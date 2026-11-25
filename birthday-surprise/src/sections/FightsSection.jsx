import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FIGHT_LINES, FIGHT_DIALOGUES, DRAMATIC_RESULT, SECTION_COPY } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/fights.css'
import '../styles/dropzone.css'

function SpeechBubble({ dialogue, index }) {
  const isMe   = dialogue.speaker === 'Puju' || dialogue.speaker === 'Bhailuu'
  const isBoth = dialogue.speaker === 'Both'
  return (
    <motion.div
      className={`speech-bubble speech-bubble--${isBoth ? 'both' : isMe ? 'me' : 'bhai'}`}
      initial={{ opacity: 0, scale: 0.7, x: isMe ? -26 : isBoth ? 0 : 26 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.22, type: 'spring', stiffness: 220 }}
    >
      <span className="speech-bubble__emoji">{dialogue.emoji}</span>
      <span className="speech-bubble__speaker">{dialogue.speaker}</span>
      <p className="speech-bubble__text">{dialogue.text}</p>
    </motion.div>
  )
}

export default function FightsSection() {
  const { getSectionOrFallback } = useMedia()
  const fightMedia = getSectionOrFallback('fights', 3, 4, 'photo')

  const [mode, setMode]         = useState('normal')
  const [showDialogue, setDia]  = useState(false)
  const [showResult, setResult] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const activateFight = () => {
    setMode('fight'); setDia(true); setResult(false); setRevealed(false)
  }
  const makePeace = () => {
    setMode('peace'); setDia(false); setResult(true)
  }

  return (
    <section id="fights" className="fights-section section-padding">
      <div className="fights-bg-deco" aria-hidden="true">
        <FloatingDecorations set="funny" count={10} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">{SECTION_COPY.fights.eyebrow}</span>
          <h2>{SECTION_COPY.fights.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{SECTION_COPY.fights.subtitle}</p>
        </motion.div>

        <SectionDropZone sectionId="fights" label="Our Fights">
          {/* Fight lines */}
          <div className="fight-lines">
            {FIGHT_LINES.map((line, i) => (
              <motion.div
                key={i}
                className="fight-line"
                initial={{ opacity: 0, x: i % 2 === 0 ? -36 : 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
                whileHover={{ x: i % 2 === 0 ? 5 : -5 }}
              >
                <span className="fight-line__bullet">{['😤','🌪️','🙄','💬','🤝','⏱️','🤔'][i]}</span>
                <p>{line}</p>
              </motion.div>
            ))}
          </div>

          {/* Meme / funny evidence clips & photos if uploaded */}
          {fightMedia.length > 0 && (
            <div className="fight-meme-board">
              {fightMedia.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="fight-meme-sticker"
                  style={{ '--tilt': `${idx % 2 === 0 ? -3 : 3}deg` }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{ scale: 1.06, rotate: 0 }}
                >
                  <span className="fight-meme-badge">EXHIBIT #{idx + 1} 😂</span>
                  {item.type === 'video' ? (
                    <video src={item.url} controls muted playsInline />
                  ) : (
                    <img src={item.url} alt={item.caption || 'Funny moment'} />
                  )}
                  <p className="font-hand">{item.caption || item.title || 'Caught on camera 😂'}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="fight-controls">
            <motion.button
              type="button"
              className={`fight-btn fight-btn--activate ${mode === 'fight' ? 'fight-btn--active' : ''}`}
              onClick={activateFight}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              😤 Activate Fight Mode
            </motion.button>
            {mode === 'fight' && (
              <motion.button
                type="button"
                className="fight-btn fight-btn--peace"
                onClick={makePeace}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🤝 Okay, Peace Now
              </motion.button>
            )}
          </div>

          {/* Dialogues */}
          <AnimatePresence>
            {showDialogue && (
              <motion.div
                className="dialogue-box"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                {FIGHT_DIALOGUES.map((d, i) => <SpeechBubble key={i} dialogue={d} index={i} />)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Peace message */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                className="peace-message"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="peace-message__text font-serif">
                  &ldquo;Fighting is temporary. Irritating each other is permanent. 😂&rdquo;
                </p>
                <p className="peace-message__sub">— Every single time, without fail.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drama reveal */}
          <div className="drama-section">
            <p className="drama-label">The ultimate question we never settled:</p>
            <h3 className="font-serif fights-drama-title">Who is more dramatic?</h3>
            <p className="drama-hint">Mahir vs. Puju — tap to see the honest verdict.</p>
            <motion.button
              type="button"
              className="fight-btn fight-btn--drama"
              onClick={() => setRevealed(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎭 Reveal the Truth
            </motion.button>
            <AnimatePresence>
              {revealed && (
                <motion.div
                  className="drama-result"
                  initial={{ opacity: 0, scale: 0.5, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 280 }}
                >
                  <span className="drama-result__icon">🏆</span>
                  <p>{DRAMATIC_RESULT}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionDropZone>
      </div>
    </section>
  )
}
