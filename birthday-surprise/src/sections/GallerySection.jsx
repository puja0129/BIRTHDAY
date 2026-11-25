import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react'
import { GALLERY_PHOTOS, SECTION_COPY } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/gallery.css'
import '../styles/dropzone.css'

const LAYOUT_MODES = [
  { id: 'collections', label: 'Collections ✨' },
  { id: 'polaroid',    label: 'Polaroids' },
  { id: 'scrapbook',   label: 'Scrapbook' },
  { id: 'collage',     label: 'Collage' },
  { id: 'masonry',     label: 'Masonry' },
  { id: 'grid',        label: 'Clean Grid' },
  { id: 'freeform',    label: 'Free-form' },
]

const COLLECTION_CONFIGS = [
  {
    id: 'col-1',
    layoutKind: 'clothesline',
    categoryKey: 'Special Days',
    fallbackId: 'p1',
    title: 'Random Favourite Days',
    badge: '📸 Snapshots',
    sticker: '💖',
    accent: '#e86f9c',
    bg: 'linear-gradient(155deg, #fff5fa 0%, #ffe6f1 100%)',
    tape: '#ffb8d0',
    fallbackNote: 'One of my favourite random days.',
    fallbackEmoji: '📸',
  },
  {
    id: 'col-2',
    layoutKind: 'stack',
    categoryKey: 'Fights & Drama',
    fallbackId: 'p2',
    title: 'No Angry Faces Allowed',
    badge: '😒 Drama Club',
    sticker: '🌟',
    accent: '#9a7ee0',
    bg: 'linear-gradient(155deg, #f8f5ff 0%, #ebe2ff 100%)',
    tape: '#d5c2ff',
    fallbackNote: "The look when we're pretending we're not angry. 😒",
    fallbackEmoji: '😒',
  },
  {
    id: 'col-3',
    layoutKind: 'filmstrip',
    categoryKey: 'Funny & Chaotic',
    fallbackId: 'p3',
    title: 'Caught Laughing For Once',
    badge: '😂 Rare Proof',
    sticker: '🎞️',
    accent: '#dda82e',
    bg: 'linear-gradient(155deg, #fffdf0 0%, #fff2c2 100%)',
    tape: '#ffe394',
    fallbackNote: 'Actually laughing for once. Proof.',
    fallbackEmoji: '😂',
  },
  {
    id: 'col-4',
    layoutKind: 'postcard',
    categoryKey: 'Sweet & Soft',
    fallbackId: 'p4',
    title: 'Quiet Good Memories',
    badge: '🌅 Postcard',
    sticker: '✈️',
    accent: '#4ca3dd',
    bg: 'linear-gradient(155deg, #f2faff 0%, #def2ff 100%)',
    tape: '#b4e7ff',
    fallbackNote: 'A quiet day that became a good memory.',
    fallbackEmoji: '🌅',
  },
  {
    id: 'col-5',
    layoutKind: 'collage',
    categoryKey: 'Childhood & Old',
    fallbackId: 'p5',
    title: 'Same-Place Survivors',
    badge: '✌️ Chaos Duo',
    sticker: '🍀',
    accent: '#45b683',
    bg: 'linear-gradient(155deg, #f2fff8 0%, #daf7e8 100%)',
    tape: '#a8ebd0',
    fallbackNote: 'Proof we can survive being in the same place. 😂',
    fallbackEmoji: '✌️',
  },
  {
    id: 'col-6',
    layoutKind: 'journal',
    categoryKey: 'Uncategorized',
    fallbackId: 'p6',
    title: 'Better Without Words',
    badge: '💫 Keepsake',
    sticker: '🫶',
    accent: '#ee8760',
    bg: 'linear-gradient(155deg, #fff8f3 0%, #ffe6d6 100%)',
    tape: '#ffcab0',
    fallbackNote: 'Some moments are better without explanation.',
    fallbackEmoji: '💫',
  },
]

const TAPE_TINTS = ['#ffb8d0', '#ffe394', '#b4e7ff', '#c9f3dc', '#dccbff', '#ffd3ba']

// Distribute uploaded photos cleanly across the 6 collections with ZERO duplicates
function buildCuratedCollections(uploadedPhotos, staticFallbackPhotos) {
  const staticById = new Map(GALLERY_PHOTOS.map(p => [p.id, p]))
  const buckets = COLLECTION_CONFIGS.map(cfg => {
    const base = staticById.get(cfg.fallbackId)
    return {
      ...cfg,
      subtitle: base?.caption || cfg.fallbackNote,
      placeholderEmoji: base?.placeholder || cfg.fallbackEmoji,
      photos: [],
    }
  })

  const sourcePool = uploadedPhotos.length > 0 ? uploadedPhotos : staticFallbackPhotos
  const usedIds = new Set()

  // Pass 1: Respect explicit user-chosen categories (except default 'Special Days' when bundled from MY)
  const nonDefaultKeys = new Set(['Fights & Drama', 'Funny & Chaotic', 'Sweet & Soft', 'Childhood & Old'])
  sourcePool.forEach(item => {
    if (nonDefaultKeys.has(item.category)) {
      const target = buckets.find(b => b.categoryKey === item.category)
      if (target && !usedIds.has(item.id)) {
        usedIds.add(item.id)
        target.photos.push(item)
      }
    }
  })

  // Pass 2: Distribute remaining photos evenly across the 6 collections (never duplicating an item)
  const remaining = sourcePool.filter(item => !usedIds.has(item.id))
  remaining.forEach((item, idx) => {
    // Prefer filling smaller buckets first so all collections look balanced
    let targetIdx = idx % buckets.length
    let smallestLen = buckets[targetIdx].photos.length
    for (let j = 0; j < buckets.length; j++) {
      if (buckets[j].photos.length < smallestLen) {
        smallestLen = buckets[j].photos.length
        targetIdx = j
      }
    }
    usedIds.add(item.id)
    buckets[targetIdx].photos.push(item)
  })

  // Attach global lightbox indices across every real photo in visual collection order
  const lightboxItems = []
  buckets.forEach(bucket => {
    if (bucket.photos.length > 0) {
      bucket.photos = bucket.photos.map(item => {
        const globalIdx = lightboxItems.length
        lightboxItems.push({ ...item, collectionTitle: bucket.title, collectionBadge: bucket.badge })
        return { ...item, _globalIdx: globalIdx }
      })
    } else {
      // Preserve existing static placeholder entry if zero real photos assigned to this slot
      const placeholderItem = {
        id: `placeholder-${bucket.fallbackId}`,
        caption: bucket.subtitle,
        placeholder: bucket.placeholderEmoji,
        tint: bucket.tape,
        collectionTitle: bucket.title,
        collectionBadge: bucket.badge,
      }
      const globalIdx = lightboxItems.length
      lightboxItems.push(placeholderItem)
      bucket.fallbackItem = { ...placeholderItem, _globalIdx: globalIdx }
    }
  })

  return { buckets, lightboxItems }
}

function PhotoFrameMedia({ photo, fallbackEmoji, hintText }) {
  const src = photo?.url || photo?.src
  if (!src) {
    return (
      <div className="col-placeholder">
        <span>{photo?.placeholder || fallbackEmoji || '📸'}</span>
        {hintText && <small>{hintText}</small>}
      </div>
    )
  }
  if (photo.type === 'video') {
    return (
      <video
        src={src}
        className="col-media-img"
        style={{
          objectFit: photo.crop?.fit || 'cover',
          objectPosition: photo.crop?.position || 'center 22%',
        }}
        muted
      />
    )
  }
  return (
    <img
      src={src}
      alt={photo.caption || photo.title || photo.name || 'Memory photo'}
      className="col-media-img"
      loading="lazy"
      style={{
        objectFit: photo.crop?.fit || 'cover',
        objectPosition: photo.crop?.position || 'center 22%',
      }}
    />
  )
}

/* ── 6 Visually Distinct Mini Scrapbook Collection Boards ────────── */

function ClotheslineBoard({ col, onOpen }) {
  const visible = col.photos.length > 0 ? col.photos.slice(0, 3) : [col.fallbackItem]
  const extraCount = Math.max(0, col.photos.length - visible.length)

  return (
    <div className="col-clothesline">
      <div className="col-string" aria-hidden="true" />
      <div className={`col-clothesline__row col-clothesline__row--n${Math.min(visible.length, 3)}`}>
        {visible.map((p, i) => (
          <motion.button
            type="button"
            key={p.id}
            className="col-mini-polaroid"
            style={{ '--tilt': `${i === 0 ? -3 : i === 1 ? 2.5 : -2}deg` }}
            whileHover={{ y: -6, rotate: 0, scale: 1.05, zIndex: 8 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpen(p._globalIdx)}
          >
            <span className="col-clip" aria-hidden="true">📎</span>
            <div className="col-media-box col-media-box--balanced">
              <PhotoFrameMedia photo={p} fallbackEmoji={col.placeholderEmoji} hintText="Drop a photo" />
            </div>
            <span className="col-mini-cap font-hand">{p.caption || col.subtitle}</span>
          </motion.button>
        ))}
      </div>
      {extraCount > 0 && (
        <button type="button" className="col-more-pill" onClick={() => onOpen(col.photos[visible.length]._globalIdx)}>
          +{extraCount} more photo{extraCount > 1 ? 's' : ''} in this board →
        </button>
      )}
    </div>
  )
}

function StackDeckBoard({ col, onOpen }) {
  const list = col.photos.length > 0 ? col.photos : [col.fallbackItem]
  const [topIdx, setTopIdx] = useState(0)
  const safeTop = topIdx % list.length
  const current = list[safeTop]
  const behind1 = list.length > 1 ? list[(safeTop + 1) % list.length] : null
  const behind2 = list.length > 2 ? list[(safeTop + 2) % list.length] : null

  return (
    <div className="col-stack-wrap">
      <div className="col-stack-deck">
        {behind2 && (
          <div className="col-stack-ghost col-stack-ghost--back2" aria-hidden="true">
            <PhotoFrameMedia photo={behind2} />
          </div>
        )}
        {behind1 && (
          <div className="col-stack-ghost col-stack-ghost--back1" aria-hidden="true">
            <PhotoFrameMedia photo={behind1} />
          </div>
        )}
        <motion.button
          type="button"
          key={current.id}
          className="col-stack-front"
          initial={{ opacity: 0.85, scale: 0.96, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
          whileHover={{ rotate: 0, scale: 1.03, y: -4 }}
          onClick={() => onOpen(current._globalIdx)}
        >
          <div className="col-media-box col-media-box--portrait">
            <PhotoFrameMedia photo={current} fallbackEmoji={col.placeholderEmoji} hintText="Tap or drop photo" />
          </div>
          <span className="col-mini-cap font-hand">{current.caption || col.subtitle}</span>
        </motion.button>
      </div>

      {list.length > 1 && (
        <div className="col-stack-controls">
          <button
            type="button"
            className="col-stack-next"
            onClick={() => setTopIdx(i => (i + 1) % list.length)}
          >
            <Layers size={13} /> Flip stack ({safeTop + 1}/{list.length})
          </button>
          <button type="button" className="col-more-pill" onClick={() => onOpen(current._globalIdx)}>
            Open fullscreen
          </button>
        </div>
      )}
    </div>
  )
}

function FilmstripBoard({ col, onOpen }) {
  const visible = col.photos.length > 0 ? col.photos.slice(0, 3) : [col.fallbackItem]
  const extraCount = Math.max(0, col.photos.length - visible.length)

  return (
    <div className="col-filmstrip">
      <div className="col-film-holes" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => <span key={i} />)}
      </div>

      <div className={`col-film-frames col-film-frames--n${Math.min(visible.length, 3)}`}>
        {visible.map((p) => (
          <motion.button
            type="button"
            key={p.id}
            className="col-film-cell"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpen(p._globalIdx)}
          >
            <div className="col-media-box col-media-box--balanced">
              <PhotoFrameMedia photo={p} fallbackEmoji={col.placeholderEmoji} hintText="Drop a funny moment" />
            </div>
            <span className="col-mini-cap font-hand">{p.caption || col.subtitle}</span>
          </motion.button>
        ))}
      </div>

      <div className="col-film-holes" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => <span key={i} />)}
      </div>

      {extraCount > 0 && (
        <button type="button" className="col-more-pill" onClick={() => onOpen(col.photos[visible.length]._globalIdx)}>
          +{extraCount} more clip{extraCount > 1 ? 's' : ''} in reel →
        </button>
      )}
    </div>
  )
}

function PostcardBoard({ col, onOpen }) {
  const list = col.photos.length > 0 ? col.photos : [col.fallbackItem]
  const mainPhoto = list[0]
  const miniList  = list.slice(1, 3)
  const extraCount = Math.max(0, list.length - 3)

  return (
    <div className="col-postcard">
      <div className="col-postcard__left">
        <motion.button
          type="button"
          className="col-postcard__main-frame"
          whileHover={{ scale: 1.03, rotate: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onOpen(mainPhoto._globalIdx)}
        >
          <div className="col-media-box col-media-box--postcard">
            <PhotoFrameMedia photo={mainPhoto} fallbackEmoji={col.placeholderEmoji} hintText="Postcard photo" />
          </div>
        </motion.button>
      </div>

      <div className="col-postcard__right">
        <div className="col-post-stamp" aria-hidden="true">
          <span>5 DEC</span>
          <small>MAHIR</small>
        </div>
        <p className="col-postcard__note font-hand">{mainPhoto.caption || col.subtitle}</p>
        {miniList.length > 0 && (
          <div className="col-postcard__minis">
            {miniList.map(p => (
              <motion.button
                type="button"
                key={p.id}
                className="col-postcard__thumb"
                whileHover={{ scale: 1.08 }}
                onClick={() => onOpen(p._globalIdx)}
              >
                <PhotoFrameMedia photo={p} />
              </motion.button>
            ))}
          </div>
        )}
        {extraCount > 0 && (
          <button type="button" className="col-more-pill" onClick={() => onOpen(list[3]._globalIdx)}>
            +{extraCount} more →
          </button>
        )}
      </div>
    </div>
  )
}

function CollageMosaicBoard({ col, onOpen }) {
  const visible = col.photos.length > 0 ? col.photos.slice(0, 3) : [col.fallbackItem]
  const extraCount = Math.max(0, col.photos.length - visible.length)

  return (
    <div className="col-collage-wrap">
      <div className={`col-collage-grid col-collage-grid--n${Math.min(visible.length, 3)}`}>
        {visible.map((p, idx) => (
          <motion.button
            type="button"
            key={p.id}
            className={`col-collage-tile ${idx === 0 && visible.length === 3 ? 'col-collage-tile--hero' : ''}`}
            whileHover={{ scale: 1.03, zIndex: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpen(p._globalIdx)}
          >
            <div className="col-media-box col-media-box--collage">
              <PhotoFrameMedia photo={p} fallbackEmoji={col.placeholderEmoji} hintText="Collage slot" />
            </div>
            {p.caption && (
              <span className="col-collage-cap font-hand">{p.caption}</span>
            )}
          </motion.button>
        ))}
      </div>
      {extraCount > 0 && (
        <button type="button" className="col-more-pill" onClick={() => onOpen(col.photos[visible.length]._globalIdx)}>
          +{extraCount} more in collage →
        </button>
      )}
    </div>
  )
}

function JournalPocketBoard({ col, onOpen }) {
  const visible = col.photos.length > 0 ? col.photos.slice(0, 2) : [col.fallbackItem]
  const extraCount = Math.max(0, col.photos.length - visible.length)

  return (
    <div className="col-journal">
      <div className="col-journal-lines" aria-hidden="true" />
      <div className={`col-journal-cards col-journal-cards--n${visible.length}`}>
        {visible.map((p, i) => (
          <motion.button
            type="button"
            key={p.id}
            className="col-journal-frame"
            style={{ '--tilt': `${i % 2 === 0 ? -2.2 : 2.2}deg` }}
            whileHover={{ scale: 1.04, rotate: 0, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpen(p._globalIdx)}
          >
            <div className="col-media-box col-media-box--balanced">
              <PhotoFrameMedia photo={p} fallbackEmoji={col.placeholderEmoji} hintText="Journal photo" />
            </div>
            <span className="col-mini-cap font-hand">{p.caption || col.subtitle}</span>
          </motion.button>
        ))}
      </div>
      <div className="col-journal-note">
        <span>✨</span>
        <p className="font-hand">&ldquo;{col.subtitle}&rdquo;</p>
      </div>
      {extraCount > 0 && (
        <button type="button" className="col-more-pill" onClick={() => onOpen(col.photos[visible.length]._globalIdx)}>
          +{extraCount} more keepsakes →
        </button>
      )}
    </div>
  )
}

function renderCollectionBody(col, onOpen) {
  switch (col.layoutKind) {
    case 'clothesline': return <ClotheslineBoard col={col} onOpen={onOpen} />
    case 'stack':       return <StackDeckBoard col={col} onOpen={onOpen} />
    case 'filmstrip':   return <FilmstripBoard col={col} onOpen={onOpen} />
    case 'postcard':    return <PostcardBoard col={col} onOpen={onOpen} />
    case 'collage':     return <CollageMosaicBoard col={col} onOpen={onOpen} />
    case 'journal':     return <JournalPocketBoard col={col} onOpen={onOpen} />
    default:            return <ClotheslineBoard col={col} onOpen={onOpen} />
  }
}

/* ── Classic Flat Mode Card (for Polaroids / Collage / Masonry / Grid / Free-form tabs) ── */
function ScrapbookPhotoCard({ item, index, mode, onOpen }) {
  const rotation =
    mode === 'grid' ? 0 :
    mode === 'freeform' ? ((index % 5) - 2) * 3.5 :
    mode === 'collage' ? ((index % 2 === 0 ? -1 : 1) * 1.4) :
    ((index % 3) - 1) * 2.5

  const src = item.url || item.src
  const tapeColor = TAPE_TINTS[index % TAPE_TINTS.length]
  const showTape = mode !== 'grid' && item.tape !== 'none'

  return (
    <motion.div
      className={`gallery-item gallery-item--${mode}`}
      initial={{ opacity: 0, y: 24, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.48, delay: (index % 4) * 0.05 }}
      whileHover={{ scale: 1.04, rotate: 0, zIndex: 15 }}
      onClick={() => onOpen(index)}
      style={{ '--rotate': `${rotation}deg` }}
    >
      {showTape && (
        <div
          className="gallery-tape"
          style={{
            background: `${tapeColor}cc`,
            transform: `rotate(${index % 2 === 0 ? -4 : 4}deg)`,
          }}
        />
      )}

      <div
        className={`gallery-polaroid gallery-polaroid--${mode}`}
        style={{ backgroundColor: mode === 'scrapbook' ? (item.tint || '#fffdf9') : '#ffffff' }}
      >
        {src ? (
          item.type === 'video' ? (
            <video
              src={src}
              className="gallery-photo"
              style={{
                objectFit: item.crop?.fit || 'cover',
                objectPosition: item.crop?.position || 'center 22%',
              }}
              muted
            />
          ) : (
            <img
              src={src}
              alt={item.caption || item.name || 'Memory'}
              className="gallery-photo"
              loading="lazy"
              style={{
                objectFit: item.crop?.fit || 'cover',
                objectPosition: item.crop?.position || 'center 22%',
              }}
            />
          )
        ) : (
          <div className="gallery-placeholder" style={{ background: item.tint || '#fff3f8' }}>
            <span>{item.placeholder || '📸'}</span>
            <p className="gallery-placeholder__hint">
              Drop a photo right here or upload via Manage Memories
            </p>
          </div>
        )}

        <div className="gallery-meta-row">
          {item.title && <p className="gallery-card-title">{item.title}</p>}
          <p className="gallery-caption font-hand">{item.caption || item.name}</p>
          {item.date && <p className="gallery-date">{item.date}</p>}
        </div>
      </div>
    </motion.div>
  )
}

export default function GallerySection() {
  const { getSection, sectionLayouts, setSectionLayout } = useMedia()
  const uploadedPhotos = getSection('gallery')
  const [viewMode, setViewMode]           = useState('collections')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const prevLayoutRef                     = useRef(sectionLayouts?.gallery)

  useEffect(() => {
    const externalLayout = sectionLayouts?.gallery
    if (externalLayout && externalLayout !== prevLayoutRef.current) {
      prevLayoutRef.current = externalLayout
      setViewMode(externalLayout)
      setLightboxIndex(null)
    }
  }, [sectionLayouts?.gallery])

  const allItems = useMemo(() => {
    const staticWithImages = GALLERY_PHOTOS.filter(p => p.src)
    const combined = [...uploadedPhotos, ...staticWithImages]
    return combined.length > 0 ? combined : GALLERY_PHOTOS
  }, [uploadedPhotos])

  const { buckets, lightboxItems } = useMemo(() => {
    const staticWithImages = GALLERY_PHOTOS.filter(p => p.src).map(p => ({ ...p, type: 'photo', url: p.src }))
    return buildCuratedCollections(uploadedPhotos, staticWithImages)
  }, [uploadedPhotos])

  const activeList = viewMode === 'collections' ? lightboxItems : allItems

  const prev = () => setLightboxIndex(i => (i > 0 ? i - 1 : activeList.length - 1))
  const next = () => setLightboxIndex(i => (i < activeList.length - 1 ? i + 1 : 0))
  const activeLightbox = lightboxIndex !== null ? activeList[lightboxIndex] : null

  useEffect(() => {
    if (lightboxIndex === null || activeList.length === 0) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, activeList.length])

  const handleModeSwitch = (id) => {
    prevLayoutRef.current = id
    setViewMode(id)
    setLightboxIndex(null)
    setSectionLayout('gallery', id)
  }

  return (
    <section id="gallery" className="gallery-section section-padding">
      <div className="gallery-deco" aria-hidden="true">
        <FloatingDecorations set="love" count={9} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">{SECTION_COPY.gallery.eyebrow}</span>
          <h2>{SECTION_COPY.gallery.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{SECTION_COPY.gallery.subtitle}</p>
        </motion.div>

        {/* Live layout switcher bar */}
        <div className="gallery-mode-bar" role="group" aria-label="Choose gallery layout">
          {LAYOUT_MODES.map(mode => (
            <button
              type="button"
              key={mode.id}
              className={`gallery-mode-btn ${viewMode === mode.id ? 'gallery-mode-btn--active' : ''}`}
              onClick={() => handleModeSwitch(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <SectionDropZone sectionId="gallery" label="Photo Polaroids">
          {viewMode === 'collections' ? (
            <div className="collections-board-grid">
              {buckets.map((col, idx) => (
                <motion.section
                  key={col.id}
                  className={`collection-board collection-board--${col.layoutKind}`}
                  style={{ '--board-bg': col.bg, '--board-accent': col.accent }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: (idx % 2) * 0.08 }}
                >
                  <span
                    className="collection-board__tape"
                    style={{
                      background: `${col.tape}dd`,
                      transform: `rotate(${idx % 2 === 0 ? -3 : 3}deg)`,
                    }}
                    aria-hidden="true"
                  />

                  <header className="collection-board__header">
                    <div className="collection-board__title-row">
                      <span className="collection-board__badge" style={{ color: col.accent }}>
                        {col.badge}
                      </span>
                      <motion.span
                        className="collection-board__sticker"
                        animate={{ rotate: [-6, 6, -6], y: [0, -3, 0] }}
                        transition={{ duration: 3.2, delay: idx * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                        aria-hidden="true"
                      >
                        {col.sticker}
                      </motion.span>
                    </div>
                    <h3 className="collection-board__title">{col.title}</h3>
                    <p className="collection-board__sub font-hand">{col.subtitle}</p>
                  </header>

                  <div className="collection-board__body">
                    {renderCollectionBody(col, setLightboxIndex)}
                  </div>
                </motion.section>
              ))}
            </div>
          ) : (
            <div className={`gallery-grid gallery-grid--${viewMode}`}>
              {allItems.map((item, i) => (
                <ScrapbookPhotoCard
                  key={item.id}
                  item={item}
                  index={i}
                  mode={viewMode}
                  onOpen={setLightboxIndex}
                />
              ))}
            </div>
          )}
        </SectionDropZone>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              className="gallery-lightbox-inner"
              initial={{ scale: 0.88 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              key={lightboxIndex}
            >
              {activeLightbox.url || activeLightbox.src ? (
                activeLightbox.type === 'video' ? (
                  <video src={activeLightbox.url || activeLightbox.src} controls autoPlay className="gallery-lightbox-img" />
                ) : (
                  <img
                    src={activeLightbox.url || activeLightbox.src}
                    alt={activeLightbox.caption}
                    className="gallery-lightbox-img"
                  />
                )
              ) : (
                <div className="lightbox__placeholder">
                  <span>{activeLightbox.placeholder || '📸'}</span>
                  <p>Drop a real photo directly onto the Polaroid board or add it inside <strong>Manage Memories</strong>!</p>
                </div>
              )}
              <div className="lightbox__meta">
                {activeLightbox.collectionBadge && (
                  <span className="gallery-lightbox-badge">
                    {activeLightbox.collectionBadge} · {lightboxIndex + 1} / {activeList.length}
                  </span>
                )}
                <p className="lightbox__caption">{activeLightbox.caption || activeLightbox.title || activeLightbox.name}</p>
                {activeLightbox.date && <p className="lightbox__date">{activeLightbox.date}</p>}
              </div>
            </motion.div>

            {activeList.length > 1 && (
              <>
                <button type="button" className="gallery-nav gallery-nav--prev" onClick={e => { e.stopPropagation(); prev() }} aria-label="Previous photo">
                  <ChevronLeft size={24} />
                </button>
                <button type="button" className="gallery-nav gallery-nav--next" onClick={e => { e.stopPropagation(); next() }} aria-label="Next photo">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            <button type="button" className="lightbox__close" onClick={() => setLightboxIndex(null)} aria-label="Close lightbox">✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
