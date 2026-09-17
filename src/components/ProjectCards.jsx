import { memo, useRef, useCallback, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import dfImg from '../assets/DF.png'
import ncImg from '../assets/NC.png'
import cfImg from '../assets/CF.png'
import cpImg from '../assets/CP.png'
/* ─────────────────────────────────────────────────────────────
   Projects data
   To give a card a background image: drop the image in
   `public/projects/` and set `image: '/projects/<filename>'`.
   Leave `image: ''` to show the gradient fallback instead.
   ───────────────────────────────────────────────────────────── */
const projects = [
  {
    id: 1,
    title: 'Crowdfunding Platform — Using Blockchain',
    category: 'Blockchain · Web3',
    tech: ['React', 'JavaScript', 'Next.js', 'Ethers.js', 'Solidity', 'Ethereum'],
    image: cfImg, // e.g. '/projects/crowdfunding.png'
    link: 'https://crowdfund-dapp-ruby.vercel.app/', // deployed site URL — opens in a new tab
    gradient: 'linear-gradient(135deg, #a855f7, #6366f1)',
    bullets: [
      'Decentralized crowdfunding platform using Ethereum smart contracts for transparent fundraising and automated fund management.',
      'Campaign creation, contribution management, milestone-based fund release and automated refund mechanisms via Solidity smart contracts.',
    ],
  },
  {
    id: 2,
    title: 'DevFlow — Developer Project & Collaboration Platform',
    category: 'Full-Stack · Real-Time',
    tech: ['React', 'JavaScript', 'Next.js', 'Node.js', 'Python', 'MongoDB', 'WebSockets'],
    image: dfImg, // full-bleed card background
    link: 'https://devflow-nine-chi.vercel.app/', // deployed site URL — opens in a new tab
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    bullets: [
      'Full-stack project management and collaboration platform for managing projects, tasks, issues, milestones and development workflows.',
      'Role-based access control, real-time task updates, GitHub repository integration, project analytics and AI-powered task breakdown.',
    ],
  },
  {
    id: 3,
    title: 'Crop Suitability Prediction System',
    category: 'Machine Learning',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    image: cpImg, // e.g. '/projects/crop-suitability.png'
    link: '', // deployed site URL — opens in a new tab
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    bullets: [
      'Machine learning-based crop suitability prediction system using the Support Vector Machine (SVM) algorithm.',
      'Data preprocessing, feature scaling, model training and evaluation on agricultural soil and climate data.',
    ],
  },
  {
    id: 4,
    title: 'NeighborConnect — Community Service & Resource-Sharing Platform',
    category: 'Full-Stack',
    tech: ['React', 'Django', 'SQLite', 'JavaScript', 'HTML', 'CSS'],
    image: ncImg, // full-bleed card background
    link: '', // deployed site URL — opens in a new tab
    gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    bullets: [
      'Full-stack community platform for sharing resources such as tools and food, discovering community events and carpooling.',
      'User authentication, resource-sharing and ride workflows, event sharing and RESTful APIs for users, resources, rides and bookings.',
    ],
  },
]

/* Exported so the Notes panel can read the same data */
export const projectList = projects

/* ── 3D Tilt Card ──────────────────────────────────
   The tilt, its specular glare and the edge highlight are written straight to
   the DOM inside a single animation frame. Previously each raw mousemove set
   React state *and* called getBoundingClientRect(), so every pointer event
   forced a synchronous layout plus a full re-render of the card. Only the
   hover on/off transition touches React now (twice per interaction). */
function TiltCard({ children, onHover, index }) {
  const cardRef = useRef(null)
  const glareRef = useRef(null)
  const edgeRef = useRef(null)
  const rectRef = useRef(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)
  const [hovering, setHovering] = useState(false)

  /* Compose the tilt from the newest pointer position — one frame at a time. */
  const paint = useCallback(() => {
    const card = cardRef.current
    const rect = rectRef.current
    if (!card || !rect) return

    const nx = (pointerRef.current.x - rect.left) / rect.width
    const ny = (pointerRef.current.y - rect.top) / rect.height

    const rotateY = (nx - 0.5) * 24 // ±12deg
    const rotateX = (0.5 - ny) * 24

    card.style.transform =
      `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`

    if (glareRef.current) {
      // The speck of light is a fixed gradient moved by transform, so it
      // composites instead of repainting the gradient every frame.
      glareRef.current.style.transform =
        `translate3d(${((nx - 0.5) * 50).toFixed(2)}%, ${((ny - 0.5) * 50).toFixed(2)}%, 0)`
    }

    if (edgeRef.current) {
      edgeRef.current.style.boxShadow =
        `inset ${((rotateY / 12) * 8).toFixed(2)}px ${((rotateX / -12) * 5).toFixed(2)}px 20px rgba(255,255,255,0.08)`
    }
  }, [])

  const measure = useCallback(() => {
    if (cardRef.current) rectRef.current = cardRef.current.getBoundingClientRect()
  }, [])

  const handleMouseEnter = useCallback(
    (e) => {
      measure() // one layout read per hover, not per pointer event
      pointerRef.current = { x: e.clientX, y: e.clientY }
      paint()
      setHovering(true)
      onHover?.(true)
    },
    [measure, paint, onHover],
  )

  const handleMouseMove = useCallback(
    (e) => {
      pointerRef.current = { x: e.clientX, y: e.clientY }
      if (!rectRef.current || rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        paint()
      })
    },
    [paint],
  )

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    rectRef.current = null

    const card = cardRef.current
    if (card) card.style.transform = RESTING_TRANSFORM
    if (glareRef.current) glareRef.current.style.transform = 'translate3d(0, 0, 0)'
    if (edgeRef.current) edgeRef.current.style.boxShadow = 'none'

    setHovering(false)
    onHover?.(null)
  }, [onHover])

  /* A stale rect would put the tilt out of register, so re-measure whenever the
     page or the inner scroller moves while the pointer is on the card. */
  useEffect(() => {
    if (!hovering) return undefined
    const invalidate = () => measure()
    window.addEventListener('resize', invalidate)
    window.addEventListener('scroll', invalidate, true)
    return () => {
      window.removeEventListener('resize', invalidate)
      window.removeEventListener('scroll', invalidate, true)
    }
  }, [hovering, measure])

  return (
    <div
      ref={cardRef}
      className="project-card"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      /* If the pointer lands while the entrance animation is still running, the
         rect captured on enter is the mid-animation one — refresh it at the end. */
      onAnimationEnd={(e) => {
        if (e.target === cardRef.current) measure()
      }}
      style={{
        ...styles.card,
        '--card-i': index,
        transform: RESTING_TRANSFORM,
        transition: hovering
          ? 'transform 0.1s cubic-bezier(0.23, 1, 0.32, 1)'
          : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: hovering
          ? '0 20px 60px rgba(171, 165, 165, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.25)'
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {children}

      {/* Glare / specular highlight overlay */}
      <div
        ref={glareRef}
        style={{
          ...styles.glare,
          opacity: hovering ? 0.35 : 0,
          transition: hovering ? 'opacity 0.15s ease' : 'opacity 0.4s ease',
        }}
      />

      {/* Edge highlight for depth */}
      <div
        ref={edgeRef}
        style={{
          ...styles.edgeHighlight,
          opacity: hovering ? 1 : 0,
          transition: hovering ? 'opacity 0.15s ease' : 'opacity 0.4s ease',
        }}
      />
    </div>
  )
}

const RESTING_TRANSFORM =
  'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'

function ProjectCards({ expanded, onHoverProject }) {
  return (
    <div
      style={{
        ...styles.grid,
        ...(expanded ? styles.gridExpanded : {}),
      }}
    >
      {projects.map((project, i) => (
        <TiltCard
          key={project.id}
          index={i}
          onHover={(entering) => onHoverProject?.(entering ? project : null)}
        >
          {/* Background: image if provided, otherwise gradient fallback */}
          {project.image ? (
            <div
              style={{
                ...styles.cardBackground,
                backgroundImage: `url(${project.image})`,
              }}
            />
          ) : (
            <div style={{ ...styles.cardBackground, background: project.gradient }} />
          )}

          {/* Readability scrim so text stays legible over images */}
          <div style={styles.scrim} />

          {/* Category — top left */}
          <div style={styles.cardContent}>
            <span style={styles.category}>{project.category}</span>

            {/* Tech + title — bottom */}
            <div style={styles.cardBottom}>

              <div style={styles.titleRow}>
                <h3 style={{ ...styles.cardTitle, ...(project.link ? { paddingRight: 44 } : {}) }}>{project.title}</h3>
              </div>
            </div>

            {/* Link button — pinned to bottom-right corner */}
            {project.link && (
              <motion.button
                style={styles.linkBtn}
                onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')}
                whileHover={{ scale: 1.12, backgroundColor: 'rgba(255,255,255,0.22)' }}
                whileTap={{ scale: 0.92 }}
                title="Open deployed site"
                aria-label={`Open ${project.title} deployed site`}
              >
                <ExternalLink size={18} />
              </motion.button>
            )}
          </div>
        </TiltCard>
      ))}
    </div>
  )
}

/* Re-rendering the cards is only needed when a hover actually changes, so the
   whole grid stays out of parent re-renders (e.g. zoom-slider frames). */
export default memo(ProjectCards)

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,

  },
  gridExpanded: {
    gap: 16,
  },
  card: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    cursor: 'pointer',
    minHeight: 220,
    display: 'flex',
    willChange: 'transform',
  },
  cardBackground: {
    position: 'absolute',
    inset: 0,
    borderRadius: 18,
    backgroundSize: '140% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  scrim: {
    position: 'absolute',
    inset: 0,
    borderRadius: 18,
    background:
      'linear-gradient(to top, rgba(5, 6, 15, 0.85) 0%, rgba(5, 6, 15, 0.35) 45%, rgba(5, 6, 15, 0.1) 100%)',
    zIndex: 0,
  },
  cardContent: {
    position: 'relative',
    padding: '18px 18px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 1,
  },
  category: {
    fontSize: '0.6rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
  },
  cardBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  techRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  },
  techChip: {
    fontSize: '0.55rem',
    fontWeight: 500,
    padding: '3px 7px',
    borderRadius: 999,
    color: 'rgba(255,255,255,0.75)',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.14)',
    backdropFilter: 'blur(6px)',
    whiteSpace: 'nowrap',
  },
  techChipMore: {
    background: 'rgba(255,255,255,0.06)',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#fff',
    lineHeight: 1.35,
    margin: 0,
  },
  linkBtn: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    zIndex: 2,
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(6px)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  glare: {
    position: 'absolute',
    inset: '-50%',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 2,
    mixBlendMode: 'overlay',
    willChange: 'transform',
    /* Fixed gradient; the hotspot is aimed by translating the layer. */
    background:
      'radial-gradient(closest-side, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 45%, transparent 72%)',
  },
  edgeHighlight: {
    position: 'absolute',
    inset: 0,
    borderRadius: 18,
    pointerEvents: 'none',
    zIndex: 2,
  },
}
