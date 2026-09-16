import { useRef, useEffect, useState, useCallback } from 'react'

export default function Scene3D() {
  const containerRef = useRef(null)
  const bgRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !bgRef.current) return

    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window

    // Normalized -1 to 1
    const x = (clientX / innerWidth - 0.5) * 2
    const y = (clientY / innerHeight - 0.5) * 2

    // Parallax transforms — background shifts opposite to cursor for depth
    // X-axis tuned for panorama: big horizontal drift + rotateY sweep
    const translateX = x * -180
    const translateY = y * -14
    const scale = 1.1 + Math.abs(x * y) * 0.02
    const rotateX = y * -2
    const rotateY = x * 6

    bgRef.current.style.transform =
      `translate(${translateX}px, ${translateY}px) scale(${scale}) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [])

  useEffect(() => {
    const handleMove = (e) => {
      requestAnimationFrame(() => handleMouseMove(e))
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [handleMouseMove])

  return (
    <div
      ref={containerRef}
      style={styles.container}
    >
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
    transition: 'transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.8s ease',
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
  particles: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.6)',
    animation: 'floatParticle 24s ease-in-out infinite',
    pointerEvents: 'none',
  },
}
