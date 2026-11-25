import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import { SECTION_COPY } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/bond.css'
import '../styles/dropzone.css'

function PastelLightOrb({ position, color, glowColor, speed = 0.5, phase = 0 }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.x = Math.sin(t * speed + phase) * 1.9
    ref.current.position.y = Math.cos(t * speed * 0.75 + phase) * 0.95
  })

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={1.2}
          roughness={0.25}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshStandardMaterial
          color={glowColor}
          transparent
          opacity={0.24}
        />
      </mesh>
      <pointLight color={glowColor} intensity={1.1} distance={4} decay={2} />
    </group>
  )
}

function ConnectionRibbon() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.08
    ref.current.material.opacity = 0.45 + Math.sin(t * 1.4) * 0.2
  })

  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.95, 0.018, 12, 100]} />
      <meshStandardMaterial
        color="#f59fc3"
        emissive="#ffd6e8"
        emissiveIntensity={0.65}
        transparent
        opacity={0.55}
      />
    </mesh>
  )
}

const BOND_TEXTS = [
  "Funny how two people can fight over the smallest things...",
  "Yet somehow feel when something isn't right.",
  "Sometimes, being connected doesn't mean being physically close.",
  "If one gets angry, the other somehow gets affected too.",
  "If one is crying, the other sometimes can't hold back.",
  "Maybe we will never understand how this works.",
  "But when something happens to you...",
  "Everything else suddenly stops mattering.",
]

export default function BondSection() {
  const { getSectionOrFallback } = useMedia()
  const bondPhotos = getSectionOrFallback('bond', 4, 6, 'photo')

  return (
    <section id="bond" className="bond-section section-padding">
      <div className="bond-deco" aria-hidden="true">
        <FloatingDecorations set="bond" count={10} />
      </div>

      {/* Pastel 3D Orbs Canvas */}
      <div className="bond-canvas" aria-hidden="true">
        <Canvas camera={{ position: [0, 0, 5.8], fov: 52 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={1.0} color="#fff9fd" />
          <Suspense fallback={null}>
            <Float speed={1} floatIntensity={0.25}>
              <PastelLightOrb position={[-1.9, 0, 0]} color="#ffa680" glowColor="#ffd2b8" speed={0.42} phase={0} />
              <PastelLightOrb position={[1.9, 0, 0]}  color="#b496f5" glowColor="#e2d4ff" speed={0.42} phase={Math.PI} />
              <ConnectionRibbon />
            </Float>
            <Sparkles count={45} scale={9} size={1.8} speed={0.35} color="#f294b9" opacity={0.55} />
            <Sparkles count={35} scale={8} size={1.5} speed={0.25} color="#9a7ee0" opacity={0.45} />
          </Suspense>
        </Canvas>
      </div>

      <div className="bond-content section-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">{SECTION_COPY.bond.eyebrow}</span>
          <h2>{SECTION_COPY.bond.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{SECTION_COPY.bond.subtitle}</p>
        </motion.div>

        <SectionDropZone sectionId="bond" label="Our Bond">
          <div className="bond-stage">
            {/* Optional floating photos framing left/right */}
            {bondPhotos.length > 0 && (
              <div className="bond-photos-scatter">
                {bondPhotos.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    className="bond-float-polaroid"
                    style={{ '--tilt': `${idx % 2 === 0 ? -4 : 4}deg` }}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.15 }}
                    whileHover={{ scale: 1.05, rotate: 0 }}
                  >
                    {item.type === 'video' ? (
                      <video src={item.url} controls muted />
                    ) : (
                      <img src={item.url} alt={item.caption || 'Our bond'} />
                    )}
                    <p className="font-hand">{item.caption || item.title || 'Just us 🤍'}</p>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="bond-texts">
              {BOND_TEXTS.map((text, i) => (
                <motion.p
                  key={i}
                  className={`bond-text ${i === 6 || i === 7 ? 'bond-text--highlight' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, delay: 0.05 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>
          </div>
        </SectionDropZone>
      </div>
    </section>
  )
}
