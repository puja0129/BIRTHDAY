import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, X, Edit2, Trash2, Grid, Layers, Cloud,
  Undo2, Redo2, RefreshCw, ArrowUp, ArrowDown,
  PanelBottomClose, PanelBottomOpen, ExternalLink, Download, FolderOpen
} from 'lucide-react'
import { useMedia } from '../context/MediaContext'
import { MEDIA_CATEGORIES } from '../hooks/useMediaStore'
import { CHAPTERS } from '../data/content'
import '../styles/mediaManager.css'

export const ALL_SECTIONS = [
  { id: 'hero',          label: 'Opening World',    icon: '✨', href: '#home' },
  { id: 'story',         label: 'Our Story',        icon: '📖', href: '#story' },
  { id: 'memories',      label: '3D Memory World',  icon: '☁️', href: '#memories' },
  { id: 'gallery',       label: 'Photo Polaroids',  icon: '🖼️', href: '#gallery' },
  { id: 'our-memories',  label: 'Our Memories Book',icon: '🎞️', href: '#our-memories' },
  { id: 'album',         label: 'Photo Album',      icon: '📸', href: '#album' },
  { id: 'videos',        label: 'Video Madness',    icon: '🎬', href: '#videos' },
  { id: 'tom-and-jerry', label: 'Tom & Jerry Wall', icon: '🐱', href: '#tom-and-jerry' },
  { id: 'sibling-chaos', label: 'Sibling Chaos',    icon: '💥', href: '#sibling-chaos' },
  { id: 'fights',        label: 'Our Fights',       icon: '😂', href: '#fights' },
  { id: 'bond',          label: 'Our Bond',         icon: '💫', href: '#bond' },
  { id: 'rishta',        label: 'Ye Kaisa Rishta',  icon: '🥹', href: '#rishta' },
  { id: 'wishes',        label: 'Birthday Wishes',  icon: '🌟', href: '#wishes' },
  { id: 'teddy',         label: 'Teddy Keepsake',   icon: '🧸', href: '#teddy' },
  { id: 'letter',        label: 'The Letter',       icon: '💌', href: '#letter' },
  { id: 'birthday',      label: 'Birthday Surprise',icon: '🎂', href: '#birthday' },
  ...CHAPTERS.map(c => ({
    id: c.id,
    label: `Ch ${c.number}: ${c.title}`,
    icon: c.emoji,
    href: '#chapters',
  })),
]

const ITEM_LAYOUTS = [
  { id: 'polaroid',   label: 'Polaroid' },
  { id: 'floating',   label: 'Floating Frame' },
  { id: 'scrapbook',  label: 'Scrapbook Tape' },
  { id: 'collage',    label: 'Collage Tile' },
  { id: 'framed',     label: 'Pastel Frame' },
  { id: 'full',       label: 'Full Background' },
  { id: 'video-card', label: 'Video Card' },
  { id: 'montage',    label: 'Montage Clip' },
]

const GALLERY_MODES = [
  { id: 'collections', label: 'Collections ✨' },
  { id: 'polaroid',  label: 'Polaroids' },
  { id: 'scrapbook', label: 'Scrapbook' },
  { id: 'collage',   label: 'Collage' },
  { id: 'grid',      label: 'Clean Grid' },
  { id: 'masonry',   label: 'Masonry' },
  { id: 'freeform',  label: 'Free-form' },
]

const CROP_POSITIONS = [
  { id: 'center center', label: 'Center' },
  { id: 'center top',    label: 'Focus Top / Faces' },
  { id: 'center bottom', label: 'Focus Bottom' },
  { id: 'left center',   label: 'Focus Left' },
  { id: 'right center',  label: 'Focus Right' },
]

function UploadZone({ onUpload, targetSection, onTargetChange, targetCategory, onCategoryChange }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    setDragging(false)
    const files = e.dataTransfer?.files
    if (files?.length) onUpload(files)
  }, [onUpload])

  return (
    <div className="upload-block">
      <div className="upload-presets-row">
        <label className="upload-preset-field">
          <span>Auto-place into section:</span>
          <select
            className="media-assign-select"
            value={targetSection || ''}
            onChange={e => onTargetChange(e.target.value || null)}
          >
            <option value="">Keep in Library (choose later)</option>
            {ALL_SECTIONS.map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
            ))}
          </select>
        </label>

        <label className="upload-preset-field">
          <span>Folder / Category:</span>
          <select
            className="media-assign-select"
            value={targetCategory}
            onChange={e => onCategoryChange(e.target.value)}
          >
            {MEDIA_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <div
        className={`upload-zone ${dragging ? 'upload-zone--active' : ''}`}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => {
            if (e.target.files?.length) onUpload(e.target.files)
            e.target.value = ''
          }}
        />
        <motion.div
          className="upload-zone__icon"
          animate={{ scale: dragging ? 1.15 : 1, y: dragging ? -4 : 0 }}
        >
          <Upload size={32} />
        </motion.div>
        <p className="upload-zone__title">Drag & drop photos and videos here</p>
        <p className="upload-zone__sub">or tap to pick from laptop / phone — mixed photos & videos work together ✨</p>
      </div>
    </div>
  )
}

function MediaCard({ item, onRemove, onUpdate, onAssign, onReplace, onDragStartItem }) {
  const [editing, setEditing]   = useState(false)
  const [title, setTitle]       = useState(item.title || '')
  const [caption, setCaption]   = useState(item.caption || '')
  const [date, setDate]         = useState(item.date || '')
  const [category, setCategory] = useState(item.category || 'Uncategorized')
  const [layout, setLayout]     = useState(item.layout || 'polaroid')
  const [cropPos, setCropPos]   = useState(item.crop?.position || 'center center')
  const [cropFit, setCropFit]   = useState(item.crop?.fit || 'cover')
  const replaceRef = useRef()

  const save = () => {
    onUpdate(item.id, {
      title,
      caption,
      date,
      category,
      layout,
      crop: { position: cropPos, fit: cropFit },
    })
    setEditing(false)
  }

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/x-birthday-media', item.id)
    e.dataTransfer.effectAllowed = 'move'
    onDragStartItem(item.id)
  }

  return (
    <motion.div
      className="media-card"
      layout
      draggable={!editing}
      onDragStart={handleDragStart}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="media-card__thumb">
        {item.type === 'video' ? (
          <video
            src={item.url}
            className="media-card__preview"
            style={{ objectFit: item.crop?.fit || 'cover', objectPosition: item.crop?.position || 'center' }}
            muted
          />
        ) : (
          <img
            src={item.url}
            alt={item.caption || item.name}
            className="media-card__preview"
            style={{ objectFit: item.crop?.fit || 'cover', objectPosition: item.crop?.position || 'center' }}
          />
        )}
        <div className="media-card__type-badge">
          {item.type === 'video' ? '🎬 Video' : '📸 Photo'}
        </div>
        {item.remoteUrl && <div className="media-card__cloud-badge" title="Saved to Cloud">☁️</div>}
      </div>

      {editing ? (
        <div className="media-card__edit">
          <input
            className="media-edit-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Short title (optional)..."
          />
          <input
            className="media-edit-input"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Caption / funny note..."
          />
          <input
            className="media-edit-input"
            value={date}
            onChange={e => setDate(e.target.value)}
            placeholder="Date (e.g. Dec 2024)..."
          />
          <select className="media-edit-input" value={category} onChange={e => setCategory(e.target.value)}>
            {MEDIA_CATEGORIES.map(c => <option key={c} value={c}>📁 {c}</option>)}
          </select>
          <select className="media-edit-input" value={layout} onChange={e => setLayout(e.target.value)}>
            {ITEM_LAYOUTS.map(l => <option key={l.id} value={l.id}>🎨 {l.label}</option>)}
          </select>
          <div className="media-crop-row">
            <select className="media-edit-input" value={cropPos} onChange={e => setCropPos(e.target.value)}>
              {CROP_POSITIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <select className="media-edit-input" value={cropFit} onChange={e => setCropFit(e.target.value)}>
              <option value="cover">Fill Crop</option>
              <option value="contain">Fit Whole</option>
            </select>
          </div>
          <div className="media-card__actions">
            <button type="button" className="media-btn media-btn--save" onClick={save}>Save</button>
            <button type="button" className="media-btn media-btn--cancel" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="media-card__meta">
          {item.title && <p className="media-card__title">{item.title}</p>}
          <p className="media-card__caption">{item.caption || <span className="media-empty-note">Tap pencil to add caption</span>}</p>
          <div className="media-card__tags">
            {item.date && <span className="media-tag">{item.date}</span>}
            {item.category && item.category !== 'Uncategorized' && <span className="media-tag">📁 {item.category}</span>}
            <span className="media-tag">🎨 {item.layout}</span>
          </div>
          {item.section && (
            <p className="media-card__section">
              📍 {ALL_SECTIONS.find(s => s.id === item.section)?.label || item.section}
            </p>
          )}
        </div>
      )}

      <div className="media-card__controls">
        <button type="button" className="media-icon-btn" onClick={() => setEditing(v => !v)} title="Edit details, layout & crop">
          <Edit2 size={13} />
        </button>

        <input
          ref={replaceRef}
          type="file"
          accept="image/*,video/*"
          style={{ display: 'none' }}
          onChange={e => {
            if (e.target.files?.[0]) onReplace(item.id, e.target.files[0])
            e.target.value = ''
          }}
        />
        <button type="button" className="media-icon-btn" onClick={() => replaceRef.current?.click()} title="Replace photo/video">
          <RefreshCw size={13} />
        </button>

        <select
          className="media-assign-select media-assign-select--compact"
          value={item.section || ''}
          onChange={e => onAssign(item.id, e.target.value || null)}
          title="Move to section"
        >
          <option value="">Move to section...</option>
          {ALL_SECTIONS.map(s => (
            <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
          ))}
        </select>

        <button type="button" className="media-icon-btn media-icon-btn--danger" onClick={() => onRemove(item.id)} title="Delete permanently">
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  )
}

function SectionView({ section, onPreview }) {
  const {
    getSection,
    unassignFromSection,
    moveItemOrder,
    reorder,
    assignToSection,
    draggedMediaId,
    setDraggedMediaId,
    sectionLayouts,
    setSectionLayout,
  } = useMedia()
  const items = getSection(section.id)
  const [dragIdx, setDragIdx] = useState(null)
  const [dropActive, setDropActive] = useState(false)

  const handleBoxDrop = (e) => {
    e.preventDefault()
    setDropActive(false)
    const droppedId = e.dataTransfer?.getData('application/x-birthday-media') || draggedMediaId
    if (droppedId) {
      assignToSection(droppedId, section.id)
      setDraggedMediaId(null)
    }
  }

  return (
    <div
      className={`section-view ${dropActive ? 'section-view--drop' : ''}`}
      onDragOver={e => { e.preventDefault(); setDropActive(true) }}
      onDragLeave={() => setDropActive(false)}
      onDrop={handleBoxDrop}
    >
      <div className="section-view__top">
        <h4 className="section-view__title">{section.icon} {section.label} ({items.length})</h4>

        <div className="section-view__actions">
          {section.id === 'gallery' && (
            <select
              className="media-assign-select media-assign-select--compact"
              value={sectionLayouts.gallery || 'polaroid'}
              onChange={e => setSectionLayout('gallery', e.target.value)}
            >
              {GALLERY_MODES.map(m => (
                <option key={m.id} value={m.id}>Layout: {m.label}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            className="section-view__preview-btn"
            onClick={() => onPreview(section.href)}
            title="Jump to this section on the website"
          >
            <ExternalLink size={12} /> Preview
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="section-view__empty">No media assigned here yet. Drop from Library or assign above.</p>
      ) : (
        <div className="section-view__grid">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="section-view__item"
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={e => e.preventDefault()}
              onDrop={(e) => {
                e.stopPropagation()
                if (dragIdx !== null && dragIdx !== idx) {
                  reorder(section.id, dragIdx, idx)
                }
                setDragIdx(null)
              }}
            >
              {item.type === 'video' ? (
                <video src={item.url} className="section-view__thumb" muted />
              ) : (
                <img
                  src={item.url}
                  alt={item.caption || item.name}
                  className="section-view__thumb"
                  style={{ objectFit: item.crop?.fit || 'cover', objectPosition: item.crop?.position || 'center' }}
                />
              )}
              <p className="section-view__caption">{item.caption || item.title || item.name}</p>

              <div className="section-view__order-btns">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveItemOrder(section.id, item.id, 'up')}
                  title="Move earlier"
                >
                  <ArrowUp size={11} />
                </button>
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => moveItemOrder(section.id, item.id, 'down')}
                  title="Move later"
                >
                  <ArrowDown size={11} />
                </button>
              </div>

              <button
                type="button"
                className="section-view__remove"
                onClick={() => unassignFromSection(item.id)}
                title="Remove from section (keeps file in Library)"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MediaManager({ onClose }) {
  const {
    items,
    loading,
    addFiles,
    replaceItem,
    updateItem,
    assignToSection,
    removeItem,
    canUndo,
    canRedo,
    undo,
    redo,
    setDraggedMediaId,
    cloudConfig,
    updateCloudConfig,
    exportManifest,
    importManifest,
  } = useMedia()

  const [tab, setTab] = useState('upload') // upload | library | sections | cloud
  const [docked, setDocked] = useState(false)
  const [filterSection, setFilterSection] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [targetSection, setTargetSection] = useState('gallery')
  const [targetCategory, setTargetCategory] = useState('Uncategorized')
  const [uploading, setUploading] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)
  const [cloudNameInput, setCloudNameInput] = useState(cloudConfig?.cloudName || '')
  const [presetInput, setPresetInput]       = useState(cloudConfig?.uploadPreset || '')
  const [statusNotice, setStatusNotice]     = useState('')
  const importRef = useRef()

  const handleUpload = async (files) => {
    setUploading(true)
    setUploadCount(files.length)
    await addFiles(files, targetSection, targetCategory)
    setUploading(false)
    setTab('library')
  }

  const handlePreviewJump = (href) => {
    setDocked(true)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleExport = () => {
    const json = exportManifest()
    const blob = new Blob([json], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'media-manifest.json'
    a.click()
    URL.revokeObjectURL(url)
    setStatusNotice('Exported media-manifest.json! Place in public/memories/ for cross-device Vercel sync.')
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importManifest(String(reader.result || '{}'))
        setStatusNotice('Imported memories setup successfully! ✨')
      } catch {
        setStatusNotice('Could not read that JSON file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const filtered = items.filter(i => {
    const sectionMatch =
      filterSection === 'all' ? true :
      filterSection === 'unassigned' ? !i.section :
      i.section === filterSection
    const catMatch =
      filterCategory === 'all' ? true :
      i.category === filterCategory
    return sectionMatch && catMatch
  })

  // Docked drag-to-section strip mode (lets user drag cards directly onto website sections!)
  if (docked) {
    return (
      <motion.div
        className="media-dock"
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        exit={{ y: 120 }}
      >
        <div className="media-dock__bar">
          <div className="media-dock__info">
            <strong>📌 Drag any photo/video below directly onto any section on the page!</strong>
          </div>
          <div className="media-dock__btns">
            <button type="button" className="btn-pastel" onClick={() => setDocked(false)}>
              <PanelBottomOpen size={14} /> Expand Editor
            </button>
            <button type="button" className="media-manager__close" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="media-dock__strip">
          {items.length === 0 ? (
            <span className="media-dock__empty">No uploaded items yet — click Expand Editor to upload!</span>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="media-dock__chip"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/x-birthday-media', item.id)
                  setDraggedMediaId(item.id)
                }}
              >
                {item.type === 'video' ? (
                  <video src={item.url} muted />
                ) : (
                  <img src={item.url} alt={item.caption || item.name} />
                )}
                <span>{item.caption || item.title || item.name}</span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="media-manager"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="media-manager__panel"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="media-manager__header">
          <div className="media-manager__title-row">
            <div>
              <h2 className="media-manager__title">🎨 Memory & Scrapbook Studio</h2>
              <p className="media-manager__subtitle">
                Upload photos & videos, write captions, switch layouts, drag into any section — auto-saved!
              </p>
            </div>
            <div className="media-manager__header-actions">
              <button
                type="button"
                className="media-icon-pill"
                disabled={!canUndo}
                onClick={undo}
                title="Undo last change"
              >
                <Undo2 size={14} /> Undo
              </button>
              <button
                type="button"
                className="media-icon-pill"
                disabled={!canRedo}
                onClick={redo}
                title="Redo change"
              >
                <Redo2 size={14} /> Redo
              </button>
              <button
                type="button"
                className="media-icon-pill media-icon-pill--dock"
                onClick={() => setDocked(true)}
                title="Dock to bottom so you can drag photos straight onto website sections"
              >
                <PanelBottomClose size={14} /> Drag Onto Page
              </button>
              <button type="button" className="media-manager__close" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="media-tabs">
            {[
              { id: 'upload',   label: 'Upload',                    icon: <Upload size={14} /> },
              { id: 'library',  label: `Library (${items.length})`, icon: <Grid size={14} /> },
              { id: 'sections', label: 'Arrange Sections',          icon: <Layers size={14} /> },
              { id: 'cloud',    label: 'Vercel Sync & Backup',      icon: <Cloud size={14} /> },
            ].map(t => (
              <button
                type="button"
                key={t.id}
                className={`media-tab ${tab === t.id ? 'media-tab--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="media-manager__body">
          {tab === 'upload' && (
            <div className="media-upload-tab">
              <UploadZone
                onUpload={handleUpload}
                targetSection={targetSection}
                onTargetChange={setTargetSection}
                targetCategory={targetCategory}
                onCategoryChange={setTargetCategory}
              />

              {uploading && (
                <div className="upload-progress">
                  <div className="upload-progress__bar" />
                  <p>Saving {uploadCount} file{uploadCount > 1 ? 's' : ''}...</p>
                </div>
              )}

              <div className="upload-tips">
                <p className="upload-tips__title">✨ How easy is this?</p>
                <ul>
                  <li>Drop photos & videos together from your laptop or phone — JPG, PNG, WEBP, MP4, MOV supported.</li>
                  <li>Click <strong>"Drag Onto Page"</strong> above to shrink this studio into a bottom tray and drag photos directly onto any section on the website!</li>
                  <li>Everything stays saved in your browser even after refreshing.</li>
                  <li>Want Mahir to see your uploaded photos on his phone via Vercel? Check the <strong>Vercel Sync & Backup</strong> tab!</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'library' && (
            <div className="media-library-tab">
              <div className="media-filter-row">
                <select
                  className="media-assign-select"
                  value={filterSection}
                  onChange={e => setFilterSection(e.target.value)}
                >
                  <option value="all">All sections ({items.length})</option>
                  <option value="unassigned">Unassigned only</option>
                  {ALL_SECTIONS.map(s => (
                    <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
                  ))}
                </select>

                <select
                  className="media-assign-select"
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                >
                  <option value="all">All folders</option>
                  {MEDIA_CATEGORIES.map(c => (
                    <option key={c} value={c}>📁 {c}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="media-loading">Loading your memories...</div>
              ) : filtered.length === 0 ? (
                <div className="media-empty">
                  <p>📸 Nothing in this view yet.</p>
                  <button type="button" className="btn-cinematic" onClick={() => setTab('upload')}>
                    Upload Photos & Videos
                  </button>
                </div>
              ) : (
                <div className="media-grid">
                  {filtered.map(item => (
                    <MediaCard
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                      onUpdate={updateItem}
                      onAssign={assignToSection}
                      onReplace={replaceItem}
                      onDragStartItem={setDraggedMediaId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'sections' && (
            <div className="media-sections-tab">
              <p className="sections-tip">
                💡 Tip: Drag thumbnails between cards to reorder them, or use the up/down arrows on phone! Removing from a section keeps the original file safe in your Library.
              </p>
              {ALL_SECTIONS.map(section => (
                <SectionView key={section.id} section={section} onPreview={handlePreviewJump} />
              ))}
            </div>
          )}

          {tab === 'cloud' && (
            <div className="media-cloud-tab">
              <div className="cloud-card">
                <h4>☁️ Optional Cloudinary Auto-Sync (Recommended for sharing Vercel link!)</h4>
                <p>
                  Browser uploads stay saved in IndexedDB on this device automatically. If you want uploads from your laptop to also appear when Mahir opens the Vercel website on his phone, add a free unsigned Cloudinary preset below (or in <code>.env</code>):
                </p>
                <div className="cloud-inputs">
                  <input
                    className="media-edit-input"
                    value={cloudNameInput}
                    onChange={e => setCloudNameInput(e.target.value)}
                    placeholder="Cloudinary Cloud Name (e.g. mahir-memories)"
                  />
                  <input
                    className="media-edit-input"
                    value={presetInput}
                    onChange={e => setPresetInput(e.target.value)}
                    placeholder="Unsigned Upload Preset (e.g. birthday_unsigned)"
                  />
                  <button
                    type="button"
                    className="btn-cinematic"
                    onClick={() => {
                      updateCloudConfig({
                        cloudName: cloudNameInput.trim(),
                        uploadPreset: presetInput.trim(),
                      })
                      setStatusNotice('Cloudinary settings saved! New uploads will sync to cloud URLs.')
                    }}
                  >
                    Save Cloud Config
                  </button>
                </div>
              </div>

              <div className="cloud-card">
                <h4>📦 Export / Import Memories Manifest</h4>
                <p>
                  Export your layout, captions, section order, and cloud URLs as <code>media-manifest.json</code>. Drop it into <code>public/memories/media-manifest.json</code> before pushing to Vercel so every visitor sees your curated setup!
                </p>
                <div className="cloud-btn-row">
                  <button type="button" className="btn-pastel" onClick={handleExport}>
                    <Download size={15} /> Export media-manifest.json
                  </button>
                  <input
                    ref={importRef}
                    type="file"
                    accept="application/json"
                    style={{ display: 'none' }}
                    onChange={handleImport}
                  />
                  <button type="button" className="btn-pastel" onClick={() => importRef.current?.click()}>
                    <FolderOpen size={15} /> Import Backup JSON
                  </button>
                </div>
                {statusNotice && <p className="cloud-status">{statusNotice}</p>}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
