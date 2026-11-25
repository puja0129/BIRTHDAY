import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { GALLERY_PHOTOS } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/photoAlbum.css'
import '../styles/dropzone.css'

const PHOTOS_PER_PAGE = 9

const ALBUM_TAPES    = ['#ffb8d0', '#ffe394', '#b4e7ff', '#c9f3dc', '#dccbff', '#ffd3ba']
const ALBUM_STICKERS = ['💖', '✨', '🌸', '🧸', '🫶', '💫', '🎀', '🤍']
const ALBUM_TILTS    = [-2.4, 1.8, -1.4, 2.3, -1.9, 1.5]

const SECTION_LABELS = {
  hero:     'Opening World',
  story:    'Our Story',
  memories: '3D Memory World',
  gallery:  'Polaroids',
  fights:   'Our Fights',
  bond:     'Our Bond',
  wishes:   'Birthday Wishes',
  teddy:    'Teddy Keepsake',
  letter:   'The Letter',
  birthday: 'Birthday Cake',
  rishta:   'Ye Kaisa Rishta',
  album:    'Photo Album',
}

function getSectionTag(section) {
  if (!section) return 'Our Memories'
  if (SECTION_LABELS[section]) return SECTION_LABELS[section]
  if (/^c\d+$/i.test(section)) return `Chapter ${section.slice(1).padStart(2, '0')}`
  return 'Our Memories'
}

function makePhotoDedupeKey(item) {
  if (item.sourcePath) return `path:${item.sourcePath.toLowerCase()}`
  if (item.remoteUrl && !item.remoteUrl.startsWith('blob:')) return `url:${item.remoteUrl}`
  if (item.blob && item.blob.name) return `file:${item.blob.name.toLowerCase()}::${item.blob.size || 0}`
  if (item.url && !item.url.startsWith('blob:')) return `url:${item.url}`
  return `id:${item.id}`
}

export default function PhotoAlbumSection() {
  const { items } = useMedia()
  const [page, setPage]               = useState(1)
  const [lightboxIdx, setLightboxIdx] = useState(null)

  // Collect ALL available website photos from the shared store (plus any static images), deduplicated cleanly
  const albumPhotos = useMemo(() => {
    const seenKeys = new Set()
    const collected = []

    const storePhotos = (items || [])
      .filter(it => it.type === 'photo' && (it.url || it.remoteUrl || it.src))
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

    const staticFallback = GALLERY_PHOTOS
      .filter(p => p.src)
      .map((p, idx) => ({
        ...p,
        type: 'photo',
        url: p.src,
        section: 'gallery',
        order: 10000 + idx,
      }))

    ;[...storePhotos, ...staticFallback].forEach(photo => {
      const key = makePhotoDedupeKey(photo)
      if (seenKeys.has(key)) return
      seenKeys.add(key)
      collected.push(photo)
    })

    return collected
  }, [items])

  const totalPages = Math.max(1, Math.ceil(albumPhotos.length / PHOTOS_PER_PAGE))
  const safePage   = Math.min(page, totalPages)
  const startIdx   = (safePage - 1) * PHOTOS_PER_PAGE
  const pagePhotos = albumPhotos.slice(startIdx, startIdx + PHOTOS_PER_PAGE)

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  // Keyboard support inside fullscreen lightbox
  useEffect(() => {
    if (lightboxIdx === null || albumPhotos.length === 0) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxIdx(null)
      } else if (e.key === 'ArrowLeft') {
        setLightboxIdx(i => {
          const next = i > 0 ? i - 1 : albumPhotos.length - 1
          setPage(Math.floor(next / PHOTOS_PER_PAGE) + 1)
          return next
        })
      } else if (e.key === 'ArrowRight') {
        setLightboxIdx(i => {
          const next = i < albumPhotos.length - 1 ? i + 1 : 0
          setPage(Math.floor(next / PHOTOS_PER_PAGE) + 1)
          return next
        })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIdx, albumPhotos.length])

  const goPrev = () => {
    setLightboxIdx(i => {
      const next = i > 0 ? i - 1 : albumPhotos.length - 1
      setPage(Math.floor(next / PHOTOS_PER_PAGE) + 1)
      return next
    })
  }

  const goNext = () => {
    setLightboxIdx(i => {
      const next = i < albumPhotos.length - 1 ? i + 1 : 0
      setPage(Math.floor(next / PHOTOS_PER_PAGE) + 1)
      return next
    })
  }

  const activePhoto = lightboxIdx !== null ? albumPhotos[lightboxIdx] : null

  return (
    <section id="album" className="album-section section-padding">
      <div className="album-deco" aria-hidden="true">
        <FloatingDecorations set="album" count={12} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-eyebrow">Puju&apos;s Keepsake Album for Mahir 📸🤍</span>
          <h2>Our Little Photo Album</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">
            Every photo gathered in one warm scrapbook — tap any frame to open it fullscreen in its natural shape.
          </p>
        </motion.div>

        {/* Album Meta Strip */}
        <div className="album-toolbar">
          <div className="album-count-pill">
            <Sparkles size={14} />
            <span>
              {albumPhotos.length} {albumPhotos.length === 1 ? 'memory' : 'memories'} collected
              {totalPages > 1 ? ` · Page ${safePage} of ${totalPages}` : ''}
            </span>
          </div>

          {totalPages > 1 && (
            <div className="album-pager" role="navigation" aria-label="Album pages">
              <button
                type="button"
                className="album-page-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                aria-label="Previous album page"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, idx) => {
                const num = idx + 1
                return (
                  <button
                    type="button"
                    key={num}
                    className={`album-page-num ${safePage === num ? 'album-page-num--active' : ''}`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                )
              })}
              <button
                type="button"
                className="album-page-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                aria-label="Next album page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>

        <SectionDropZone sectionId="album" label="Photo Album">
          {albumPhotos.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={safePage}
                className="album-masonry"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.32 }}
              >
                {pagePhotos.map((item, localIdx) => {
                  const globalIdx = startIdx + localIdx
                  const tilt      = ALBUM_TILTS[globalIdx % ALBUM_TILTS.length]
                  const tapeColor = ALBUM_TAPES[globalIdx % ALBUM_TAPES.length]
                  const sticker   = ALBUM_STICKERS[globalIdx % ALBUM_STICKERS.length]
                  const src       = item.url || item.remoteUrl || item.src

                  return (
                    <motion.article
                      key={item.id}
                      className="album-card"
                      style={{ '--tilt': `${tilt}deg` }}
                      initial={{ opacity: 0, y: 18, rotate: tilt }}
                      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
                      viewport={{ once: true, amount: 0.08 }}
                      transition={{ duration: 0.42, delay: (localIdx % 4) * 0.04 }}
                      whileHover={{ scale: 1.035, rotate: 0, y: -4, zIndex: 12 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setLightboxIdx(globalIdx)}
                    >
                      <span
                        className="album-card__tape"
                        style={{
                          background: `${tapeColor}d9`,
                          transform: `rotate(${globalIdx % 2 === 0 ? -4 : 4}deg)`,
                        }}
                        aria-hidden="true"
                      />
                      <span className="album-card__sticker" aria-hidden="true">{sticker}</span>

                      <div className="album-card__frame">
                        <img
                          src={src}
                          alt={item.caption || item.title || item.name || 'Mahir & Puju memory'}
                          className="album-card__img"
                          loading="lazy"
                        />
                      </div>

                      <div className="album-card__meta">
                        {item.title && <p className="album-card__title">{item.title}</p>}
                        <p className="album-card__caption font-hand">
                          {item.caption || 'Little piece of our chaos 🤍'}
                        </p>
                        <div className="album-card__footer">
                          <span className="album-card__tag">{getSectionTag(item.section)}</span>
                          {item.date && <span className="album-card__date">{item.date}</span>}
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="album-empty glass-card">
              <span className="album-empty__icon">📷🤍</span>
              <h3 className="font-serif">Our Photo Album is waiting!</h3>
              <p>
                Drop any photos here or upload them in <strong>🎨 Manage Memories</strong> — every photo across the site automatically gathers right here.
              </p>
            </div>
          )}
        </SectionDropZone>

        {totalPages > 1 && (
          <div className="album-bottom-pager">
            <button
              type="button"
              className="btn-pastel"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              <ChevronLeft size={15} /> Previous Page
            </button>
            <span className="album-bottom-pager__label font-hand">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              className="btn-pastel"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              Next Page <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Preserving Original Proportions */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            className="album-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setLightboxIdx(null)}
          >
            <motion.div
              className="album-lightbox__card"
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="album-lightbox__stage">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePhoto.id}
                    src={activePhoto.url || activePhoto.remoteUrl || activePhoto.src}
                    alt={activePhoto.caption || activePhoto.title || activePhoto.name}
                    className="album-lightbox__img"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.22 }}
                  />
                </AnimatePresence>
              </div>

              <div className="album-lightbox__meta">
                <div className="album-lightbox__badges">
                  <span className="album-lightbox__pill">{getSectionTag(activePhoto.section)}</span>
                  <span className="album-lightbox__counter">
                    {lightboxIdx + 1} / {albumPhotos.length}
                  </span>
                </div>
                {activePhoto.title && <p className="album-lightbox__title">{activePhoto.title}</p>}
                <p className="album-lightbox__caption font-hand">
                  {activePhoto.caption || activePhoto.name || 'Our favourite memory 🤍'}
                </p>
                {activePhoto.date && <p className="album-lightbox__date">{activePhoto.date}</p>}
              </div>
            </motion.div>

            {albumPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  className="album-lightbox__nav album-lightbox__nav--prev"
                  onClick={e => { e.stopPropagation(); goPrev() }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className="album-lightbox__nav album-lightbox__nav--next"
                  onClick={e => { e.stopPropagation(); goNext() }}
                  aria-label="Next photo"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <button
              type="button"
              className="lightbox__close"
              onClick={() => setLightboxIdx(null)}
              aria-label="Close photo"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
