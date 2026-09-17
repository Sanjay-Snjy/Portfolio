import { useRef, useEffect, useState, useCallback } from 'react'
import { enableGyro } from '../gyro'

export default function Scene3D() {
  const containerRef = useRef(null)
  const bgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  /* ── One frame at a time ──
     Input (mouse or gyro) only records the newest coordinates and asks for a
     single animation frame. The previous version requested a frame from every
     raw event, so a fast mouse queued several redundant frames per rendered
     frame. When input stops, no frames are scheduled at all. */
  const pendingRef = useRef(null)
  const rafRef = useRef(0)

  const applyParallax = useCallback((x, y) => {
    const bg = bgRef.current
    if (!bg) return

    // X-axis tuned for the panorama: big horizontal drift + rotateY sweep
    const translateX = x * -180
    const translateY = y * -14
    const scale = 1.1 + Math.abs(x * y) * 0.02
    const rotateX = y * -2
    const rotateY = x * 6

    bg.style.transform =
      `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [])

  const queue = useCallback(
    (x, y) => {
      pendingRef.current = [x, y]
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        const next = pendingRef.current
        if (next) applyParallax(next[0], next[1])
      })
    },
    [applyParallax],
  )

  /* ── Mouse parallax (desktop) ── */
  useEffect(() => {
    const onMove = (e) => {
      // Ignore touch/stylus so a finger drag never fights the gyro parallax.
      if (e.pointerType && e.pointerType !== 'mouse') return
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      queue(x, y)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }, [queue])

  /* ── Gyroscopic parallax (mobile) ──
     Tilting the phone pans the panorama, through the same pipeline as the mouse. */
  useEffect(() => {
    let removed = false

    const onOrientation = (e) => {
      if (e.gamma == null || e.beta == null) return
      // gamma: -90..90 (left/right tilt), beta: -180..180 (front/back tilt)
      const x = Math.max(-1, Math.min(1, e.gamma / 30))
      const y = Math.max(-1, Math.min(1, (e.beta - 45) / 30))
      queue(x, y)
    }

    enableGyro().then((granted) => {
      if (!granted || removed) return
      window.addEventListener('deviceorientation', onOrientation)
    })

    return () => {
      removed = true
      window.removeEventListener('deviceorientation', onOrientation)
    }
  }, [queue])

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Background image with parallax */}
      <div
        ref={bgRef}
        style={{
          ...styles.bg,
          opacity: loaded ? 1 : 0,
        }}
      >
        <img
          src="/bg6.png"
          alt=""
          fetchPriority="high"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={styles.img}
        />
      </div>

      {/* Subtle vignette overlay for depth */}
      <div style={styles.vignette} />
    </div>
  )
}

const styles = {
  container: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    perspective: '800px',
    perspectiveOrigin: '40% 40%',
  },
  bg: {
    // Wide horizontal bleed so the stronger x-axis drift/rotation never exposes edges
    position: 'absolute',
    inset: '-60px -320px',
    /* Short fade only. A long fade delays the moment the glass panels have
       anything behind them to blur, which reads as "the blur arrives late". */
    transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.22s ease-out',
    willChange: 'transform',
    transformStyle: 'preserve-3d',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
    pointerEvents: 'none',
  },
}
