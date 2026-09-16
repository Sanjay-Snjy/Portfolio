import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { playSound } from '../sounds'
import { Plus, Minus } from 'lucide-react'

const MIN = 0.4
const MAX = 1.15
const STEPS = 100

function toPercent(z) {
  return ((z - MIN) / (MAX - MIN)) * 100
}

export default function ZoomSlider({ zoom, onZoom }) {
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const setFromClientY = useCallback(
    (clientY) => {
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const ratio = 1 - (clientY - rect.top) / rect.height
      const clamped = Math.min(1, Math.max(0, ratio))
      onZoom(MIN + clamped * (MAX - MIN))
    },
    [onZoom]
  )

  /* While dragging, listen on window so the cursor can leave the track */
  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => setFromClientY(e.clientY)
    const onUp = () => setDragging(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, setFromClientY])

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
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
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
          setDragging(true)
          setFromClientY(e.clientY)
        }}
        onKeyDown={onKeyDown}
        style={{
          ...styles.track,
          boxShadow: dragging
            ? '0 0 0 1px rgba(255,255,255,0.25), 0 8px 32px rgba(0,0,0,0.4)'
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Filled portion (bottom = min zoom, top = max zoom) */}
        <div style={{ ...styles.fill, height: `${pct}%` }} />

        {/* Draggable thumb */}
        <div style={{ ...styles.thumb, bottom: `${pct}%` }} />
      </div>

      <motion.button
        style={{ ...styles.btn, opacity: zoom <= MIN ? 0.35 : 1 }}
        onClick={() => { playSound('zoom'); onZoom(Math.max(MIN, zoom - (MAX - MIN) / STEPS)) }}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.9 }}
        title="Zoom out"
      >
        <Minus size={14} />
      </motion.button>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 999,
    background: 'rgba(15, 15, 25, 0.4)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    transform: 'scale(0.9)',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  btn: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    flexShrink: 0,
  },
  track: {
    position: 'relative',
    width: 8,
    height: 160,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
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
    borderRadius: 999,
    background: '#ffffff81',
    transition: 'height 0.05s linear',
  },
  thumb: {
    position: 'absolute',
    left: '50%',
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#fff',
    transform: 'translate(-50%, 50%)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 0 3px rgba(139,92,246,0.35)',
    cursor: 'grab',
  },
}
