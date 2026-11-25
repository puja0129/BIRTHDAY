import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CHAPTERS, BIRTHDAY_LETTER, SECTION_COPY } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/chapters.css'
import '../styles/dropzone.css'

const TYPE_DECO = {
  funny:     'funny',
  emotional: 'bond',
  growth:    'nature',
  comfort:   'gold',
  sweet:     'love',
  letter:    'gold',
}

function Tape({ angle = -3, color = '#e86f9c' }) {
  return (
    <div className="tape" style={{ transform: `rotate(${angle}deg)`, background: `${color}44`, borderColor: `${color}66` }}>
      <div className="tape__texture" />
    </div>
  )
}

function ChapterCard({ chapter, index, onClick }) {
  return (
    <motion.div
      className="chapter-card"
      style={{ '--card-bg': chapter.bgGradient, '--card-color': chapter.color }}
      initial={{ opacity: 0, y: 28, rotate: index % 2 === 0 ? -1 : 1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.06 }}
      whileHover={{ y: -6, rotate: index % 2 === 0 ? 0.8 : -0.8, scale: 1.02 }}
      onClick={() => onClick(chapter)}
    >
      <Tape angle={index % 2 === 0 ? -3 : 3} color={chapter.color} />
      <div className="chapter-card__inner">
        <div className="chapter-card__header">
          <span className="chapter-card__num">{chapter.number}</span>
          <motion.span
            className="chapter-card__emoji"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          >
            {chapter.emoji}
          </motion.span>
        </div>
        <h3 className="chapter-card__title">{chapter.title}</h3>
        <p className="chapter-card__subtitle">{chapter.subtitle}</p>
        {chapter.funFact && (
          <div className="chapter-card__funfact">
            <span>💡</span> {chapter.funFact}
          </div>
        )}
        <div className="chapter-card__cta" style={{ color: chapter.color }}>
          Open note →
        </div>
      </div>
    </motion.div>
  )
}

function DayTimeline({ timeline }) {
  return (
    <div className="day-timeline">
      {timeline.map((entry, i) => (
        <motion.div
          key={i}
          className="day-entry"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="day-entry__time">{entry.time}</div>
          <div className="day-entry__bar">
            <motion.div
              className="day-entry__fill"
              initial={{ width: 0 }}
              animate={{ width: `${(entry.level / 5) * 100}%` }}
              transition={{ duration: 0.7, delay: i * 0.1 + 0.2 }}
              style={{ background: `hsl(${340 + entry.level * 18}, 82%, 68%)` }}
            />
          </div>
          <div className="day-entry__label">{entry.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

function LetterChapter() {
  const [opened, setOpened] = useState(false)
  const paragraphs = BIRTHDAY_LETTER.split('\n\n').filter(Boolean)

  return (
    <div className="letter-chapter">
      {!opened ? (
        <motion.div className="letter-sealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div
            className="letter-sealed__envelope"
            animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          >
            💌
          </motion.div>
          <h3 className="font-serif">My Final Letter to You</h3>
          <p className="letter-sealed__note">In our language. With emojis and zero filters.</p>
          <motion.button
            type="button"
            className="btn-cinematic"
            onClick={() => setOpened(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Open the letter ✨
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="letter-chapter__content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="letter-paper-bg">
            <div className="letter-paper-lines" aria-hidden="true" />
            <div className="letter-paper-content">
              {paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  className={`letter-modal-para ${i === 0 ? 'letter-modal-para--salutation' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function ChapterModal({ chapter, onClose }) {
  const { getSection } = useMedia()
  const photos = getSection(chapter?.id)

  if (!chapter) return null
  const isLetter = chapter.id === 'c11'

  return (
    <motion.div
      className="chapter-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="chapter-modal__inner"
        style={{ '--modal-color': chapter.color, '--modal-bg': chapter.bgGradient }}
        initial={{ scale: 0.88, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 24 }}
        transition={{ duration: 0.45, type: 'spring', stiffness: 220 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="chapter-modal__decos" aria-hidden="true">
          <FloatingDecorations set={TYPE_DECO[chapter.type] || 'gold'} count={8} />
        </div>

        <div className="chapter-modal__header">
          <div className="chapter-modal__header-left">
            <span className="chapter-modal__num">{chapter.number}</span>
            <span className="chapter-modal__emoji">{chapter.emoji}</span>
          </div>
          <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close chapter">✕</button>
        </div>

        <h2 className="chapter-modal__title">{chapter.title}</h2>
        <p className="chapter-modal__subtitle">{chapter.subtitle}</p>
        <div className="chapter-modal__rule" style={{ background: chapter.color }} />

        <div className="chapter-modal__body">
          {isLetter ? (
            <LetterChapter />
          ) : (
            <SectionDropZone sectionId={chapter.id} label={`Chapter ${chapter.number}`}>
              <div className="chapter-modal__content">
                {chapter.content.map((para, i) => (
                  <motion.p
                    key={i}
                    className={`chapter-para ${i === 0 ? 'chapter-para--lead' : ''}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                  >
                    {para}
                  </motion.p>
                ))}
              </div>

              {chapter.id === 'c7' && chapter.timeline && (
                <DayTimeline timeline={chapter.timeline} />
              )}

              {chapter.funFact && (
                <div className="chapter-funfact-badge">
                  💡 {chapter.funFact}
                </div>
              )}

              {photos.length > 0 && (
                <div className="chapter-photos">
                  {photos.map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      className="chapter-photo-frame"
                      style={{ '--rotate': `${(i % 3 - 1) * 2}deg` }}
                      whileHover={{ scale: 1.05, rotate: 0 }}
                    >
                      {photo.type === 'video' ? (
                        <video src={photo.url} className="chapter-photo-img" muted controls />
                      ) : (
                        <img src={photo.url} alt={photo.caption} className="chapter-photo-img" />
                      )}
                      {photo.caption && <p className="chapter-photo-caption font-hand">{photo.caption}</p>}
                    </motion.div>
                  ))}
                </div>
              )}
            </SectionDropZone>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ChaptersSection() {
  const [activeChapter, setActiveChapter] = useState(null)

  return (
    <section id="chapters" className="chapters-section section-padding">
      <div className="chapters-bg-deco" aria-hidden="true">
        <FloatingDecorations set="love" count={12} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">{SECTION_COPY.chapters.eyebrow}</span>
          <h2 className="chapters-title">{SECTION_COPY.chapters.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{SECTION_COPY.chapters.subtitle}</p>
        </motion.div>

        <div className="chapters-grid">
          {CHAPTERS.map((chapter, i) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              index={i}
              onClick={setActiveChapter}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeChapter && (
          <ChapterModal chapter={activeChapter} onClose={() => setActiveChapter(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
