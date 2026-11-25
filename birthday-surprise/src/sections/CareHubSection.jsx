import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, Check } from 'lucide-react'
import { NEED_ME_CARDS, UNWRITTEN_RULES, RANDOM_SURPRISES } from '../data/content'
import FloatingDecorations from '../components/FloatingDecorations'
import '../styles/careHub.css'

export default function CareHubSection() {
  const [selectedMood, setSelectedMood] = useState(NEED_ME_CARDS[0].id)
  const [checkedRules, setCheckedRules] = useState(() => UNWRITTEN_RULES.map((_, i) => i === 0 || i === 3))
  const [surpriseIdx, setSurpriseIdx]   = useState(0)

  const currentCard = NEED_ME_CARDS.find(c => c.id === selectedMood) || NEED_ME_CARDS[0]
  const currentSurprise = RANDOM_SURPRISES[surpriseIdx]

  const toggleRule = (idx) => {
    setCheckedRules(prev => prev.map((val, i) => (i === idx ? !val : val)))
  }

  const nextSurprise = () => {
    setSurpriseIdx(prev => {
      let next = Math.floor(Math.random() * RANDOM_SURPRISES.length)
      if (next === prev) next = (prev + 1) % RANDOM_SURPRISES.length
      return next
    })
  }

  return (
    <section id="care-hub" className="care-section section-padding">
      <div className="care-deco" aria-hidden="true">
        <FloatingDecorations set="love" count={10} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-eyebrow">Open Whenever Needed 💌</span>
          <h2>When You Need Your Puju</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">
            Tap whichever mood you&apos;re in today — plus our completely ridiculous unwritten rules &amp; Puju&apos;s random drop box.
          </p>
        </motion.div>

        {/* Part 1: When You Need Me mood tabs */}
        <div className="needme-wrapper">
          <div className="needme-tabs" role="tablist" aria-label="Choose how you feel">
            {NEED_ME_CARDS.map(card => (
              <button
                type="button"
                key={card.id}
                className={`needme-tab ${selectedMood === card.id ? 'needme-tab--active' : ''}`}
                style={{ '--tab-bg': card.color, '--tab-accent': card.accent }}
                onClick={() => setSelectedMood(card.id)}
              >
                {card.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              className="needme-letter-card"
              style={{ background: currentCard.color, '--accent': currentCard.accent }}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="needme-letter-card__title">{currentCard.title}</h3>
              <p className="needme-letter-card__msg">{currentCard.message}</p>
              <span className="needme-letter-card__sig font-hand">— Always yours, Puju 🤍</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Part 2: Dual Split — Unwritten Rules Notepad + Random Surprise Drop */}
        <div className="care-split-grid">
          {/* Unwritten Sibling Rules */}
          <motion.div
            className="rules-notepad"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
          >
            <div className="rules-notepad__spiral" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => <span key={i} />)}
            </div>
            <h3 className="rules-notepad__title">📜 Our Unwritten Sibling Rules</h3>
            <p className="rules-notepad__sub">Tap any rule to stamp it agreed (no appeals accepted 😂):</p>

            <ul className="rules-list">
              {UNWRITTEN_RULES.map((rule, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    className={`rule-item ${checkedRules[idx] ? 'rule-item--checked' : ''}`}
                    onClick={() => toggleRule(idx)}
                  >
                    <span className="rule-check">
                      {checkedRules[idx] && <Check size={13} strokeWidth={3} />}
                    </span>
                    <span>{rule}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Random Puju Surprise Button */}
          <motion.div
            className="surprise-box"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
          >
            <span className="surprise-box__eyebrow">🎁 Random Puju Surprise Jar</span>
            <h3 className="surprise-box__title">Tap for a sudden roast, inside joke, or soft truth</h3>

            <AnimatePresence mode="wait">
              <motion.div
                key={surpriseIdx}
                className="surprise-card"
                initial={{ opacity: 0, rotate: -2, scale: 0.92 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 2, scale: 0.92 }}
                transition={{ duration: 0.28 }}
              >
                <span className="surprise-card__tag">{currentSurprise.tag}</span>
                <p className="surprise-card__text font-hand">&ldquo;{currentSurprise.text}&rdquo;</p>
              </motion.div>
            </AnimatePresence>

            <motion.button
              type="button"
              className="btn-cinematic surprise-btn"
              onClick={nextSurprise}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shuffle size={16} /> Pull Another Surprise ✨
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
