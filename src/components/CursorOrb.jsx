import { useRef, useEffect, useState } from 'react'

export default function CursorOrb() {
  const orbRef = useRef(null)
  const glowRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Smooth cursor position with lerp
    let mouseX = 0
    let mouseY = 0
    let orbX = 0
    let orbY = 0
    let rafId = null

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) setVisible(true)
    }

    const onMouseLeave = () => setVisible(false)
    const onMouseEnter = () => setVisible(true)

    const animate = () => {
      // Lerp for smooth follow (lower = slower, more floaty)
      const lerp = 0.12
      orbX += (mouseX - orbX) * lerp
      orbY += (mouseY - orbY) * lerp

      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${orbX - 16}px, ${orbY - 16}px)`
      }
      if (glowRef.current) {
        // Glow trails slightly behind for a trailing effect
        const glowLerp = 0.06
        glowRef.current.style.transform = `translate(${orbX - 40}px, ${orbY - 40}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [visible])

  return (
    <>
      {/* Outer glow — large, soft, trails behind */}
      <div
        ref={glowRef}
        style={{
          ...styles.outerGlow,
          opacity: visible ? 1 : 0,
        }}
      />
      {/* Inner orb — small, bright, sharp */}
      <div
        ref={orbRef}
        style={{
          ...styles.orb,
          opacity: visible ? 1 : 0,
        }}
      />
    </>
  )
}

const styles = {
  outerGlow: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    borderRadius: '50%',
  
    pointerEvents: 'none',
    zIndex: 9998,
    transition: 'opacity 0.4s ease',
    willChange: 'transform',
    filter: 'blur(4px)',
  },
  orb: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(179, 224, 206, 0.5) 30%, rgba(0, 0, 0, 0.2) 60%, transparent 80%)',
    pointerEvents: 'none',
    zIndex: 9999,
    transition: 'opacity 0.4s ease',
    willChange: 'transform',
  },
}
