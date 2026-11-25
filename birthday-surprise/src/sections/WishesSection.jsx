import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BIRTHDAY_WISHES,
  WISH_SCRAPBOOK_META,
  GALLERY_PHOTOS,
  SECTION_COPY,
} from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/wishes.css'
import '../styles/dropzone.css'

// Different playful reveal animations per wish card so consecutive items feel fresh
function getPhotoRevealVariant(layout) {
  switch (layout) {
    case 'polaroid-right':
      return { initial: { opacity: 0, x: 45, y: -35, rotate: 10 }, animate: { opacity: 1, x: 0, y: 0, rotate: 4 } }
    case 'float-left':
      return { initial: { opacity: 0, x: -50, y: 24, rotate: -10 }, animate: { opacity: 1, x: 0, y: 0, rotate: -5 } }
    case 'corner-top':
      return { initial: { opacity: 0, y: -50, scale: 0.8, rotate: 8 }, animate: { opacity: 1, y: 0, scale: 1, rotate: -3 } }
    case 'dual-peek':
      return { initial: { opacity: 0, scale: 0.78, rotate: 6 }, animate: { opacity: 1, scale: 1, rotate: 3 } }
    case 'postcard-bottom':
      return { initial: { opacity: 0, y: 55, rotate: -8 }, animate: { opacity: 1, y: 0, rotate: 4 } }
    case 'chaos-side':
      return { initial: { opacity: 0, x: -42, rotate: -12, scale: 0.85 }, animate: { opacity: 1, x: 0, rotate: -4, scale: 1 } }
    case 'ticket-tilt':
      return { initial: { opacity: 0, x: 48, rotate: -8, scale: 0.85 }, animate: { opacity: 1, x: 0, rotate: 5, scale: 1 } }
    default:
      return { initial: { opacity: 0, y: 36, scale: 0.88 }, animate: { opacity: 1, y: 0, scale: 1 } }
  }
}

function WishPolaroid({ photo, meta, index, onClick, secondary = false }) {
  const anim = getPhotoRevealVariant(meta.layout)
  const src = photo?.url || photo?.src

  return (
    <motion.div
      className={`wish-polaroid ${secondary ? 'wish-polaroid--secondary' : ''}`}
      style={{ '--tape-color': meta.tapeColor }}
      initial={anim.initial}
      whileInView={anim.animate}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay: secondary ? 0.22 : 0.12, type: 'spring', stiffness: 170 }}
      whileHover={{ scale: 1.06, rotate: 0, zIndex: 12 }}
      onClick={() => onClick(photo || { placeholder: meta.photoPlaceholder, caption: meta.handNote, isPlaceholder: true })}
    >
      <span className="wish-polaroid__tape" />
      <div className="wish-polaroid__frame">
        {src ? (
          photo.type === 'video' ? (
            <video src={src} className="wish-polaroid__media" muted />
          ) : (
            <img
              src={src}
              alt={photo.caption || meta.handNote}
              className="wish-polaroid__media"
              loading="lazy"
              style={{ objectPosition: photo.crop?.position || 'center center' }}
            />
          )
        ) : (
          <div className="wish-polaroid__placeholder">
            <span>{meta.photoPlaceholder}</span>
            <small>drop wish #{index + 1} photo</small>
          </div>
        )}
      </div>
      <p className="wish-polaroid__note font-hand">
        {photo?.caption || meta.handNote}
      </p>
    </motion.div>
  )
}

function WishScrapbookRow({ wish, index, primaryPhoto, secondaryPhoto, onOpenPhoto }) {
  const meta = WISH_SCRAPBOOK_META[index % WISH_SCRAPBOOK_META.length]
  const numLabel = String(index + 1).padStart(2, '0')
  const cardEnterX = index % 2 === 0 ? -28 : 28

  return (
    <motion.article
      className={`wish-row wish-row--${meta.layout}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55 }}
    >
      {/* Main Wish Card */}
      <motion.div
        className="wish-card"
        style={{ background: meta.bg, '--wish-accent': meta.accent }}
        initial={{ opacity: 0, x: cardEnterX }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.6 }}
      >
        <div className="wish-card__top">
          <span className="wish-card__num" style={{ color: meta.accent }}>{numLabel} / 08</span>
          <motion.span
            className="wish-card__sticker"
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {meta.sticker}
          </motion.span>
        </div>

        {/* Exact original wish text preserved */}
        <p className="wish-card__text">{wish}</p>

        <div className="wish-card__footer">
          <span className="wish-card__tag font-hand" style={{ color: meta.accent }}>
            {meta.handNote}
          </span>
        </div>
      </motion.div>

      {/* Unexpected Scroll-Revealed Polaroids */}
      <div className="wish-photos-cluster">
        <WishPolaroid
          photo={primaryPhoto}
          meta={meta}
          index={index}
          onClick={onOpenPhoto}
        />
        {(meta.layout === 'dual-peek' || meta.layout === 'finale-duo') && secondaryPhoto && (
          <WishPolaroid
            photo={secondaryPhoto}
            meta={meta}
            index={index + 8}
            onClick={onOpenPhoto}
            secondary
          />
        )}
      </div>
    </motion.article>
  )
}

export default function WishesSection() {
  const { getSectionOrFallback, items } = useMedia()
  const wishesPool = getSectionOrFallback('wishes', 12, 3, 'photo')
  const [activePhoto, setActivePhoto] = useState(null)

  const photoPool = useMemo(() => {
    const staticPics = GALLERY_PHOTOS.filter(p => p.src).map(p => ({ ...p, url: p.src }))
    const fallback = wishesPool.length > 0 ? wishesPool : (items.length > 0 ? items : staticPics)
    return fallback
  }, [wishesPool, items])

  const getWishPhoto = (slotIdx) => {
    if (photoPool.length === 0) return null
    return photoPool[slotIdx % photoPool.length]
  }

  return (
    <section id="wishes" className="wishes-section section-padding">
      <div className="wishes-deco" aria-hidden="true">
        <FloatingDecorations set="butterflies" count={12} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">{SECTION_COPY.wishes.eyebrow}</span>
          <h2>{SECTION_COPY.wishes.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{SECTION_COPY.wishes.subtitle}</p>
        </motion.div>

        <SectionDropZone sectionId="wishes" label="Birthday Wishes">
          <div className="wishes-journey">
            {BIRTHDAY_WISHES.map((wish, i) => (
              <WishScrapbookRow
                key={i}
                wish={wish}
                index={i}
                primaryPhoto={getWishPhoto(i)}
                secondaryPhoto={getWishPhoto(i + 8)}
                onOpenPhoto={setActivePhoto}
              />
            ))}
          </div>
        </SectionDropZone>
      </div>

      {/* Lightbox for clicked wish photo */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              className="lightbox__card glass-card"
              initial={{ scale: 0.86 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              {(activePhoto.url || activePhoto.src) ? (
                activePhoto.type === 'video' ? (
                  <video src={activePhoto.url} controls autoPlay className="lightbox__img" />
                ) : (
                  <img src={activePhoto.url || activePhoto.src} alt={activePhoto.caption} className="lightbox__img" />
                )
              ) : (
                <div className="lightbox__placeholder">
                  <span>{activePhoto.placeholder || '🎂'}</span>
                  <p>Drop your photos into the Wishes area or assign them under <strong>Birthday Wishes</strong> in Manage Memories!</p>
                </div>
              )}
              <div className="lightbox__meta">
                <p className="lightbox__caption">{activePhoto.caption || activePhoto.name || 'Birthday memory 🤍'}</p>
                {activePhoto.date && <p className="lightbox__date">{activePhoto.date}</p>}
              </div>
              <button type="button" className="lightbox__close" onClick={() => setActivePhoto(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
