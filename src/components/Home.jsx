import { motion } from 'framer-motion'

/* ── Home page: profile intro card ── */
export default function Home() {
  return (
    <motion.div
      className="glass-panela"
      style={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
    </motion.div>
  )
}

const styles = {
  card: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6ee7b7, #3b82f6)',
    padding: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  info: {
    flex: 1,
    minWidth: 150,
  },
  label: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.5)',
    display: 'block',
    marginBottom: 2,
  },
  name: {
    fontSize: '1.15rem',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.8))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
}
