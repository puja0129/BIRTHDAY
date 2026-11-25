/**
 * FloatingDecorations — Pastel scrapbook floating accents.
 * Uses deterministic placement so animations stay butter-smooth without jitter.
 */
import { useMemo } from 'react'
import { motion } from 'framer-motion'

const DECORATION_SETS = {
  gold:        ['✨', '⭐', '🌟', '💫', '🌸', '☁️'],
  love:        ['🤍', '💖', '💛', '💜', '✨', '🦋'],
  funny:       ['😂', '😤', '🌪️', '💬', '🙃', '⚡'],
  nature:      ['🌸', '🌼', '🍀', '🦋', '☁️', '🌿'],
  birthday:    ['🎂', '🎈', '🎉', '🎊', '✨', '🎀'],
  bond:        ['💫', '✨', '🤍', '🦋', '🌙', '💜'],
  butterflies: ['🦋', '✨', '🌸', '☁️', '💖', '⭐'],
  teddy:       ['🧸', '🤍', '🥹', '🎀', '💛', '✨'],
  rishta:      ['🥹', '🤍', '😂', '❤️', '✨', '🧿'],
  album:       ['📸', '💖', '🌸', '✨', '🫶', '🎞️'],
  music:       ['🎵', '🎶', '🎧', '💿', '✨', '🤍'],
  tomjerry:    ['🐭', '🐱', '🧀', '💥', '🌪️', '😂'],
  flipbook:    ['🎞️', '📸', '🔖', '🫂', '🌸', '✨'],
  keepsake:    ['🤍', '☕', '🧸', '🔌', '🌧️', '🌟'],
  comic:       ['💬', '⚡', '💥', '🎭', '🤪', '✨'],
}

function Decoration({ emoji, x, y, size, duration, delay, amplitude, opacity }) {
  return (
    <motion.span
      className="float-deco"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: `${size}rem`,
        position: 'absolute',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 1,
        opacity,
      }}
      animate={{
        y: [0, -amplitude, 0],
        rotate: [-6, 6, -6],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.span>
  )
}

export default function FloatingDecorations({ set = 'gold', count = 12 }) {
  const decorations = useMemo(() => {
    const emojis = DECORATION_SETS[set] || DECORATION_SETS.gold
    return Array.from({ length: count }, (_, i) => ({
      id: `${set}-${i}`,
      emoji: emojis[i % emojis.length],
      x: 4 + ((i * 19.3 + 7) % 90),
      y: 6 + ((i * 23.7 + 11) % 84),
      size: 0.95 + (i % 4) * 0.28,
      duration: 3.4 + (i % 4) * 0.7,
      delay: (i * 0.45) % 3,
      amplitude: 8 + (i % 3) * 6,
      opacity: 0.25 + (i % 3) * 0.1,
    }))
  }, [set, count])

  return (
    <div className="float-deco-layer" aria-hidden="true">
      {decorations.map(d => <Decoration key={d.id} {...d} />)}
    </div>
  )
}
