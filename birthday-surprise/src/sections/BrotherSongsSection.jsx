import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Plus, Trash2, Edit2, Music, Disc, Radio, Repeat, Square, RotateCcw, Upload
} from 'lucide-react'
import { BROTHER_SONGS_STARTER } from '../data/content'
import { MY_AUDIO_FILES } from '../data/myMedia'
import { useMedia } from '../context/MediaContext'
import FloatingDecorations from '../components/FloatingDecorations'
import '../styles/brotherSongs.css'

const PREVIEW_LIMIT_SEC = 30
const SONGS_META_KEY = 'mahir-brother-songs-v1'
const SONGS_DB_NAME  = 'brother-songs-audio-db'
const SONGS_STORE    = 'audio-blobs'

const CARD_STYLES = [
  { id: 'vinyl',    label: '💿 Spinning Vinyl Sleeve' },
  { id: 'cassette', label: '📼 Retro Pastel Cassette' },
  { id: 'polaroid', label: '📸 Polaroid Single Cover' },
  { id: 'cd',       label: '🪩 Holographic CD Jewel' },
  { id: 'ticket',   label: '📻 FM Radio Ticket' },
]

// Distinct pentatonic pastel melodies for starter cards before custom MP3 upload
const SYNTH_MELODIES = {
  warm:      [261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 392.0],
  nostalgic: [293.66, 349.23, 440.0, 523.25, 440.0, 392.0, 349.23, 329.63],
  playful:   [392.0, 440.0, 523.25, 440.0, 587.33, 523.25, 440.0, 392.0],
  dreamy:    [246.94, 293.66, 369.99, 440.0, 369.99, 293.66, 329.63, 293.66],
  breezy:    [329.63, 392.0, 493.88, 587.33, 493.88, 392.0, 440.0, 392.0],
}

function openSongsDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(SONGS_DB_NAME, 1)
    req.onupgradeneeded = (e) => {
      if (!e.target.result.objectStoreNames.contains(SONGS_STORE)) {
        e.target.result.createObjectStore(SONGS_STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = e => resolve(e.target.result)
    req.onerror   = e => reject(e.target.error)
  })
}

async function idbSaveAudio(id, blob) {
  const db = await openSongsDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SONGS_STORE, 'readwrite')
    const req = tx.objectStore(SONGS_STORE).put({ id, blob })
    req.onsuccess = () => resolve()
    req.onerror   = e => reject(e.target.error)
  })
}

async function idbDeleteAudio(id) {
  const db = await openSongsDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SONGS_STORE, 'readwrite')
    const req = tx.objectStore(SONGS_STORE).delete(id)
    req.onsuccess = () => resolve()
    req.onerror   = e => reject(e.target.error)
  })
}

async function idbGetAllAudio() {
  const db = await openSongsDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SONGS_STORE, 'readonly')
    const req = tx.objectStore(SONGS_STORE).getAll()
    req.onsuccess = e => resolve(e.target.result || [])
    req.onerror   = e => reject(e.target.error)
  })
}

function buildInitialSongs() {
  try {
    const raw = localStorage.getItem(SONGS_META_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback to starter catalog
  }

  const fromFolder = MY_AUDIO_FILES.map((track, i) => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    mood: 'Your Memory File 🎶',
    style: CARD_STYLES[i % CARD_STYLES.length].id,
    accent: BROTHER_SONGS_STARTER[i % BROTHER_SONGS_STARTER.length].accent,
    bgGradient: BROTHER_SONGS_STARTER[i % BROTHER_SONGS_STARTER.length].bgGradient,
    audioUrl: track.audioUrl,
    previewStart: 0,
    note: 'Bundled right from your MY folder — 30s preview ready whenever you press play 💛',
    synthPreset: 'warm',
    builtinFolder: true,
  }))

  return fromFolder.length > 0 ? fromFolder : BROTHER_SONGS_STARTER
}

function formatSec(sec) {
  const s = Math.max(0, Math.round(sec))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${String(rem).padStart(2, '0')}`
}

/* ── Distinct Song Card Visuals (5 different styles) ───────────────── */
function SongCardArtwork({ song, isPlaying, coverPhoto }) {
  const style = song.style || 'vinyl'

  if (style === 'cassette') {
    return (
      <div className="bs-art bs-art--cassette">
        <div className="bs-cassette-label">
          <span>SIDE A · 30S</span>
          <strong className="font-hand">{song.title}</strong>
        </div>
        <div className="bs-cassette-window">
          <div className={`bs-reel ${isPlaying ? 'bs-spin' : ''}`} />
          <div className="bs-tape-bridge" />
          <div className={`bs-reel ${isPlaying ? 'bs-spin' : ''}`} />
        </div>
      </div>
    )
  }

  if (style === 'polaroid') {
    return (
      <div className="bs-art bs-art--polaroid">
        <span className="bs-art-tape" aria-hidden="true" />
        <div className="bs-polaroid-img">
          {coverPhoto ? (
            <img src={coverPhoto} alt={song.title} />
          ) : (
            <div className="bs-polaroid-emoji">🎶</div>
          )}
          {isPlaying && (
            <div className="bs-eq-bars" aria-hidden="true">
              <span /><span /><span /><span />
            </div>
          )}
        </div>
        <p className="bs-polaroid-hand font-hand">{song.mood || 'Memory mix'}</p>
      </div>
    )
  }

  if (style === 'cd') {
    return (
      <div className="bs-art bs-art--cd">
        <div className={`bs-cd-disc ${isPlaying ? 'bs-spin-slow' : ''}`}>
          {coverPhoto && <img src={coverPhoto} alt={song.title} className="bs-cd-cover-hint" />}
          <span className="bs-cd-hole" />
        </div>
      </div>
    )
  }

  if (style === 'ticket') {
    return (
      <div className="bs-art bs-art--ticket">
        <div className="bs-ticket-top">
          <Radio size={15} />
          <span>DEC 5 FM · 0:30 PREVIEW</span>
        </div>
        <div className="bs-ticket-wave" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className={isPlaying ? 'bs-wave-bar bs-wave-bar--live' : 'bs-wave-bar'}
              style={{ animationDelay: `${i * 0.08}s`, height: `${28 + ((i * 19) % 58)}%` }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Default: vinyl sleeve + peeking disc
  return (
    <div className="bs-art bs-art--vinyl">
      <div className="bs-vinyl-sleeve">
        {coverPhoto ? (
          <img src={coverPhoto} alt={song.title} />
        ) : (
          <Disc size={28} color={song.accent || '#e86f9c'} />
        )}
      </div>
      <div className={`bs-vinyl-record ${isPlaying ? 'bs-spin-slow' : ''}`}>
        <span className="bs-vinyl-center" style={{ background: song.accent || '#e86f9c' }} />
      </div>
    </div>
  )
}

export default function BrotherSongsSection() {
  const { items: mediaItems } = useMedia()
  const availablePhotos = useMemo(() => mediaItems.filter(m => m.type === 'photo'), [mediaItems])

  const [songs, setSongs]             = useState(buildInitialSongs)
  const [blobUrls, setBlobUrls]       = useState({})
  const [currentIdx, setCurrentIdx]   = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [elapsed, setElapsed]         = useState(0)
  const [volume, setVolume]           = useState(0.75)
  const [muted, setMuted]             = useState(false)
  const [endBehavior, setEndBehavior] = useState('next') // 'next' | 'stop'
  const [loopPlaylist, setLoopList]   = useState(true)

  // Modal state for Easy Add / Edit Song
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formState, setFormState] = useState({
    title: '', artist: '', mood: '', note: '',
    style: 'vinyl', previewStart: 0, audioUrl: '', coverUrl: '',
  })
  const [pendingAudioFile, setPendingAudioFile] = useState(null)

  // Single shared playback engine refs -> prevents ANY overlapping audio
  const audioRef       = useRef(null)
  const timerRef       = useRef(null)
  const synthCtxRef    = useRef(null)
  const synthGainRef   = useRef(null)
  const synthLoopRef   = useRef(null)
  const elapsedRef     = useRef(0)
  const playSongRef    = useRef(null)
  const endBehaviorRef = useRef(endBehavior)
  const loopListRef    = useRef(loopPlaylist)
  const songsRef       = useRef(songs)
  const currentIdxRef  = useRef(currentIdx)
  const mutedRef          = useRef(muted)
  const volumeRef         = useRef(volume)
  const sessionTokenRef   = useRef(0)

  useEffect(() => { endBehaviorRef.current = endBehavior }, [endBehavior])
  useEffect(() => { loopListRef.current    = loopPlaylist }, [loopPlaylist])
  useEffect(() => { songsRef.current       = songs }, [songs])
  useEffect(() => { currentIdxRef.current  = currentIdx }, [currentIdx])
  useEffect(() => {
    mutedRef.current  = muted
    volumeRef.current = volume
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
      audioRef.current.muted  = muted
    }
    if (synthGainRef.current && synthCtxRef.current) {
      synthGainRef.current.gain.setTargetAtTime(muted ? 0 : volume * 0.14, synthCtxRef.current.currentTime, 0.04)
    }
  }, [muted, volume])

  // Load persisted audio blobs from IndexedDB on mount
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const records = await idbGetAllAudio()
        if (!active) return
        const map = {}
        records.forEach(({ id, blob }) => {
          map[id] = URL.createObjectURL(blob)
        })
        setBlobUrls(map)
      } catch {
        // IndexedDB unavailable fallback
      }
    })()
    return () => { active = false }
  }, [])

  // Persist song catalog metadata in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SONGS_META_KEY, JSON.stringify(songs))
    } catch {
      // Ignore quota errors
    }
  }, [songs])

  const resolveAudioSrc = useCallback((song) => {
    if (!song) return null
    if (blobUrls[song.id]) return blobUrls[song.id]
    if (song.audioUrl) return song.audioUrl
    const bundled = MY_AUDIO_FILES.find(f => f.id === song.id)
    return bundled?.audioUrl || null
  }, [blobUrls])

  const resolveCoverSrc = useCallback((song, index) => {
    if (song?.coverUrl) return song.coverUrl
    if (availablePhotos.length > 0) return availablePhotos[index % availablePhotos.length].url
    return null
  }, [availablePhotos])

  const stopAllEngines = useCallback(() => {
    sessionTokenRef.current += 1
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (synthLoopRef.current) {
      clearInterval(synthLoopRef.current)
      synthLoopRef.current = null
    }
    if (audioRef.current) {
      audioRef.current.onended = null
      audioRef.current.onerror = null
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    if (synthCtxRef.current) {
      try {
        synthCtxRef.current.close()
      } catch {
        // Ignore already closed
      }
      synthCtxRef.current  = null
      synthGainRef.current = null
    }
  }, [])

  const finishPreview = useCallback(() => {
    stopAllEngines()
    setIsPlaying(false)
    setElapsed(0)
    elapsedRef.current = 0

    if (endBehaviorRef.current === 'next' && songsRef.current.length > 0) {
      const nextIdx = currentIdxRef.current + 1
      if (nextIdx < songsRef.current.length) {
        setTimeout(() => playSongRef.current?.(nextIdx, 0), 120)
      } else if (loopListRef.current) {
        setTimeout(() => playSongRef.current?.(0, 0), 120)
      }
    }
  }, [stopAllEngines])

  const startSynthPreview = useCallback((song, startElapsed = 0, token = sessionTokenRef.current) => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) {
      setIsPlaying(false)
      return
    }
    const ctx = new AudioCtx()
    const masterGain = ctx.createGain()
    masterGain.gain.value = mutedRef.current ? 0 : volumeRef.current * 0.14
    masterGain.connect(ctx.destination)
    synthCtxRef.current  = ctx
    synthGainRef.current = masterGain

    const notes = SYNTH_MELODIES[song.synthPreset] || SYNTH_MELODIES.warm
    let step = Math.floor(startElapsed / 0.55) % notes.length

    const playNote = (freq) => {
      if (!synthCtxRef.current || synthCtxRef.current.state === 'closed' || sessionTokenRef.current !== token) return
      const now = synthCtxRef.current.currentTime
      const osc = synthCtxRef.current.createOscillator()
      const env = synthCtxRef.current.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, now)
      env.gain.setValueAtTime(0.001, now)
      env.gain.exponentialRampToValueAtTime(0.45, now + 0.04)
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      osc.connect(env)
      env.connect(masterGain)
      osc.start(now)
      osc.stop(now + 0.52)
    }

    playNote(notes[step])
    synthLoopRef.current = setInterval(() => {
      if (sessionTokenRef.current !== token) return
      step = (step + 1) % notes.length
      playNote(notes[step])
    }, 550)

    const startedWall = performance.now() - startElapsed * 1000
    timerRef.current = setInterval(() => {
      if (sessionTokenRef.current !== token) return
      const nextElapsed = Math.min(PREVIEW_LIMIT_SEC, (performance.now() - startedWall) / 1000)
      elapsedRef.current = nextElapsed
      setElapsed(nextElapsed)
      if (nextElapsed >= PREVIEW_LIMIT_SEC) {
        finishPreview()
      }
    }, 80)
  }, [finishPreview])

  const playSongAtIndex = useCallback((index, seekWithinPreview = 0) => {
    const targetList = songsRef.current
    if (!targetList.length) return
    const safeIdx = ((index % targetList.length) + targetList.length) % targetList.length
    const song = targetList[safeIdx]

    // Strictly stop everything else first -> zero overlapping audio ever
    stopAllEngines()
    const token = ++sessionTokenRef.current
    window.dispatchEvent(new CustomEvent('brother-song-play'))

    const clampedStartElapsed = Math.max(0, Math.min(PREVIEW_LIMIT_SEC - 0.1, seekWithinPreview))
    setCurrentIdx(safeIdx)
    setElapsed(clampedStartElapsed)
    elapsedRef.current = clampedStartElapsed
    setIsPlaying(true)

    const src = resolveAudioSrc(song)
    if (!src) {
      startSynthPreview(song, clampedStartElapsed)
      return
    }

    const audio = new Audio(src)
    audio.volume = mutedRef.current ? 0 : volumeRef.current
    audio.muted  = mutedRef.current
    audioRef.current = audio

    const rawStart = Number(song.previewStart) || 0
    let effectiveBaseStart = rawStart

    const startTicking = () => {
      if (sessionTokenRef.current !== token || audioRef.current !== audio) return
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = setInterval(() => {
        if (!audioRef.current || sessionTokenRef.current !== token) return
        const played = Math.max(0, audioRef.current.currentTime - effectiveBaseStart)
        const capped = Math.min(PREVIEW_LIMIT_SEC, played)
        elapsedRef.current = capped
        setElapsed(capped)
        if (played >= PREVIEW_LIMIT_SEC) {
          finishPreview()
        }
      }, 80)
    }

    audio.onloadedmetadata = () => {
      if (sessionTokenRef.current !== token) return
      const dur = audio.duration
      if (dur && isFinite(dur)) {
        effectiveBaseStart = Math.min(rawStart, Math.max(0, dur - 0.5))
        audio.currentTime = Math.min(dur - 0.05, effectiveBaseStart + clampedStartElapsed)
      }
    }

    audio.onended = () => {
      if (sessionTokenRef.current !== token) return
      finishPreview()
    }

    audio.onerror = () => {
      if (sessionTokenRef.current !== token) return
      // If remote link fails, seamlessly fall back to soft music-box synth for 30s
      stopAllEngines()
      sessionTokenRef.current = token
      startSynthPreview(song, clampedStartElapsed)
    }

    audio.play()
      .then(() => {
        if (sessionTokenRef.current !== token) {
          audio.pause()
          return
        }
        startTicking()
      })
      .catch(() => {
        if (sessionTokenRef.current !== token) return
        stopAllEngines()
        sessionTokenRef.current = token
        startSynthPreview(song, clampedStartElapsed)
      })
  }, [finishPreview, resolveAudioSrc, startSynthPreview, stopAllEngines])

  useEffect(() => {
    playSongRef.current = playSongAtIndex
  }, [playSongAtIndex])

  // Stop preview if user turns background corner MusicPlayer back on
  useEffect(() => {
    const onBgMusic = () => {
      stopAllEngines()
      setIsPlaying(false)
    }
    window.addEventListener('background-music-play', onBgMusic)
    return () => {
      window.removeEventListener('background-music-play', onBgMusic)
      stopAllEngines()
    }
  }, [stopAllEngines])

  const handleTogglePlayPause = (idx = currentIdx) => {
    if (idx !== currentIdx) {
      playSongAtIndex(idx, 0)
      return
    }
    if (isPlaying) {
      stopAllEngines()
      setIsPlaying(false)
    } else {
      const resumeAt = elapsedRef.current >= PREVIEW_LIMIT_SEC ? 0 : elapsedRef.current
      playSongAtIndex(currentIdx, resumeAt)
    }
  }

  const handleRestartPreview = (idx) => {
    playSongAtIndex(idx, 0)
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const targetSec = pct * PREVIEW_LIMIT_SEC
    if (isPlaying) {
      playSongAtIndex(currentIdx, targetSec)
    } else {
      elapsedRef.current = targetSec
      setElapsed(targetSec)
    }
  }

  /* ── Add / Edit / Remove Song Handlers ─────────────────────────── */
  const openAddModal = () => {
    setEditingId(null)
    setPendingAudioFile(null)
    setFormState({
      title: '',
      artist: '',
      mood: 'Dedicated to Mahir ❤️',
      note: '',
      style: CARD_STYLES[songs.length % CARD_STYLES.length].id,
      previewStart: 0,
      audioUrl: '',
      coverUrl: '',
    })
    setModalOpen(true)
  }

  const openEditModal = (song) => {
    setEditingId(song.id)
    setPendingAudioFile(null)
    setFormState({
      title: song.title || '',
      artist: song.artist || '',
      mood: song.mood || '',
      note: song.note || '',
      style: song.style || 'vinyl',
      previewStart: song.previewStart || 0,
      audioUrl: song.audioUrl || '',
      coverUrl: song.coverUrl || '',
    })
    setModalOpen(true)
  }

  const handleSaveSong = async (e) => {
    e.preventDefault()
    const id = editingId || `song-${Date.now()}`
    const palette = BROTHER_SONGS_STARTER[songs.length % BROTHER_SONGS_STARTER.length]

    if (pendingAudioFile) {
      await idbSaveAudio(id, pendingAudioFile)
      const nextUrl = URL.createObjectURL(pendingAudioFile)
      setBlobUrls(prev => ({ ...prev, [id]: nextUrl }))
    }

    const cleanEntry = {
      id,
      title: formState.title.trim() || pendingAudioFile?.name.replace(/\.[^/.]+$/, '') || 'Our Song',
      artist: formState.artist.trim() || 'Puju & Mahir Playlist',
      mood: formState.mood.trim() || 'Sibling Vibes ✨',
      note: formState.note.trim() || 'Always reminds me of my Pagal Bhai 🤍',
      style: formState.style || 'vinyl',
      accent: palette.accent,
      bgGradient: palette.bgGradient,
      previewStart: Math.max(0, Number(formState.previewStart) || 0),
      audioUrl: formState.audioUrl.trim(),
      coverUrl: formState.coverUrl.trim(),
      synthPreset: palette.synthPreset,
    }

    setSongs(prev => {
      if (editingId) {
        return prev.map(s => (s.id === editingId ? { ...s, ...cleanEntry } : s))
      }
      return [...prev, cleanEntry]
    })

    setModalOpen(false)
    setPendingAudioFile(null)
  }

  const handleRemoveSong = async (idx) => {
    const target = songs[idx]
    if (!target) return
    if (idx === currentIdx) {
      stopAllEngines()
      setIsPlaying(false)
      setElapsed(0)
      elapsedRef.current = 0
    }
    try {
      await idbDeleteAudio(target.id)
    } catch {
      // Ignore if none stored
    }
    setSongs(prev => prev.filter((_, i) => i !== idx))
    if (currentIdx >= songs.length - 1) {
      setCurrentIdx(0)
    }
  }

  const handleResetDefaults = () => {
    stopAllEngines()
    setIsPlaying(false)
    setElapsed(0)
    elapsedRef.current = 0
    localStorage.removeItem(SONGS_META_KEY)
    setSongs(buildInitialSongs())
    setCurrentIdx(0)
  }

  const activeSong = songs[currentIdx] || songs[0] || null
  const remainingSec = Math.max(0, PREVIEW_LIMIT_SEC - elapsed)
  const progressPct  = Math.min(100, (elapsed / PREVIEW_LIMIT_SEC) * 100)

  return (
    <section id="brother-songs" className="bsongs-section section-padding">
      <div className="bsongs-deco" aria-hidden="true">
        <FloatingDecorations set="music" count={11} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65 }}
        >
          <span className="section-eyebrow">Playlist From Puju&apos;s Headphones 🎧</span>
          <h2>Brother Songs — Our 30-Second Mixtape</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">
            Every track plays an exact <strong>30-second preview</strong> — upload your own MP3s or tweak songs anytime without overlapping audio.
          </p>
        </motion.div>

        {/* Master 30-Second Preview Music Console */}
        {activeSong && (
          <motion.div
            className="bs-console glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bs-console__top">
              <div className="bs-console__now">
                <div className={`bs-console__disc ${isPlaying ? 'bs-spin-slow' : ''}`} style={{ background: activeSong.bgGradient }}>
                  <Music size={18} color={activeSong.accent || '#e86f9c'} />
                </div>
                <div className="bs-console__meta">
                  <div className="bs-console__badges">
                    <span className="bs-preview-pill">⏱️ 30s Preview Mode</span>
                    <span className="bs-source-pill">
                      {resolveAudioSrc(activeSong) ? '🎵 Custom Audio' : '🎹 Music-Box Preview'}
                    </span>
                  </div>
                  <h3 className="bs-console__title">{activeSong.title}</h3>
                  <p className="bs-console__artist">
                    {activeSong.artist} · <em>&ldquo;{activeSong.note}&rdquo;</em>
                  </p>
                </div>
              </div>

              <div className="bs-console__actions">
                <button type="button" className="btn-pastel bs-add-btn" onClick={openAddModal}>
                  <Plus size={15} /> Add Song
                </button>
                <button type="button" className="bs-icon-circle" onClick={handleResetDefaults} title="Restore starter songs">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* 30-Second Scrubber + Controls */}
            <div className="bs-console__player-row">
              <div className="bs-transport">
                <button
                  type="button"
                  className="bs-ctrl-btn"
                  onClick={() => playSongAtIndex(currentIdx - 1, 0)}
                  aria-label="Previous song"
                >
                  <SkipBack size={17} />
                </button>

                <button
                  type="button"
                  className="bs-play-main"
                  onClick={() => handleTogglePlayPause(currentIdx)}
                  aria-label={isPlaying ? 'Pause preview' : 'Play 30s preview'}
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>

                <button
                  type="button"
                  className="bs-ctrl-btn"
                  onClick={() => playSongAtIndex(currentIdx + 1, 0)}
                  aria-label="Next song"
                >
                  <SkipForward size={17} />
                </button>
              </div>

              <div className="bs-progress-area">
                <div className="bs-time-row">
                  <span>{formatSec(elapsed)}</span>
                  <span className="bs-rem-pill">
                    {isPlaying
                      ? `${Math.ceil(remainingSec)}s remaining in preview`
                      : elapsed > 0
                        ? `Paused · ${Math.ceil(remainingSec)}s left`
                        : 'Ready · 0:30 max preview'}
                  </span>
                  <span>0:30</span>
                </div>
                <div
                  className="bs-progress-track"
                  role="slider"
                  aria-label="30-second preview progress"
                  aria-valuemin={0}
                  aria-valuemax={30}
                  aria-valuenow={Math.round(elapsed)}
                  onClick={handleSeek}
                >
                  <div className="bs-progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              <div className="bs-volume-wrap">
                <button
                  type="button"
                  className="bs-ctrl-btn"
                  onClick={() => setMuted(v => !v)}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={muted ? 0 : volume}
                  onChange={e => { setMuted(false); setVolume(parseFloat(e.target.value)) }}
                  className="bs-vol-slider"
                  aria-label="Song preview volume"
                />
              </div>
            </div>

            {/* Playlist End Settings Bar */}
            <div className="bs-settings-row">
              <span className="bs-settings-label">When 30s preview finishes:</span>
              <div className="bs-end-pills">
                <button
                  type="button"
                  className={`bs-setting-pill ${endBehavior === 'next' ? 'bs-setting-pill--active' : ''}`}
                  onClick={() => setEndBehavior('next')}
                >
                  <SkipForward size={13} /> Auto-Next Song
                </button>
                <button
                  type="button"
                  className={`bs-setting-pill ${endBehavior === 'stop' ? 'bs-setting-pill--active' : ''}`}
                  onClick={() => setEndBehavior('stop')}
                >
                  <Square size={12} /> Stop Automatically
                </button>
                {endBehavior === 'next' && (
                  <button
                    type="button"
                    className={`bs-setting-pill ${loopPlaylist ? 'bs-setting-pill--active' : ''}`}
                    onClick={() => setLoopList(v => !v)}
                  >
                    <Repeat size={13} /> Loop Queue {loopPlaylist ? 'ON' : 'OFF'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Diverse Visual Song Cards Playlist Grid */}
        <div className="bs-grid">
          {songs.map((song, idx) => {
            const isSelected = idx === currentIdx
            const isCardPlaying = isSelected && isPlaying
            const coverSrc = resolveCoverSrc(song, idx)
            const hasRealAudio = Boolean(resolveAudioSrc(song))
            const cardProgress = isSelected ? progressPct : 0
            const cardRemaining = isSelected ? Math.ceil(remainingSec) : PREVIEW_LIMIT_SEC

            return (
              <motion.article
                key={song.id}
                className={`bs-card bs-card--${song.style || 'vinyl'} ${isSelected ? 'bs-card--active' : ''}`}
                style={{ '--song-bg': song.bgGradient, '--song-accent': song.accent }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.45, delay: (idx % 3) * 0.06 }}
                whileHover={{ y: -5 }}
              >
                <div className="bs-card__head">
                  <span className="bs-card__num">TRACK #{String(idx + 1).padStart(2, '0')}</span>
                  <div className="bs-card__head-actions">
                    <button
                      type="button"
                      className="bs-mini-icon"
                      onClick={() => openEditModal(song)}
                      title="Edit song / upload MP3"
                    >
                      <Edit2 size={13} />
                    </button>
                    {songs.length > 1 && (
                      <button
                        type="button"
                        className="bs-mini-icon bs-mini-icon--danger"
                        onClick={() => handleRemoveSong(idx)}
                        title="Remove song"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Distinct Artwork Style */}
                <SongCardArtwork song={song} isPlaying={isCardPlaying} coverPhoto={coverSrc} />

                <div className="bs-card__info">
                  <span className="bs-card__mood" style={{ color: song.accent }}>
                    {song.mood || 'Dedicated Song'}
                  </span>
                  <h4 className="bs-card__title">{song.title}</h4>
                  <p className="bs-card__artist">{song.artist}</p>
                  <p className="bs-card__note font-hand">&ldquo;{song.note}&rdquo;</p>
                </div>

                {/* Individual Song Controls & 30s Bar */}
                <div className="bs-card__controls">
                  <div className="bs-card__bar">
                    <div className="bs-card__bar-fill" style={{ width: `${cardProgress}%`, background: song.accent }} />
                  </div>
                  <div className="bs-card__btns">
                    <button
                      type="button"
                      className={`bs-card__play ${isCardPlaying ? 'bs-card__play--live' : ''}`}
                      style={{ background: song.accent }}
                      onClick={() => handleTogglePlayPause(idx)}
                    >
                      {isCardPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                      <span>{isCardPlaying ? 'Pause' : 'Play 30s'}</span>
                    </button>

                    <button
                      type="button"
                      className="bs-card__restart"
                      onClick={() => handleRestartPreview(idx)}
                      title="Restart 30s preview"
                    >
                      ↺ {cardRemaining}s
                    </button>

                    {!hasRealAudio && (
                      <button
                        type="button"
                        className="bs-card__attach"
                        onClick={() => openEditModal(song)}
                        title="Upload MP3 for this track"
                      >
                        <Upload size={12} /> MP3
                      </button>
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}

          {/* Add New Song Card Slot */}
          <motion.button
            type="button"
            className="bs-card bs-card--add"
            onClick={openAddModal}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="bs-add-circle"><Plus size={26} /></span>
            <h4 className="font-serif">Add a Song for Mahir</h4>
            <p>Upload any MP3 / audio clip or paste a URL — plays a clean 30s preview</p>
          </motion.button>
        </div>
      </div>

      {/* Add / Edit Song Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.form
              className="bs-modal glass-card"
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              onClick={e => e.stopPropagation()}
              onSubmit={handleSaveSong}
            >
              <h3>{editingId ? 'Edit Brother Song 🎵' : 'Add Song to Playlist ✨'}</h3>

              <label className="bs-field">
                <span>Song Title *</span>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={e => setFormState(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Tera Yaar Hoon Main"
                />
              </label>

              <div className="bs-field-row">
                <label className="bs-field">
                  <span>Artist / Vibe</span>
                  <input
                    type="text"
                    value={formState.artist}
                    onChange={e => setFormState(f => ({ ...f, artist: e.target.value }))}
                    placeholder="e.g. Arijit Singh"
                  />
                </label>
                <label className="bs-field">
                  <span>Visual Card Style</span>
                  <select
                    value={formState.style}
                    onChange={e => setFormState(f => ({ ...f, style: e.target.value }))}
                  >
                    {CARD_STYLES.map(cs => (
                      <option key={cs.id} value={cs.id}>{cs.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="bs-field-row">
                <label className="bs-field">
                  <span>Upload Audio (.mp3/.m4a/.wav)</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={e => setPendingAudioFile(e.target.files?.[0] || null)}
                  />
                  {pendingAudioFile && <small className="bs-file-ok">Selected: {pendingAudioFile.name}</small>}
                </label>
                <label className="bs-field">
                  <span>Preview Start (seconds)</span>
                  <input
                    type="number"
                    min={0}
                    max={600}
                    value={formState.previewStart}
                    onChange={e => setFormState(f => ({ ...f, previewStart: e.target.value }))}
                  />
                </label>
              </div>

              <label className="bs-field">
                <span>Or Audio URL (optional)</span>
                <input
                  type="url"
                  value={formState.audioUrl}
                  onChange={e => setFormState(f => ({ ...f, audioUrl: e.target.value }))}
                  placeholder="https://...mp3"
                />
              </label>

              {availablePhotos.length > 0 && (
                <label className="bs-field">
                  <span>Cover Photo (optional — from your memories)</span>
                  <select
                    value={formState.coverUrl}
                    onChange={e => setFormState(f => ({ ...f, coverUrl: e.target.value }))}
                  >
                    <option value="">Auto-pick from memories ✨</option>
                    {availablePhotos.map((p, i) => (
                      <option key={p.id} value={p.url}>
                        {p.caption || p.name || `Photo #${i + 1}`}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="bs-field">
                <span>Why it reminds me of Mahir (Note)</span>
                <textarea
                  rows={2}
                  value={formState.note}
                  onChange={e => setFormState(f => ({ ...f, note: e.target.value }))}
                  placeholder="Write what memory or inside joke this song brings back..."
                />
              </label>

              <div className="bs-modal__actions">
                <button type="button" className="btn-pastel" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-cinematic">Save Song ✨</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
