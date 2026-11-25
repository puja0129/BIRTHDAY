import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SECRET_MESSAGE, SITE_CONFIG } from '../data/content'
import '../styles/footer.css'

export default function Footer() {
  const [clicks, setClicks]     = useState(0)
  const [revealed, setRevealed] = useState(false)

  const handleHeartClick = () => {
    const next = clicks + 1
    setClicks(next)
    if (next >= 5) setRevealed(true)
  }

  const paragraphs = SECRET_MESSAGE.split('\n\n').filter(Boolean)

  return (
    <footer className="footer">
      <div className="footer__rainbow-top" aria-hidden="true" />
      <div className="footer__inner section-container">
        <div className="footer__content">
          <motion.p
            className="footer__tagline font-hand"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {SITE_CONFIG.openingTagline}
          </motion.p>

          <div className="footer__divider" />

          <p className="footer__hint">
            {clicks < 5
              ? `Pssst... tap the little heart ${5 - clicks} more time${5 - clicks !== 1 ? 's' : ''} 👀`
              : 'Okayy you unlocked the tiny extra secret! 🌟'}
          </p>

          <motion.button
            type="button"
            className="footer__heart"
            onClick={handleHeartClick}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8 }}
            animate={clicks > 0 && clicks < 5 ? { scale: [1, 1.45, 1] } : {}}
            transition={{ duration: 0.3 }}
            aria-label="Secret heart"
          >
            {clicks >= 5 ? '🌟' : '🩷'}
          </motion.button>

          <p className="footer__made-with">
            Made by your Puju, with love, bakbak &amp; way too much sibling drama. 😂❤️
          </p>

          <p className="footer__copy">Mahir · 5 December 2026 🎂✨</p>
        </div>
      </div>

      {/* Secret modal */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="secret-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRevealed(false)}
          >
            <motion.div
              className="secret-modal__card"
              initial={{ scale: 0.84, rotate: -3, y: 30 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="secret-modal__paper-lines" aria-hidden="true" />

              <div className="secret-modal__top">
                <motion.span
                  className="secret-modal__icon"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  🌟
                </motion.span>
                <span className="secret-modal__badge">secret unlocked · Mahir only 👀</span>
              </div>

              <div className="secret-modal__text">
                {paragraphs.map((para, i) => (
                  <motion.p
                    key={i}
                    className={`secret-para ${i === 0 ? 'secret-para--lead font-hand' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.1 }}
                  >
                    {para}
                  </motion.p>
                ))}
              </div>

              <button type="button" className="btn-pastel secret-close" onClick={() => setRevealed(false)}>
                Close Secret ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}
