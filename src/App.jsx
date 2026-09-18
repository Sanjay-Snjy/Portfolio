import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Scene3D from './components/Scene3D'
import NavBar from './components/NavBar'
import NotesPanel from './components/NotesPanel'
import SocialBar from './components/SocialBar'
import Controls from './components/Controls'
import Home from './components/Home'
import CursorOrb from './components/CursorOrb'
import LandingScreen from './components/LandingScreen'
import ZoomSlider from './components/ZoomSlider'
import { TiltProvider, TiltLayer } from './components/TiltContext'
import { education } from './data/content'
import { MousePointer2 } from 'lucide-react'
import './App.css'

/* Home is the default view, so it stays in the initial chunk. The other, much
   heavier views are split out. The loaders are hoisted so the same import can
   be kicked off from the enter click, a nav hover, or the idle prefetch —
   the module promise is cached, so repeat calls are free and Suspense never
   flashes a second time. */
const loadProjectCards = () => import('./components/ProjectCards')
const loadTechStack = () => import('./components/TechStack')
const loadContactSection = () => import('./components/ContactSection')

const prefetchDeferredSections = () => {
  loadProjectCards()
  loadTechStack()
  loadContactSection()
}

const ProjectCards = lazy(loadProjectCards)
const TechStack = lazy(loadTechStack)
const ContactSection = lazy(loadContactSection)

const sections = ['Home', 'Projects', 'Skillset', 'Contact']

/* ── Inner app that consumes TiltContext ── */
function AppInner() {
  const [activeSection, setActiveSection] = useState('Home')
  const [activeTechId, setActiveTechId] = useState(null)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [showNotes, setShowNotes] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [entered, setEntered] = useState(false)
  const [zoom, setZoom] = useState(0.88)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  /* Stable identities so the memoised panels below can skip re-rendering. */
  const handleNavigate = useCallback((s) => {
    setActiveSection(s)
    setActiveTechId(null)
  }, [])

  const handleCloseNotes = useCallback(() => setShowNotes(false), [])

  /* Entering the HUD is the earliest signal of intent — start pulling the
     deferred chunks right then, rather than waiting for idle. */
  const handleEnter = useCallback(() => {
    setEntered(true)
    prefetchDeferredSections()
  }, [])

  /* Hovering/focusing a nav item means the user is about to click it. */
  const handleNavPrefetch = useCallback(() => prefetchDeferredSections(), [])

  /* Belt and suspenders: pull the deferred section chunks in once the main
     thread is free anyway, so the first paint is never gated on them. */
  useEffect(() => {
    const prefetch = () => prefetchDeferredSections()
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 2500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(prefetch, 1500)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="app" style={{ cursor: 'none' }}>
      {/* Custom Cursor */}
      <CursorOrb />

      {/* 3D Background — always visible */}
      <div className="scene-container">
        <Scene3D />
      </div>

      {/* Landing Screen — transparent, just the icon */}
      {!entered && <LandingScreen onEnter={handleEnter} />}

      {/* Top right controls — always visible; back button only after entering */}
      <div className="top-controls">
        <Controls
          showBack={entered}
          onBack={() => setEntered(false)}
          onFullscreen={toggleFullscreen}
        />
      </div>

      {/* Zoom slider — fixed bottom right, not affected by zoom */}
      <div className="zoom-slider-container" style={{ opacity: entered ? 1 : 0, pointerEvents: entered ? 'auto' : 'none', transition: 'opacity 0.35s' }}>
        <ZoomSlider zoom={zoom} onZoom={setZoom} />
      </div>

      {/* HUD overlay — zoom + tilt on scroll.
          The enter/exit fade deliberately lives on the panels themselves (via
          .is-entered) rather than as an opacity on this container: an ancestor
          with opacity < 1 becomes a backdrop root, which would leave the glass
          panels with nothing behind them to blur for the whole fade. */}
      <div
        className={`hud-overlay${entered ? ' is-entered' : ''}`}
        style={{
          transform: `scale(${zoom})`,
          transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >

        {/* Main content area */}
        <div className="content-layout">
          {/* ── Left Nav ── tilt inward based on zoom ── */}
          <div className="nav-wrapper">
          <TiltLayer
            baseRotateY={Math.max(0, 4 + (zoom - 0.88) * 35)}
            baseRotateX={-1}
            mouseInfluence={0.15}
            depth={1}
            perspective={1000}
            glass="light"
          >
            <NavBar
              sections={sections}
              active={activeSection}
              onNavigate={handleNavigate}
              onPrefetch={handleNavPrefetch}
            />
          </TiltLayer>
          </div>

          {/* ── Center Content ── (no tilt — stays flat) */}
          <div className="center-content glass-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="center-inner"
              >
                {/* The Suspense boundary sits *inside* the presence child on
                    purpose. Wrapping AnimatePresence instead meant a lazy
                    section suspended the swap itself: the previous section
                    stayed on screen with no feedback until the chunk landed.
                    Here the animated element always mounts, and the fallback
                    (which reserves the panel's height, so it can't collapse
                    into a thin strip) shows a spinner while it loads. */}
                <Suspense
                  fallback={
                    <div className="section-fallback">
                      <span className="section-fallback__spinner" />
                    </div>
                  }
                >
                {activeSection === 'Home' && (
                  <div className="home-view">
                    <Home />
                  </div>
                )}
                {activeSection === 'Projects' && (
                  <div className="projects-view" style={{ padding: 16 }}>
                    <ProjectCards expanded onHoverProject={setHoveredProject} />
                  </div>
                )}
                {activeSection === 'Skillset' && (
                  <div className="personal-view">
                    <TechStack activeId={activeTechId} setActiveId={setActiveTechId} zoom={zoom} />
                  </div>
                )}
                {activeSection === 'Education' && (
                  <div className="education-view">
                    <div className="education-header">
                      <span className="education-eyebrow">Where I studied</span>
                      <h2 className="education-title">Education</h2>
                    </div>
                    <div className="education-list">
                      {education.map((ed) => (
                        <div key={ed.id} className="education-item">
                          <span className="education-dot" />
                          <div>
                            <h4 className="education-degree">{ed.degree}</h4>
                            <p className="education-inst">{ed.institution}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeSection === 'Contact' && <ContactSection />}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right Notes Panel ── */}
          <div className="notes-wrapper">
          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <TiltLayer
                  baseRotateY={-Math.max(0, 4 + (zoom - 0.88) * 35)}
                  baseRotateX={-1}
                  mouseInfluence={0.15}
                  depth={1}
                  perspective={1000}
                  glass="light"
                >
                  <NotesPanel
                    onClose={handleCloseNotes}
                    activeTech={activeTechId}
                    activeSection={activeSection}
                    hoveredProject={hoveredProject}
                  />
                </TiltLayer>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>

        {/* ── Bottom Social Bar ── */}
        <div className="social-bar-container">
          <TiltLayer
            baseRotateY={0}
            baseRotateX={-2}
            mouseInfluence={0.1}
            depth={3}
          >
            <SocialBar />
          </TiltLayer>
        </div>

        {/* Focus hint — decorative, only meaningful once inside the HUD */}
        {entered && (
          <motion.div
            className="focus-hint"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <MousePointer2 size={16} style={{ marginRight: 8, opacity: 0.7 }} />
          </motion.div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <TiltProvider>
      <AppInner />
    </TiltProvider>
  )
}

export default App
