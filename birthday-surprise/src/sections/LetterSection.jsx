import { useState, useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { BIRTHDAY_LETTER, SECTION_COPY } from '../data/content'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import SectionDropZone from '../components/SectionDropZone'
import '../styles/letter.css'
import '../styles/dropzone.css'

function PastelEnvelope3D({ opened, onClick }) {
  const bodyRef  = useRef()
  const lidRef   = useRef()
  const paperRef = useRef()
  const [hovered, setHovered] = useState(false)

  const flapGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-1.48, 0)
    shape.lineTo(1.48, 0)
    shape.lineTo(0, -1.08)
    shape.closePath()
    return new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: false })
  }, [])

  useFrame((state, delta) => {
    if (!bodyRef.current) return
    bodyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.1
    if (lidRef.current) {
      lidRef.current.rotation.x = THREE.MathUtils.lerp(
        lidRef.current.rotation.x,
        opened ? -Math.PI * 1.12 : (hovered ? -0.18 : 0),
        delta * 4.5
      )
    }
    if (paperRef.current) {
      paperRef.current.position.y = THREE.MathUtils.lerp(paperRef.current.position.y, opened ? 0.95 : 0, delta * 4)
      paperRef.current.material.opacity = THREE.MathUtils.lerp(paperRef.current.material.opacity, opened ? 1 : 0, delta * 5)
    }
  })

  return (
    <group
      ref={bodyRef}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      onClick={onClick}
    >
      <mesh>
        <boxGeometry args={[2.95, 1.9, 0.12]} />
        <meshStandardMaterial color="#ffeef5" roughness={0.45} />
      </mesh>

      <mesh position={[0, 0, 0.064]}>
        <planeGeometry args={[2.75, 1.72]} />
        <meshStandardMaterial color="#f5e9ff" roughness={0.6} />
      </mesh>

      <group ref={lidRef} position={[0, 0.95, 0.06]}>
        <mesh geometry={flapGeo}>
          <meshStandardMaterial color="#ffe2ee" roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <mesh ref={paperRef} position={[0, 0, 0.1]}>
        <planeGeometry args={[2.3, 1.45]} />
        <meshStandardMaterial color="#fffdf7" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, -0.05, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.06, 32]} />
        <meshStandardMaterial color="#f4a862" emissive="#f48fb1" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

export default function LetterSection() {
  const { getSectionOrFallback } = useMedia()
  const letterPhotos = getSectionOrFallback('letter', 3, 2, 'photo')
  const [step, setStep] = useState('sealed') // sealed | opening | reading

  const handleEnvelopeClick = () => {
    if (step !== 'sealed') return
    setStep('opening')
    setTimeout(() => setStep('reading'), 750)
  }

  const paragraphs = BIRTHDAY_LETTER.split('\n\n').filter(Boolean)

  return (
    <section id="letter" className="letter-section section-padding">
      <div className="letter-deco" aria-hidden="true">
        <FloatingDecorations set="love" count={8} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">{SECTION_COPY.letter.eyebrow}</span>
          <h2>{SECTION_COPY.letter.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{SECTION_COPY.letter.subtitle}</p>
        </motion.div>

        {/* 3D Pastel Envelope */}
        <div className="letter-canvas" onClick={handleEnvelopeClick}>
          <Canvas camera={{ position: [0, 0, 5.6], fov: 48 }} gl={{ antialias: true, alpha: true }}>
            <ambientLight intensity={1.1} color="#fff9fd" />
            <directionalLight position={[4, 5, 4]} intensity={0.85} color="#fff3dc" />
            <Suspense fallback={null}>
              <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0.14}>
                <PastelEnvelope3D opened={step !== 'sealed'} onClick={handleEnvelopeClick} />
              </Float>
              <Sparkles count={45} scale={9} size={1.6} speed={0.35} color="#f59fc3" opacity={0.55} />
            </Suspense>
          </Canvas>
        </div>

        {step === 'sealed' && (
          <motion.div
            className="letter-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button type="button" className="btn-cinematic" onClick={handleEnvelopeClick}>
              Open Puju&apos;s Letter 💌
            </button>
          </motion.div>
        )}

        <SectionDropZone sectionId="letter" label="The Letter">
          <AnimatePresence>
            {step === 'reading' && (
              <motion.div
                className="letter-desk-layout"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
              >
                {/* Decorative corner memories if uploaded — kept neatly outside text column */}
                {letterPhotos.length > 0 && (
                  <aside className="letter-side-memories">
                    {letterPhotos.map((item, idx) => (
                      <div
                        key={item.id}
                        className="letter-side-polaroid"
                        style={{ '--tilt': `${idx % 2 === 0 ? -3 : 3}deg` }}
                      >
                        <span className="letter-side-polaroid__tape" />
                        {item.type === 'video' ? (
                          <video src={item.url} muted controls />
                        ) : (
                          <img src={item.url} alt={item.caption || 'Memory'} />
                        )}
                        <p className="font-hand">{item.caption || item.title || 'For us 🤍'}</p>
                      </div>
                    ))}
                  </aside>
                )}

                <div className="letter-scroll">
                  <div className="letter-paper">
                    <div className="letter-paper__lines" aria-hidden="true" />
                    <div className="letter-paper__inner">
                      <div className="letter-top-rule" />
                      {paragraphs.map((para, i) => (
                        <motion.p
                          key={i}
                          className="letter-paragraph"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.55, delay: 0.1 + i * 0.08 }}
                          style={i === 0 || i === paragraphs.length - 1 ? { fontWeight: 700, color: '#b04a78' } : {}}
                        >
                          {para}
                        </motion.p>
                      ))}
                      <div className="letter-top-rule" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionDropZone>
      </div>
    </section>
  )
}
