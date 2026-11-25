import { motion } from 'framer-motion'
import { YE_KAISA_RISHTA_DATA } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/yeKaisaRishta.css'
import '../styles/dropzone.css'

export default function YeKaisaRishtaSection() {
  const { getSection } = useMedia()
  const rishtaPhotos = getSection('rishta')

  const closingIdx = YE_KAISA_RISHTA_DATA.partTwoParagraphs.length - 1

  return (
    <section id="rishta" className="rishta-section section-padding">
      {/* Subtle floating hearts, doodles, stars & ambient glows */}
      <div className="rishta-deco" aria-hidden="true">
        <FloatingDecorations set="rishta" count={12} />
      </div>
      <div className="rishta-glow rishta-glow--warm" aria-hidden="true" />
      <div className="rishta-glow rishta-glow--mist" aria-hidden="true" />

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-eyebrow">{YE_KAISA_RISHTA_DATA.eyebrow}</span>
          <h2>{YE_KAISA_RISHTA_DATA.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{YE_KAISA_RISHTA_DATA.subtitle}</p>
        </motion.div>

        <SectionDropZone sectionId="rishta" label="Ye Kaisa Rishta">
          <div className="rishta-journal-wrap">
            {/* ── ACT I: Playful, Warm & Teasing Scrapbook Folio ── */}
            <motion.article
              className="rishta-folio rishta-folio--warm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.5 }}
            >
              <span className="rishta-washi rishta-washi--peach" aria-hidden="true" />
              <span className="rishta-washi rishta-washi--mint" aria-hidden="true" />
              <div className="rishta-paper-rules" aria-hidden="true" />

              <div className="rishta-folio__top">
                <span className="rishta-act-badge rishta-act-badge--warm">
                  {YE_KAISA_RISHTA_DATA.partOneBadge}
                </span>
                <motion.span
                  className="rishta-corner-doodle"
                  animate={{ rotate: [-5, 5, -5], y: [0, -3, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                  aria-hidden="true"
                >
                  🤣❤️
                </motion.span>
              </div>

              <div className="rishta-stream">
                {YE_KAISA_RISHTA_DATA.partOneParagraphs.map((para, i) => (
                  <div key={i} className="rishta-entry-wrap">
                    <motion.p
                      className={`rishta-para ${para.handHighlight ? 'rishta-para--hand' : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{ duration: 0.36 }}
                    >
                      <span className="rishta-para__doodle" aria-hidden="true">{para.doodle}</span>
                      <span>{para.text}</span>
                    </motion.p>

                    {i < YE_KAISA_RISHTA_DATA.partOneParagraphs.length - 1 && (
                      <div className="rishta-break" aria-hidden="true">
                        <span className="rishta-break__line" />
                        <span className="rishta-break__glyph">{i % 2 === 0 ? '✦' : '♡'}</span>
                        <span className="rishta-break__line" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.article>

            {/* ── VISUAL TONE SHIFT: Playful jokes -> Unexplained Deep Bond ── */}
            <motion.div
              className="rishta-shift"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55 }}
            >
              <div className="rishta-shift__line" />
              <div className="rishta-shift__center">
                <div className="rishta-shift__hearts" aria-hidden="true">
                  <motion.span
                    animate={{ scale: [1, 1.22, 1], y: [0, -3, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🤍
                  </motion.span>
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0], opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.22, 1], y: [0, -3, 0] }}
                    transition={{ duration: 2.2, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🥹
                  </motion.span>
                </div>
                <span className="rishta-shift__whisper font-hand">
                  {YE_KAISA_RISHTA_DATA.transitionWhisper}
                </span>
              </div>
              <div className="rishta-shift__line" />
            </motion.div>

            {/* ── ACT II: Deep, Quiet, Emotional Unexplained Connection ── */}
            <motion.article
              className="rishta-folio rishta-folio--emotional"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.08 }}
              transition={{ duration: 0.55 }}
            >
              <span className="rishta-washi rishta-washi--lavender" aria-hidden="true" />
              <div className="rishta-thread-line" aria-hidden="true" />

              <div className="rishta-folio__top">
                <span className="rishta-act-badge rishta-act-badge--emotional">
                  {YE_KAISA_RISHTA_DATA.partTwoBadge}
                </span>
              </div>

              <motion.h3
                className="rishta-emotional-lead font-serif"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45 }}
              >
                {YE_KAISA_RISHTA_DATA.partTwoLead}
              </motion.h3>

              <div className="rishta-emotional-stream">
                {YE_KAISA_RISHTA_DATA.partTwoParagraphs.map((para, i) => (
                  <div key={i} className="rishta-emotional-row">
                    <span className="rishta-thread-dot" aria-hidden="true">
                      {i === closingIdx ? '♾️' : '•'}
                    </span>
                    <motion.p
                      className={`rishta-emotional-para ${para.handHighlight ? 'rishta-emotional-para--closing font-hand' : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.12 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                    >
                      {para.text}
                    </motion.p>
                  </div>
                ))}
              </div>

              {/* Soft Animated Ending Emblem */}
              <motion.div
                className="rishta-finale"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55 }}
              >
                <div className="rishta-finale__orbs" aria-hidden="true">
                  <motion.span
                    className="rishta-orb rishta-orb--rose"
                    animate={{ x: [-4, 4, -4], scale: [1, 1.08, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🫀
                  </motion.span>
                  <motion.span
                    className="rishta-orb-link"
                    animate={{ opacity: [0.55, 1, 0.55], scale: [0.96, 1.06, 0.96] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ♾️
                  </motion.span>
                  <motion.span
                    className="rishta-orb rishta-orb--violet"
                    animate={{ x: [4, -4, 4], scale: [1, 1.08, 1] }}
                    transition={{ duration: 3.2, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    🤍
                  </motion.span>
                </div>
                <p className="rishta-finale__caption font-hand">
                  Bas feel hota hai — hamesha. 🫂❤️🩹✨
                </p>
              </motion.div>
            </motion.article>

            {/* Optional pinned photos if dropped into this section */}
            {rishtaPhotos.length > 0 && (
              <div className="rishta-photos-row">
                {rishtaPhotos.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    className="rishta-polaroid"
                    style={{ '--tilt': `${idx % 2 === 0 ? -2.5 : 2.5}deg` }}
                    whileHover={{ scale: 1.04, rotate: 0 }}
                  >
                    {item.type === 'video' ? (
                      <video src={item.url} controls muted playsInline />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.caption || 'Our bond'}
                        style={{ objectPosition: item.crop?.position || 'center 22%' }}
                      />
                    )}
                    {item.caption && <p className="font-hand">{item.caption}</p>}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </SectionDropZone>
      </div>
    </section>
  )
}
