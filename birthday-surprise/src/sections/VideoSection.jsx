import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Film, SkipForward, SkipBack } from 'lucide-react'
import { VIDEOS, SECTION_COPY } from '../data/content'
import { useMedia } from '../context/MediaContext'
import SectionDropZone from '../components/SectionDropZone'
import FloatingDecorations from '../components/FloatingDecorations'
import '../styles/videos.css'
import '../styles/dropzone.css'

function VideoThumb({ video, index, onClick, isMediaItem }) {
  return (
    <motion.div
      className="video-thumb"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(video)}
    >
      <div className="video-thumb__media-wrap">
        {video.thumbnail || (isMediaItem && video.type === 'photo') ? (
          <img src={video.thumbnail || video.url} alt={video.caption} className="video-thumb__img" />
        ) : video.url || video.src ? (
          <video src={video.url || video.src} className="video-thumb__img" muted />
        ) : (
          <div className="video-thumb__placeholder">
            <span>{video.placeholder || '🎬'}</span>
            <p className="video-thumb__placeholder-hint">
              Drop a video clip here or upload in Manage Memories
            </p>
          </div>
        )}

        <div className="video-thumb__overlay">
          <div className="video-thumb__play">
            <Play size={22} fill="currentColor" />
          </div>
        </div>
      </div>

      <div className="video-thumb__meta">
        {video.title && <p className="video-thumb__title">{video.title}</p>}
        <p className="video-thumb__caption font-hand">{video.caption || video.name}</p>
        {video.date && <p className="video-thumb__date">{video.date}</p>}
      </div>
    </motion.div>
  )
}

export default function VideoSection() {
  const { getSection } = useMedia()
  const uploadedVideos = getSection('videos')
  const galleryFallback = getSection('gallery')
  const [activeVideo, setActiveVideo] = useState(null)
  const [montageOpen, setMontageOpen] = useState(false)
  const [montageIdx, setMontageIdx]   = useState(0)
  const [montagePlay, setMontagePlay] = useState(true)

  const playableItems = useMemo(() => {
    const statics = VIDEOS.filter(v => v.src).map(v => ({ ...v, url: v.src, type: 'video' }))
    if (uploadedVideos.length > 0 || statics.length > 0) {
      return [...uploadedVideos, ...statics]
    }
    return galleryFallback
  }, [uploadedVideos, galleryFallback])

  // Auto-advance photo slides in Memory Montage when playing
  useEffect(() => {
    if (!montageOpen || !montagePlay || playableItems.length <= 1) return
    const current = playableItems[montageIdx]
    if (current?.type === 'video') return // video advances onEnded
    const timer = setTimeout(() => {
      setMontageIdx(i => (i + 1) % playableItems.length)
    }, 3400)
    return () => clearTimeout(timer)
  }, [montageOpen, montagePlay, montageIdx, playableItems])

  const handleOpen = (video) => {
    const src = video.src || video.url
    if (!src) return
    setActiveVideo({ ...video, src })
  }

  const displayList = uploadedVideos.length > 0 || VIDEOS.some(v => v.src)
    ? [...uploadedVideos, ...VIDEOS.filter(v => v.src)]
    : VIDEOS

  return (
    <section id="videos" className="video-section section-padding">
      <div className="video-deco" aria-hidden="true">
        <FloatingDecorations set="gold" count={8} />
      </div>

      <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-eyebrow">{SECTION_COPY.videos.eyebrow}</span>
          <h2>{SECTION_COPY.videos.title}</h2>
          <div className="divider-glow" />
          <p className="section-subtitle">{SECTION_COPY.videos.subtitle}</p>
        </motion.div>

        {playableItems.length > 0 && (
          <div className="video-montage-trigger-wrap">
            <button
              type="button"
              className="btn-cinematic"
              onClick={() => {
                setMontageIdx(0)
                setMontagePlay(true)
                setMontageOpen(true)
              }}
            >
              <Film size={17} /> Play Memory Montage ({playableItems.length})
            </button>
          </div>
        )}

        <SectionDropZone sectionId="videos" label="Video Madness">
          <div className="video-grid">
            {displayList.map((item, i) => (
              <VideoThumb
                key={item.id}
                video={item}
                index={i}
                onClick={handleOpen}
                isMediaItem={Boolean(item.url)}
              />
            ))}
          </div>
        </SectionDropZone>
      </div>

      {/* Single Video/Photo Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div className="video-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
          >
            <motion.div className="video-modal__inner"
              initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              {activeVideo.type === 'photo' ? (
                <img src={activeVideo.src} alt={activeVideo.caption} className="video-modal__player" />
              ) : (
                <video src={activeVideo.src} controls autoPlay className="video-modal__player" />
              )}
              <div className="video-modal__meta">
                <p className="font-hand">{activeVideo.caption || activeVideo.title || activeVideo.name}</p>
              </div>
              <button type="button" className="lightbox__close" onClick={() => setActiveVideo(null)}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory Montage Slideshow Player */}
      <AnimatePresence>
        {montageOpen && playableItems[montageIdx] && (
          <motion.div
            className="video-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMontageOpen(false)}
          >
            <motion.div
              className="video-modal__inner"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="montage-stage">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={playableItems[montageIdx].id}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55 }}
                    className="montage-frame"
                  >
                    {playableItems[montageIdx].type === 'video' ? (
                      <video
                        src={playableItems[montageIdx].url || playableItems[montageIdx].src}
                        controls
                        autoPlay={montagePlay}
                        onEnded={() => setMontageIdx(i => (i + 1) % playableItems.length)}
                        className="video-modal__player"
                      />
                    ) : (
                      <img
                        src={playableItems[montageIdx].url || playableItems[montageIdx].src}
                        alt={playableItems[montageIdx].caption}
                        className="video-modal__player"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="montage-controls">
                <p className="font-hand montage-caption">
                  {playableItems[montageIdx].caption || playableItems[montageIdx].name}
                </p>
                <div className="montage-btns">
                  <button
                    type="button"
                    className="btn-pastel"
                    onClick={() => setMontageIdx(i => (i - 1 + playableItems.length) % playableItems.length)}
                    aria-label="Previous clip"
                  >
                    <SkipBack size={15} />
                  </button>
                  <button
                    type="button"
                    className="btn-pastel"
                    onClick={() => setMontagePlay(v => !v)}
                    aria-label={montagePlay ? 'Pause' : 'Play'}
                  >
                    {montagePlay ? <Pause size={15} /> : <Play size={15} />}
                  </button>
                  <button
                    type="button"
                    className="btn-pastel"
                    onClick={() => setMontageIdx(i => (i + 1) % playableItems.length)}
                    aria-label="Next clip"
                  >
                    <SkipForward size={15} />
                  </button>
                  <span className="montage-counter">{montageIdx + 1} / {playableItems.length}</span>
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
