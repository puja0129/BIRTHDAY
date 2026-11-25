import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE_CONFIG } from './data/content'
import { MediaProvider } from './context/MediaContext'

// Sections
import HeroSection           from './sections/HeroSection'
import CountdownSection      from './sections/CountdownSection'
import TimelineSection       from './sections/TimelineSection'
import BrotherExeSection     from './sections/BrotherExeSection'
import MemoryUniverseSection from './sections/MemoryUniverseSection'
import BrotherSongsSection   from './sections/BrotherSongsSection'
import GallerySection        from './sections/GallerySection'
import OurMemoriesSection    from './sections/OurMemoriesSection'
import PhotoAlbumSection     from './sections/PhotoAlbumSection'
import VideoSection          from './sections/VideoSection'
import TomJerrySection       from './sections/TomJerrySection'
import FightsSection         from './sections/FightsSection'
import SiblingChaosSection   from './sections/SiblingChaosSection'
import RemindsMeSection      from './sections/RemindsMeSection'
import CareHubSection        from './sections/CareHubSection'
import BondSection           from './sections/BondSection'
import YeKaisaRishtaSection  from './sections/YeKaisaRishtaSection'
import ChaptersSection       from './sections/ChaptersSection'
import PujuCornerSection     from './sections/PujuCornerSection'
import WishesSection         from './sections/WishesSection'
import TeddySection          from './sections/TeddySection'
import LetterSection         from './sections/LetterSection'
import BirthdaySection       from './sections/BirthdaySection'

// Components
import Navigation     from './components/Navigation'
import MusicPlayer    from './components/MusicPlayer'
import Footer         from './components/Footer'
import MediaManager   from './components/MediaManager'
import PasswordScreen from './sections/PasswordScreen'

import './styles/musicPlayer.css'
import './styles/mediaManager.css'

function AppInner() {
  const [unlocked, setUnlocked]         = useState(!SITE_CONFIG.passwordEnabled)
  const [entered, setEntered]           = useState(false)
  const [showMediaMgr, setShowMediaMgr] = useState(false)

  const handleEnter = () => {
    setEntered(true)
    setTimeout(() => {
      document.getElementById('countdown')?.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  if (!unlocked) {
    return (
      <AnimatePresence>
        <PasswordScreen onUnlock={() => setUnlocked(true)} />
      </AnimatePresence>
    )
  }

  return (
    <>
      {entered && <Navigation />}
      {entered && <MusicPlayer />}

      {/* Floating Manage Memories studio button (revealed once inside) */}
      {entered && (
        <motion.button
          type="button"
          className="media-trigger-btn"
          onClick={() => setShowMediaMgr(true)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
        >
          🎨 Manage Memories
        </motion.button>
      )}

      <main>
        <HeroSection onEnter={handleEnter} hasEntered={entered} />

        {entered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75 }}
          >
            <CountdownSection />
            <TimelineSection />
            <BrotherExeSection />
            <MemoryUniverseSection />
            <BrotherSongsSection />
            <GallerySection />
            <OurMemoriesSection />
            <PhotoAlbumSection />
            <VideoSection />
            <TomJerrySection />
            <FightsSection />
            <SiblingChaosSection />
            <RemindsMeSection />
            <CareHubSection />
            <BondSection />
            <YeKaisaRishtaSection />
            <ChaptersSection />
            <PujuCornerSection />
            <WishesSection />
            <TeddySection />
            <LetterSection />
            <BirthdaySection />
            <Footer />
          </motion.div>
        )}
      </main>

      {/* Memory & Scrapbook Studio */}
      <AnimatePresence>
        {showMediaMgr && (
          <MediaManager onClose={() => setShowMediaMgr(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <MediaProvider>
      <AppInner />
    </MediaProvider>
  )
}
