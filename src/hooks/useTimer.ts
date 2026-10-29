import { useCallback, useEffect, useRef, useState } from 'react'

export type TimerMode = 'idle' | 'work' | 'rest'

type TimerState = {
  mode: TimerMode
  remaining: number
  running: boolean
}

export function useTimer() {
  const [state, setState] = useState<TimerState>({
    mode: 'idle',
    remaining: 0,
    running: false,
  })
  const endAtRef = useRef<number | null>(null)
  const modeRef = useRef<TimerMode>('idle')

  useEffect(() => {
    if (!state.running || state.remaining <= 0) return

    const tick = () => {
      if (endAtRef.current == null) return
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000))
      if (left <= 0) {
        endAtRef.current = null
        setState({ mode: 'idle', remaining: 0, running: false })
        modeRef.current = 'idle'
        try {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([120, 60, 120])
          }
        } catch {
          /* ignore */
        }
      } else {
        setState((prev) => ({ ...prev, remaining: left }))
      }
    }

    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [state.running, state.remaining > 0])

  const start = useCallback((mode: TimerMode, seconds: number) => {
    const safe = Math.max(1, Math.floor(seconds))
    endAtRef.current = Date.now() + safe * 1000
    modeRef.current = mode
    setState({ mode, remaining: safe, running: true })
  }, [])

  const pause = useCallback(() => {
    setState((prev) => {
      if (!prev.running) return prev
      endAtRef.current = null
      return { ...prev, running: false }
    })
  }, [])

  const resume = useCallback(() => {
    setState((prev) => {
      if (prev.running || prev.remaining <= 0 || prev.mode === 'idle') return prev
      endAtRef.current = Date.now() + prev.remaining * 1000
      return { ...prev, running: true }
    })
  }, [])

  const reset = useCallback(() => {
    endAtRef.current = null
    modeRef.current = 'idle'
    setState({ mode: 'idle', remaining: 0, running: false })
  }, [])

  return {
    mode: state.mode,
    remaining: state.remaining,
    running: state.running,
    start,
    pause,
    resume,
    reset,
  }
}
