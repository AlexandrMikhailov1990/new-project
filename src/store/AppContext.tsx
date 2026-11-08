import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createId } from '../lib/id'
import { loadAppData, saveAppData } from '../lib/storage'
import type {
  AppData,
  Exercise,
  Program,
  ProgramDay,
  SetRecord,
  WorkoutSession,
} from '../types'

type AppContextValue = {
  data: AppData
  activeSession: WorkoutSession | null
  upsertProgram: (program: Program) => void
  deleteProgram: (programId: string) => void
  addExercise: (exercise: Omit<Exercise, 'id'> & { id?: string }) => Exercise
  startSession: (program: Program, day: ProgramDay) => WorkoutSession
  startFreeSession: () => WorkoutSession
  updateActiveSession: (updater: (session: WorkoutSession) => WorkoutSession) => void
  addSet: (exerciseId: string, set: Omit<SetRecord, 'id' | 'completedAt'>) => void
  removeSet: (exerciseId: string, setId: string) => void
  finishSession: () => void
  abandonSession: () => void
  deleteSession: (sessionId: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

function abandonActives(sessions: WorkoutSession[]): WorkoutSession[] {
  const now = new Date().toISOString()
  return sessions.map((s) =>
    s.status === 'active' ? { ...s, status: 'abandoned' as const, finishedAt: now } : s,
  )
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadAppData())

  useEffect(() => {
    saveAppData(data)
  }, [data])

  const activeSession = useMemo(
    () => data.sessions.find((s) => s.status === 'active') ?? null,
    [data.sessions],
  )

  const value = useMemo<AppContextValue>(() => {
    const upsertProgram = (program: Program) => {
      setData((prev) => {
        const exists = prev.programs.some((p) => p.id === program.id)
        return {
          ...prev,
          programs: exists
            ? prev.programs.map((p) => (p.id === program.id ? program : p))
            : [...prev.programs, program],
        }
      })
    }

    const deleteProgram = (programId: string) => {
      setData((prev) => ({
        ...prev,
        programs: prev.programs.filter((p) => p.id !== programId),
      }))
    }

    const addExercise = (exercise: Omit<Exercise, 'id'> & { id?: string }): Exercise => {
      const next: Exercise = {
        id: exercise.id ?? createId('ex'),
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        usesWeight: exercise.usesWeight,
      }
      setData((prev) => {
        if (prev.exercises.some((e) => e.id === next.id)) return prev
        return { ...prev, exercises: [...prev.exercises, next] }
      })
      return next
    }

    const startSession = (program: Program, day: ProgramDay): WorkoutSession => {
      const exercises = day.exerciseIds
        .map((id) => data.exercises.find((e) => e.id === id))
        .filter((e): e is Exercise => Boolean(e))
        .map((e) => ({
          exerciseId: e.id,
          exerciseName: e.name,
          usesWeight: e.usesWeight,
          sets: [] as SetRecord[],
        }))

      const session: WorkoutSession = {
        id: createId('session'),
        programId: program.id,
        programName: program.name,
        dayId: day.id,
        dayName: day.name,
        startedAt: new Date().toISOString(),
        finishedAt: null,
        exercises,
        status: 'active',
      }

      setData((prev) => ({
        ...prev,
        sessions: [...abandonActives(prev.sessions), session],
      }))

      return session
    }

    const startFreeSession = (): WorkoutSession => {
      const session: WorkoutSession = {
        id: createId('session'),
        programId: 'free',
        programName: 'Свободная',
        dayId: 'free',
        dayName: 'Без программы',
        startedAt: new Date().toISOString(),
        finishedAt: null,
        exercises: [],
        status: 'active',
      }

      setData((prev) => ({
        ...prev,
        sessions: [...abandonActives(prev.sessions), session],
      }))

      return session
    }

    const updateActiveSession = (updater: (session: WorkoutSession) => WorkoutSession) => {
      setData((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) => (s.status === 'active' ? updater(s) : s)),
      }))
    }

    const addSet = (exerciseId: string, set: Omit<SetRecord, 'id' | 'completedAt'>) => {
      updateActiveSession((session) => ({
        ...session,
        exercises: session.exercises.map((exercise) => {
          if (exercise.exerciseId !== exerciseId) return exercise
          return {
            ...exercise,
            sets: [
              ...exercise.sets,
              {
                ...set,
                id: createId('set'),
                completedAt: new Date().toISOString(),
              },
            ],
          }
        }),
      }))
    }

    const removeSet = (exerciseId: string, setId: string) => {
      updateActiveSession((session) => ({
        ...session,
        exercises: session.exercises.map((exercise) => {
          if (exercise.exerciseId !== exerciseId) return exercise
          return { ...exercise, sets: exercise.sets.filter((s) => s.id !== setId) }
        }),
      }))
    }

    const finishSession = () => {
      updateActiveSession((session) => ({
        ...session,
        status: 'completed',
        finishedAt: new Date().toISOString(),
      }))
    }

    const abandonSession = () => {
      updateActiveSession((session) => ({
        ...session,
        status: 'abandoned',
        finishedAt: new Date().toISOString(),
      }))
    }

    const deleteSession = (sessionId: string) => {
      setData((prev) => ({
        ...prev,
        sessions: prev.sessions.filter((s) => s.id !== sessionId),
      }))
    }

    return {
      data,
      activeSession,
      upsertProgram,
      deleteProgram,
      addExercise,
      startSession,
      startFreeSession,
      updateActiveSession,
      addSet,
      removeSet,
      finishSession,
      abandonSession,
      deleteSession,
    }
  }, [data, activeSession])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
