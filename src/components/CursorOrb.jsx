import { useEffect, useRef, useState } from 'react'

export default function CursorOrb() {
  const orbRef = useRef(null)
  const glowRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const visibleRef = useRef(false)

  useEffect(() => {
    // Touch devices have no cursor to follow — don't run anything at all.
    if (window.matchMedia('(hover: none)').matches) return undefined

    let mouseX = 0
    let mouseY = 0
    let orbX = 0
    let orbY = 0
    let rafId = 0
    let running = false

    const tick = () => {
      orbX += (mouseX - orbX) * 0.12
      orbY += (mouseY - orbY) * 0.12

      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${orbX - 16}px, ${orbY - 16}px, 0)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${orbX - 40}px, ${orbY - 40}px, 0)`
      }

      /* Settled on the pointer — stop requesting frames until it moves again.
         Previously this loop ran forever, even with the mouse untouched. */
      if (Math.abs(mouseX - orbX) < 0.2 && Math.abs(mouseY - orbY) < 0.2) {
        running = false
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      rafId = requestAnimationFrame(tick)
    }

    const onMouseMove = (e) => {
      if (e.pointerType !== 'mouse') return
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visibleRef.current) {
        visibleRef.current = true
        setVisible(true)
      }
      start()
    }

    const onMouseLeave = () => {
      visibleRef.current = false
      setVisible(false)
    }
    const onMouseEnter = () => {
      visibleRef.current = true
      setVisible(true)
    }

    window.addEventListener('pointermove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('pointermove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      if (rafId) cancelAnimationFrame(rafId)
    }
    /* Intentionally empty deps: `visible` used to be a dependency, so the very
       first mouse move tore down and rebuilt the listeners and the loop. */
  }, [])

  return (
    <>
      {/* Outer glow — large, soft */}
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
    /* No background paint and no filter: this element is a transparent
       placeholder, so a blur filter here only cost a composited layer. */
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
