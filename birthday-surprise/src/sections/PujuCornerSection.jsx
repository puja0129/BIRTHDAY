import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { REMINDS_ME_ITEMS, ALT_UNIVERSE_CHATS, PROMISE_WALL } from '../data/content'
import FloatingDecorations from '../components/FloatingDecorations'
import '../styles/pujuCorner.css'

export default function PujuCornerSection() {
  const [activeReminder, setActiveReminder] = useState(0)
  const [chatScenario, setChatScenario]     = useState(ALT_UNIVERSE_CHATS[0].id)
  const [stampedPromises, setStamped]       = useState({ pr2: true, pr6: true })

  const activeChat = ALT_UNIVERSE_CHATS.find(c => c.id === chatScenario) || ALT_UNIVERSE_CHATS[0]

  const toggleStamp = (id) => {
    setStamped(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section id="puju-corner" className="corner-section section-padding">
      <div className="corner-deco" aria-hidden="true">
        <FloatingDecorations set="butterflies" count={10} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* 1. Things That Remind Me of You */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-eyebrow">Random Triggers 😂❤️</span>
          <h2>Things That Randomly Remind Me of You</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">
            Tap any little token to see why my brain immediately blames it on you.
          </p>
        </motion.div>

        <div className="reminds-wrap">
          <div className="reminds-chips">
            {REMINDS_ME_ITEMS.map((item, idx) => (
              <motion.button
                type="button"
                key={idx}
                className={`remind-chip ${activeReminder === idx ? 'remind-chip--active' : ''}`}
                onClick={() => setActiveReminder(idx)}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>{item.emoji}</span>
                <span>{item.title}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeReminder}
              className="remind-story glass-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <span className="remind-story__emoji">{REMINDS_ME_ITEMS[activeReminder].emoji}</span>
              <p>{REMINDS_ME_ITEMS[activeReminder].story}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2. Dual Interactive Row: Alternate Universe Chat + Puju's Promise Wall */}
        <div className="corner-dual-grid">
          {/* Phone Mockup: Chat in Another Universe */}
          <motion.div
            className="alt-phone"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
          >
            <div className="alt-phone__top">
              <div className="alt-phone__notch" />
              <p className="alt-phone__contact">📱 Chat in Another Universe</p>
              <div className="alt-phone__tabs">
                {ALT_UNIVERSE_CHATS.map(c => (
                  <button
                    type="button"
                    key={c.id}
                    className={`alt-tab-btn ${chatScenario === c.id ? 'alt-tab-btn--active' : ''}`}
                    onClick={() => setChatScenario(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeChat.id}
                className="alt-phone__messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {activeChat.messages.map((msg, i) => {
                  const isPuju = msg.from === 'Puju'
                  return (
                    <motion.div
                      key={i}
                      className={`alt-msg ${isPuju ? 'alt-msg--puju' : 'alt-msg--mahir'}`}
                      initial={{ opacity: 0, x: isPuju ? -14 : 14, scale: 0.92 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: i * 0.14 }}
                    >
                      <span className="alt-msg__name">{msg.from}</span>
                      <p>{msg.text}</p>
                    </motion.div>
                  )
                })}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Pinned Pastel Promise Wall */}
          <motion.div
            className="promise-wall"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <h3 className="promise-wall__title">📌 Puju&apos;s Promise Wall</h3>
            <p className="promise-wall__sub">
              Mix of genuine sibling promises &amp; questionable ones — tap any sticky note to stamp it!
            </p>

            <div className="promise-grid">
              {PROMISE_WALL.map((pr, idx) => {
                const isStamped = Boolean(stampedPromises[pr.id])
                return (
                  <motion.button
                    type="button"
                    key={pr.id}
                    className="promise-note"
                    style={{
                      background: pr.color,
                      '--tilt': `${idx % 2 === 0 ? -2 : 2}deg`,
                    }}
                    whileHover={{ scale: 1.04, rotate: 0, zIndex: 5 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleStamp(pr.id)}
                  >
                    <span className="promise-pin" aria-hidden="true">📍</span>
                    <span className="promise-note__emoji">{pr.emoji}</span>
                    <p className="promise-note__text">{pr.text}</p>
                    {isStamped && (
                      <motion.span
                        className="promise-stamp font-hand"
                        initial={{ scale: 1.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        Signed by Puju ✓❤️
                      </motion.span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
