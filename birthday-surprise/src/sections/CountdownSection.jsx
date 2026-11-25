import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SITE_CONFIG, SECTION_COPY } from '../data/content'
import FloatingDecorations from '../components/FloatingDecorations'
import '../styles/countdown.css'

function getTimeUntilBirthday() {
  const now = new Date()
  // Check local / IST Dec 5 calculation dynamically so it never goes stale
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  if (month === 11 && day === 5) {
    return { isToday: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  let targetYear = year
  if (month > 11 || (month === 11 && day > 5)) {
    targetYear = year + 1
  }

  const target = new Date(`${targetYear}-12-05T00:00:00+05:30`)
  const diff = Math.max(0, target - now)
  if (diff <= 0) {
    return { isToday: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    isToday: false,
    targetYear,
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

function CountUnit({ value, label, color, bgTint }) {
  const [prev, setPrev] = useState(value)
  const [flip, setFlip] = useState(false)

  useEffect(() => {
    if (value !== prev) {
      setFlip(true)
      const t = setTimeout(() => { setPrev(value); setFlip(false) }, 320)
      return () => clearTimeout(t)
    }
  }, [value, prev])

  return (
    <motion.div
      className="count-unit"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div
        className={`count-unit__box ${flip ? 'count-unit__box--flip' : ''}`}
        style={{ '--unit-color': color, '--unit-bg': bgTint }}
      >
        <span className="count-unit__number">{String(prev ?? 0).padStart(2, '0')}</span>
        <div className="count-unit__glow" style={{ background: color }} />
      </div>
      <span className="count-unit__label">{label}</span>
    </motion.div>
  )
}

export default function CountdownSection() {
  const [timeState, setTimeState] = useState(() => getTimeUntilBirthday())

  useEffect(() => {
    const id = setInterval(() => {
      setTimeState(getTimeUntilBirthday())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="countdown" className="countdown-section section-padding">
      <div className="countdown-deco" aria-hidden="true">
        <FloatingDecorations set="birthday" count={10} />
      </div>

      <div className="section-container">
        <motion.div
          className="countdown-inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          {timeState.isToday ? (
            <div className="countdown-birthday glass-card">
              <motion.div
                className="countdown-birthday__icon"
                animate={{ scale: [1, 1.18, 1], rotate: [-6, 6, -6] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                🎂
              </motion.div>
              <h2 className="countdown-birthday__title">Aaj Mahir ni birthday chhe! 🎉</h2>
              <p className="countdown-birthday__sub">Happy Birthday, Pagal Bhai. ❤️</p>
              <p className="countdown-birthday__note">{SITE_CONFIG.openingTagline}</p>
            </div>
          ) : (
            <>
              <div className="section-eyebrow">{SECTION_COPY.countdown.eyebrow}</div>
              <p className="countdown-subnote">{SECTION_COPY.countdown.subNote}</p>

              <div className="countdown-grid">
                <CountUnit value={timeState.days}    label="Days"    color="#e86f9c" bgTint="#fff0f6" />
                <CountUnit value={timeState.hours}   label="Hours"   color="#9a7ee0" bgTint="#f4efff" />
                <CountUnit value={timeState.minutes} label="Minutes" color="#4ca3dd" bgTint="#edf8ff" />
                <CountUnit value={timeState.seconds} label="Seconds" color="#45b683" bgTint="#edfcf4" />
              </div>

              <div className="countdown-date-pill">
                <span>🗓️ 5 December {timeState.targetYear}</span>
              </div>

              <p className="countdown-tagline font-hand">
                &ldquo;{SITE_CONFIG.openingTagline}&rdquo;
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
