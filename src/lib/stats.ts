import type {
  ExerciseHistory,
  SetRecord,
  WorkoutSession,
} from '../types'

export function sessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce((sum, exercise) => {
    return (
      sum +
      exercise.sets.reduce((setSum, set) => {
        const weight = set.weightKg ?? 0
        return setSum + weight * set.reps
      }, 0)
    )
  }, 0)
}

export function sessionSetCount(session: WorkoutSession): number {
  return session.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)
}

export function completedSessions(sessions: WorkoutSession[]): WorkoutSession[] {
  return sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => (b.finishedAt ?? b.startedAt).localeCompare(a.finishedAt ?? a.startedAt))
}

export function getExerciseHistory(
  sessions: WorkoutSession[],
  exerciseId: string,
  excludeSessionId?: string,
): ExerciseHistory {
  const relevant = completedSessions(sessions).filter(
    (s) => s.id !== excludeSessionId && s.exercises.some((e) => e.exerciseId === exerciseId),
  )

  let bestWeightKg: number | null = null
  let bestReps: number | null = null
  let bestVolume: number | null = null
  let totalSets = 0

  for (const session of relevant) {
    const log = session.exercises.find((e) => e.exerciseId === exerciseId)
    if (!log) continue
    for (const set of log.sets) {
      totalSets += 1
      if (set.weightKg != null) {
        bestWeightKg = bestWeightKg == null ? set.weightKg : Math.max(bestWeightKg, set.weightKg)
        const volume = set.weightKg * set.reps
        bestVolume = bestVolume == null ? volume : Math.max(bestVolume, volume)
      }
      bestReps = bestReps == null ? set.reps : Math.max(bestReps, set.reps)
    }
  }

  const last = relevant[0]
  const lastLog = last?.exercises.find((e) => e.exerciseId === exerciseId)
  const lastSets: SetRecord[] = lastLog?.sets ?? []

  return {
    lastSets,
    lastSessionDate: last?.finishedAt ?? last?.startedAt ?? null,
    bestWeightKg,
    bestReps,
    bestVolume,
    totalSets,
  }
}

export function weeklyVolumeSeries(
  sessions: WorkoutSession[],
  weeks = 8,
): { label: string; volume: number; sets: number; workouts: number }[] {
  const now = new Date()
  const result: { label: string; volume: number; sets: number; workouts: number }[] = []

  for (let i = weeks - 1; i >= 0; i -= 1) {
    const end = new Date(now)
    end.setHours(23, 59, 59, 999)
    end.setDate(end.getDate() - i * 7)
    const start = new Date(end)
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const inWeek = completedSessions(sessions).filter((s) => {
      const t = new Date(s.finishedAt ?? s.startedAt).getTime()
      return t >= start.getTime() && t <= end.getTime()
    })

    result.push({
      label: `${start.getDate()}.${start.getMonth() + 1}`,
      volume: inWeek.reduce((sum, s) => sum + sessionVolume(s), 0),
      sets: inWeek.reduce((sum, s) => sum + sessionSetCount(s), 0),
      workouts: inWeek.length,
    })
  }

  return result
}

export function personalBests(
  sessions: WorkoutSession[],
): { exerciseId: string; exerciseName: string; weightKg: number; reps: number; volume: number }[] {
  const map = new Map<
    string,
    { exerciseId: string; exerciseName: string; weightKg: number; reps: number; volume: number }
  >()

  for (const session of completedSessions(sessions)) {
    for (const exercise of session.exercises) {
      for (const set of exercise.sets) {
        if (set.weightKg == null) continue
        const volume = set.weightKg * set.reps
        const existing = map.get(exercise.exerciseId)
        if (!existing || volume > existing.volume) {
          map.set(exercise.exerciseId, {
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            weightKg: set.weightKg,
            reps: set.reps,
            volume,
          })
        }
      }
    }
  }

  return [...map.values()].sort((a, b) => b.volume - a.volume)
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatKg(value: number | null | undefined): string {
  if (value == null) return '—'
  return Number.isInteger(value) ? `${value} кг` : `${value.toFixed(1)} кг`
}
