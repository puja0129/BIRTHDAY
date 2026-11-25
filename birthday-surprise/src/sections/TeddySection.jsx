import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TEDDY_SECTION_DATA } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/teddy.css'
import '../styles/dropzone.css'

const HUG_NOTES = [
  "Instant sukoon mode: active 🤍",
  "Keeping you right beside me 🫂✨",
  "Not letting go anytime soon 🥹🧸",
  "Safe comfort delivered straight from this teddy ❤️",
]

export default function TeddySection() {
  const { getSection } = useMedia()
  const teddyMedia = getSection('teddy')

  const [hugCount, setHugCount] = useState(0)
  const [hugging, setHugging]   = useState(false)

  const handleHug = () => {
    setHugCount(c => c + 1)
    setHugging(true)
    setTimeout(() => setHugging(false), 900)
  }

  const lastIdx = TEDDY_SECTION_DATA.storyParagraphs.length - 1

  return (
    <section id="teddy" className="teddy-section section-padding">
      <div className="teddy-deco" aria-hidden="true">
        <FloatingDecorations set="teddy" count={10} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-eyebrow">{TEDDY_SECTION_DATA.eyebrow}</span>
          <h2>{TEDDY_SECTION_DATA.sectionTitle}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{TEDDY_SECTION_DATA.sectionSubtitle}</p>
        </motion.div>

        <SectionDropZone sectionId="teddy" label="Teddy Keepsake">
          <div className="teddy-spread">
            {/* Block 1: Complete Hindi-English Teddy Keepsake Story */}
            <motion.article
              className="teddy-story-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.65 }}
            >
              <span className="teddy-tape teddy-tape--peach" aria-hidden="true" />

              <div className="teddy-story-card__corner" aria-hidden="true">
                <motion.span
                  animate={{ y: [0, -4, 0], rotate: [-4, 4, -4] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🧸
                </motion.span>
                <motion.span
                  animate={{ scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🤍
                </motion.span>
              </div>

              <motion.p
                className="teddy-story-card__lead font-serif"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5 }}
              >
                {TEDDY_SECTION_DATA.storyLead}
              </motion.p>

              <div className="teddy-story-card__body">
                {TEDDY_SECTION_DATA.storyParagraphs.map((para, i) => (
                  <motion.p
                    key={i}
                    className={`teddy-para ${i === lastIdx ? 'teddy-para--signoff' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
                  >
                    {para}
                  </motion.p>
                ))}
              </div>
            </motion.article>

            {/* Right Column: Interactive Teddy Charm + Separate Additional Paragraph Block */}
            <div className="teddy-side-col">
              {/* Cozy Teddy Interactive Companion Card */}
              <motion.div
                className="teddy-charm-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: 0.08 }}
              >
                <div className="teddy-charm-stage">
                  <motion.span
                    className="teddy-float-heart teddy-float-heart--1"
                    animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden="true"
                  >
                    🤍
                  </motion.span>
                  <motion.span
                    className="teddy-float-heart teddy-float-heart--2"
                    animate={{ y: [0, -10, 0], opacity: [0.55, 1, 0.55] }}
                    transition={{ duration: 3.1, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden="true"
                  >
                    ❤️
                  </motion.span>
                  <motion.span
                    className="teddy-float-heart teddy-float-heart--3"
                    animate={{ y: [0, -6, 0], rotate: [-8, 8, -8] }}
                    transition={{ duration: 2.8, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden="true"
                  >
                    🎀
                  </motion.span>

                  <motion.button
                    type="button"
                    className="teddy-plush-btn"
                    onClick={handleHug}
                    animate={hugging ? { scale: [1, 1.18, 0.94, 1.04, 1] } : { y: [0, -5, 0] }}
                    transition={
                      hugging
                        ? { duration: 0.55 }
                        : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                    }
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Hug the teddy"
                  >
                    🧸
                  </motion.button>

                  <AnimatePresence>
                    {hugging && (
                      <motion.div
                        className="teddy-hug-puff"
                        initial={{ opacity: 0, y: 4, scale: 0.7 }}
                        animate={{ opacity: 1, y: -18, scale: 1.15 }}
                        exit={{ opacity: 0, y: -32 }}
                        transition={{ duration: 0.75 }}
                        aria-hidden="true"
                      >
                        🫂🤍❤️
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="teddy-charm-meta">
                  <button type="button" className="btn-pastel teddy-hug-cta" onClick={handleHug}>
                    🫂 Hug the Teddy
                  </button>
                  <p className="teddy-charm-status font-hand">
                    {hugCount > 0
                      ? `${HUG_NOTES[(hugCount - 1) % HUG_NOTES.length]} (${hugCount})`
                      : 'Tap the teddy whenever you miss me 🤍'}
                  </p>
                </div>
              </motion.div>

              {/* Block 2: Separate Additional Emotional Paragraph Card */}
              <motion.article
                className="teddy-attachment-card"
                initial={{ opacity: 0, y: 24, rotate: 0.8 }}
                whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
                whileHover={{ rotate: 0, y: -3 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: 0.14 }}
              >
                <span className="teddy-tape teddy-tape--lavender" aria-hidden="true" />
                <div className="teddy-attachment-card__head">
                  <span className="teddy-attachment-card__badge">
                    {TEDDY_SECTION_DATA.attachmentBadge}
                  </span>
                </div>

                <div className="teddy-attachment-card__body">
                  {TEDDY_SECTION_DATA.attachmentParagraphs.map((para, i) => (
                    <motion.p
                      key={i}
                      className="teddy-attachment-para"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    >
                      {para}
                    </motion.p>
                  ))}
                </div>
              </motion.article>

              {/* Optional dropped/assigned teddy photos */}
              {teddyMedia.length > 0 && (
                <div className="teddy-photos-row">
                  {teddyMedia.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="teddy-photo-polaroid"
                      style={{ '--tilt': `${idx % 2 === 0 ? -3 : 3}deg` }}
                      whileHover={{ scale: 1.05, rotate: 0 }}
                    >
                      {item.type === 'video' ? (
                        <video src={item.url} controls muted playsInline />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.caption || 'Teddy keepsake'}
                          style={{ objectPosition: item.crop?.position || 'center center' }}
                        />
                      )}
                      {item.caption && <p className="font-hand">{item.caption}</p>}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionDropZone>
      </div>
    </section>
  )
}
