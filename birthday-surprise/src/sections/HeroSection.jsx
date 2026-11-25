import { useState, useRef, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useMedia } from '../context/MediaContext'
import { HERO_FLOATING_NOTES, GALLERY_PHOTOS } from '../data/content'
import '../styles/hero.css'

// Scattered floating ambient icons placed across the entire hero viewport (not clumped)
const SCATTERED_ELEMENTS = [
  { id: 'se1',  icon: '🎈', x: '6%',  y: '14%', size: '1.9rem', dur: 4.4, amp: 14, rot: 8 },
  { id: 'se2',  icon: '🎂', x: '89%', y: '10%', size: '1.8rem', dur: 5.1, amp: 12, rot: -10 },
  { id: 'se3',  icon: '✨', x: '24%', y: '10%', size: '1.3rem', dur: 3.6, amp: 10, rot: 14 },
  { id: 'se4',  icon: '💖', x: '75%', y: '18%', size: '1.4rem', dur: 4.0, amp: 12, rot: -12 },
  { id: 'se5',  icon: '☁️', x: '43%', y: '6%',  size: '2.2rem', dur: 6.2, amp: 9,  rot: 4 },
  { id: 'se6',  icon: '⭐', x: '17%', y: '47%', size: '1.35rem',dur: 3.9, amp: 13, rot: 15 },
  { id: 'se7',  icon: '🦋', x: '82%', y: '44%', size: '1.55rem',dur: 4.5, amp: 15, rot: -14 },
  { id: 'se8',  icon: '🎊', x: '10%', y: '78%', size: '1.65rem',dur: 4.8, amp: 12, rot: 10 },
  { id: 'se9',  icon: '🩷', x: '34%', y: '86%', size: '1.35rem',dur: 4.1, amp: 11, rot: -8 },
  { id: 'se10', icon: '🎂', x: '64%', y: '88%', size: '1.7rem', dur: 5.0, amp: 13, rot: 9 },
  { id: 'se11', icon: '🎈', x: '91%', y: '79%', size: '1.9rem', dur: 4.6, amp: 14, rot: -9 },
  { id: 'se12', icon: '🌟', x: '50%', y: '91%', size: '1.45rem',dur: 3.8, amp: 10, rot: 12 },
  { id: 'se13', icon: '🎀', x: '70%', y: '7%',  size: '1.5rem', dur: 4.3, amp: 11, rot: -11 },
  { id: 'se14', icon: '☁️', x: '27%', y: '68%', size: '2.0rem', dur: 5.8, amp: 9,  rot: 3 },
  { id: 'se15', icon: '💫', x: '74%', y: '67%', size: '1.4rem', dur: 4.2, amp: 12, rot: -15 },
  { id: 'se16', icon: '🤍', x: '4%',  y: '54%', size: '1.3rem', dur: 4.7, amp: 10, rot: 10 },
  { id: 'se17', icon: '🎈', x: '94%', y: '52%', size: '1.65rem',dur: 4.9, amp: 13, rot: -7 },
  { id: 'se18', icon: '✨', x: '56%', y: '14%', size: '1.3rem', dur: 3.7, amp: 10, rot: 14 },
]

function usePhotoTexture(src) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!src) {
      setTexture(null)
      return
    }
    let mounted = true
    const loader = new THREE.TextureLoader()
    loader.load(
      src,
      (tex) => {
        if (!mounted) {
          tex.dispose()
          return
        }
        tex.colorSpace = THREE.SRGBColorSpace
        // Center-crop UV preserve aspect ratio so portrait/landscape MY photos never stretch
        if (tex.image?.width && tex.image?.height) {
          const aspect = tex.image.width / tex.image.height
          if (aspect > 1) {
            tex.repeat.set(1 / aspect, 1)
            tex.offset.set((1 - 1 / aspect) / 2, 0)
          } else if (aspect < 1) {
            tex.repeat.set(1, aspect)
            tex.offset.set(0, (1 - aspect) * 0.65)
          }
        }
        setTexture(tex)
      },
      undefined,
      () => {
        if (mounted) setTexture(null)
      }
    )
    return () => { mounted = false }
  }, [src])

  return texture
}

// ── Interactive 3D Pastel Keepsake Envelope ───────────────────────
function PastelEnvelope3D({ unsealed, entering, pointerRef, onToggleEnvelope }) {
  const groupRef = useRef()
  const lidRef   = useRef()
  const cardRef  = useRef()
  const sealRef  = useRef()
  const [hovered, setHovered] = useState(false)

  const flapGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-1.38, 0)
    shape.lineTo(1.38, 0)
    shape.lineTo(0, -1.04)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
    })
  }, [])

  const isOpen = unsealed || entering

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const px = pointerRef.current.x * 0.28
    const py = pointerRef.current.y * 0.18

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.sin(t * 0.7) * 0.14 + px,
      delta * 4
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.cos(t * 0.55) * 0.07 - py,
      delta * 4
    )

    if (lidRef.current) {
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        isOpen ? -Math.PI * 1.12 : (hovered ? -0.22 : 0),
        delta * 5.2
      )
    }

    if (cardRef.current) {
      cardRef.current.position.y = THREE.MathUtils.lerp(
        cardRef.current.position.y,
        isOpen ? 1.05 : 0.02,
        delta * 4.5
      )
      cardRef.current.position.z = THREE.MathUtils.lerp(
        cardRef.current.position.z,
        isOpen ? 0.24 : -0.01,
        delta * 4.5
      )
      cardRef.current.rotation.z = THREE.MathUtils.lerp(
        cardRef.current.rotation.z,
        isOpen ? 0.04 : 0,
        delta * 4
      )
    }

    if (sealRef.current) {
      const targetScale = isOpen ? 0.01 : (hovered ? 1.18 : 1 + Math.sin(t * 3) * 0.06)
      sealRef.current.scale.setScalar(THREE.MathUtils.lerp(sealRef.current.scale.x, targetScale, delta * 7))
    }
  })

  return (
    <group
      ref={groupRef}
      position={[0, 0.2, 0]}
      onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={e => { e.stopPropagation(); onToggleEnvelope() }}
    >
      {/* Envelope pocket */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.76, 1.78, 0.12]} />
        <meshStandardMaterial color="#fff1f7" roughness={0.32} metalness={0.05} />
      </mesh>

      {/* Soft lavender inner liner */}
      <mesh position={[0, 0.03, 0.063]}>
        <planeGeometry args={[2.56, 1.6]} />
        <meshStandardMaterial color="#ede3ff" roughness={0.48} />
      </mesh>

      {/* Rising birthday ticket inside envelope */}
      <mesh ref={cardRef} position={[0, 0.02, -0.01]}>
        <boxGeometry args={[2.28, 1.44, 0.035]} />
        <meshStandardMaterial
          color="#fffbe6"
          emissive={isOpen ? '#ffd8ea' : '#000000'}
          emissiveIntensity={isOpen ? 0.42 : 0}
          roughness={0.35}
        />
      </mesh>

      {/* Satin pastel peach ribbon across front */}
      <mesh position={[0, -0.26, 0.07]}>
        <boxGeometry args={[2.78, 0.2, 0.014]} />
        <meshStandardMaterial color="#ffcae0" roughness={0.28} metalness={0.14} />
      </mesh>

      {/* Hinged top lid */}
      <group ref={lidRef} position={[0, 0.89, 0.055]}>
        <mesh geometry={flapGeo}>
          <meshStandardMaterial color="#ffe2ee" roughness={0.32} metalness={0.06} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Heart/Wax seal */}
      <mesh ref={sealRef} position={[0, -0.1, 0.105]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.06, 32]} />
        <meshStandardMaterial
          color="#f79ec3"
          emissive="#ffa876"
          emissiveIntensity={0.45}
          roughness={0.22}
          metalness={0.3}
        />
      </mesh>
    </group>
  )
}

function PastelBalloon3D({ position, color, scale = 1, speed = 1 }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed
    ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.25
    ref.current.rotation.z = Math.sin(t * 0.65 + position[2]) * 0.09
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.08} />
      </mesh>
      <mesh position={[0, -0.36, 0]}>
        <coneGeometry args={[0.06, 0.08, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.85, 6]} />
        <meshStandardMaterial color="#e5c5d8" />
      </mesh>
    </group>
  )
}

function FluffyCloud3D({ position, scale = 1 }) {
  return (
    <Float speed={0.8} floatIntensity={0.35} rotationIntensity={0.05}>
      <group position={position} scale={scale}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.56, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
        <mesh position={[0.46, -0.08, 0]}>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshStandardMaterial color="#fff7fb" roughness={0.9} />
        </mesh>
        <mesh position={[-0.46, -0.1, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#f2faff" roughness={0.9} />
        </mesh>
      </group>
    </Float>
  )
}

function Floating3DPolaroid({ position, rotation, photoSrc, tintColor }) {
  const texture = usePhotoTexture(photoSrc)

  return (
    <Float speed={1.45} floatIntensity={0.5} rotationIntensity={0.22}>
      <group position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[1.08, 1.3, 0.04]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.1, 0.025]}>
          <planeGeometry args={[0.9, 0.9]} />
          {texture ? (
            <meshBasicMaterial map={texture} />
          ) : (
            <meshStandardMaterial color={tintColor} roughness={0.45} />
          )}
        </mesh>
      </group>
    </Float>
  )
}

function PastelSparkleParticles({ count = 120, burst }) {
  const pointsRef = useRef()
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#ff8eb8'),
      new THREE.Color('#ffd97d'),
      new THREE.Color('#8be0c5'),
      new THREE.Color('#8bc8ff'),
      new THREE.Color('#b99aff'),
      new THREE.Color('#ffb58f'),
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 18
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      const c = palette[i % palette.length]
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [count])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * (burst ? 0.5 : 0.045)
    pointsRef.current.rotation.x += delta * 0.015
    if (burst) {
      pointsRef.current.scale.setScalar(THREE.MathUtils.lerp(pointsRef.current.scale.x, 1.9, delta * 3))
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.14} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

function HeroCameraRig({ entering, pointerRef }) {
  const { camera } = useThree()
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const targetX = Math.sin(t * 0.25) * 0.25 + pointerRef.current.x * 0.4
    const targetY = Math.cos(t * 0.2) * 0.15 + pointerRef.current.y * 0.25
    const targetZ = entering ? 2.6 : 5.4
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 3)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 3)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 2.6)
    camera.lookAt(0, 0.1, 0)
  })
  return null
}

function ConfettiBurst({ intense = false }) {
  const pieces = useMemo(() => {
    const count = intense ? 56 : 28
    const colors = ['#ff8eb8', '#ffd97d', '#8be0c5', '#8bc8ff', '#b99aff', '#ffa97a']
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const dist  = (intense ? 150 : 90) + (i % 6) * 52
      return {
        id: i,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 40,
        rot: (i * 53) % 360,
        color: colors[i % colors.length],
        size: 7 + (i % 5) * 2,
      }
    })
  }, [intense])

  return (
    <div className="hero-burst-layer" aria-hidden="true">
      {pieces.map(p => (
        <motion.span
          key={p.id}
          className="hero-burst-piece"
          style={{
            background: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
          animate={{ x: p.dx, y: p.dy, scale: 1.1, opacity: 0, rotate: p.rot }}
          transition={{ duration: intense ? 1.1 : 0.9, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export default function HeroSection({ onEnter, hasEntered }) {
  const { getSectionOrFallback } = useMedia()
  const [unsealed, setUnsealed]       = useState(false)
  const [envelopeBurst, setEnvBurst]  = useState(false)
  const [entering, setEntering]       = useState(false)
  const [activeNote, setActiveNote]   = useState(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const [parallax, setParallax]       = useState({ x: 0, y: 0 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const heroPhotos = useMemo(() => {
    const picked = getSectionOrFallback('hero', 5, 0, 'photo')
    const staticPics = GALLERY_PHOTOS.filter(p => p.src).map(p => ({ ...p, url: p.src }))
    const combined = picked.length > 0 ? picked : staticPics
    return [0, 1, 2, 3, 4].map(idx => combined[idx] || null)
  }, [getSectionOrFallback])

  const updatePointer = (clientX, clientY) => {
    const nx = (clientX / window.innerWidth) * 2 - 1
    const ny = -((clientY / window.innerHeight) * 2 - 1)
    pointerRef.current = { x: nx, y: ny }
    setParallax({ x: nx * 10, y: -ny * 8 })
  }

  const handleToggleEnvelope = () => {
    const next = !unsealed
    setUnsealed(next)
    if (next) {
      setEnvBurst(true)
      setTimeout(() => setEnvBurst(false), 950)
    }
  }

  const handleEnterWorld = () => {
    if (entering) return
    setUnsealed(true)
    setEntering(true)
    window.dispatchEvent(new CustomEvent('start-birthday-music'))
    setTimeout(() => {
      onEnter?.()
      setEntering(false)
    }, hasEntered ? 350 : 950)
  }

  return (
    <section
      id="home"
      className="hero"
      onMouseMove={e => updatePointer(e.clientX, e.clientY)}
      onTouchMove={e => {
        if (e.touches?.[0]) updatePointer(e.touches[0].clientX, e.touches[0].clientY)
      }}
    >
      {/* Animated dreamy pastel sky + bokeh */}
      <div className="hero__aurora" aria-hidden="true" />
      <div className="hero__bokeh" aria-hidden="true">
        <span className="bokeh-dot bokeh-dot--1" />
        <span className="bokeh-dot bokeh-dot--2" />
        <span className="bokeh-dot bokeh-dot--3" />
        <span className="bokeh-dot bokeh-dot--4" />
      </div>

      {/* Random floating pastel confetti, hearts, cakes, butterflies & clouds across the whole section */}
      <div className="hero__scattered" aria-hidden="true">
        {SCATTERED_ELEMENTS.map((el, i) => (
          <motion.span
            key={el.id}
            className="hero-float-el"
            style={{ left: el.x, top: el.y, fontSize: el.size }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{
              opacity: [0.55, 0.9, 0.55],
              scale: 1,
              y: [0, -el.amp, 0],
              rotate: [-el.rot, el.rot, -el.rot],
            }}
            transition={{
              duration: el.dur,
              delay: i * 0.08,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {el.icon}
          </motion.span>
        ))}
      </div>

      {/* Main Responsive Stage Container */}
      <div className="hero__stage">
        {/* Interactive 3D Envelope + Pastel Sky Canvas */}
        <motion.div
          className="hero__envelope-stage"
          initial={{ opacity: 0, y: -24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="hero__canvas">
            <Canvas camera={{ position: [0, 0.1, 5.4], fov: 50 }} gl={{ antialias: true, alpha: true }} shadows>
              <ambientLight intensity={1.05} color="#fff9fd" />
              <directionalLight position={[4, 6, 4]} intensity={0.9} color="#fff1dc" castShadow />
              <pointLight position={[-4, 2, 3]} intensity={0.75} color="#ffb6d5" />
              <pointLight position={[4, -2, 3]} intensity={0.7} color="#a7d8ff" />

              <HeroCameraRig entering={entering} pointerRef={pointerRef} />

              <Suspense fallback={null}>
                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
                  <PastelEnvelope3D
                    unsealed={unsealed}
                    entering={entering}
                    pointerRef={pointerRef}
                    onToggleEnvelope={handleToggleEnvelope}
                  />
                </Float>

                <Floating3DPolaroid
                  position={[-3.2, 0.85, -1.5]}
                  rotation={[0.08, 0.35, -0.14]}
                  photoSrc={heroPhotos[0]?.url}
                  tintColor="#ffd6e8"
                />
                <Floating3DPolaroid
                  position={[3.25, 0.85, -1.4]}
                  rotation={[0.06, -0.35, 0.12]}
                  photoSrc={heroPhotos[1]?.url}
                  tintColor="#d8f0ff"
                />

                <PastelBalloon3D position={[-2.35, 0.4, -0.6]} color="#ff9ec4" scale={0.92} speed={1.1} />
                <PastelBalloon3D position={[2.4, 0.55, -0.7]}  color="#9cd4ff" scale={0.9}  speed={1.2} />
                <PastelBalloon3D position={[-1.4, 1.7, -1.9]}  color="#ffe28a" scale={0.78} speed={0.95} />
                <PastelBalloon3D position={[1.55, 1.75, -1.9]} color="#b7f0d4" scale={0.82} speed={1.05} />

                <FluffyCloud3D position={[-3.4, -0.95, -2.2]} scale={0.82} />
                <FluffyCloud3D position={[3.5, -0.85, -2.4]}  scale={0.78} />

                <PastelSparkleParticles count={isMobile ? 60 : 125} burst={unsealed || entering} />
              </Suspense>
            </Canvas>
          </div>

          <button
            type="button"
            className={`hero__envelope-pill ${unsealed ? 'hero__envelope-pill--open' : ''}`}
            onClick={handleToggleEnvelope}
          >
            {unsealed ? '💌 Unsealed! Tap to fold back' : '💌 Tap the 3D envelope to unseal Puju’s secret card!'}
          </button>

          {/* Pop-out ticket revealed when the 3D envelope unseals */}
          <AnimatePresence>
            {unsealed && (
              <motion.div
                className="hero__ticket"
                initial={{ opacity: 0, y: 16, scale: 0.85, rotate: -2 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 240, damping: 18 }}
              >
                <span>🎀</span>
                <p>
                  <strong>Official 5 December Pass:</strong> Unlimited leg-pulling, zero drama timeouts &amp; mandatory feeding for Mr. Drama King — approved by Puju! 😂❤️
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Central Glassy Invitation Card */}
        <motion.div
          className="hero__card"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        >
          <div className="hero__card-tape hero__card-tape--left" aria-hidden="true" />
          <div className="hero__card-tape hero__card-tape--right" aria-hidden="true" />

          <motion.div
            className="hero__top-pill"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            ✨ 5 December Edition · World&apos;s Most Annoying Sister Presents ✨
          </motion.div>

          <motion.h1
            className="hero__greeting font-hand"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, type: 'spring', stiffness: 200 }}
          >
            Hey, Mahir! 👀
          </motion.h1>

          <motion.p
            className="hero__hook font-serif"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            So, Mr. Drama King... don&apos;t act surprised. You know your sister is never capable of doing anything normally. 😂❤️
          </motion.p>

          <motion.div
            className="hero__story-body"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78 }}
          >
            <p>
              This little world is made just for you, by your <strong>Puju</strong>. Your{' '}
              <span className="tag-chip tag-chip--pink">pagal</span>,{' '}
              <span className="tag-chip tag-chip--peach">masti khor</span>,{' '}
              <span className="tag-chip tag-chip--lavender">nakhrebaaz</span>, drama-baaz sister who fights with you, irritates you, pulls your leg, makes random demands and somehow loves you more than she ever says.
            </p>
            <p>
              You might be <span className="tag-chip tag-chip--yellow">my favourite headache</span> and{' '}
              <span className="tag-chip tag-chip--blue">my forever partner in chaos</span>, annoying yet totally irreplaceable — the one I fight with and still love the most.{' '}
              <strong>My brother, my safe place.</strong> So I made this little corner of the internet just for us: a little bit of our fights, our masti, our memories, our nonsense and a whole lot of love.
            </p>
          </motion.div>

          <motion.p
            className="hero__nudge font-hand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
          >
            Now stop acting cool and enter. I know you&apos;re smiling already. 😂❤️
          </motion.p>

          <motion.div
            className="hero__signature"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.08 }}
          >
            <strong>From your Puju,</strong>
            <span>Your permanently annoying sister — who never behaves normally. 🎀</span>
          </motion.div>

          <motion.div
            className="hero__cta-wrap"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.18 }}
          >
            <motion.button
              type="button"
              className="hero__enter-btn"
              onClick={handleEnterWorld}
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>{hasEntered ? 'Jump to Birthday Surprise 🎉' : 'Enter Our Little World ✨'}</span>
            </motion.button>
            <span className="hero__hint">Tap any floating card around the page for Puju&apos;s secret comments 👀</span>
          </motion.div>
        </motion.div>

        {/* 5 Playful Floating Sibling Cards (orbit wings on desktop, staggered strip on tablet/mobile) */}
        <div
          className="hero__cards-orbit"
          style={!isMobile ? { transform: `translate3d(${parallax.x * 0.45}px, ${parallax.y * 0.45}px, 0)` } : undefined}
        >
          {HERO_FLOATING_NOTES.map((note, idx) => {
            const item = heroPhotos[idx]
            return (
              <motion.button
                type="button"
                key={note.id}
                className={`hero-polaroid hero-polaroid--${idx + 1}`}
                initial={{ opacity: 0, scale: 0.72, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.13, duration: 0.6, type: 'spring', stiffness: 190 }}
                whileHover={{ scale: 1.08, y: -6, rotate: 0, zIndex: 25 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveNote(activeNote?.id === note.id ? null : { ...note, photo: item })}
              >
                <span className="hero-polaroid__tape" style={{ background: note.tint }} />
                <span className="hero-polaroid__badge">{note.tag}</span>
                <div className="hero-polaroid__img-wrap" style={{ background: note.tint }}>
                  {item?.url ? (
                    <img
                      src={item.url}
                      alt={item.caption || note.caption}
                      style={{ objectPosition: item?.crop?.position || 'center 22%' }}
                    />
                  ) : (
                    <span className="hero-polaroid__emoji">{note.emoji}</span>
                  )}
                </div>
                <span className="hero-polaroid__caption font-hand">{note.caption}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Tiny secret pop-up when clicking any Polaroid card */}
      <AnimatePresence>
        {activeNote && (
          <motion.div
            className="hero-mini-note"
            initial={{ opacity: 0, y: 12, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            onClick={() => setActiveNote(null)}
          >
            <span>{activeNote.emoji}</span>
            <p>{activeNote.secret}</p>
            <small>tap to close ✕</small>
          </motion.div>
        )}
      </AnimatePresence>

      {(envelopeBurst || entering) && <ConfettiBurst intense={entering} />}
    </section>
  )
}
