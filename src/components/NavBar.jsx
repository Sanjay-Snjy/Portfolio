import { motion } from 'framer-motion'
import { playSound } from '../sounds'
import {
  Home,
  Layers,
  Cpu,
  GraduationCap,
  Mail,
} from 'lucide-react'

const icons = {
  Home: Home,
  Projects: Layers,
  'Tech Stack': Cpu,
  Education: GraduationCap,
  Contact: Mail,
}

export default function NavBar({ sections, active, onNavigate }) {
  return (
    <div className="navbar" style={styles.navbar}>
      {sections.map((section) => {
        const Icon = icons[section]
        const isActive = active === section
        return (
          <motion.button
            key={section}
            onClick={() => { playSound('nav'); onNavigate(section) }}
            style={{
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
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

const styles = {
  navbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '12px 8px',
    width: 160,
    flexShrink: 0,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 20,
    border: 'none',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    position: 'relative',
    fontFamily: 'inherit',
    textAlign: 'left',
    transition: 'background 0.2s',
  },
  navItemActive: {
    background: 'rgba(255, 255, 255, 0.1)',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 3,
    height: 20,
    borderRadius: 2,
    background: 'linear-gradient(180deg, #6ee7b7, #3b82f6)',
  },
}
