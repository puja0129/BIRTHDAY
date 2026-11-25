import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shuffle, MessageSquare } from 'lucide-react'
import { SIBLING_CHAOS_PANELS, CHAOS_MIXER_PRESETS } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/siblingChaos.css'
import '../styles/dropzone.css'

export default function SiblingChaosSection() {
  const { getSectionOrFallback } = useMedia()
  const chaosSnapshots = getSectionOrFallback('sibling-chaos', 2, 3, 'photo')

  const [poppedPanel, setPoppedPanel] = useState(null)
  const [revealedNotes, setRevealed]  = useState({})
  const [mixerIdx, setMixerIdx]       = useState({ s: 0, c: 0, e: 0 })

  const togglePanelTruth = (id) => {
    setPoppedPanel(id)
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const shuffleChaosScene = () => {
    setMixerIdx({
      s: Math.floor(Math.random() * CHAOS_MIXER_PRESETS.starters.length),
      c: Math.floor(Math.random() * CHAOS_MIXER_PRESETS.comebacks.length),
      e: Math.floor(Math.random() * CHAOS_MIXER_PRESETS.endings.length),
    })
  }

  return (
    <section id="sibling-chaos" className="sc-section section-padding">
      <div className="sc-halftone" aria-hidden="true" />
      <div className="sc-deco" aria-hidden="true">
        <FloatingDecorations set="comic" count={10} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Comic Book Cover Masthead */}
        <motion.div
          className="sc-masthead"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="sc-masthead__top">
            <span>VOL. 2026 · ISSUE #05-DEC</span>
            <span>PRICE: ZERO BRAINCELLS 😂</span>
          </div>
          <h2>Our Sibling Chaos — The Comic Chronicles</h2>
          <p className="font-hand">
            Starring: Puju (47 Moods) &amp; Mahir (World&apos;s Biggest Drama King) · Click any comic panel for SFX &amp; secret truth! 💥
          </p>
        </motion.div>

        {/* Irregular Multi-Panel Comic Spread */}
        <div className="sc-comic-grid">
          {SIBLING_CHAOS_PANELS.map((panel) => {
            const isOpen = Boolean(revealedNotes[panel.id])
            const isPopped = poppedPanel === panel.id
            return (
              <motion.article
                key={panel.id}
                className={`sc-panel sc-panel--${panel.span}`}
                style={{ '--sc-bg': panel.bg, '--sc-accent': panel.accent }}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                whileHover={{ y: -4 }}
                onClick={() => togglePanelTruth(panel.id)}
              >
                <div className="sc-panel__head">
                  <span className="sc-issue-tag">{panel.issueTag}</span>
                  <motion.span
                    className="sc-sfx-pill"
                    animate={isPopped ? { scale: [1, 1.35, 1], rotate: [-8, 8, 0] } : {}}
                    transition={{ duration: 0.35 }}
                  >
                    {panel.sfx}
                  </motion.span>
                </div>

                <h3 className="sc-panel__title">{panel.title}</h3>

                <div className="sc-dialogue-list">
                  {panel.beats.map((beat, i) => (
                    <div key={i} className={`sc-bubble sc-bubble--${beat.align}`}>
                      <span className="sc-speaker">{beat.who}</span>
                      <p>{beat.text}</p>
                    </div>
                  ))}
                </div>

                <div className="sc-panel__foot">
                  <span>{panel.footerNote}</span>
                  <span className="sc-tap-hint">
                    <MessageSquare size={12} /> {isOpen ? 'Hide note' : 'Tap for truth'}
                  </span>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="sc-secret-bar"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p className="font-hand">{panel.secretTruth}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            )
          })}
        </div>

        {/* Interactive Mini Scene Generator ("Chaos Mixer") */}
        <motion.div
          className="sc-mixer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="sc-mixer__head">
            <div>
              <span className="sc-issue-tag">BONUS INTERACTIVE PANEL 🎲</span>
              <h3>Build / Shuffle a Typical Day Episode</h3>
            </div>
            <button type="button" className="sc-shuffle-btn" onClick={shuffleChaosScene}>
              <Shuffle size={15} /> Shuffle Chaos Scene
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${mixerIdx.s}-${mixerIdx.c}-${mixerIdx.e}`}
              className="sc-mixer-strip"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="sc-mixer-cell sc-mixer-cell--1">
                <small>SCENE 1 · HOW IT STARTED</small>
                <p>{CHAOS_MIXER_PRESETS.starters[mixerIdx.s]}</p>
              </div>
              <div className="sc-mixer-cell sc-mixer-cell--2">
                <small>SCENE 2 · THE COMEBACK</small>
                <p>{CHAOS_MIXER_PRESETS.comebacks[mixerIdx.c]}</p>
              </div>
              <div className="sc-mixer-cell sc-mixer-cell--3">
                <small>SCENE 3 · INEVITABLE ENDING</small>
                <p>{CHAOS_MIXER_PRESETS.endings[mixerIdx.e]}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Optional Comic Photo Evidence Panels */}
        <SectionDropZone sectionId="sibling-chaos" label="Comic Evidence">
          {chaosSnapshots.length > 0 && (
            <div className="sc-photo-panels">
              {chaosSnapshots.map((item, idx) => (
                <div key={item.id} className="sc-photo-card" style={{ '--tilt': `${idx % 2 === 0 ? -1.5 : 1.5}deg` }}>
                  <span className="sc-issue-tag">EVIDENCE #{idx + 1}</span>
                  <img src={item.url} alt={item.caption || 'Sibling chaos'} />
                  <p className="font-hand">&ldquo;{item.caption || 'No regrets 😂'}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </SectionDropZone>
      </div>
    </section>
  )
}
