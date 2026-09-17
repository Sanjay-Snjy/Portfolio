import { motion } from 'framer-motion'
import { playSound } from '../sounds'
import { ArrowLeft, Maximize2 } from 'lucide-react'

export default function Controls({ showBack = true, onBack, onFullscreen }) {
  return (
    <div style={styles.controls}>
      {showBack && (
        <motion.button
          style={styles.btn}
          onClick={() => { playSound('back'); onBack() }}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.9 }}
          title="Back to landing"
        >
          <ArrowLeft size={16} />
        </motion.button>
      )}
      <motion.button
        style={styles.btn}
        onClick={() => { playSound('fullscreen'); onFullscreen() }}
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
        whileTap={{ scale: 0.9 }}
      >
        <Maximize2 size={16} />
      </motion.button>
    </div>
  )
}

const styles = {
  controls: {
    display: 'flex',
    gap: 8,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    color: 'rgba(255, 255, 255, 0.3)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease, background-color 0.2s ease',
    fontFamily: 'inherit',
  },
}
