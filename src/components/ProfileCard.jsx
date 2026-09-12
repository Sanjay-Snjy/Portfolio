import { motion } from 'framer-motion'

export default function ProfileCard() {
  return (
    <motion.div
      className="glass-panela"
      style={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <div style={styles.avatarRing}>
        <img src="/profile.jpeg" alt="Profile" style={styles.avatarImg} />
      </div>
      <div style={styles.info}>
        <span style={styles.label}>Front-end Developer Portfolio</span>
        <h1 style={styles.name}>SANJAY</h1>
      </div>
      <motion.button
        style={styles.seeMore}
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.95 }}
      >
        See more
      </motion.button>
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
  seeMore: {
    padding: '8px 20px',
    borderRadius: 50,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '0.82rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
}
