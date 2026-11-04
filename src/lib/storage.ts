import { createSeedData } from '../data/seed'
import type { AppData } from '../types'

const STORAGE_KEY = 'trenazher-app-v1'

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedData()
    const parsed = JSON.parse(raw) as AppData
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.programs)) {
      return createSeedData()
    }
    return {
      version: 1,
      exercises: parsed.exercises ?? [],
      programs: parsed.programs ?? [],
      sessions: parsed.sessions ?? [],
    }
  } catch {
    return createSeedData()
  }
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetAppData(): AppData {
  const data = createSeedData()
  saveAppData(data)
  return data
}
