import { useState, useRef, Suspense, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import * as THREE from 'three'
import { SECTION_COPY, BEFORE_YOU_LEAVE } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/birthday.css'
import '../styles/dropzone.css'

function Flame({ position, extinguished }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current || extinguished) return
    ref.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8 + position[0]) * 0.16
    ref.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.09
  })

  return (
    <group ref={ref} position={position}>
      <mesh>
        <coneGeometry args={[0.075, 0.27, 10]} />
        <meshStandardMaterial
          color={extinguished ? '#c7b8b0' : '#ffae19'}
          emissive={extinguished ? '#000000' : new THREE.Color(1.0, 0.55, 0.1)}
          emissiveIntensity={extinguished ? 0 : 1.4}
          transparent
          opacity={extinguished ? 0.3 : 0.95}
        />
      </mesh>
      {!extinguished && <pointLight color="#ffaa44" intensity={1.3} distance={2.5} decay={2} />}
    </group>
  )
}

function PastelCakeTier({ position, size, spongeColor, icingColor, gemColor, height }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[size, size, height, 36]} />
        <meshStandardMaterial color={spongeColor} roughness={0.45} />
      </mesh>
      <mesh position={[0, height / 2 + 0.04, 0]}>
        <cylinderGeometry args={[size + 0.06, size + 0.02, 0.12, 36]} />
        <meshStandardMaterial color={icingColor} roughness={0.3} />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * size, height / 2 + 0.09, Math.sin(a) * size]}>
            <sphereGeometry args={[0.075, 10, 10]} />
            <meshStandardMaterial color={gemColor} roughness={0.25} />
          </mesh>
        )
      })}
    </group>
  )
}

function PartyBalloon({ position, color, speed = 1 }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.2
  })
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial color={color} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.58, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.6, 6]} />
        <meshStandardMaterial color="#e6c4d4" />
      </mesh>
    </group>
  )
}

function CakeScene({ candlesOut }) {
  const groupRef = useRef()
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.25
  })

  const candlePositions = [
    [0, 1.88, 0],
    [0.36, 1.84, 0.28],
    [-0.36, 1.84, 0.28],
    [0.34, 1.84, -0.26],
    [-0.34, 1.84, -0.26],
  ]

  const candleColors = ['#ff9ec4', '#9cd4ff', '#ffe28a', '#a9eccb', '#cfb8ff']

  return (
    <group ref={groupRef} position={[0, -0.55, 0]}>
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[1.65, 1.5, 0.08, 40]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>

      <PastelCakeTier position={[0, 0, 0]}    size={1.38} height={0.68} spongeColor="#ffb3d1" icingColor="#fff8fa" gemColor="#a7d8ff" />
      <PastelCakeTier position={[0, 0.78, 0]} size={0.98} height={0.58} spongeColor="#b9f0d8" icingColor="#fffef5" gemColor="#ff9ec4" />
      <PastelCakeTier position={[0, 1.48, 0]} size={0.62} height={0.48} spongeColor="#d8c8ff" icingColor="#ffffff" gemColor="#ffd97d" />

      {candlePositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.045, 0.34, 12]} />
            <meshStandardMaterial color={candleColors[i % candleColors.length]} roughness={0.35} />
          </mesh>
          <Flame position={[0, 0.3, 0]} extinguished={candlesOut} />
        </group>
      ))}
    </group>
  )
}

const FINAL_TEXTS = [
  "After all our fights...",
  "All our stupid arguments...",
  "All the random bakbak and food drama...",
  "All those moments we probably never thought were special...",
  "Somehow, they became my favourite memories.",
]

export default function BirthdaySection() {
  const { getSectionOrFallback, items: allUploaded } = useMedia()
  const birthdayUploads = getSectionOrFallback('birthday', 6, 1, 'photo')

  const [candlesOut, setCandlesOut]     = useState(false)
  const [showFinal, setShowFinal]       = useState(false)
  const [confetti, setConfetti]         = useState(false)
  const [hugCount, setHugCount]         = useState(0)
  const [hugBurst, setHugBurst]         = useState(false)
  const [montageOpen, setMontageOpen]   = useState(false)
  const [montageIdx, setMontageIdx]     = useState(0)
  const [montagePlay, setMontagePlay]   = useState(true)

  const confettiPieces = useMemo(() => {
    const colors = ['#ff8eb8', '#ffd97d', '#8be0c5', '#8bc8ff', '#b99aff', '#ffa97a']
    return Array.from({ length: 56 }, (_, i) => ({
      id: i,
      left: `${(i * 17.3) % 98}%`,
      color: colors[i % colors.length],
      size: 7 + (i % 5) * 2,
      round: i % 2 === 0,
      rot: i % 2 === 0 ? 360 : -360,
      duration: 3 + (i % 4) * 0.7,
      delay: (i % 7) * 0.22,
    }))
  }, [])

  const montagePool = useMemo(() => {
    return birthdayUploads.length > 0 ? birthdayUploads : allUploaded
  }, [birthdayUploads, allUploaded])

  useEffect(() => {
    if (!montageOpen || !montagePlay || montagePool.length <= 1) return
    const current = montagePool[montageIdx]
    if (current?.type === 'video') return
    const timer = setTimeout(() => {
      setMontageIdx(i => (i + 1) % montagePool.length)
    }, 3200)
    return () => clearTimeout(timer)
  }, [montageOpen, montagePlay, montageIdx, montagePool])

  const blowCandles = () => {
    setCandlesOut(true)
    setTimeout(() => {
      setShowFinal(true)
      setConfetti(true)
    }, 650)
  }

  const triggerHug = () => {
    setHugCount(c => c + 1)
    setHugBurst(true)
    setTimeout(() => setHugBurst(false), 1200)
  }

  return (
    <section id="birthday" className="birthday-section section-padding">
      <div className="birthday-deco" aria-hidden="true">
        <FloatingDecorations set="birthday" count={confetti ? 18 : 10} />
      </div>

      {/* Confetti celebration overlay */}
      <AnimatePresence>
        {confetti && (
          <div className="confetti-container" aria-hidden="true">
            {confettiPieces.map(c => (
              <motion.div
                key={c.id}
                className="confetti-piece"
                style={{
                  left: c.left,
                  background: c.color,
                  width: `${c.size}px`,
                  height: `${c.size}px`,
                  borderRadius: c.round ? '50%' : '2px',
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{
                  y: (typeof window !== 'undefined' ? window.innerHeight : 900) + 60,
                  opacity: [1, 1, 0],
                  rotate: c.rot,
                }}
                transition={{ duration: c.duration, delay: c.delay }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">{SECTION_COPY.birthday.eyebrow}</span>
          <h2>{SECTION_COPY.birthday.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{SECTION_COPY.birthday.subtitle}</p>
        </motion.div>

        {/* Colourful 3D Pastel Cake */}
        <div className="birthday-canvas">
          <Canvas camera={{ position: [0, 1.35, 5.7], fov: 48 }} gl={{ antialias: true, alpha: true }}>
            <ambientLight intensity={1.1} color="#fff9fd" />
            <directionalLight position={[4, 6, 4]} intensity={0.95} color="#fff2d6" />
            <pointLight position={[-4, 2, 3]} intensity={0.6} color="#ffafd2" />
            <pointLight position={[4, 2, 3]}  intensity={0.6} color="#9fd5ff" />
            <Suspense fallback={null}>
              <Float speed={0.9} floatIntensity={0.22} rotationIntensity={0.08}>
                <CakeScene candlesOut={candlesOut} />
              </Float>
              <PartyBalloon position={[-2.6, 1.2, -1.2]} color="#ff9ec4" speed={1.1} />
              <PartyBalloon position={[2.6, 1.3, -1.2]}  color="#9cd4ff" speed={1.2} />
              <PartyBalloon position={[-1.9, 1.9, -2.0]} color="#ffe28a" speed={0.95} />
              <PartyBalloon position={[2.0, 2.0, -2.0]}  color="#b7f0d4" speed={1.05} />
              <Sparkles count={confetti ? 95 : 45} scale={10} size={2} speed={0.7} color="#f59fc3" opacity={0.7} />
            </Suspense>
          </Canvas>
        </div>

        <SectionDropZone sectionId="birthday" label="Birthday Surprise">
          <div className="birthday-content">
            <div className="birthday-texts">
              {FINAL_TEXTS.map((text, i) => (
                <motion.p
                  key={i}
                  className={`birthday-text ${i === 4 ? 'birthday-text--special' : ''}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, delay: i * 0.12 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {!candlesOut ? (
              <motion.button
                type="button"
                className="btn-cinematic birthday-wish-btn"
                onClick={blowCandles}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
              >
                🕯️ Blow Candles &amp; Make a Wish
              </motion.button>
            ) : null}

            <AnimatePresence>
              {showFinal && (
                <motion.div
                  className="birthday-final glass-card"
                  initial={{ opacity: 0, scale: 0.9, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.85, type: 'spring', stiffness: 160 }}
                >
                  <motion.h2
                    className="birthday-final__title font-serif"
                    animate={{ scale: [1, 1.025, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                  >
                    Happy Birthday, Mahir. ❤️
                  </motion.h2>
                  <p className="birthday-final__sub">
                    To my Drama King &amp; forever partner in chaos — my favourite headache.
                  </p>
                  <p className="birthday-final__closer">
                    Stay happy. Stay crazy. And never change the person you are.
                  </p>
                  <div className="birthday-final__tagline font-hand">
                    — From your Puju (your permanently annoying sister) 😂❤️
                  </div>

                  {montagePool.length > 0 && (
                    <button
                      type="button"
                      className="btn-pastel"
                      onClick={() => {
                        setMontageIdx(0)
                        setMontagePlay(true)
                        setMontageOpen(true)
                      }}
                    >
                      <Film size={15} /> Open Birthday Memory Montage ✨
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Surrounding memory collage from uploaded birthday media */}
            {birthdayUploads.length > 0 && (
              <div className="birthday-collage">
                {birthdayUploads.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    className="birthday-collage__card"
                    style={{ '--tilt': `${(idx % 3 - 1) * 3}deg` }}
                    whileHover={{ scale: 1.06, rotate: 0 }}
                  >
                    {item.type === 'video' ? (
                      <video src={item.url} controls muted playsInline />
                    ) : (
                      <img src={item.url} alt={item.caption || 'Birthday memory'} />
                    )}
                    <p className="font-hand">{item.caption || item.title || '5 December ❤️'}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Before You Leave + Virtual Hug from Puju */}
            <motion.div
              className="before-leave-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7 }}
            >
              <span className="before-leave__eyebrow">🌙 Last Stop Before You Close This</span>
              <h3 className="before-leave__title">{BEFORE_YOU_LEAVE.title}</h3>
              <div className="before-leave__lines">
                {BEFORE_YOU_LEAVE.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>

              <div className="hug-zone">
                <motion.button
                  type="button"
                  className="btn-cinematic hug-btn"
                  onClick={triggerHug}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                >
                  {BEFORE_YOU_LEAVE.hugButton}
                </motion.button>

                <AnimatePresence>
                  {hugBurst && (
                    <motion.div
                      className="hug-hearts-burst"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1.35 }}
                      exit={{ opacity: 0, scale: 1.7 }}
                      transition={{ duration: 0.9 }}
                      aria-hidden="true"
                    >
                      <span>🤗</span><span>💖</span><span>🫂</span><span>❤️</span><span>✨</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {hugCount > 0 && (
                  <motion.div
                    key={hugCount}
                    className="hug-confirmation"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="font-hand">{BEFORE_YOU_LEAVE.hugMessage}</p>
                    <small>Virtual hugs claimed today: {hugCount} {hugCount >= 3 ? '(clingy 😂❤️)' : '🤍'}</small>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </SectionDropZone>
      </div>

      {/* Birthday Memory Montage Lightbox */}
      <AnimatePresence>
        {montageOpen && montagePool[montageIdx] && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMontageOpen(false)}
          >
            <motion.div
              className="lightbox__card glass-card"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              {montagePool[montageIdx].type === 'video' ? (
                <video
                  src={montagePool[montageIdx].url}
                  controls
                  autoPlay={montagePlay}
                  onEnded={() => setMontageIdx(i => (i + 1) % montagePool.length)}
                  className="lightbox__img"
                />
              ) : (
                <img
                  src={montagePool[montageIdx].url}
                  alt={montagePool[montageIdx].caption}
                  className="lightbox__img"
                />
              )}
              <div className="lightbox__meta">
                <p className="lightbox__caption">
                  {montagePool[montageIdx].caption || montagePool[montageIdx].name}
                </p>
                <div className="birthday-montage-controls">
                  <button type="button" className="btn-pastel" onClick={() => setMontageIdx(i => (i - 1 + montagePool.length) % montagePool.length)}>
                    <SkipBack size={14} />
                  </button>
                  <button type="button" className="btn-pastel" onClick={() => setMontagePlay(v => !v)}>
                    {montagePlay ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button type="button" className="btn-pastel" onClick={() => setMontageIdx(i => (i + 1) % montagePool.length)}>
                    <SkipForward size={14} />
                  </button>
                </div>
              </div>
              <button type="button" className="lightbox__close" onClick={() => setMontageOpen(false)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
