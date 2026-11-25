import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { SITE_CONFIG } from '../data/content'
import '../styles/nav.css'

const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'Our Story',    href: '#story' },
  { label: 'Brother.exe',  href: '#brother-exe' },
  { label: 'Songs 🎵',     href: '#brother-songs' },
  { label: 'Polaroids',    href: '#gallery' },
  { label: 'Memories 🎞️',  href: '#our-memories' },
  { label: 'Album',        href: '#album' },
  { label: 'Tom & Jerry',  href: '#tom-and-jerry' },
  { label: 'Chaos 😂',     href: '#sibling-chaos' },
  { label: 'Reminds Me',   href: '#reminds-me' },
  { label: 'Fights',       href: '#fights' },
  { label: 'Care & Rules', href: '#care-hub' },
  { label: 'Rishta',       href: '#rishta' },
  { label: 'Chapters',     href: '#chapters' },
  { label: 'Promises',     href: '#puju-corner' },
  { label: 'Wishes',       href: '#wishes' },
  { label: 'Teddy',        href: '#teddy' },
  { label: 'Letter',       href: '#letter' },
  { label: 'Cake',         href: '#birthday' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const observerRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.slice(1))
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { threshold: 0.25 }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observerRef.current.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  const handleNavClick = (href) => {
    setMobileOpen(false)
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      {/* Pastel scroll progress ribbon */}
      <motion.div className="nav__progress" style={{ scaleX }} />

      <div className="nav__inner">
        <motion.a
          className="nav__logo"
          href="#countdown"
          onClick={e => { e.preventDefault(); handleNavClick('#home') }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="nav__logo-icon">🎂</span>
          <span className="nav__logo-text">{SITE_CONFIG.brotherName}&apos;s World</span>
        </motion.a>

        {/* Desktop links */}
        <ul className="nav__links">
          {NAV_LINKS.map((link, i) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.2 }}
            >
              <a
                className={`nav__link ${activeSection === link.href.slice(1) ? 'nav__link--active' : ''}`}
                href={link.href}
                onClick={e => { e.preventDefault(); handleNavClick(link.href) }}
              >
                {link.label}
              </a>
            </motion.li>
          ))}
        </ul>

        {/* Mobile burger */}
        <button
          type="button"
          className={`nav__burger ${mobileOpen ? 'nav__burger--open' : ''}`}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav__mobile"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                className={`nav__mobile-link ${activeSection === link.href.slice(1) ? 'nav__mobile-link--active' : ''}`}
                href={link.href}
                onClick={e => { e.preventDefault(); handleNavClick(link.href) }}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
