/**
 * useMediaStore — IndexedDB + localStorage + bundled MY/ folder media store
 *
 * Automatically preloads all photos & videos from d:\mahi\birthday-surprise\MY\
 * while persisting user uploads, edits, captions, crops, order, and soft deletes.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { SITE_CONFIG } from '../data/content'
import { MY_MEDIA } from '../data/myMedia'

const DB_NAME    = 'birthday-media-db'
const DB_VERSION = 1
const STORE_NAME = 'media-files'
const META_KEY   = 'birthday-media-meta-v2'
const LAYOUT_KEY = 'birthday-section-layouts-v2'
const CLOUD_KEY  = 'birthday-cloud-config'

export const MEDIA_CATEGORIES = [
  'Uncategorized',
  'Funny & Chaotic',
  'Sweet & Soft',
  'Childhood & Old',
  'Fights & Drama',
  'Special Days',
]

// ── IndexedDB helpers ──────────────────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = e => {
      if (!e.target.result.objectStoreNames.contains(STORE_NAME)) {
        e.target.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess = e => resolve(e.target.result)
    req.onerror   = e => reject(e.target.error)
  })
}

async function idbPut(id, blob) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readwrite')
    const req = tx.objectStore(STORE_NAME).put({ id, blob })
    req.onsuccess = () => resolve()
    req.onerror   = e => reject(e.target.error)
  })
}

async function idbDelete(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readwrite')
    const req = tx.objectStore(STORE_NAME).delete(id)
    req.onsuccess = () => resolve()
    req.onerror   = e => reject(e.target.error)
  })
}

async function idbGetAll() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = e => resolve(e.target.result || [])
    req.onerror   = e => reject(e.target.error)
  })
}

// ── Storage helpers ────────────────────────────────────────────────
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      if (key === META_KEY) {
        const legacy = localStorage.getItem('birthday-media-meta')
        if (legacy) return JSON.parse(legacy)
      }
      return fallback
    }
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn('[MediaStore] Storage quota warning:', err)
  }
}

async function uploadToCloudinary(file, config) {
  const cloudName    = config?.cloudName || SITE_CONFIG.cloudinaryCloudName
  const uploadPreset = config?.uploadPreset || SITE_CONFIG.cloudinaryUploadPreset
  if (!cloudName || !uploadPreset) return null

  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', uploadPreset)

  const resourceType = file.type.startsWith('video') ? 'video' : 'image'
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status})`)
  const data = await res.json()
  return data.secure_url || null
}

function normalizeMetaItem(id, m = {}, blob = null) {
  const type = m.type || (blob?.type?.startsWith('video') ? 'video' : 'photo')
  return {
    id,
    type,
    name:      m.name      || id,
    title:     m.title     || '',
    caption:   m.caption   || '',
    date:      m.date      || '',
    category:  m.category  || 'Uncategorized',
    section:   m.section   || null,
    layout:    m.layout    || (type === 'video' ? 'video-card' : 'polaroid'),
    crop:      m.crop      || { position: 'center 22%', fit: 'cover' },
    order:     typeof m.order === 'number' ? m.order : 999,
    remoteUrl: m.remoteUrl || null,
    builtin:   Boolean(m.builtin),
    tint:      m.tint      || undefined,
    tape:      m.tape      || undefined,
  }
}

export function useMediaStore() {
  // Initialize synchronously with MY_MEDIA so hero/gallery render immediately on frame 1!
  const [items, setItems] = useState(() => {
    const meta = loadJSON(META_KEY, {})
    return MY_MEDIA
      .filter(entry => !meta[entry.id]?.deleted)
      .map(entry => ({
        ...entry,
        ...(meta[entry.id] || {}),
        url: entry.url,
        remoteUrl: entry.url,
        builtin: true,
      }))
      .sort((a, b) => a.order - b.order)
  })
  const [loading, setLoading]        = useState(true)
  const [sectionLayouts, setLayouts] = useState(() => loadJSON(LAYOUT_KEY, {
    gallery: 'polaroid',
    videos:  'cards',
  }))
  const [cloudConfig, setCloudConfigState] = useState(() => loadJSON(CLOUD_KEY, {
    cloudName:    SITE_CONFIG.cloudinaryCloudName || '',
    uploadPreset: SITE_CONFIG.cloudinaryUploadPreset || '',
  }))
  const [draggedMediaId, setDraggedMediaId] = useState(null)

  const historyRef = useRef({ past: [], future: [] })
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false })

  const syncHistoryFlags = useCallback(() => {
    setHistoryState({
      canUndo: historyRef.current.past.length > 0,
      canRedo: historyRef.current.future.length > 0,
    })
  }, [])

  const pushSnapshot = useCallback((currentMeta, currentLayouts) => {
    historyRef.current.past.push({
      meta: JSON.parse(JSON.stringify(currentMeta)),
      layouts: JSON.parse(JSON.stringify(currentLayouts)),
    })
    if (historyRef.current.past.length > 30) historyRef.current.past.shift()
    historyRef.current.future = []
    syncHistoryFlags()
  }, [syncHistoryFlags])

  const rebuildMetaFromItems = (list) => {
    const next = loadJSON(META_KEY, {})
    list.forEach(it => {
      next[it.id] = {
        type:      it.type,
        name:      it.name,
        title:     it.title,
        caption:   it.caption,
        date:      it.date,
        category:  it.category,
        section:   it.section,
        layout:    it.layout,
        crop:      it.crop,
        order:     it.order,
        remoteUrl: it.remoteUrl || null,
        builtin:   Boolean(it.builtin),
      }
    })
    return next
  }

  // Merge MY_MEDIA + IndexedDB uploads + localStorage metadata + optional media-manifest.json
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const blobs   = await idbGetAll()
        const meta    = loadJSON(META_KEY, {})
        const blobMap = new Map()
        blobs.forEach(({ id, blob }) => blobMap.set(id, blob))

        const loaded = []
        const seenIds = new Set()

        // 1. Bundled MY_MEDIA (honoring user edits or soft-delete tombstones)
        MY_MEDIA.forEach(entry => {
          const override = meta[entry.id]
          if (override?.deleted) return
          const merged = {
            ...entry,
            ...(override || {}),
            // Keep fresh Vite URL unless overridden by replacement blob
            url: blobMap.has(entry.id) ? URL.createObjectURL(blobMap.get(entry.id)) : entry.url,
            blob: blobMap.get(entry.id) || null,
            builtin: true,
          }
          seenIds.add(entry.id)
          loaded.push(merged)
        })

        // 2. IndexedDB user uploads
        blobs.forEach(({ id, blob }) => {
          if (seenIds.has(id)) return
          const url = URL.createObjectURL(blob)
          seenIds.add(id)
          loaded.push({
            ...normalizeMetaItem(id, meta[id], blob),
            url,
            blob,
          })
        })

        // 3. Remote-only items (Cloudinary or manifest)
        Object.entries(meta).forEach(([id, m]) => {
          if (!seenIds.has(id) && !m?.deleted && m?.remoteUrl && !id.startsWith('my-')) {
            seenIds.add(id)
            loaded.push({
              ...normalizeMetaItem(id, m),
              url: m.remoteUrl,
              blob: null,
            })
          }
        })

        // 4. Optional static manifest in public/memories/media-manifest.json
        try {
          const res = await fetch('/memories/media-manifest.json')
          if (res.ok) {
            const manifest = await res.json()
            if (Array.isArray(manifest?.items)) {
              manifest.items.forEach(entry => {
                if (entry?.id && entry?.remoteUrl && !seenIds.has(entry.id) && !meta[entry.id]?.deleted) {
                  seenIds.add(entry.id)
                  loaded.push({
                    ...normalizeMetaItem(entry.id, entry),
                    url: entry.remoteUrl,
                    blob: null,
                  })
                }
              })
            }
          }
        } catch {
          // No static manifest file present
        }

        loaded.sort((a, b) => a.order - b.order)
        if (active) setItems(loaded)
      } catch (err) {
        console.error('[MediaStore] Load error:', err)
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => { active = false }
  }, [])

  const addFiles = useCallback(async (fileList, targetSection = null, defaultCategory = 'Uncategorized') => {
    const files = Array.from(fileList || [])
    if (!files.length) return []

    const meta = loadJSON(META_KEY, {})
    pushSnapshot(meta, sectionLayouts)

    const newItems = []
    let baseOrder = Date.now()

    for (const file of files) {
      if (!file.type?.match(/^(image|video)\//)) continue
      const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const localUrl = URL.createObjectURL(file)
      await idbPut(id, file)

      let remoteUrl = null
      try {
        remoteUrl = await uploadToCloudinary(file, cloudConfig)
      } catch (err) {
        console.warn('[MediaStore] Cloud sync skipped:', err.message)
      }

      const type = file.type.startsWith('video') ? 'video' : 'photo'
      const record = normalizeMetaItem(id, {
        type,
        name: file.name,
        title: '',
        caption: '',
        date: '',
        category: defaultCategory,
        section: targetSection,
        layout: type === 'video' ? 'video-card' : 'polaroid',
        crop: { position: 'center 22%', fit: 'cover' },
        order: baseOrder++,
        remoteUrl,
      }, file)

      meta[id] = record
      newItems.push({ ...record, url: remoteUrl || localUrl, blob: file })
    }

    saveJSON(META_KEY, meta)
    setItems(prev => [...prev, ...newItems])
    return newItems
  }, [cloudConfig, pushSnapshot, sectionLayouts])

  const replaceItem = useCallback(async (id, newFile) => {
    if (!newFile || !newFile.type?.match(/^(image|video)\//)) return
    const localUrl = URL.createObjectURL(newFile)
    await idbPut(id, newFile)

    let remoteUrl = null
    try {
      remoteUrl = await uploadToCloudinary(newFile, cloudConfig)
    } catch {
      // Keep local blob replacement
    }

    const type = newFile.type.startsWith('video') ? 'video' : 'photo'
    const meta = loadJSON(META_KEY, {})
    meta[id] = {
      ...(meta[id] || {}),
      type,
      name: newFile.name,
      remoteUrl: remoteUrl || null,
    }
    saveJSON(META_KEY, meta)

    setItems(prev => prev.map(it => {
      if (it.id !== id) return it
      if (it.url && it.url.startsWith('blob:')) URL.revokeObjectURL(it.url)
      return {
        ...it,
        type,
        name: newFile.name,
        url: remoteUrl || localUrl,
        remoteUrl: remoteUrl || null,
        blob: newFile,
      }
    }))
  }, [cloudConfig])

  const updateItem = useCallback((id, changes) => {
    const meta = loadJSON(META_KEY, {})
    pushSnapshot(meta, sectionLayouts)
    meta[id] = { ...(meta[id] || {}), ...changes }
    saveJSON(META_KEY, meta)
    setItems(prev => prev.map(it => (it.id === id ? { ...it, ...changes } : it)))
  }, [pushSnapshot, sectionLayouts])

  const assignToSection = useCallback((id, section) => {
    updateItem(id, { section })
  }, [updateItem])

  const unassignFromSection = useCallback((id) => {
    updateItem(id, { section: null })
  }, [updateItem])

  const removeItem = useCallback(async (id) => {
    const isBuiltin = id.startsWith('my-')
    if (!isBuiltin) await idbDelete(id)

    const meta = loadJSON(META_KEY, {})
    pushSnapshot(meta, sectionLayouts)

    if (isBuiltin) {
      meta[id] = { ...(meta[id] || {}), deleted: true }
    } else {
      delete meta[id]
    }
    saveJSON(META_KEY, meta)

    setItems(prev => {
      const target = prev.find(i => i.id === id)
      if (target?.url && target.url.startsWith('blob:')) URL.revokeObjectURL(target.url)
      return prev.filter(i => i.id !== id)
    })
  }, [pushSnapshot, sectionLayouts])

  const reorder = useCallback((section, fromIdx, toIdx) => {
    if (fromIdx === toIdx) return
    setItems(prev => {
      const currentMeta = rebuildMetaFromItems(prev)
      pushSnapshot(currentMeta, sectionLayouts)

      const sectionItems = prev
        .filter(i => i.section === section)
        .sort((a, b) => a.order - b.order)

      if (fromIdx < 0 || toIdx < 0 || fromIdx >= sectionItems.length || toIdx >= sectionItems.length) {
        return prev
      }

      const [moved] = sectionItems.splice(fromIdx, 1)
      sectionItems.splice(toIdx, 0, moved)

      const meta = loadJSON(META_KEY, currentMeta)
      sectionItems.forEach((item, idx) => {
        item.order = idx
        meta[item.id] = { ...(meta[item.id] || {}), order: idx }
      })
      saveJSON(META_KEY, meta)

      return prev.map(it => {
        const updated = sectionItems.find(s => s.id === it.id)
        return updated ? { ...it, order: updated.order } : it
      })
    })
  }, [pushSnapshot, sectionLayouts])

  const moveItemOrder = useCallback((section, id, direction) => {
    const ordered = items
      .filter(i => i.section === section)
      .sort((a, b) => a.order - b.order)
    const idx = ordered.findIndex(i => i.id === id)
    if (idx === -1) return
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1
    if (nextIdx < 0 || nextIdx >= ordered.length) return
    reorder(section, idx, nextIdx)
  }, [items, reorder])

  const setSectionLayout = useCallback((section, layout) => {
    const meta = loadJSON(META_KEY, {})
    pushSnapshot(meta, sectionLayouts)
    setLayouts(prev => {
      const next = { ...prev, [section]: layout }
      saveJSON(LAYOUT_KEY, next)
      return next
    })
  }, [pushSnapshot, sectionLayouts])

  const updateCloudConfig = useCallback((nextCfg) => {
    setCloudConfigState(nextCfg)
    saveJSON(CLOUD_KEY, nextCfg)
  }, [])

  const undo = useCallback(() => {
    const last = historyRef.current.past.pop()
    if (!last) return
    const currentMeta = loadJSON(META_KEY, {})
    historyRef.current.future.push({
      meta: JSON.parse(JSON.stringify(currentMeta)),
      layouts: JSON.parse(JSON.stringify(sectionLayouts)),
    })
    saveJSON(META_KEY, last.meta)
    saveJSON(LAYOUT_KEY, last.layouts)
    setLayouts(last.layouts)
    setItems(prev => {
      const byId = new Map(prev.map(i => [i.id, i]))
      MY_MEDIA.forEach(m => {
        if (!last.meta[m.id]?.deleted && !byId.has(m.id)) {
          byId.set(m.id, { ...m, ...(last.meta[m.id] || {}) })
        }
      })
      return Array.from(byId.values())
        .filter(it => !last.meta[it.id]?.deleted)
        .map(it => (last.meta[it.id] ? { ...it, ...last.meta[it.id] } : it))
        .sort((a, b) => a.order - b.order)
    })
    syncHistoryFlags()
  }, [sectionLayouts, syncHistoryFlags])

  const redo = useCallback(() => {
    const next = historyRef.current.future.pop()
    if (!next) return
    const currentMeta = loadJSON(META_KEY, {})
    historyRef.current.past.push({
      meta: JSON.parse(JSON.stringify(currentMeta)),
      layouts: JSON.parse(JSON.stringify(sectionLayouts)),
    })
    saveJSON(META_KEY, next.meta)
    saveJSON(LAYOUT_KEY, next.layouts)
    setLayouts(next.layouts)
    setItems(prev =>
      prev
        .filter(it => !next.meta[it.id]?.deleted)
        .map(it => (next.meta[it.id] ? { ...it, ...next.meta[it.id] } : it))
        .sort((a, b) => a.order - b.order)
    )
    syncHistoryFlags()
  }, [sectionLayouts, syncHistoryFlags])

  const exportManifest = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      sectionLayouts,
      items: items.map(({ blob, url, ...rest }) => ({
        ...rest,
        remoteUrl: rest.remoteUrl || (url && !url.startsWith('blob:') ? url : null),
      })),
    }
    return JSON.stringify(payload, null, 2)
  }, [items, sectionLayouts])

  const importManifest = useCallback((jsonText) => {
    const parsed = JSON.parse(jsonText)
    const meta = loadJSON(META_KEY, {})
    pushSnapshot(meta, sectionLayouts)

    if (parsed?.sectionLayouts) {
      setLayouts(parsed.sectionLayouts)
      saveJSON(LAYOUT_KEY, parsed.sectionLayouts)
    }

    if (Array.isArray(parsed?.items)) {
      parsed.items.forEach(entry => {
        if (!entry?.id) return
        meta[entry.id] = { ...(meta[entry.id] || {}), ...entry }
      })
      saveJSON(META_KEY, meta)
      setItems(prev => {
        const next = prev.map(it => (meta[it.id] ? { ...it, ...meta[it.id] } : it))
        parsed.items.forEach(entry => {
          if (entry?.id && entry?.remoteUrl && !next.some(x => x.id === entry.id)) {
            next.push({
              ...normalizeMetaItem(entry.id, entry),
              url: entry.remoteUrl,
              blob: null,
            })
          }
        })
        return next.sort((a, b) => a.order - b.order)
      })
    }
  }, [pushSnapshot, sectionLayouts])

  // Explicitly assigned items for a section
  const getSection = useCallback((section) =>
    items
      .filter(i => i.section === section)
      .sort((a, b) => a.order - b.order),
    [items]
  )

  // Auto-fills sections cleanly using MY photos when no section-specific overrides exist
  const getSectionOrFallback = useCallback((section, count = 4, offset = 0, typeFilter = 'photo') => {
    const direct = getSection(section)
    if (direct.length > 0) return direct

    const pool = items
      .filter(i => !typeFilter || i.type === typeFilter)
      .sort((a, b) => a.order - b.order)

    if (pool.length === 0) return []

    const limit = Math.min(count, pool.length)
    const selected = []
    for (let i = 0; i < limit; i++) {
      selected.push(pool[(offset + i) % pool.length])
    }
    return selected
  }, [getSection, items])

  return {
    items,
    loading,
    sectionLayouts,
    cloudConfig,
    draggedMediaId,
    setDraggedMediaId,
    canUndo: historyState.canUndo,
    canRedo: historyState.canRedo,
    addFiles,
    replaceItem,
    updateItem,
    assignToSection,
    unassignFromSection,
    removeItem,
    reorder,
    moveItemOrder,
    setSectionLayout,
    updateCloudConfig,
    undo,
    redo,
    exportManifest,
    importManifest,
    getSection,
    getSectionOrFallback,
  }
}
