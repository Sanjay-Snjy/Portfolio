import { memo } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import TechGlyph from './TechGlyph'
import { stack, stackGroups } from '../data/content'

function NotesPanel({ onClose, activeTech, activeSection, hoveredProject }) {
  const byId = Object.fromEntries(stack.map((t) => [t.id, t]))
  const active = activeTech ? byId[activeTech] : null
  const relatedNames = active
    ? (active.related || []).map((r) => byId[r]?.name).filter(Boolean)
    : []

  const showTechReadout = activeSection === 'Skillset'
  const showProjectReadout = activeSection === 'Projects'

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h3 style={styles.title}>Notes</h3>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {showProjectReadout ? (
          hoveredProject ? (
            <motion.div
              key={hoveredProject.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── Project header ── */}
              <div style={styles.projectHead}>
                <span style={styles.projectCategory}>{hoveredProject.category}</span>
                <h4 style={styles.projectTitle}>{hoveredProject.title}</h4>
              </div>

              {/* ── Description ── */}
              {(hoveredProject.bullets || []).map((b, i) => (
                <p key={i} style={styles.techNote}>{b}</p>
              ))}

              {/* ── Tech stack ── */}
              {hoveredProject.tech?.length > 0 && (
                <div style={styles.section}>
                  <span style={styles.sectionLabel}>Tech Stack</span>
                  <div style={styles.tagList}>
                    {hoveredProject.tech.map((t) => (
                      <span key={t} style={styles.tag}>{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Deployed site link ── */}
              {hoveredProject.link && (
                <div style={styles.techRel}>
                  <span style={styles.techRelLabel}>Deployed at</span>
                  <a
                    href={hoveredProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.projectLink}
                  >
                    {hoveredProject.link.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </motion.div>
          ) : (
            <div>
              <h4 style={styles.noteTitle}>Projects</h4>
              <p style={styles.paragraph}>
                Hover over a project card to see its details here — what it does,
                the tech behind it, and a link to the live site.
              </p>
              <p style={styles.hint}>4 projects</p>
            </div>
          )
        ) : showTechReadout ? (
          active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── Header with icon + name ── */}
              <div style={styles.techHead}>
                <TechGlyph id={active.id} size={32} className="stack__readout-glyph" />
                <div>
                  <h4 style={styles.techName}>{active.name}</h4>
                  <p style={styles.techGroup}>
                    {stackGroups.find((g) => g.id === active.group)?.label}
                  </p>
                </div>
              </div>

              {/* ── Description ── */}
              <p style={styles.techNote}>{active.note}</p>

              {/* ── Experience & Level ── 
              <div style={styles.statsRow}>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Experience</span>
                  <span style={styles.statValue}>{active.experience}</span>
                </div>
                <div style={styles.statDivider} />
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Level</span>
                  <span style={styles.statValue}>{active.level}</span>
                </div>
              </div>*/}

              {/* ── Key Features ── */}
              {active.features && active.features.length > 0 && (
                <div style={styles.section}>
                  <span style={styles.sectionLabel}>Key Features</span>
                  <div style={styles.tagList}>
                    {active.features.map((f) => (
                      <span key={f} style={styles.tag}>{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Use Cases ── */}
              {active.useCases && active.useCases.length > 0 && (
                <div style={styles.section}>
                  <span style={styles.sectionLabel}>Use Cases</span>
                  <div style={styles.tagList}>
                    {active.useCases.map((u) => (
                      <span key={u} style={{ ...styles.tag, ...styles.tagAlt }}>{u}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Works With ── */}
              {relatedNames.length > 0 && (
                <div style={styles.techRel}>
                  <span style={styles.techRelLabel}>Works with</span>
                  <span style={styles.techRelNames}>{relatedNames.join(' · ')}</span>
                </div>
              )}
            </motion.div>
          ) : (
            <div>
              <h4 style={styles.noteTitle}>Skillset</h4>
              <p style={styles.paragraph}>
                Hover over a technology chip to see how I use it and what it connects to.
              </p>
              <p style={styles.hint}>
                {stack.length} tools · {stackGroups.length} groups
              </p>
            </div>
          )
        ) : (
          <>
            <h4 style={styles.noteTitle}>How to use this website?</h4>
            <p style={styles.paragraph}>
              Hello everyone, welcome to my portfolio website!
              This website offers a 3D experience created using
              Three.js, a tool that allows me to design 3D objects
              and export them as React code.
            </p>
            <p style={styles.paragraph}>
              I know what you're thinking: "A portfolio website in
              3D for a front-end developer? Is that really
              necessary?" In short, the answer is no. But it is fun!
              And it's a great way to showcase my work.
            </p>
            <p style={styles.paragraph}>
              On this website, you'll find a collection of my
              projects, personal information, and information on
              my education and career. I hope you enjoy seeing
              what I can do. I won't keep you waiting any longer,
              so go take a look!
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default memo(NotesPanel)

const styles = {
  panel: {
    width: 280,
    flexShrink: 0,
    height: 540,
    maxHeight: 'calc(100vh - 200px)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 18px 14px',
    borderBottom: '1px solid rgba(29, 29, 31, 0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--ink)',
  },
  headerRight: {
    display: 'flex',
    gap: 4,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 20,
    border: 'none',
    background: 'rgba(255,255,255,0.5)',
    color: 'var(--ink-2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease, background-color 0.2s ease, color 0.2s ease',
  },
  content: {
    padding: '16px 18px',
    overflowY: 'auto',
    flex: 1,
  },
  noteTitle: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: 'var(--ink)',
    marginBottom: 14,
  },
  paragraph: {
    fontSize: '0.78rem',
    lineHeight: 1.7,
    color: 'var(--ink-2)',
    marginBottom: 14,
  },
  hint: {
    fontSize: '0.6rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
    marginTop: 20,
  },
  /* ── Tech readout ── */
  techHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  techName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--ink)',
  },
  techGroup: {
    fontSize: '0.55rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-3)',
  },
  techNote: {
    fontSize: '0.78rem',
    lineHeight: 1.7,
    color: 'var(--ink-2)',
    marginBottom: 14,
  },
  /* ── Project readout ── */
  projectHead: {
    marginBottom: 12,
  },
  projectCategory: {
    display: 'block',
    fontSize: '0.65rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-2)',
    marginBottom: 6,
  },
  projectTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--ink)',
    lineHeight: 1.4,
    margin: 0,
  },
  projectLink: {
    fontSize: '0.75rem',
    color: 'var(--ink)',
    textDecoration: 'none',
    wordBreak: 'break-all',
  },
  /* ── Stats row ── */
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    padding: '10px 0',
    marginBottom: 14,
    borderTop: '1px solid rgba(29, 29, 31, 0.1)',
    borderBottom: '1px solid rgba(29, 29, 31, 0.1)',
  },
  stat: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
  },
  statDivider: {
    width: 1,
    height: 24,
    background: 'rgba(29, 29, 31, 0.12)',
  },
  statLabel: {
    fontSize: '0.8rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--ink)',
  },
  statValue: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--ink)',
  },
  /* ── Sections ── */
  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    display: 'block',
    fontSize: '0.7rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink)',
    marginBottom: 8,
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    fontSize: '0.72rem',
    padding: '3px 10px',
    borderRadius: 999,
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: 'var(--ink-2)',
    whiteSpace: 'nowrap',
  },
  tagAlt: {
    background: 'rgba(255, 255, 255, 0.13)',
    border: '1px solid rgba(29, 29, 31, 0.14)',
    color: 'var(--ink-2)',
  },
  /* ── Works with ── */
  techRel: {
    marginTop: 12,
    paddingTop: 10,
    borderTop: '1px solid rgba(29, 29, 31, 0.1)',
  },
  techRelLabel: {
    display: 'block',
    fontSize: '0.5rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink)',
    marginBottom: 4,
  },
  techRelNames: {
    fontSize: '0.78rem',
    color: 'var(--ink-2)',
  },
}
