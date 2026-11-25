import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { TIMELINE_MEMORIES, SECTION_COPY } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/timeline.css'
import '../styles/dropzone.css'

function TimelineEntry({ memory, mediaItem, index, onOpenMedia }) {
  const isLeft = index % 2 === 0

  return (
    <motion.div
      className={`timeline-entry timeline-entry--${isLeft ? 'left' : 'right'}`}
      initial={{ opacity: 0, x: isLeft ? -45 : 45 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65 }}
    >
      <div className="timeline-dot" style={{ '--dot-color': memory.color }}>
        <span className="timeline-dot__emoji">{memory.emoji}</span>
      </div>

      <motion.div
        className="timeline-card"
        style={{ background: memory.bgTint || '#ffffff', borderColor: `${memory.color}38` }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
      >
        {(mediaItem || memory.image) && (
          <div
            className="timeline-card__photo"
            onClick={() => mediaItem && onOpenMedia(mediaItem)}
          >
            {mediaItem?.type === 'video' ? (
              <video src={mediaItem.url} muted controls playsInline />
            ) : (
              <img
                src={mediaItem?.url || memory.image}
                alt={mediaItem?.caption || memory.title}
                style={{ objectPosition: mediaItem?.crop?.position || 'center center' }}
              />
            )}
            {mediaItem?.caption && (
              <span className="timeline-card__photo-cap font-hand">{mediaItem.caption}</span>
            )}
          </div>
        )}
        <div className="timeline-card__header">
          <span className="timeline-card__date" style={{ color: memory.color }}>{memory.date}</span>
        </div>
        <h3 className="timeline-card__title">{memory.title}</h3>
        <p className="timeline-card__desc">{memory.description}</p>
      </motion.div>
    </motion.div>
  )
}

export default function TimelineSection() {
  const ref = useRef(null)
  const { getSection, getSectionOrFallback } = useMedia()
  const explicitStory = getSection('story')
  const storyMedia = explicitStory.length > 0
    ? explicitStory
    : getSectionOrFallback('story', TIMELINE_MEMORIES.length, 2, 'photo')
  const [activeMedia, setActiveMedia] = useState(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Extra story uploads beyond the 7 timeline slots appear cleanly below as a story strip
  const extraMedia = explicitStory.length > TIMELINE_MEMORIES.length
    ? explicitStory.slice(TIMELINE_MEMORIES.length)
    : []

  return (
    <section id="story" className="timeline-section section-padding" ref={ref}>
      <div className="timeline-deco" aria-hidden="true">
        <FloatingDecorations set="nature" count={10} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">{SECTION_COPY.timeline.eyebrow}</span>
          <h2>{SECTION_COPY.timeline.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{SECTION_COPY.timeline.subtitle}</p>
        </motion.div>

        <SectionDropZone sectionId="story" label="Our Story">
          <div className="timeline-wrapper">
            <div className="timeline-line">
              <motion.div className="timeline-line__fill" style={{ height: lineHeight }} />
            </div>

            <div className="timeline-entries">
              {TIMELINE_MEMORIES.map((memory, i) => (
                <TimelineEntry
                  key={memory.id}
                  memory={memory}
                  mediaItem={storyMedia[i] || null}
                  index={i}
                  onOpenMedia={setActiveMedia}
                />
              ))}
            </div>
          </div>

          {extraMedia.length > 0 && (
            <div className="story-extra-strip">
              {extraMedia.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="story-extra-card"
                  style={{ '--tilt': `${idx % 2 === 0 ? -2 : 2}deg` }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  onClick={() => setActiveMedia(item)}
                >
                  {item.type === 'video' ? (
                    <video src={item.url} muted />
                  ) : (
                    <img src={item.url} alt={item.caption || item.name} />
                  )}
                  <p className="font-hand">{item.caption || item.title || 'Story moment 🤍'}</p>
                </motion.div>
              ))}
            </div>
          )}
        </SectionDropZone>
      </div>

      <AnimatePresence>
        {activeMedia && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveMedia(null)}>
            <motion.div className="lightbox__card glass-card" initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              {activeMedia.type === 'video' ? (
                <video src={activeMedia.url} controls autoPlay className="lightbox__img" />
              ) : (
                <img src={activeMedia.url} alt={activeMedia.caption} className="lightbox__img" />
              )}
              <div className="lightbox__meta">
                <p className="lightbox__caption">{activeMedia.caption || activeMedia.name}</p>
                {activeMedia.date && <p className="lightbox__date">{activeMedia.date}</p>}
              </div>
              <button type="button" className="lightbox__close" onClick={() => setActiveMedia(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
