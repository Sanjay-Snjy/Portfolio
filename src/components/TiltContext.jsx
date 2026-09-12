import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const TiltContext = createContext({ tiltX: 0, tiltY: 0, isMobile: false })

export function useTilt() {
  return useContext(TiltContext)
}

export function TiltProvider({ children }) {
  const [tilt, setTilt] = useState({ tiltX: 0, tiltY: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const rafRef = useRef(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(hover: none)').matches || window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const onMouseMove = useCallback((e) => {
    const { innerWidth, innerHeight } = window
    targetRef.current.x = (e.clientX / innerWidth - 0.5) * 8
    targetRef.current.y = (e.clientY / innerHeight - 0.5) * 8
  }, [])

  useEffect(() => {
    if (isMobile) return

    const animate = () => {
      const lerp = 0.08
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp
      setTilt({ tiltX: currentRef.current.x, tiltY: currentRef.current.y })
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile, onMouseMove])

  return (
    <TiltContext.Provider value={{ ...tilt, isMobile }}>
      {children}
    </TiltContext.Provider>
  )
}

export function useTiltStyle({
  baseRotateY = 0,
  baseRotateX = 0,
  mouseInfluence = 0.5,
  depth = 0,
  perspective = 1200,
} = {}) {
  const { tiltX, tiltY, isMobile } = useTilt()
  const depthZ = depth * 12

  if (isMobile) {
    return {
      transform: `perspective(${perspective}px) translateZ(${depthZ}px) rotateY(${baseRotateY}deg) rotateX(${baseRotateX}deg)`,
      transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
    }
  }

  const mouseRotateX = tiltY * 2.5 * mouseInfluence
  const mouseRotateY = tiltX * 5 * mouseInfluence

  const finalRotateX = baseRotateX + mouseRotateX
  const finalRotateY = baseRotateY + mouseRotateY

  return {
    transform: `perspective(${perspective}px) translateZ(${depthZ}px) rotateY(${finalRotateY}deg) rotateX(${finalRotateX}deg)`,
    transition: 'transform 0.12s cubic-bezier(0.23, 1, 0.32, 1)',
  }
}

/**
 * Wrapper component that applies 3D tilt.
 * When `glass` is set, the backdrop-filter lives on this same element
 * so it works correctly even with3D transforms.
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
  const tiltStyle = useTiltStyle({ baseRotateY, baseRotateX, mouseInfluence, depth, perspective })

  const glassClass = glass === 'dark'
    ? 'glass-panel-dark'
    : glass === 'light'
      ? 'glass-panel'
      : ''

  const mergedClass = [className, glassClass].filter(Boolean).join(' ')

  return (
    <div className={mergedClass} style={{ ...style, ...tiltStyle }} {...props}>
      {children}
    </div>
  )
}
