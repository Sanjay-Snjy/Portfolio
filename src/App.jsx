import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Scene3D from './components/Scene3D'
import NavBar from './components/NavBar'
import ProjectCards from './components/ProjectCards'
import TechStack from './components/TechStack'
import NotesPanel from './components/NotesPanel'
import SocialBar from './components/SocialBar'
import Controls from './components/Controls'
import ProfileCard from './components/ProfileCard'
import ContactSection from './components/ContactSection'
import CursorOrb from './components/CursorOrb'
import LandingScreen from './components/LandingScreen'
import ZoomSlider from './components/ZoomSlider'
import { TiltProvider, TiltLayer } from './components/TiltContext'
import { education } from './data/content'
import { MousePointer2 } from 'lucide-react'
import './App.css'

const sections = ['Home', 'Projects', 'Tech Stack', 'Education', 'Contact']

/* ── Inner app that consumes TiltContext ── */
function AppInner() {
  const [activeSection, setActiveSection] = useState('Home')
  const [activeTechId, setActiveTechId] = useState(null)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [showNotes, setShowNotes] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [entered, setEntered] = useState(false)
  const [zoom, setZoom] = useState(0.88)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="app" style={{ cursor: 'none' }}>
      {/* Custom Cursor */}
      <CursorOrb />

      {/* 3D Background — always visible */}
      <div className="scene-container">
        <Scene3D />
      </div>

      {/* Landing Screen — transparent, just the icon */}
      {!entered && <LandingScreen onEnter={() => setEntered(true)} />}

      {/* Top right controls — fixed, not affected by zoom */}
      <div className="top-controls" style={{ opacity: entered ? 1 : 0, transition: 'opacity 0.35s' }}>
        <Controls
          onBack={() => setEntered(false)}
          onFullscreen={toggleFullscreen}
        />
      </div>

      {/* Zoom slider — fixed bottom right, not affected by zoom */}
      <div className="zoom-slider-container" style={{ opacity: entered ? 1 : 0, pointerEvents: entered ? 'auto' : 'none', transition: 'opacity 0.35s' }}>
        <ZoomSlider zoom={zoom} onZoom={setZoom} />
      </div>

      {/* HUD overlay — zoom + tilt on scroll */}
      <div
        className="hud-overlay"
        style={{
          opacity: entered ? 1 : 0,
          transform: `scale(${zoom})`,
          transition: 'opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1), transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >

        {/* Main content area */}
        <div className="content-layout">
          {/* ── Left Nav ── tilt inward based on zoom ── */}
          <TiltLayer
            baseRotateY={Math.max(0, 4 + (zoom - 0.88) * 35)}
            baseRotateX={-1}
            mouseInfluence={0.15}
            depth={1}
            perspective={1000}
            glass="dark"
          >
            <NavBar
              sections={sections}
              active={activeSection}
              onNavigate={(s) => { setActiveSection(s); setActiveTechId(null) }}
            />
          </TiltLayer>

          {/* ── Center Content ── (no tilt — stays flat) */}
          <div className="center-content glass-panel-dark">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="center-inner"
              >
                {activeSection === 'Home' && (
                  <div className="home-view">
                    <ProfileCard />
                  </div>
                )}
                {activeSection === 'Projects' && (
                  <div className="projects-view" style={{ padding: 16 }}>
                    <ProjectCards expanded onHoverProject={setHoveredProject} />
                  </div>
                )}
                {activeSection === 'Tech Stack' && (
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right Notes Panel ── */}
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
                  glass="dark"
                >
                  <NotesPanel
                    onClose={() => setShowNotes(false)}
                    activeTech={activeTechId}
                    activeSection={activeSection}
                    hoveredProject={hoveredProject}
                  />
                </TiltLayer>
              </motion.div>
            )}
          </AnimatePresence>
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

        {/* Focus hint */}
        <motion.div
          className="focus-hint"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <MousePointer2 size={16} style={{ marginRight: 8, opacity: 0.7 }} />
        </motion.div>
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
