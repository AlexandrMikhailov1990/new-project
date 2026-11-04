import type { AppData, Exercise, Program } from '../types'

export const SEED_EXERCISES: Exercise[] = [
  { id: 'ex-squat', name: 'Приседания со штангой', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-rdl', name: 'Румынская тяга', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-legpress', name: 'Жим ногами', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-lunge', name: 'Выпады с гантелями', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-calf', name: 'Подъёмы на носки', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-bench', name: 'Жим лёжа', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-incline', name: 'Жим на наклонной', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-fly', name: 'Разведения гантелей', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-ohp', name: 'Жим стоя', muscleGroup: 'Плечи', usesWeight: true },
  { id: 'ex-lateral', name: 'Махи в стороны', muscleGroup: 'Плечи', usesWeight: true },
  { id: 'ex-row', name: 'Тяга штанги в наклоне', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-pulldown', name: 'Тяга верхнего блока', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-deadlift', name: 'Становая тяга', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-pullup', name: 'Подтягивания', muscleGroup: 'Спина', usesWeight: false },
  { id: 'ex-curl', name: 'Сгибания на бицепс', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-triceps', name: 'Разгибания на трицепс', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-plank', name: 'Планка', muscleGroup: 'Кор', usesWeight: false },
  { id: 'ex-crunch', name: 'Скручивания', muscleGroup: 'Кор', usesWeight: false },
  { id: 'ex-hipthrust', name: 'Ягодичный мост', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-facepull', name: 'Разведения на заднюю дельту', muscleGroup: 'Плечи', usesWeight: true },
]

export const SEED_PROGRAMS: Program[] = [
  {
    id: 'prog-fullbody',
    name: 'Фулбади',
    description: 'Три тренировки в неделю на всё тело. Удобно, если ходите 2–3 раза.',
    days: [
      {
        id: 'fb-a',
        name: 'День A',
        exerciseIds: ['ex-squat', 'ex-bench', 'ex-row', 'ex-ohp', 'ex-plank'],
      },
      {
        id: 'fb-b',
        name: 'День B',
        exerciseIds: ['ex-deadlift', 'ex-incline', 'ex-pulldown', 'ex-lunge', 'ex-crunch'],
      },
      {
        id: 'fb-c',
        name: 'День C',
        exerciseIds: ['ex-legpress', 'ex-ohp', 'ex-pullup', 'ex-hipthrust', 'ex-curl'],
      },
    ],
  },
  {
    id: 'prog-ppl',
    name: 'Жим / Тяга / Ноги',
    description: 'Классический сплит push/pull/legs. Можно крутить 3 или 6 дней в неделю.',
    days: [
      {
        id: 'ppl-push',
        name: 'Жим',
        exerciseIds: ['ex-bench', 'ex-incline', 'ex-ohp', 'ex-lateral', 'ex-triceps'],
      },
      {
        id: 'ppl-pull',
        name: 'Тяга',
        exerciseIds: ['ex-deadlift', 'ex-row', 'ex-pulldown', 'ex-facepull', 'ex-curl'],
      },
      {
        id: 'ppl-legs',
        name: 'Ноги',
        exerciseIds: ['ex-squat', 'ex-rdl', 'ex-legpress', 'ex-lunge', 'ex-calf', 'ex-plank'],
      },
    ],
  },
  {
    id: 'prog-ul',
    name: 'Верх / Низ',
    description: 'Чередование верха и низа. Хорошо для 4 тренировок в неделю.',
    days: [
      {
        id: 'ul-upper-a',
        name: 'Верх A',
        exerciseIds: ['ex-bench', 'ex-row', 'ex-ohp', 'ex-pulldown', 'ex-curl', 'ex-triceps'],
      },
      {
        id: 'ul-lower-a',
        name: 'Низ A',
        exerciseIds: ['ex-squat', 'ex-rdl', 'ex-legpress', 'ex-calf', 'ex-plank'],
      },
      {
        id: 'ul-upper-b',
        name: 'Верх B',
        exerciseIds: ['ex-incline', 'ex-pullup', 'ex-lateral', 'ex-fly', 'ex-facepull'],
      },
      {
        id: 'ul-lower-b',
        name: 'Низ B',
        exerciseIds: ['ex-deadlift', 'ex-lunge', 'ex-hipthrust', 'ex-calf', 'ex-crunch'],
      },
    ],
  },
]

export function createSeedData(): AppData {
  return {
    version: 1,
    exercises: structuredClone(SEED_EXERCISES),
    programs: structuredClone(SEED_PROGRAMS),
    sessions: [],
  }
}
