import { useRef, useCallback, useState } from 'react'
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
    link: '', // deployed site URL — opens in a new tab
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
    link: '', // deployed site URL — opens in a new tab
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

/* ── 3D Tilt Card ────────────────────────────────── */
function TiltCard({ children, onHover }) {
  const cardRef = useRef(null)
  const glareRef = useRef(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovering: false })

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Tilt angles — max ±12 degrees
    const rotateY = ((x - centerX) / centerX) * 12
    const rotateX = ((centerY - y) / centerY) * -12

    // Glare position
    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100

    setTilt({ rotateX, rotateY, glareX, glareY, isHovering: true })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovering: false })
    onHover?.(null)
  }, [onHover])

  const transform = `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.isHovering ? 1.05 : 1}, ${tilt.isHovering ? 1.05 : 1}, ${tilt.isHovering ? 1.05 : 1})`

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => onHover?.(true)}
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
        },
      }}
      style={{
        ...styles.card,
        transform,
        transition: tilt.isHovering
          ? 'transform 0.1s cubic-bezier(0.23, 1, 0.32, 1)'
          : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: tilt.isHovering
          ? `0 20px 60px rgba(171, 165, 165, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.25)`
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {children}

      {/* Glare / specular highlight overlay */}
      <div
        ref={glareRef}
        style={{
          ...styles.glare,
          opacity: tilt.isHovering ? 0.35 : 0,
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
          transition: tilt.isHovering ? 'opacity 0.15s ease' : 'opacity 0.4s ease',
        }}
      />

      {/* Edge highlight for depth */}
      <div
        style={{
          ...styles.edgeHighlight,
          opacity: tilt.isHovering ? 1 : 0,
          boxShadow: `inset ${(tilt.rotateY / 12) * 8}px ${(tilt.rotateX / -12) * 5}px 20px rgba(255,255,255,0.08)`,
          transition: tilt.isHovering ? 'opacity 0.15s ease' : 'opacity 0.4s ease',
        }}
      />
    </motion.div>
  )
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export default function ProjectCards({ expanded, onHoverProject }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{
        ...styles.grid,
        ...(expanded ? styles.gridExpanded : {}),
      }}
    >
      {projects.map((project) => (
        <TiltCard
          key={project.id}
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
                <h3 style={styles.cardTitle}>{project.title}</h3>
                {project.link && (
                  <motion.button
                    style={styles.linkBtn}
                    onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')}
                    whileHover={{ scale: 1.12, backgroundColor: 'rgba(255,255,255,0.22)' }}
                    whileTap={{ scale: 0.92 }}
                    title="Open deployed site"
                    aria-label={`Open ${project.title} deployed site`}
                  >
                    <ExternalLink size={14} />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </TiltCard>
      ))}
    </motion.div>
  )
}

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
    transformStyle: 'preserve-3d',
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
    justifyContent: 'space-between',
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
    width: 28,
    height: 28,
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
    inset: 0,
    borderRadius: 18,
    pointerEvents: 'none',
    zIndex: 2,
    mixBlendMode: 'overlay',
  },
  edgeHighlight: {
    position: 'absolute',
    inset: 0,
    borderRadius: 18,
    pointerEvents: 'none',
    zIndex: 2,
  },
}
