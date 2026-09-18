import { memo } from 'react'
import { motion } from 'framer-motion'
import { playSound } from '../sounds'
import {
  Home,
  Layers,
  Cpu,
  Mail,
} from 'lucide-react'

const icons = {
  Home: Home,
  Projects: Layers,
  Skillset: Cpu,
  Contact: Mail,
}

function NavBar({ sections, active, onNavigate, onPrefetch }) {
  return (
    <div className="navbar" style={styles.navbar}>
      {sections.map((section) => {
        const Icon = icons[section]
        const isActive = active === section
        return (
          <motion.button
            key={section}
            /* The chunk for a lazy section starts loading the moment the
               pointer is on its way to the button, so the click never waits. */
            onMouseEnter={onPrefetch}
            onFocus={onPrefetch}
            onClick={() => { playSound('nav'); onNavigate(section) }}
            style={{
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            }}
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.13)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <Icon
              size={18}
              style={{
                opacity: isActive ? 1 : 0.5,
                transition: 'opacity 0.2s',
              }}
            />
            <span style={{
              fontSize: '0.82rem',
              fontWeight: isActive ? 500 : 400,
              opacity: isActive ? 1 : 0.6,
              transition: 'opacity 0.2s',
            }}>
              {section}
            </span>
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

/* Props are all primitives or stable callbacks, so re-renders only happen when
   the active section actually changes. */
export default memo(NavBar)

const styles = {
  navbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '12px 8px',
    width: 160,
    flexShrink: 0,
  },
  /* visionOS sidebar rows: vibrancy text, hover is a soft white pill,
     selection is a brighter pill with a whisper of shadow. */
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 16,
    border: 'none',
    background: 'transparent',
    color: 'var(--ink)',
    cursor: 'pointer',
    position: 'relative',
    fontFamily: 'inherit',
    textAlign: 'left',
    transition: 'background 0.2s',
  },
  navItemActive: {
    background: 'rgba(255, 255, 255, 0.59)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
  },
  indicator: {
    display: 'none',
  },
}
