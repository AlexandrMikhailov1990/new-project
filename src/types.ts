export type Exercise = {
  id: string
  name: string
  muscleGroup: string
  usesWeight: boolean
}

export type ProgramDay = {
  id: string
  name: string
  exerciseIds: string[]
}

export type Program = {
  id: string
  name: string
  description: string
  days: ProgramDay[]
}

export type SetRecord = {
  id: string
  reps: number
  weightKg: number | null
  workSeconds: number
  restSeconds: number
  completedAt: string
}

export type ExerciseLog = {
  exerciseId: string
  exerciseName: string
  usesWeight: boolean
  sets: SetRecord[]
}

export type WorkoutSession = {
  id: string
  programId: string
  programName: string
  dayId: string
  dayName: string
  startedAt: string
  finishedAt: string | null
  exercises: ExerciseLog[]
  status: 'active' | 'completed' | 'abandoned'
}

export type AppData = {
  version: 1
  exercises: Exercise[]
  programs: Program[]
  sessions: WorkoutSession[]
}

export type ExerciseHistory = {
  lastSets: SetRecord[]
  lastSessionDate: string | null
  bestWeightKg: number | null
  bestReps: number | null
  bestVolume: number | null
  totalSets: number
}
