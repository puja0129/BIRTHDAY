import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TOM_JERRY_SCENES, TOM_JERRY_STRIP } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/tomJerry.css'
import '../styles/dropzone.css'

const TEASE_REACTIONS = [
  { label: 'Hide His Charger 🔌', sfx: 'WHERE IS MY CHARGER?! 😾', dropPatience: 22 },
  { label: 'Steal Last Fries 🍟', sfx: 'YOINK!! TOO SLOW!! 😜', dropPatience: 25 },
  { label: 'Say "Heran Nai Kar" 😜', sfx: 'YOU LITERALLY STARTED IT!! 🗯️', dropPatience: 18 },
  { label: 'Drop Peace Cake 🎂', sfx: 'FINE… TRUCE ACCEPTED 🥹🧀', dropPatience: -100 },
]

function CartoonCatSvg({ mood }) {
  const isHappy = mood === 'truce'
  const isDizzy = mood === 'backfire'
  return (
    <svg viewBox="0 0 130 130" className="tj-svg" aria-label="Brother Cat cartoon">
      {/* Tail */}
      <path
        d="M98 92 Q122 86 116 62"
        fill="none"
        stroke="#8d99be"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Body */}
      <ellipse cx="64" cy="96" rx="34" ry="26" fill="#a5b1d8" stroke="#2d1a14" strokeWidth="3" />
      <ellipse cx="64" cy="98" rx="18" ry="18" fill="#eef2ff" />
      {/* Head */}
      <circle cx="64" cy="52" r="30" fill="#a5b1d8" stroke="#2d1a14" strokeWidth="3" />
      {/* Ears */}
      <polygon points="38,34 32,8 54,24" fill="#a5b1d8" stroke="#2d1a14" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="41,30 37,14 50,24" fill="#ffb8d0" />
      <polygon points="90,34 96,8 74,24" fill="#a5b1d8" stroke="#2d1a14" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="87,30 91,14 78,24" fill="#ffb8d0" />
      {/* Mini Drama King Crown */}
      <polygon points="52,22 57,10 64,19 71,10 76,22" fill="#ffd97d" stroke="#2d1a14" strokeWidth="2.2" />
      {/* Muzzle */}
      <ellipse cx="64" cy="60" rx="17" ry="11" fill="#fffaf6" />
      <polygon points="60,55 68,55 64,60" fill="#e86f9c" />
      {/* Eyes */}
      {isDizzy ? (
        <>
          <text x="45" y="51" fontSize="15" fontWeight="bold" fill="#2d1a14">@</text>
          <text x="72" y="51" fontSize="15" fontWeight="bold" fill="#2d1a14">@</text>
        </>
      ) : isHappy ? (
        <>
          <path d="M46 49 Q52 43 58 49" fill="none" stroke="#2d1a14" strokeWidth="3" strokeLinecap="round" />
          <path d="M70 49 Q76 43 82 49" fill="none" stroke="#2d1a14" strokeWidth="3" strokeLinecap="round" />
          <circle cx="44" cy="57" r="4" fill="#ffb3c9" opacity="0.8" />
          <circle cx="84" cy="57" r="4" fill="#ffb3c9" opacity="0.8" />
        </>
      ) : (
        <>
          <circle cx="52" cy="48" r="5" fill="#ffffff" stroke="#2d1a14" strokeWidth="2" />
          <circle cx="53" cy="48" r="2.6" fill="#2d1a14" />
          <circle cx="76" cy="48" r="5" fill="#ffffff" stroke="#2d1a14" strokeWidth="2" />
          <circle cx="75" cy="48" r="2.6" fill="#2d1a14" />
          {/* Mischievous / Grumpy eyebrows */}
          <line x1="44" y1="38" x2="58" y2="43" stroke="#2d1a14" strokeWidth="3.2" strokeLinecap="round" />
          <line x1="84" y1="38" x2="70" y2="43" stroke="#2d1a14" strokeWidth="3.2" strokeLinecap="round" />
        </>
      )}
      {/* Whiskers */}
      <line x1="28" y1="56" x2="43" y2="58" stroke="#2d1a14" strokeWidth="1.8" />
      <line x1="27" y1="63" x2="43" y2="62" stroke="#2d1a14" strokeWidth="1.8" />
      <line x1="100" y1="56" x2="85" y2="58" stroke="#2d1a14" strokeWidth="1.8" />
      <line x1="101" y1="63" x2="85" y2="62" stroke="#2d1a14" strokeWidth="1.8" />
      {/* Mouth */}
      {isHappy ? (
        <path d="M57 65 Q64 72 71 65" fill="none" stroke="#2d1a14" strokeWidth="2.5" strokeLinecap="round" />
      ) : (
        <path d="M57 67 Q64 62 71 67" fill="none" stroke="#2d1a14" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  )
}

function CartoonMouseSvg({ mood }) {
  const isTruce = mood === 'truce'
  return (
    <svg viewBox="0 0 120 120" className="tj-svg tj-svg--mouse" aria-label="Sister Mouse cartoon">
      {/* Big round ears */}
      <circle cx="34" cy="34" r="19" fill="#d99a6c" stroke="#2d1a14" strokeWidth="3" />
      <circle cx="34" cy="34" r="11" fill="#ffc4d6" />
      <circle cx="84" cy="34" r="19" fill="#d99a6c" stroke="#2d1a14" strokeWidth="3" />
      <circle cx="84" cy="34" r="11" fill="#ffc4d6" />
      {/* Pink ribbon bow for Puju */}
      <path d="M52 22 L60 27 L68 22 L66 30 L54 30 Z" fill="#ff7eb3" stroke="#2d1a14" strokeWidth="2" />
      {/* Curly tail */}
      <path d="M26 94 Q6 86 14 66" fill="none" stroke="#f294b9" strokeWidth="5" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="59" cy="88" rx="25" ry="20" fill="#d99a6c" stroke="#2d1a14" strokeWidth="3" />
      <ellipse cx="59" cy="90" rx="13" ry="13" fill="#ffe9d6" />
      {/* Head */}
      <circle cx="59" cy="54" r="24" fill="#d99a6c" stroke="#2d1a14" strokeWidth="3" />
      <ellipse cx="59" cy="61" rx="15" ry="10" fill="#ffe9d6" />
      <circle cx="59" cy="56" r="4" fill="#2d1a14" />
      {/* Eyes */}
      <circle cx="49" cy="48" r="4.5" fill="#ffffff" stroke="#2d1a14" strokeWidth="2" />
      <circle cx="50" cy="48" r="2.3" fill="#2d1a14" />
      {isTruce ? (
        <circle cx="69" cy="48" r="4.5" fill="#ffffff" stroke="#2d1a14" strokeWidth="2" />
      ) : (
        /* Playful cheeky wink! */
        <path d="M64 48 Q69 43 74 48" fill="none" stroke="#2d1a14" strokeWidth="2.8" strokeLinecap="round" />
      )}
      {isTruce && <circle cx="68" cy="48" r="2.3" fill="#2d1a14" />}
      {/* Smile */}
      <path d="M51 64 Q59 71 67 64" fill="none" stroke="#2d1a14" strokeWidth="2.4" strokeLinecap="round" />
      {/* Golden Cheese wedge */}
      <polygon points="82,78 112,86 86,98" fill="#ffd95a" stroke="#2d1a14" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="93" cy="88" r="2.4" fill="#e5a922" />
      <circle cx="101" cy="91" r="1.8" fill="#e5a922" />
    </svg>
  )
}

export default function TomJerrySection() {
  const { getSectionOrFallback } = useMedia()
  const chaosPhotos = getSectionOrFallback('tom-and-jerry', 2, 1, 'photo')

  const [sceneId, setSceneId]   = useState(TOM_JERRY_SCENES[0].id)
  const [patience, setPatience] = useState(72)
  const [teaseLog, setTeaseLog] = useState('Click any chaos button below to annoy your cartoon brother 😂')
  const [pokeBounce, setBounce] = useState(0)

  const scene = TOM_JERRY_SCENES.find(s => s.id === sceneId) || TOM_JERRY_SCENES[0]

  const triggerReaction = (reaction) => {
    setBounce(b => b + 1)
    setTeaseLog(reaction.sfx)
    if (reaction.dropPatience < 0) {
      setPatience(100)
      setSceneId('truce')
      return
    }
    setPatience(prev => {
      const next = prev - reaction.dropPatience
      if (next <= 12) {
        setSceneId('backfire')
        return 10
      }
      return next
    })
  }

  return (
    <section id="tom-and-jerry" className="tj-section section-padding">
      <div className="tj-deco" aria-hidden="true">
        <FloatingDecorations set="tomjerry" count={10} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-eyebrow">Live Sibling Cartoon Studio 🐭🐱</span>
          <h2>Tom &amp; Jerry — Basically Us Every Day</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">
            Half the day chasing &amp; teasing each other like cartoon rivals, the other half secretly making sure the other one is okay 😂🤍
          </p>
        </motion.div>

        {/* Episode Switcher Tabs */}
        <div className="tj-tabs" role="tablist" aria-label="Choose cartoon episode">
          {TOM_JERRY_SCENES.map(item => (
            <button
              type="button"
              key={item.id}
              className={`tj-tab ${sceneId === item.id ? 'tj-tab--active' : ''}`}
              onClick={() => {
                setSceneId(item.id)
                setTeaseLog(item.sfx)
                if (item.id === 'truce') setPatience(100)
              }}
            >
              {item.tab}
            </button>
          ))}
        </div>

        {/* Interactive Cartoon Stage */}
        <motion.div
          key={pokeBounce}
          className={`tj-stage tj-stage--${sceneId}`}
          animate={pokeBounce > 0 ? { x: [-4, 5, -3, 2, 0] } : {}}
          transition={{ duration: 0.35 }}
        >
          <div className="tj-stage__topbar">
            <span className="tj-episode-badge">{scene.badge}</span>

            <div className="tj-patience-box">
              <span>Brother&apos;s Patience Meter:</span>
              <div className="tj-patience-track">
                <div
                  className="tj-patience-fill"
                  style={{
                    width: `${patience}%`,
                    background: patience < 30 ? '#ee6c6c' : patience < 65 ? '#f5b041' : '#52c48c',
                  }}
                />
              </div>
              <strong>{patience}%</strong>
            </div>
          </div>

          <div className="tj-sfx-burst" key={teaseLog}>
            <span>{teaseLog}</span>
          </div>

          {/* Animated Characters Arena */}
          <div className="tj-arena">
            {/* Brother Cat */}
            <motion.div
              className="tj-actor tj-actor--cat"
              animate={
                sceneId === 'chase' ? { x: [0, 26, 0], y: [0, -8, 0] } :
                sceneId === 'backfire' ? { rotate: [-6, 8, -6], y: [0, 6, 0] } :
                sceneId === 'truce' ? { x: 18, y: 0 } :
                { y: [0, -5, 0] }
              }
              transition={{ duration: sceneId === 'chase' ? 1.1 : 2.1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${sceneId}-cat-bubble`}
                  className="tj-bubble tj-bubble--cat"
                  initial={{ opacity: 0, scale: 0.85, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                >
                  <small>Mahir (Tom Mode)</small>
                  <p>{scene.catLine}</p>
                </motion.div>
              </AnimatePresence>
              <CartoonCatSvg mood={sceneId} />
              {sceneId === 'backfire' && <span className="tj-dizzy">💫💫</span>}
            </motion.div>

            {/* Center Props */}
            <div className="tj-center-prop" aria-hidden="true">
              {sceneId === 'truce' ? '🍰🤍' : sceneId === 'backfire' ? '💥🪤' : '💨⚡'}
            </div>

            {/* Sister Mouse */}
            <motion.div
              className="tj-actor tj-actor--mouse"
              onClick={() => triggerReaction(TEASE_REACTIONS[1])}
              title="Tap Puju to dodge & tease!"
              animate={
                sceneId === 'chase' ? { x: [0, 32, 0], y: [0, -14, 0] } :
                sceneId === 'heran' ? { rotate: [-5, 5, -5], y: [0, -10, 0] } :
                sceneId === 'truce' ? { x: -18, y: 0 } :
                { y: [0, -8, 0] }
              }
              transition={{ duration: sceneId === 'chase' ? 0.95 : 1.7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${sceneId}-mouse-bubble`}
                  className="tj-bubble tj-bubble--mouse"
                  initial={{ opacity: 0, scale: 0.85, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                >
                  <small>Puju (Jerry Mode)</small>
                  <p>{scene.mouseLine}</p>
                </motion.div>
              </AnimatePresence>
              <CartoonMouseSvg mood={sceneId} />
            </motion.div>
          </div>

          {/* Cute mouse hole baseboard */}
          <div className="tj-baseboard" aria-hidden="true">
            <div className="tj-mousehole" />
          </div>

          <p className="tj-stage__caption font-hand">{scene.caption}</p>

          {/* Interactive Action Buttons */}
          <div className="tj-controls">
            {TEASE_REACTIONS.map((btn, i) => (
              <motion.button
                type="button"
                key={i}
                className={`tj-action-btn ${btn.dropPatience < 0 ? 'tj-action-btn--peace' : ''}`}
                onClick={() => triggerReaction(btn)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.94 }}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 3-Panel Tom & Jerry Comic Sequence */}
        <div className="tj-strip">
          {TOM_JERRY_STRIP.map((item, idx) => (
            <motion.div
              key={item.panel}
              className="tj-panel"
              style={{ '--panel-bg': item.bg, '--tilt': `${idx === 0 ? -1.5 : idx === 2 ? 1.5 : 0}deg` }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              whileHover={{ rotate: 0, y: -5 }}
            >
              <div className="tj-panel__top">
                <span>{item.panel}</span>
                <span>{item.emoji}</span>
              </div>
              <h4>{item.title}</h4>
              <div className="tj-panel__lines">
                <p className="tj-line-cat">🐱 {item.bubbleCat}</p>
                <p className="tj-line-mouse">🐭 {item.bubbleMouse}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Optional Cartoon Wall Photo Frame */}
        <SectionDropZone sectionId="tom-and-jerry" label="Tom & Jerry Wall">
          {chaosPhotos.length > 0 && (
            <div className="tj-photo-shelf">
              <span className="tj-shelf-label font-hand">Caught acting like real-life Tom &amp; Jerry 📸👇</span>
              <div className="tj-shelf-row">
                {chaosPhotos.map((p, i) => (
                  <div key={p.id} className="tj-wall-frame" style={{ '--tilt': `${i % 2 === 0 ? -2.5 : 2.5}deg` }}>
                    <img src={p.url} alt={p.caption || 'Tom & Jerry sibling moment'} />
                    <span className="font-hand">{p.caption || 'Certified Chaos Duo 😂'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionDropZone>
      </div>
    </section>
  )
}
