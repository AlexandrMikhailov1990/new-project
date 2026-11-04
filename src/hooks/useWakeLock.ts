import { useEffect } from 'react'

/** Keep the screen awake while a gym timer is running (best-effort). */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || typeof navigator === 'undefined' || !('wakeLock' in navigator)) return

    let cancelled = false
    let lock: WakeLockSentinel | null = null

    const request = async () => {
      try {
        lock = await navigator.wakeLock.request('screen')
        if (cancelled) {
          await lock.release()
          lock = null
        }
      } catch {
        /* unsupported / denied — ignore */
      }
    }

    void request()

    const onVisible = () => {
      if (document.visibilityState === 'visible' && active) void request()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      void lock?.release()
    }
  }, [active])
}
