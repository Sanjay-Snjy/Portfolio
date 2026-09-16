/*
 * ── Gyroscope access helper ──
 *
 * iOS Safari requires an explicit permission request that must be
 * triggered from a user gesture (we call it on the landing-icon tap).
 * Android/Chrome grant silently — but need HTTPS to expose the sensor.
 *
 * Returns true if gyro events are allowed to fire.
 */
export async function enableGyro() {
  try {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      const res = await DeviceOrientationEvent.requestPermission()
      return res === 'granted'
    }
    // No permission API (Android, desktop) — events just work (or don't exist)
    return true
  } catch {
    return false
  }
}
