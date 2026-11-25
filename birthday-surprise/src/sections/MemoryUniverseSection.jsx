import { Suspense, useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Text } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { GALLERY_PHOTOS, SECTION_COPY } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/memories.css'
import '../styles/dropzone.css'

const PASTEL_FRAME_TINTS = ['#ffd6e8', '#e9e0ff', '#d8f0ff', '#fff4c4', '#daf7e8', '#ffe2cf']

function useMemoryTexture(url) {
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    if (!url) {
      setTexture(null)
      return
    }
    let active = true
    const loader = new THREE.TextureLoader()
    loader.load(
      url,
      (tex) => {
        if (!active) {
          tex.dispose()
          return
        }
        tex.colorSpace = THREE.SRGBColorSpace
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
        if (active) setTexture(null)
      }
    )
    return () => { active = false }
  }, [url])

  return texture
}

function PhotoCard3D({ data, index, total, onClick }) {
  const meshRef = useRef()
  const angle = (index / Math.max(1, total)) * Math.PI * 2
  const radius = 3.9
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const baseY = Math.sin(index * 1.4) * 0.65
  const [hovered, setHovered] = useState(false)

  const photoSrc = data.type === 'video' ? null : (data.url || data.src)
  const texture  = useMemoryTexture(photoSrc)
  const pastelTint = data.tint || PASTEL_FRAME_TINTS[index % PASTEL_FRAME_TINTS.length]

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    // Noticeably livelier floating & gentle tilt as the carousel orbits
    meshRef.current.position.y = baseY + Math.sin(t * 1.65 + index) * 0.24
    meshRef.current.rotation.z = Math.cos(t * 1.15 + index) * 0.06
    const targetScale = hovered ? 1.16 : 1
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 7))
  })

  return (
    <group
      ref={meshRef}
      position={[x, baseY, z]}
      rotation={[0, -angle + Math.PI / 2, 0]}
      onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={e => { e.stopPropagation(); onClick(data, index) }}
    >
      {/* Polaroid card body */}
      <mesh>
        <boxGeometry args={[1.45, 1.75, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.65} />
      </mesh>

      {/* Pastel border accent */}
      <mesh position={[0, -0.02, -0.02]}>
        <boxGeometry args={[1.52, 1.82, 0.02]} />
        <meshStandardMaterial color={pastelTint} roughness={0.5} />
      </mesh>

      {/* Picture window */}
      <mesh position={[0, 0.12, 0.03]}>
        <planeGeometry args={[1.22, 1.22]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial color={pastelTint} roughness={0.45} />
        )}
      </mesh>

      {!texture && (
        <Text position={[0, 0.12, 0.05]} fontSize={0.38} color="#4c372d">
          {data.type === 'video' ? '🎬' : (data.placeholder || '📸')}
        </Text>
      )}
    </group>
  )
}

// Continuously revolving 3D Polaroid Carousel (~3x faster smooth orbit)
function CarouselOrbit({ allItems, onSelect }) {
  const orbitRef = useRef()

  useFrame((_, delta) => {
    if (!orbitRef.current) return
    orbitRef.current.rotation.y += delta * 0.36
  })

  return (
    <group ref={orbitRef}>
      {allItems.map((item, i) => (
        <PhotoCard3D
          key={item.id}
          data={item}
          index={i}
          total={allItems.length}
          onClick={onSelect}
        />
      ))}
    </group>
  )
}

function SkyCamera({ pointerRef }) {
  const { camera } = useThree()
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const px = pointerRef.current.x * 1.4
    const py = pointerRef.current.y * 0.85
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(t * 0.32) * 0.9 + px, delta * 2.5)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.85 + Math.cos(t * 0.28) * 0.35 + py, delta * 2.5)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function PastelOrbitalRing() {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.22
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.2, 0.15, 0]} position={[0, -0.2, 0]}>
      <torusGeometry args={[4.05, 0.025, 12, 120]} />
      <meshStandardMaterial color="#f9b6d3" emissive="#ffd8e8" emissiveIntensity={0.4} transparent opacity={0.6} />
    </mesh>
  )
}

export default function MemoryUniverseSection() {
  const { getSectionOrFallback } = useMedia()
  const [selected, setSelected] = useState(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const allItems = useMemo(() => {
    const picked = getSectionOrFallback('memories', 12, 1, 'photo')
    if (picked.length > 0) return picked
    return GALLERY_PHOTOS.map(p => ({ ...p, url: p.src }))
  }, [getSectionOrFallback])

  const handleMove = (clientX, clientY, rect) => {
    const nx = ((clientX - rect.left) / rect.width) * 2 - 1
    const ny = -(((clientY - rect.top) / rect.height) * 2 - 1)
    pointerRef.current = { x: nx, y: ny }
  }

  return (
    <section id="memories" className="memory-section section-padding">
      <div className="memory-deco" aria-hidden="true">
        <FloatingDecorations set="butterflies" count={10} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">{SECTION_COPY.memories.eyebrow}</span>
          <h2>{SECTION_COPY.memories.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{SECTION_COPY.memories.subtitle}</p>
        </motion.div>

        <SectionDropZone sectionId="memories" label="3D Memory World" className="memory-canvas-wrapper">
          <div
            className="memory-canvas"
            onMouseMove={e => handleMove(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())}
            onTouchMove={e => {
              if (e.touches?.[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget.getBoundingClientRect())
            }}
          >
            <Canvas camera={{ position: [0, 0.85, 7.6], fov: 52 }} gl={{ antialias: true, alpha: true }}>
              <ambientLight intensity={1.1} color="#fff9fd" />
              <directionalLight position={[4, 6, 4]} intensity={0.85} color="#fff2d6" />
              <pointLight position={[-4, 2, 2]} intensity={0.65} color="#ffb6d6" />
              <pointLight position={[4, -2, -2]} intensity={0.6} color="#a4d7ff" />

              <SkyCamera pointerRef={pointerRef} />

              <Suspense fallback={null}>
                <PastelOrbitalRing />
                <Sparkles count={isMobile ? 45 : 95} scale={11} size={2.2} speed={0.55} color="#f59fc3" opacity={0.7} />
                <Sparkles count={isMobile ? 35 : 70} scale={10} size={1.8} speed={0.45} color="#9bc9ff" opacity={0.65} />

                <CarouselOrbit
                  allItems={allItems}
                  onSelect={(d, idx) => setSelected([d, idx])}
                />
              </Suspense>
            </Canvas>
            <div className="memory-sky-hint">Orbiting live — move around or tap any Polaroid to zoom in ✨</div>
          </div>
        </SectionDropZone>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="lightbox__card glass-card"
              initial={{ scale: 0.82 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.88 }}
              onClick={e => e.stopPropagation()}
            >
              {(selected[0].url || selected[0].src) ? (
                selected[0].type === 'video' ? (
                  <video src={selected[0].url} controls autoPlay className="lightbox__img" />
                ) : (
                  <img
                    src={selected[0].url || selected[0].src}
                    alt={selected[0].caption}
                    className="lightbox__img"
                    style={{ objectPosition: selected[0].crop?.position || 'center center' }}
                  />
                )
              ) : (
                <div className="lightbox__placeholder">
                  <span>{selected[0].placeholder || '📸'}</span>
                  <p>Drop a photo right onto the 3D sky or pick one in <strong>Manage Memories</strong>!</p>
                </div>
              )}
              <div className="lightbox__meta">
                <p className="lightbox__caption">{selected[0].caption || selected[0].title || selected[0].name}</p>
                {selected[0].date && <p className="lightbox__date">{selected[0].date}</p>}
              </div>
              <button type="button" className="lightbox__close" onClick={() => setSelected(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
