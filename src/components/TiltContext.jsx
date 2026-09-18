import { createContext, useContext, useEffect, useState } from 'react'

/* ══════════════════════════════════════════════════════════════════
   Spatial tilt driver — zero React re-renders.

   The previous version called setTilt() inside a requestAnimationFrame
   loop, so the whole component tree re-rendered ~60×/second for every
   consumer of this context. Instead we lerp toward the pointer and write
   the result to two CSS custom properties on <html>. Every tilt surface
   reads those variables from CSS, so a mouse move only ever triggers a
   transform recomposite — React is not involved.

   The loop also fully idles: once the eased value converges on the
   pointer it stops scheduling frames until the next pointer event.
   ══════════════════════════════════════════════════════════════════ */

const TiltContext = createContext({ isMobile: false })

export function useTilt() {
  return useContext(TiltContext)
}

/* Same easing + amplitude as before so the feel is unchanged:
   value = (client / viewport - 0.5) * 8, eased 8% per frame. */
const LERP = 0.08
const RANGE = 8
const CONVERGED = 0.002

function startTiltEngine() {
  const root = document.documentElement
  const target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  let raf = 0

  const write = () => {
    root.style.setProperty('--tilt-x', current.x.toFixed(4))
    root.style.setProperty('--tilt-y', current.y.toFixed(4))
  }

  const tick = () => {
    raf = 0
    const dx = target.x - current.x
    const dy = target.y - current.y

    /* Settled — stop scheduling frames entirely until input arrives. */
    if (Math.abs(dx) < CONVERGED && Math.abs(dy) < CONVERGED) {
      current.x = target.x
      current.y = target.y
      write()
      return
    }

    current.x += dx * LERP
    current.y += dy * LERP
    write()
    raf = requestAnimationFrame(tick)
  }

  const onPointerMove = (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * RANGE
    target.y = (e.clientY / window.innerHeight - 0.5) * RANGE
    if (!raf) raf = requestAnimationFrame(tick)
  }

  const onPointerLeave = () => {
    target.x = 0
    target.y = 0
    if (!raf) raf = requestAnimationFrame(tick)
  }

  /* Never burn frames while the tab is hidden. */
  const onVisibility = () => {
    cancelAnimationFrame(raf)
    raf = 0
    if (!document.hidden) raf = requestAnimationFrame(tick)
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerleave', onPointerLeave)
    document.removeEventListener('visibilitychange', onVisibility)
    cancelAnimationFrame(raf)
    raf = 0
  }
}

export function TiltProvider({ children }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () =>
      setIsMobile(
        window.matchMedia('(hover: none)').matches || window.innerWidth < 768,
      )
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return undefined
    return startTiltEngine()
  }, [isMobile])

  return (
    <TiltContext.Provider value={{ isMobile }}>
      {children}
    </TiltContext.Provider>
  )
}

/**
 * Wrapper component that applies the spatial tilt.
 *
 * The transform is composed entirely in CSS from the `--tilt-x` / `--tilt-y`
 * variables written by the engine, so only `baseRotateY` / `baseRotateX`
 * (which change on zoom, not per frame) ever come from React.
 *
 * When `glass` is set the backdrop-filter lives on this same element so it
 * composites correctly with the 3D transform.
 */
export function TiltLayer({
  baseRotateY = 0,
  baseRotateX = 0,
  mouseInfluence = 0.3,
  depth = 0,
  perspective = 1200,
  glass, // 'dark' | 'light' — applies glass-panel directly on the wrapper
  className,
  style,
  children,
  ...props
}) {
  const { isMobile } = useTilt()

  /* The material is light-only now (the visionOS restyle), so both the 'light'
     and the legacy 'dark' value resolve to the same class. */
  const glassClass = glass ? 'glass-panel' : ''

  const mergedClass = [
    'tilt-layer',
    isMobile && 'tilt-layer--static',
    className,
    glassClass,
  ]
    .filter(Boolean)
    .join(' ')

  /* Multipliers mirror the previous maths: x drifts 5×, y drifts 2.5×. */
  const layerVars = {
    '--tl-persp': `${perspective}px`,
    '--tl-z': `${depth * 12}px`,
    '--tl-base-y': `${baseRotateY}deg`,
    '--tl-base-x': `${baseRotateX}deg`,
    '--tl-infl-x': isMobile ? 0 : mouseInfluence * 5,
    '--tl-infl-y': isMobile ? 0 : mouseInfluence * 2.5,
  }

  return (
    <div className={mergedClass} style={{ ...style, ...layerVars }} {...props}>
      {children}
    </div>
  )
}
