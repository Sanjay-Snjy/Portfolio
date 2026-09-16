import { useState, useEffect, useCallback, useRef } from 'react'
import { playSound } from '../sounds'
import { motion, AnimatePresence } from 'framer-motion'
import { enableGyro } from '../gyro'

export default function LandingScreen({ onEnter }) {
  const [exiting, setExiting] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  /* ── Cursor-following 3D tilt ── */
  const onMouseMove = useCallback((e) => {
    const { innerWidth, innerHeight } = window
    targetRef.current.x = (e.clientX / innerWidth - 0.5) * 2
    targetRef.current.y = (e.clientY / innerHeight - 0.5) * 2
  }, [])

  useEffect(() => {
    if (exiting) return
    window.addEventListener('mousemove', onMouseMove)
    const animate = () => {
      const lerp = 0.06
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp
      setTilt({ x: currentRef.current.x, y: currentRef.current.y })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [exiting, onMouseMove])

  const handleClick = () => {
    playSound('landing')
    enableGyro() // iOS needs this user gesture to grant motion sensors — no-op elsewhere
    setExiting(true)
    setTimeout(() => onEnter(), 700)
  }

  const rotateY = tilt.x * 8
  const rotateX = -tilt.y * 5

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          className="landing-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="landing-btn-area"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="landing-glow-1" />

            <motion.button
              className="landing-btn glass-panel-dark"
              onClick={handleClick}
              style={{
                transform: `perspective(800px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/profile.jpeg" alt="Profile" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
              <span>Portfolio</span>
            </motion.button>

            <div className="landing-hint">Click to enter</div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="landing-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ pointerEvents: 'none' }}
        >
          <motion.div
            className="landing-exit-glow"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.5, 3, 5] }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />

          <motion.div
            className="landing-btn-area"
            animate={{
              scale: [1, 1.15, 1.8, 40],
              rotateY: [0, 8, -5, 0],
              rotateX: [0, -4, 3, 0],
              opacity: [1, 1, 0.8, 0],
            }}
            transition={{
              duration: 0.7,
              ease: [0.23, 1, 0.32, 1],
              times: [0, 0.25, 0.55, 1],
            }}
          >
            <div className="landing-glow-1" />
            <motion.button className="landing-btn glass-panel-dark">
              Portfolio
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
