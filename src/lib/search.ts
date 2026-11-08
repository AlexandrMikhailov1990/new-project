import type { Exercise } from '../types'

/** Case-insensitive: query matches if every whitespace-separated token is a substring of the name. */
export function matchesExerciseName(name: string, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const hay = name.toLowerCase()
  return q.split(/\s+/).every((token) => hay.includes(token))
}

export function filterExercises(exercises: Exercise[], query: string): Exercise[] {
  return exercises.filter((e) => matchesExerciseName(e.name, query))
}
