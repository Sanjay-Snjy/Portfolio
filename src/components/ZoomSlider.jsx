import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { playSound } from '../sounds'
import { Plus, Minus } from 'lucide-react'

const MIN = 0.4
const MAX = 1.15
const STEPS = 100
/* Track is a fixed 160px tall, bottom-anchored bar. */
const TRACK_H = 160

function toPercent(z) {
  return ((z - MIN) / (MAX - MIN)) * 100
}

export default function ZoomSlider({ zoom, onZoom }) {
  const trackRef = useRef(null)
  const rectRef = useRef(null)
  const pendingYRef = useRef(null)
  const rafRef = useRef(0)
  const [dragging, setDragging] = useState(false)

  const commit = useCallback(
    (clientY) => {
      pendingYRef.current = clientY
      /* At most one zoom update per frame. A raw pointermove stream in React
         state used to re-render the whole app on every single event. */
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        const y = pendingYRef.current
        const rect = rectRef.current
        if (y == null || !rect || !rect.height) return
        const ratio = 1 - (y - rect.top) / rect.height
        const clamped = Math.min(1, Math.max(0, ratio))
        onZoom(MIN + clamped * (MAX - MIN))
      })
    },
    [onZoom],
  )

  const beginDrag = useCallback(
    (clientY) => {
      if (trackRef.current) rectRef.current = trackRef.current.getBoundingClientRect()
      setDragging(true)
      commit(clientY)
    },
    [commit],
  )

  /* While dragging, listen on window so the cursor can leave the track */
  useEffect(() => {
    if (!dragging) return undefined
    const onMove = (e) => commit(e.clientY)
    const onUp = () => setDragging(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging, commit])

  /* The track is fixed to the viewport corner; only a resize can move it. */
  useEffect(() => {
    const remeasure = () => {
      if (dragging && trackRef.current) {
        rectRef.current = trackRef.current.getBoundingClientRect()
      }
    }
    window.addEventListener('resize', remeasure)
    return () => window.removeEventListener('resize', remeasure)
  }, [dragging])

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  /* Keyboard accessibility */
  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault()
      playSound('zoom')
      onZoom(Math.min(MAX, zoom + (MAX - MIN) / STEPS))
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault()
      playSound('zoom')
      onZoom(Math.max(MIN, zoom - (MAX - MIN) / STEPS))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onZoom(MIN)
    } else if (e.key === 'End') {
      e.preventDefault()
      onZoom(MAX)
    }
  }

  const pct = toPercent(zoom)

  return (
    <div style={styles.wrapper}>
      <motion.button
        style={{ ...styles.btn, opacity: zoom >= MAX ? 0.35 : 1 }}
        onClick={() => { playSound('zoom'); onZoom(Math.min(MAX, zoom + (MAX - MIN) / STEPS)) }}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.9)' }}
        whileTap={{ scale: 0.9 }}
        title="Zoom in"
      >
        <Plus size={14} />
      </motion.button>

      <div
        ref={trackRef}
        role="slider"
        aria-label="Zoom"
        aria-valuemin={Math.round(MIN * 100)}
        aria-valuemax={Math.round(MAX * 100)}
        aria-valuenow={Math.round(zoom * 100)}
        aria-orientation="vertical"
        tabIndex={0}
        onPointerDown={(e) => {
          e.preventDefault()
          beginDrag(e.clientY)
        }}
        onKeyDown={onKeyDown}
        style={{
          ...styles.track,
          boxShadow: dragging
            ? '0 0 0 2px rgba(10, 132, 255, 0.32), 0 8px 24px rgba(0,0,0,0.25)'
            : '0 2px 10px rgba(0,0,0,0.18)',
        }}
      >
        {/* Filled portion — height is fixed and scaled, so no layout runs */}
        <div style={{ ...styles.fill, transform: `scaleY(${pct / 100})` }} />

        {/* Draggable thumb — positioned purely by transform */}
        <div
          style={{
            ...styles.thumb,
            transform: `translate(-50%, 50%) translateY(${-(pct / 100) * TRACK_H}px)`,
          }}
        />
      </div>

      <motion.button
        style={{ ...styles.btn, opacity: zoom <= MIN ? 0.35 : 1 }}
        onClick={() => { playSound('zoom'); onZoom(Math.max(MIN, zoom - (MAX - MIN) / STEPS)) }}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
        whileTap={{ scale: 0.9 }}
        title="Zoom out"
      >
        <Minus size={14} />
      </motion.button>
    </div>
  )
}

const styles = {
  /* A visionOS ornament: a small floating pill of the same glass material. */
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 999,
    background: 'var(--glass-fill)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    boxShadow: 'var(--shadow-float), var(--glass-edge)',
    transform: 'scale(0.9)',
    border: '1px solid var(--glass-stroke)',
  },
  btn: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.31)',
    background: 'rgba(255, 255, 255, 0.09)',
    color: 'var(--ink-2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease, background-color 0.2s ease, opacity 0.2s ease',
    fontFamily: 'inherit',
    flexShrink: 0,
  },
  track: {
    position: 'relative',
    width: 8,
    height: TRACK_H,
    borderRadius: 999,
    background: 'rgba(29, 29, 31, 0.12)',
    border: '1px solid rgba(255,255,255,0.55)',
    cursor: 'ns-resize',
    overflow: 'visible',
    outline: 'none',
    touchAction: 'none',
  },
  fill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    borderRadius: 999,
    background: 'rgba(208, 223, 239, 0.9)',
    transformOrigin: 'bottom',
    transition: 'transform 0.05s linear',
    willChange: 'transform',
  },
  thumb: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.28), 0 0 0 2px rgba(252, 253, 255, 0.01)',
    cursor: 'grab',
    willChange: 'transform',
  },
}
