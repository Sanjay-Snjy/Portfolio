import { motion } from 'framer-motion'
import { playSound } from '../sounds'
import { Mail, Phone, Link2, Code2 } from 'lucide-react'

const links = [
  { label: 'LinkedIn', icon: Link2, href: '#' },
  { label: 'Email', icon: Mail, href: '#' },
  { label: 'Github', icon: Code2, href: '#' },
]

export default function SocialBar() {
  return (
    <motion.div
      style={styles.bar}
      className="glass-panel-dark"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      {links.map((link) => {
        const Icon = link.icon
        return (
          <motion.a
            key={link.label}
            href={link.href}
            style={styles.link}
            onClick={() => playSound('social')}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.16)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={16} style={{ opacity: 0.6 }} />
            <span style={styles.label}>{link.label}</span>
          </motion.a>
        )
      })}
    </motion.div>
  )
}

const styles = {
  bar: {
    display: 'flex',
    gap: 25 ,
    padding: '8px 10px',
    borderRadius: 50,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 18px',
    borderRadius: 50,
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: '0.82rem',
    fontWeight: 400,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  label: {
    fontSize: '0.82rem',
  },
}
