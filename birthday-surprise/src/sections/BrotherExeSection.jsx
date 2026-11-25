import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BROTHER_EXE, SIBLING_AWARDS } from '../data/content'
import FloatingDecorations from '../components/FloatingDecorations'
import '../styles/brotherExe.css'

export default function BrotherExeSection() {
  const [roastMode, setRoastMode]       = useState(true)
  const [scanMsg, setScanMsg]           = useState('Status: 100% Pagal Brother online — click buttons or stats below 👀')
  const [activeAward, setActiveAward]   = useState(SIBLING_AWARDS[0].id)

  const selectedAward = SIBLING_AWARDS.find(a => a.id === activeAward) || SIBLING_AWARDS[0]

  return (
    <section id="brother-exe" className="exe-section section-padding">
      <div className="exe-deco" aria-hidden="true">
        <FloatingDecorations set="funny" count={8} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-eyebrow">Official System Diagnostic 💻😂</span>
          <h2>Running: Brother.exe</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">
            Puju ran a complete scan on Mahir. Results are dangerously accurate — toggle between Roast &amp; Truth below!
          </p>
        </motion.div>

        {/* Pastel Retro OS Card */}
        <motion.div
          className="exe-window"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
        >
          {/* Titlebar */}
          <div className="exe-titlebar">
            <div className="exe-dots">
              <span style={{ background: '#ff8eb8' }} />
              <span style={{ background: '#ffd97d' }} />
              <span style={{ background: '#8be0c5' }} />
            </div>
            <span className="exe-version">{BROTHER_EXE.version}</span>

            <div className="exe-mode-switch" role="group" aria-label="Switch tone">
              <button
                type="button"
                className={`exe-mode-btn ${roastMode ? 'exe-mode-btn--active' : ''}`}
                onClick={() => setRoastMode(true)}
              >
                🔥 Roast Mode
              </button>
              <button
                type="button"
                className={`exe-mode-btn ${!roastMode ? 'exe-mode-btn--active' : ''}`}
                onClick={() => setRoastMode(false)}
              >
                🤍 Real Talk
              </button>
            </div>
          </div>

          {/* Animated Stats Grid */}
          <div className="exe-stats">
            {BROTHER_EXE.stats.map((stat, idx) => (
              <div key={stat.id} className="exe-stat-row">
                <div className="exe-stat-head">
                  <span className="exe-stat-label">{stat.label}</span>
                  <span className="exe-stat-val" style={{ color: stat.color }}>
                    {stat.value === 100 && stat.id === 'safeplace' ? '∞%' : `${stat.value}%`}
                  </span>
                </div>

                <div className="exe-bar-track">
                  <motion.div
                    className="exe-bar-fill"
                    style={{ background: stat.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stat.value}%` }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.9, delay: idx * 0.1, ease: 'easeOut' }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${stat.id}-${roastMode}`}
                    className="exe-stat-note"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                  >
                    {roastMode ? stat.roastLine : stat.truthLine}
                  </motion.p>
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Interactive Diagnostic Buttons */}
          <div className="exe-actions-box">
            <div className="exe-action-btns">
              {BROTHER_EXE.quickChecks.map((check, i) => (
                <button
                  type="button"
                  key={i}
                  className="btn-pastel exe-action-btn"
                  onClick={() => setScanMsg(check.reply)}
                >
                  {check.label}
                </button>
              ))}
            </div>
            <motion.div
              key={scanMsg}
              className="exe-console"
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span>&gt;_</span> {scanMsg}
            </motion.div>
          </div>
        </motion.div>

        {/* Sibling Awards Shelf */}
        <div className="awards-block">
          <p className="awards-heading font-hand">Official Sibling Awards (zero unbiased judges involved 🏆)</p>
          <div className="awards-grid">
            {SIBLING_AWARDS.map((award) => (
              <motion.button
                type="button"
                key={award.id}
                className={`award-pill ${activeAward === award.id ? 'award-pill--active' : ''}`}
                style={{ '--award-bg': award.color }}
                onClick={() => setActiveAward(award.id)}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="award-pill__icon">{award.trophy}</span>
                <span className="award-pill__title">{award.title}</span>
                <span className="award-pill__badge">{award.badge}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAward.id}
              className="award-citation"
              style={{ background: selectedAward.color }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <span>{selectedAward.trophy}</span>
              <p>{selectedAward.note}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
