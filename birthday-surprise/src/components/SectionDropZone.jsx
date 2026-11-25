/**
 * SectionDropZone — Accepts both OS file drops (photos/videos from device)
 * AND internal media items dragged from MediaManager.
 * Also displays a subtle touch-friendly quick upload button for mobile devices.
 */
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud } from 'lucide-react'
import { useMedia } from '../context/MediaContext'

export default function SectionDropZone({
  sectionId,
  children,
  className = '',
  label = 'this section',
  showQuickAdd = true,
}) {
  const { assignToSection, addFiles, draggedMediaId, setDraggedMediaId } = useMedia()
  const [draggingOver, setDraggingOver] = useState(false)
  const [justDropped, setJustDropped]   = useState(false)
  const fileInputRef = useRef(null)

  const flashSuccess = useCallback(() => {
    setJustDropped(true)
    setTimeout(() => setJustDropped(false), 1800)
  }, [])

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingOver(false)

    // 1. Check if dragged from internal MediaManager library
    const internalId = e.dataTransfer?.getData('application/x-birthday-media') || draggedMediaId
    if (internalId && (!e.dataTransfer?.files || e.dataTransfer.files.length === 0)) {
      assignToSection(internalId, sectionId)
      setDraggedMediaId(null)
      flashSuccess()
      return
    }

    // 2. Otherwise check OS files dropped directly from laptop/phone
    const files = e.dataTransfer?.files
    if (files?.length) {
      await addFiles(files, sectionId)
      flashSuccess()
    }
  }, [addFiles, assignToSection, draggedMediaId, flashSuccess, sectionId, setDraggedMediaId])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    if (!draggingOver) setDraggingOver(true)
  }, [draggingOver])

  const handleDragLeave = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggingOver(false)
    }
  }, [])

  const handleQuickUpload = async (e) => {
    if (!e.target.files?.length) return
    await addFiles(e.target.files, sectionId)
    flashSuccess()
    e.target.value = ''
  }

  return (
    <div
      className={`section-drop-zone ${draggingOver ? 'section-drop-zone--active' : ''} ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {children}

      {showQuickAdd && (
        <div className="section-drop-zone__toolbar">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleQuickUpload}
          />
          <button
            type="button"
            className="section-drop-zone__add-btn"
            onClick={() => fileInputRef.current?.click()}
            title={`Add photos or videos directly to ${label}`}
          >
            <UploadCloud size={15} />
            <span>Drop or add photo/video to {label}</span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {draggingOver && (
          <motion.div
            className="section-drop-zone__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="section-drop-zone__badge">
              <span>✨</span>
              <p>Drop right here to add to {label} 📸</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {justDropped && (
          <motion.div
            className="section-drop-zone__toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            Added to {label}! 💖
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
