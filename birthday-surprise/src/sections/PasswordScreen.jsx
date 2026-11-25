import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE_CONFIG } from '../data/content'
import FloatingDecorations from '../components/FloatingDecorations'
import '../styles/password.css'

export default function PasswordScreen({ onUnlock }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const tryUnlock = () => {
    if (input.trim().toLowerCase() === SITE_CONFIG.password.toLowerCase()) {
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setTimeout(() => setError(false), 2000)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') tryUnlock()
  }

  return (
    <motion.div
      className="password-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FloatingDecorations set="love" count={12} />

      <motion.div
        className={`password-card glass-card ${shake ? 'password-card--shake' : ''}`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <div className="password-emoji">🔐</div>
        <h2 className="password-title font-serif">Oyy Mahir, secret knock!</h2>
        <p className="password-subtitle">Type the tiny secret code to step inside.</p>
        <input
          type="password"
          className={`password-input ${error ? 'password-input--error' : ''}`}
          placeholder="Secret code..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          autoFocus
        />
        <AnimatePresence>
          {error && (
            <motion.p
              className="password-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Nope! Not that one 😂 Try again?
            </motion.p>
          )}
        </AnimatePresence>
        <button type="button" className="btn-cinematic password-btn" onClick={tryUnlock}>
          Unlock Surprise ✨
        </button>
        <p className="password-note">
          Frontend privacy gate only — just keeps casual visitors out.
        </p>
      </motion.div>
    </motion.div>
  )
}
