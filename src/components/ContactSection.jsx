import { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Check, AlertCircle } from 'lucide-react'
import { playSound } from '../sounds'
import './ContactSection.css'

/* Brand marks — lucide-react no longer ships brand icons */
function GithubMark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  )
}

function LinkedinMark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  )
}

/* ── Edit these ──────────────────────────────────── */
const CONTACT_EMAIL = 'you@example.com' // where notifications are sent + fallback mailto
const GITHUB_URL = '' // e.g. 'https://github.com/yourname'
const LINKEDIN_URL = '' // e.g. 'https://linkedin.com/in/yourname'

// Get your free key in 30 seconds:
//   1. Go to https://web3forms.com
//   2. Enter YOUR email address → click "Create Access Key"
//   3. Check your inbox, copy the key, paste it below.
// When set, submissions land directly in your inbox (no mail app opens).
const WEB3FORMS_KEY = 'd11d3270-cc7e-4161-972f-6049c0063a6c' // e.g. 'a1b2c3d4-5678-90ab-cdef-1234567890ab'
/* ────────────────────────────────────────────────── */

const STATUS = { idle: 'idle', sending: 'sending', sent: 'sent', error: 'error' }

function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(STATUS.idle)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    playSound('nav')

    /* Direct-to-inbox delivery via Web3Forms when the key is configured */
    if (WEB3FORMS_KEY) {
      setStatus(STATUS.sending)
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            name: form.name,
            email: form.email,
            message: form.message,
            subject: `Portfolio contact from ${form.name || 'a visitor'}`,
            from_name: 'Portfolio Contact Form',
          }),
        })
        const data = await res.json()
        if (data.success) {
          setStatus(STATUS.sent)
          setForm({ name: '', email: '', message: '' })
        } else {
          setStatus(STATUS.error)
        }
      } catch {
        setStatus(STATUS.error)
      }
      return
    }

    /* Fallback: no key configured — open the visitor's mail app pre-filled */
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || 'a visitor'}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name}\n${form.email}`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setStatus(STATUS.sent)
  }

  /* Reset button state after a moment */
  const statusLabel = {
    [STATUS.idle]: 'Send',
    [STATUS.sending]: 'Sending…',
    [STATUS.sent]: WEB3FORMS_KEY ? 'Message sent!' : 'Opening mail…',
    [STATUS.error]: 'Failed — retry',
  }
  if (status === STATUS.sent || status === STATUS.error) {
    setTimeout(() => setStatus(STATUS.idle), status === STATUS.error ? 4000 : 2500)
  }

  const socials = [
    { id: 'mail', Icon: Mail, label: 'Email', href: `mailto:${CONTACT_EMAIL}` },
    { id: 'github', Icon: GithubMark, label: 'GitHub', href: GITHUB_URL },
    { id: 'linkedin', Icon: LinkedinMark, label: 'LinkedIn', href: LINKEDIN_URL },
  ].filter((s) => s.href)

  return (
    <div className="contact-view">
      {/* ── Header ── */}
      <div className="contact-header">
        <span className="contact-eyebrow">Get in touch</span>
        <h2 className="contact-title">
          Contact<span className="contact-dot">.</span>
        </h2>
        <p className="contact-sub">
          Have a project in mind, or just want to say hi? My inbox is always open.
        </p>
      </div>

      {/* ── Form ── */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="contact-field">
          <input
            id="contact-name"
            type="text"
            required
            placeholder=" "
            value={form.name}
            onChange={update('name')}
            disabled={status === STATUS.sending}
          />
          <label htmlFor="contact-name">Your Name</label>
        </div>

        <div className="contact-field">
          <input
            id="contact-email"
            type="email"
            required
            placeholder=" "
            value={form.email}
            onChange={update('email')}
            disabled={status === STATUS.sending}
          />
          <label htmlFor="contact-email">Your Email</label>
        </div>

        <div className="contact-field contact-field-area">
          <textarea
            id="contact-message"
            required
            placeholder=" "
            rows={10}
            value={form.message}
            onChange={update('message')}
            disabled={status === STATUS.sending}
          />
          <label htmlFor="contact-message">Your Message</label>
        </div>

        <div className="contact-actions">
          <motion.button
            type="submit"
            className={`contact-send ${status === STATUS.sent ? 'is-sent' : ''} ${status === STATUS.error ? 'is-error' : ''}`}
            disabled={status === STATUS.sending}
            whileHover={status === STATUS.sending ? undefined : { scale: 1.04 }}
            whileTap={status === STATUS.sending ? undefined : { scale: 0.96 }}
          >
            {status === STATUS.sending && <span className="contact-spinner" />}
            {status === STATUS.sent && <Check size={16} />}
            {status === STATUS.error && <AlertCircle size={16} />}
            {!status || (status === STATUS.idle && <Send size={16} />)}
            <span>{statusLabel[status] || 'Send'}</span>
          </motion.button>
        </div>
      </form>
    </div>
  )
}

/* Takes no props — keep it off the parent's re-render path. */
export default memo(ContactSection)
