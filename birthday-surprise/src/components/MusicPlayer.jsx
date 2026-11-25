import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react'
import { SITE_CONFIG } from '../data/content'
import { MY_AUDIO_SRC } from '../data/myMedia'

export default function MusicPlayer() {
  const [playing, setPlaying]   = useState(false)
  const [muted, setMuted]       = useState(false)
  const [volume, setVolume]     = useState(0.35)
  const [expanded, setExpanded] = useState(false)
  const [started, setStarted]   = useState(false)
  const [missing, setMissing]   = useState(false)
  const audioRef   = useRef(null)
  const missingRef = useRef(false)

  useEffect(() => {
    const audio = new Audio(MY_AUDIO_SRC || SITE_CONFIG.musicSrc)
    audio.loop = true
    audio.volume = 0.35
    audio.preload = 'none'
    audio.onerror = () => {
      missingRef.current = true
      setMissing(true)
    }
    audioRef.current = audio

    // Start gently only after user clicks "Enter Our Little World"
    const handleEnterMusic = () => {
      if (!audioRef.current || missingRef.current) return
      audioRef.current.play()
        .then(() => {
          setStarted(true)
          setPlaying(true)
        })
        .catch(() => {
          // Graceful fallback if no mp3 file yet or browser blocked
        })
    }

    // Pause background music automatically when a Brother Song 30s preview plays
    const handleBrotherSongPlay = () => {
      if (!audioRef.current) return
      audioRef.current.pause()
      setPlaying(false)
    }

    window.addEventListener('start-birthday-music', handleEnterMusic)
    window.addEventListener('brother-song-play', handleBrotherSongPlay)
    return () => {
      window.removeEventListener('start-birthday-music', handleEnterMusic)
      window.removeEventListener('brother-song-play', handleBrotherSongPlay)
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggle = () => {
    if (!audioRef.current) return
    if (!started) {
      setStarted(true)
      window.dispatchEvent(new CustomEvent('background-music-play'))
      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => setMissing(true))
      return
    }
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      window.dispatchEvent(new CustomEvent('background-music-play'))
      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => {})
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !muted
    setMuted(v => !v)
  }

  const changeVolume = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  if (!SITE_CONFIG.musicEnabled) return null

  return (
    <motion.div
      className="music-player"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="music-player__panel"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
          >
            <div className="music-player__row">
              <button type="button" className="music-player__btn" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <span className="music-player__label">
                {missing ? 'Add background.mp3' : !started ? 'Play music' : playing ? 'Playing ♪' : 'Paused'}
              </span>
              <button type="button" className="music-player__btn" onClick={toggleMute} aria-label="Toggle mute">
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={changeVolume}
              className="music-player__volume"
              aria-label="Volume"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={`music-player__icon-btn ${playing ? 'music-player__icon-btn--playing' : ''}`}
        onClick={() => setExpanded(v => !v)}
        aria-label="Music controls"
      >
        <Music size={17} color="#b04a78" />
      </button>
    </motion.div>
  )
}
