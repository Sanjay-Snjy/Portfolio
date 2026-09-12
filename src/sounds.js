/*
 * ── Sound Effects ──
 *
 * Place your MP3 files in the public/sounds/ folder.
 * Update the paths below to match your file names.
 *
 * public/sounds/click-landing.mp3   → App icon (landing screen)
 * public/sounds/click-nav.mp3       → Nav bar buttons
 * public/sounds/click-social.mp3    → Social bar links
 * public/sounds/click-back.mp3      → Back button
 * public/sounds/click-fullscreen.mp3 → Fullscreen button
 */

const sounds = {
  // 1 — Landing screen app icon click
  landing: new Audio('/sounds/sound1.mp3'),

  // 2 — Nav bar button clicks
  nav: new Audio('/sounds/sound5.mp3'),

  // 3 — Social bar link clicks
  social: new Audio('/sounds/sound5.mp3'),

  // 4 — Top controls back button
  back: new Audio('/sounds/sound5.mp3'),

  // 5 — Top controls fullscreen/extend button
  fullscreen: new Audio('/sounds/sound5.mp3'),
}

/**
 * Play a sound by key. Resets to start so rapid clicks re-trigger.
 * @param {'landing'|'nav'|'social'|'back'|'fullscreen'} key
 */
export function playSound(key) {
  const audio = sounds[key]
  if (!audio) return
  audio.currentTime = 0
  audio.volume = 0.6
  audio.play().catch(() => {})
}
