import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Film, Clock, Plus, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { OUR_MEMORIES_SPREADS } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/ourMemories.css'
import '../styles/dropzone.css'

const VIEW_MODES = [
  { id: 'flipbook', label: '📖 Scrapbook Flipbook' },
  { id: 'slides',   label: '📽️ Memory Slides' },
  { id: 'timeline', label: '🎞️ Scrapbook Timeline' },
]

function MemoryMediaTile({ item, className = '', onClick, playVideoControls = false }) {
  if (!item) return null
  return (
    <div className={`om-media-tile ${className}`} onClick={onClick}>
      {item.type === 'video' ? (
        <video
          src={item.url}
          controls={playVideoControls}
          muted={!playVideoControls}
          playsInline
          className="om-media-el"
        />
      ) : (
        <img
          src={item.url}
          alt={item.caption || item.name || 'Our memory'}
          className="om-media-el"
          loading="lazy"
          style={{ objectPosition: item.crop?.position || 'center 22%' }}
        />
      )}
      {item.caption && (
        <span className="om-media-cap font-hand">{item.caption}</span>
      )}
    </div>
  )
}

export default function OurMemoriesSection() {
  const { items, getSection, addFiles } = useMedia()
  const fileInputRef = useRef(null)

  const [mode, setMode]           = useState('flipbook')
  const [pageIdx, setPageIdx]     = useState(0)
  const [slideIdx, setSlideIdx]   = useState(0)
  const [autoPlay, setAutoPlay]   = useState(false)
  const [lightboxItem, setLightbox] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Combine dedicated 'our-memories' items first, plus other real MY photos & videos without duplicates
  const memoryMedia = useMemo(() => {
    const dedicated = getSection('our-memories')
    const seen = new Set(dedicated.map(d => d.id))
    const rest = items.filter(it => !seen.has(it.id))
    return [...dedicated, ...rest]
  }, [getSection, items])

  // Build spreads so every curated spread + extra uploaded media always gets a page
  const spreads = useMemo(() => {
    const base = OUR_MEMORIES_SPREADS.map((sp, i) => {
      const pairStart = i * 2
      const primary = memoryMedia[pairStart] || null
      const secondary = memoryMedia[pairStart + 1] || null
      return { ...sp, items: [primary, secondary].filter(Boolean) }
    })

    // Append extra flipbook spreads automatically whenever media exceeds 8 items
    const extraOffset = OUR_MEMORIES_SPREADS.length * 2
    for (let i = extraOffset; i < memoryMedia.length; i += 3) {
      const slice = memoryMedia.slice(i, i + 3)
      const spreadNum = base.length + 1
      base.push({
        id: `spread-extra-${spreadNum}`,
        chapterTag: `Page ${String(spreadNum).padStart(2, '0')} · Bonus Scrapbook Collage`,
        dateLabel: 'Added Memories 📸🎬',
        title: 'More of our unfiltered chaos together',
        story: 'Every extra picture & clip tucked neatly into the next page of our memory book — flip anytime.',
        doodle: '🫂',
        paperTint: spreadNum % 2 === 0 ? '#fdf4ff' : '#fff8ed',
        sticker: 'Still collecting moments, Pagal Bhai ❤️',
        items: slice,
      })
    }
    return base
  }, [memoryMedia])

  const safePage = Math.min(pageIdx, Math.max(0, spreads.length - 1))
  const currentSpread = spreads[safePage] || spreads[0]

  const safeSlide = memoryMedia.length > 0 ? slideIdx % memoryMedia.length : 0
  const activeSlide = memoryMedia[safeSlide] || null

  // Slideshow auto-advance for photos (videos advance cleanly when they end)
  useEffect(() => {
    if (mode !== 'slides' || !autoPlay || memoryMedia.length <= 1) return
    if (activeSlide?.type === 'video') return
    const id = setTimeout(() => {
      setSlideIdx(i => (i + 1) % memoryMedia.length)
    }, 3400)
    return () => clearTimeout(id)
  }, [mode, autoPlay, safeSlide, activeSlide, memoryMedia.length])

  const handleQuickUpload = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    try {
      await addFiles(files, 'our-memories', 'Special Days')
      setPageIdx(0)
      setSlideIdx(0)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <section id="our-memories" className="om-section section-padding">
      <div className="om-deco" aria-hidden="true">
        <FloatingDecorations set="flipbook" count={10} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-eyebrow">Flip Through Together 🎞️🫂</span>
          <h2>Our Memories — Scrapbook &amp; Reels</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">
            Pictures, videos, and little stories side by side — turn the book pages, watch memory slides, or drop in new clips anytime.
          </p>
        </motion.div>

        {/* Top Bar: Mode Switcher + Direct Add Photos/Videos Button */}
        <div className="om-toolbar">
          <div className="om-mode-pills" role="tablist" aria-label="Choose memory view">
            {VIEW_MODES.map(m => (
              <button
                type="button"
                key={m.id}
                className={`om-mode-btn ${mode === m.id ? 'om-mode-btn--active' : ''}`}
                onClick={() => setMode(m.id)}
              >
                {m.id === 'flipbook' && <BookOpen size={14} />}
                {m.id === 'slides'   && <Film size={14} />}
                {m.id === 'timeline' && <Clock size={14} />}
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          <div className="om-upload-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleQuickUpload}
            />
            <button
              type="button"
              className="btn-cinematic om-add-media-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Plus size={16} />
              <span>{uploading ? 'Adding...' : 'Add Photos / Videos'}</span>
            </button>
          </div>
        </div>

        <SectionDropZone sectionId="our-memories" label="Our Memories Book">
          {/* 1. SCRAPBOOK FLIPBOOK MODE */}
          {mode === 'flipbook' && currentSpread && (
            <div className="om-book-wrap">
              <div className="om-book">
                <div className="om-book-spine" aria-hidden="true" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSpread.id}
                    className="om-book-spread"
                    style={{ '--spread-bg': currentSpread.paperTint }}
                    initial={{ opacity: 0, rotateY: -6, x: 18 }}
                    animate={{ opacity: 1, rotateY: 0, x: 0 }}
                    exit={{ opacity: 0, rotateY: 6, x: -18 }}
                    transition={{ duration: 0.38 }}
                  >
                    {/* Left Book Page: Story + First Frame */}
                    <div className="om-page om-page--left">
                      <div className="om-page-head">
                        <span className="om-chapter-pill">{currentSpread.chapterTag}</span>
                        <span className="om-page-doodle">{currentSpread.doodle}</span>
                      </div>

                      <span className="om-date-tag font-hand">{currentSpread.dateLabel}</span>
                      <h3 className="om-page-title">{currentSpread.title}</h3>
                      <p className="om-page-story">{currentSpread.story}</p>

                      {currentSpread.items[0] ? (
                        <motion.div
                          className="om-polaroid-slot"
                          whileHover={{ rotate: 0, scale: 1.03 }}
                          onClick={() => setLightbox(currentSpread.items[0])}
                        >
                          <span className="om-tape" aria-hidden="true" />
                          <MemoryMediaTile item={currentSpread.items[0]} />
                        </motion.div>
                      ) : (
                        <div className="om-empty-slot" onClick={() => fileInputRef.current?.click()}>
                          <span>📸</span>
                          <p>Click Add Photos / Videos to pin a memory here</p>
                        </div>
                      )}
                    </div>

                    {/* Right Book Page: Collage / Video + Handwritten Sticky Note */}
                    <div className="om-page om-page--right">
                      {currentSpread.items.length >= 2 ? (
                        <div className={`om-collage-stack om-collage-stack--n${Math.min(currentSpread.items.length, 3)}`}>
                          {currentSpread.items.slice(1).map((it, idx) => (
                            <motion.div
                              key={it.id}
                              className="om-collage-frame"
                              style={{ '--tilt': `${idx % 2 === 0 ? 2 : -2}deg` }}
                              whileHover={{ scale: 1.03, rotate: 0 }}
                              onClick={() => setLightbox(it)}
                            >
                              <MemoryMediaTile item={it} playVideoControls={it.type === 'video'} />
                            </motion.div>
                          ))}
                        </div>
                      ) : currentSpread.items[0] ? (
                        <div className="om-collage-single">
                          <motion.div
                            className="om-collage-frame"
                            whileHover={{ scale: 1.03 }}
                            onClick={() => setLightbox(currentSpread.items[0])}
                          >
                            <MemoryMediaTile item={currentSpread.items[0]} playVideoControls={currentSpread.items[0].type === 'video'} />
                          </motion.div>
                        </div>
                      ) : (
                        <div className="om-empty-slot" onClick={() => fileInputRef.current?.click()}>
                          <span>🎬</span>
                          <p>Drop mixed photos or videos right here ✨</p>
                        </div>
                      )}

                      <div className="om-sticky-quote">
                        <span>📌</span>
                        <p className="font-hand">{currentSpread.sticker}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Page-Turning Footer Controls */}
              <div className="om-book-nav">
                <button
                  type="button"
                  className="btn-pastel"
                  onClick={() => setPageIdx(p => (p > 0 ? p - 1 : spreads.length - 1))}
                >
                  <ChevronLeft size={16} /> Prev Page
                </button>

                <div className="om-page-dots">
                  {spreads.map((sp, i) => (
                    <button
                      type="button"
                      key={sp.id}
                      className={`om-dot ${i === safePage ? 'om-dot--active' : ''}`}
                      onClick={() => setPageIdx(i)}
                      aria-label={`Open page ${i + 1}`}
                    />
                  ))}
                  <span className="om-page-count">Page {safePage + 1} / {spreads.length}</span>
                </div>

                <button
                  type="button"
                  className="btn-pastel"
                  onClick={() => setPageIdx(p => (p + 1) % spreads.length)}
                >
                  Flip Page <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* 2. MEMORY SLIDES PROJECTOR MODE */}
          {mode === 'slides' && (
            <div className="om-slides-wrap">
              {activeSlide ? (
                <div className="om-slide-stage glass-card">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSlide.id}
                      className="om-slide-frame"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.35 }}
                    >
                      {activeSlide.type === 'video' ? (
                        <video
                          src={activeSlide.url}
                          controls
                          autoPlay={autoPlay}
                          onEnded={() => autoPlay && setSlideIdx(i => (i + 1) % memoryMedia.length)}
                          className="om-slide-media"
                        />
                      ) : (
                        <img
                          src={activeSlide.url}
                          alt={activeSlide.caption || 'Memory slide'}
                          className="om-slide-media"
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="om-slide-bar">
                    <div className="om-slide-meta">
                      <span className="om-slide-type">{activeSlide.type === 'video' ? '🎬 Video Reel' : '📸 Memory Slide'}</span>
                      <p className="font-hand om-slide-cap">{activeSlide.caption || activeSlide.name || 'One of ours 🤍'}</p>
                    </div>

                    <div className="om-slide-controls">
                      <button
                        type="button"
                        className="btn-pastel"
                        onClick={() => setSlideIdx(i => (i - 1 + memoryMedia.length) % memoryMedia.length)}
                      >
                        <ChevronLeft size={15} />
                      </button>
                      <button
                        type="button"
                        className="om-play-pill"
                        onClick={() => setAutoPlay(v => !v)}
                      >
                        {autoPlay ? <Pause size={14} /> : <Play size={14} />}
                        <span>{autoPlay ? 'Pause Slides' : 'Auto-Play'}</span>
                      </button>
                      <button
                        type="button"
                        className="btn-pastel"
                        onClick={() => setSlideIdx(i => (i + 1) % memoryMedia.length)}
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  <div className="om-thumb-strip">
                    {memoryMedia.map((m, idx) => (
                      <button
                        type="button"
                        key={m.id}
                        className={`om-thumb ${idx === safeSlide ? 'om-thumb--active' : ''}`}
                        onClick={() => setSlideIdx(idx)}
                      >
                        {m.type === 'video' ? (
                          <video src={m.url} muted />
                        ) : (
                          <img src={m.url} alt="" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="om-empty-slot om-empty-slot--big" onClick={() => fileInputRef.current?.click()}>
                  <span>🎞️</span>
                  <p>No slides yet — tap &ldquo;Add Photos / Videos&rdquo; above to fill the reel!</p>
                </div>
              )}
            </div>
          )}

          {/* 3. SCRAPBOOK TIMELINE RIBBON MODE */}
          {mode === 'timeline' && (
            <div className="om-timeline">
              {spreads.map((sp, i) => (
                <motion.div
                  key={sp.id}
                  className={`om-tl-card ${i % 2 === 0 ? 'om-tl-card--left' : 'om-tl-card--right'}`}
                  style={{ '--tl-bg': sp.paperTint }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                >
                  <div className="om-tl-text">
                    <span className="om-chapter-pill">{sp.dateLabel}</span>
                    <h3>{sp.title}</h3>
                    <p>{sp.story}</p>
                    <small className="font-hand">{sp.sticker}</small>
                  </div>
                  <div className="om-tl-media-row">
                    {sp.items.map(it => (
                      <div key={it.id} className="om-tl-polaroid" onClick={() => setLightbox(it)}>
                        <MemoryMediaTile item={it} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </SectionDropZone>
      </div>

      {/* Lightbox for full view */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="lightbox__card glass-card"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              {lightboxItem.type === 'video' ? (
                <video src={lightboxItem.url} controls autoPlay className="lightbox__img" />
              ) : (
                <img src={lightboxItem.url} alt={lightboxItem.caption} className="lightbox__img" />
              )}
              <div className="lightbox__meta">
                <p className="lightbox__caption">{lightboxItem.caption || lightboxItem.name || 'Our Memory'}</p>
              </div>
              <button type="button" className="lightbox__close" onClick={() => setLightbox(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
