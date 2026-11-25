import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Plus, Heart, X } from 'lucide-react'
import { REMINDS_ME_BOARD } from '../data/content'
import FloatingDecorations from '../components/FloatingDecorations'
import '../styles/remindsMe.css'

const CUSTOM_REMINDERS_KEY = 'mahir-reminds-custom-v1'
const CATEGORIES = ['All', 'Dialogues', 'Songs', 'Objects', 'Habits', 'Moments']

function loadCustomReminders() {
  try {
    const raw = localStorage.getItem(CUSTOM_REMINDERS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function RemindsMeSection() {
  const [customItems, setCustomItems] = useState(loadCustomReminders)
  const [category, setCategory]       = useState('All')
  const [selectedId, setSelectedId]   = useState(REMINDS_ME_BOARD[0].id)
  const [discoveredIds, setDiscovered] = useState(() => new Set([REMINDS_ME_BOARD[0].id]))
  const [surpriseOpen, setSurpriseOpen] = useState(false)
  const [stampedMap, setStampedMap]     = useState({})
  const [adding, setAdding]             = useState(false)
  const [draft, setDraft] = useState({ icon: '✨', title: '', category: 'Moments', memory: '', surpriseNote: '' })

  const allItems = useMemo(() => [...REMINDS_ME_BOARD, ...customItems], [customItems])
  const filteredItems = useMemo(
    () => (category === 'All' ? allItems : allItems.filter(it => it.category === category)),
    [allItems, category]
  )

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_REMINDERS_KEY, JSON.stringify(customItems))
    } catch {
      // Ignore storage quota errors
    }
  }, [customItems])

  const activeItem = allItems.find(it => it.id === selectedId) || filteredItems[0] || allItems[0]

  const handleSelectTile = (item) => {
    setSelectedId(item.id)
    setSurpriseOpen(false)
    setDiscovered(prev => {
      const next = new Set(prev)
      next.add(item.id)
      return next
    })
  }

  const handleAddCustom = (e) => {
    e.preventDefault()
    if (!draft.title.trim() || !draft.memory.trim()) return
    const nextItem = {
      id: `rm-custom-${Date.now()}`,
      category: draft.category,
      shape: 'polaroid',
      icon: draft.icon.trim() || '🤍',
      title: draft.title.trim(),
      accent: '#e86f9c',
      tint: '#fff1f7',
      teaser: 'Pinned by Puju 🤍',
      memory: draft.memory.trim(),
      surpriseTitle: 'Personal Surprise ✨',
      surpriseNote: draft.surpriseNote.trim() || 'Every random little thing somehow leads straight back to you, Mahir ❤️',
      reactionLabel: 'Permanent Trigger 😂🤍',
    }
    setCustomItems(prev => [...prev, nextItem])
    setSelectedId(nextItem.id)
    setDiscovered(prev => new Set(prev).add(nextItem.id))
    setCategory('All')
    setDraft({ icon: '✨', title: '', category: 'Moments', memory: '', surpriseNote: '' })
    setAdding(false)
  }

  return (
    <section id="reminds-me" className="rm-section section-padding">
      <div className="rm-deco" aria-hidden="true">
        <FloatingDecorations set="keepsake" count={10} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-eyebrow">Little Brain Triggers &amp; Keepsakes 🤍</span>
          <h2>Things That Remind Me of You</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">
            Everyday objects, songs, habits, and random words that secretly shout &ldquo;Mahir!&rdquo; in my head — click any keepsake to reveal a surprise inside.
          </p>
        </motion.div>

        {/* Filter Bar + Discovery Meter */}
        <div className="rm-topbar">
          <div className="rm-filters" role="tablist" aria-label="Filter keepsakes by category">
            {CATEGORIES.map(cat => (
              <button
                type="button"
                key={cat}
                className={`rm-filter-btn ${category === cat ? 'rm-filter-btn--active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="rm-meta-right">
            <span className="rm-counter">
              ✨ Discovered {discoveredIds.size} / {allItems.length}
            </span>
            <button type="button" className="btn-pastel rm-pin-btn" onClick={() => setAdding(true)}>
              <Plus size={14} /> Pin Trigger
            </button>
          </div>
        </div>

        {/* Two-Column Pegboard + Surprise Inspector */}
        <div className="rm-layout">
          {/* Tactile Mixed-Shape Keepsake Pegboard */}
          <div className="rm-pegboard">
            {filteredItems.map((item, idx) => {
              const isSelected = activeItem?.id === item.id
              const isUnlocked = discoveredIds.has(item.id)
              return (
                <motion.button
                  type="button"
                  key={item.id}
                  className={`rm-tile rm-tile--${item.shape || 'polaroid'} ${isSelected ? 'rm-tile--active' : ''}`}
                  style={{ '--rm-bg': item.tint, '--rm-accent': item.accent, '--tilt': `${(idx % 3 - 1) * 1.8}deg` }}
                  whileHover={{ y: -5, rotate: 0, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectTile(item)}
                >
                  <span className="rm-tile__pin" aria-hidden="true" style={{ background: item.accent }} />
                  <span className="rm-tile__icon">{item.icon}</span>
                  <div className="rm-tile__text">
                    <small style={{ color: item.accent }}>{item.category}</small>
                    <strong>{item.title}</strong>
                    <span>{item.teaser}</span>
                  </div>
                  {isUnlocked && <span className="rm-tile__seen" title="Unlocked">✓</span>}
                </motion.button>
              )
            })}
          </div>

          {/* Interactive Surprise Reveal Drawer */}
          {activeItem && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                className="rm-drawer glass-card"
                style={{ '--rm-accent': activeItem.accent, '--rm-bg': activeItem.tint }}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="rm-drawer__head">
                  <span className="rm-drawer__emoji">{activeItem.icon}</span>
                  <div>
                    <span className="rm-drawer__cat" style={{ color: activeItem.accent }}>
                      {activeItem.category} Trigger
                    </span>
                    <h3 className="rm-drawer__title">{activeItem.title}</h3>
                  </div>
                </div>

                <p className="rm-drawer__memory">{activeItem.memory}</p>

                {/* Surprise Toggle Reveal */}
                <div className="rm-surprise-zone">
                  <button
                    type="button"
                    className="btn-cinematic rm-surprise-btn"
                    onClick={() => setSurpriseOpen(v => !v)}
                  >
                    <Sparkles size={15} />
                    <span>{surpriseOpen ? 'Hide Little Surprise' : 'Open Little Surprise Inside ✨'}</span>
                  </button>

                  <AnimatePresence>
                    {surpriseOpen && (
                      <motion.div
                        className="rm-surprise-card"
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      >
                        <strong>{activeItem.surpriseTitle}</strong>
                        <p className="font-hand">&ldquo;{activeItem.surpriseNote}&rdquo;</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  className={`rm-stamp-btn ${stampedMap[activeItem.id] ? 'rm-stamp-btn--done' : ''}`}
                  onClick={() => setStampedMap(prev => ({ ...prev, [activeItem.id]: !prev[activeItem.id] }))}
                >
                  <Heart size={14} fill={stampedMap[activeItem.id] ? 'currentColor' : 'none'} />
                  <span>{stampedMap[activeItem.id] ? `Stamped: ${activeItem.reactionLabel}` : activeItem.reactionLabel}</span>
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Add Custom Reminder Modal */}
      <AnimatePresence>
        {adding && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAdding(false)}
          >
            <motion.form
              className="bs-modal glass-card"
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 12 }}
              onClick={e => e.stopPropagation()}
              onSubmit={handleAddCustom}
            >
              <div className="rm-modal-head">
                <h3>Pin Another Reminder 🤍</h3>
                <button type="button" className="bs-mini-icon" onClick={() => setAdding(false)}>
                  <X size={14} />
                </button>
              </div>
              <div className="bs-field-row">
                <label className="bs-field">
                  <span>Emoji Icon</span>
                  <input
                    type="text"
                    value={draft.icon}
                    onChange={e => setDraft(d => ({ ...d, icon: e.target.value }))}
                  />
                </label>
                <label className="bs-field">
                  <span>Category</span>
                  <select
                    value={draft.category}
                    onChange={e => setDraft(d => ({ ...d, category: e.target.value }))}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="bs-field">
                <span>What Reminds You of Mahir? *</span>
                <input
                  type="text"
                  required
                  value={draft.title}
                  onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                  placeholder="e.g. Cold Coffee / Night Rides"
                />
              </label>
              <label className="bs-field">
                <span>Why? *</span>
                <textarea
                  rows={2}
                  required
                  value={draft.memory}
                  onChange={e => setDraft(d => ({ ...d, memory: e.target.value }))}
                  placeholder="Write the funny story or feeling..."
                />
              </label>
              <label className="bs-field">
                <span>Secret Surprise Line (optional)</span>
                <input
                  type="text"
                  value={draft.surpriseNote}
                  onChange={e => setDraft(d => ({ ...d, surpriseNote: e.target.value }))}
                  placeholder="Hidden confession unlocked when clicked..."
                />
              </label>
              <div className="bs-modal__actions">
                <button type="button" className="btn-pastel" onClick={() => setAdding(false)}>Cancel</button>
                <button type="submit" className="btn-cinematic">Pin Keepsake ✨</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
