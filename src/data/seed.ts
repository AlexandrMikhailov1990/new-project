import type { AppData, Exercise, Program } from '../types'

export const SEED_EXERCISES: Exercise[] = [
  // Ноги
  { id: 'ex-squat', name: 'Приседания со штангой', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-front-squat', name: 'Фронтальные приседания', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-goblet', name: 'Гоблет-приседания', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-hack', name: 'Гакк-приседания', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-legpress', name: 'Жим ногами', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-rdl', name: 'Румынская тяга', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-stiff-dl', name: 'Тяга на прямых ногах', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-lunge', name: 'Выпады с гантелями', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-walking-lunge', name: 'Выпады в ходьбе', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-bulgarian', name: 'Болгарские выпады', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-leg-ext', name: 'Разгибания ног в тренажёре', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-leg-curl', name: 'Сгибания ног лёжа', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-leg-curl-sit', name: 'Сгибания ног сидя', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-hipthrust', name: 'Ягодичный мост', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-abductor', name: 'Отведения бедра', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-adductor', name: 'Сведения бедра', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-calf', name: 'Подъёмы на носки стоя', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-calf-sit', name: 'Подъёмы на носки сидя', muscleGroup: 'Ноги', usesWeight: true },
  { id: 'ex-stepup', name: 'Зашагивания на тумбу', muscleGroup: 'Ноги', usesWeight: true },
  // Грудь
  { id: 'ex-bench', name: 'Жим лёжа', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-bench-db', name: 'Жим гантелей лёжа', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-incline', name: 'Жим на наклонной', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-incline-db', name: 'Жим гантелей на наклонной', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-decline', name: 'Жим на обратно-наклонной', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-fly', name: 'Разведения гантелей лёжа', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-cable-fly', name: 'Сведения в кроссовере', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-pec-deck', name: 'Бабочка (pec deck)', muscleGroup: 'Грудь', usesWeight: true },
  { id: 'ex-pushup', name: 'Отжимания от пола', muscleGroup: 'Грудь', usesWeight: false },
  { id: 'ex-dip-chest', name: 'Отжимания на брусьях (грудь)', muscleGroup: 'Грудь', usesWeight: false },
  // Спина
  { id: 'ex-deadlift', name: 'Становая тяга', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-sumo-dl', name: 'Становая тяга сумо', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-row', name: 'Тяга штанги в наклоне', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-row-db', name: 'Тяга гантели в наклоне', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-seated-row', name: 'Тяга горизонтального блока', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-pulldown', name: 'Тяга верхнего блока', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-pulldown-rev', name: 'Тяга верхнего блока обратным хватом', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-pullup', name: 'Подтягивания', muscleGroup: 'Спина', usesWeight: false },
  { id: 'ex-chinup', name: 'Подтягивания обратным хватом', muscleGroup: 'Спина', usesWeight: false },
  { id: 'ex-lat-pullover', name: 'Пуловер', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-tbar', name: 'Тяга Т-грифа', muscleGroup: 'Спина', usesWeight: true },
  { id: 'ex-hyperext', name: 'Гиперэкстензия', muscleGroup: 'Спина', usesWeight: false },
  { id: 'ex-shrug', name: 'Шраги со штангой', muscleGroup: 'Спина', usesWeight: true },
  // Плечи
  { id: 'ex-ohp', name: 'Жим стоя', muscleGroup: 'Плечи', usesWeight: true },
  { id: 'ex-ohp-sit', name: 'Жим сидя', muscleGroup: 'Плечи', usesWeight: true },
  { id: 'ex-ohp-db', name: 'Жим гантелей сидя', muscleGroup: 'Плечи', usesWeight: true },
  { id: 'ex-arnold', name: 'Жим Арнольда', muscleGroup: 'Плечи', usesWeight: true },
  { id: 'ex-lateral', name: 'Махи в стороны', muscleGroup: 'Плечи', usesWeight: true },
  { id: 'ex-front-raise', name: 'Махи вперёд', muscleGroup: 'Плечи', usesWeight: true },
  { id: 'ex-facepull', name: 'Разведения на заднюю дельту', muscleGroup: 'Плечи', usesWeight: true },
  { id: 'ex-rear-delt', name: 'Разведения в наклоне', muscleGroup: 'Плечи', usesWeight: true },
  { id: 'ex-upright-row', name: 'Тяга к подбородку', muscleGroup: 'Плечи', usesWeight: true },
  // Руки
  { id: 'ex-curl', name: 'Сгибания на бицепс со штангой', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-curl-db', name: 'Сгибания на бицепс с гантелями', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-hammer', name: 'Молотки', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-curl-cable', name: 'Сгибания на бицепс на блоке', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-curl-conc', name: 'Концентрированные сгибания', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-triceps', name: 'Разгибания на трицепс на блоке', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-skull', name: 'Французский жим', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-oh-ext', name: 'Разгибания из-за головы', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-close-bench', name: 'Жим узким хватом', muscleGroup: 'Руки', usesWeight: true },
  { id: 'ex-dip-tri', name: 'Отжимания на брусьях (трицепс)', muscleGroup: 'Руки', usesWeight: false },
  { id: 'ex-wrist-curl', name: 'Сгибания запястий', muscleGroup: 'Руки', usesWeight: true },
  // Кор
  { id: 'ex-plank', name: 'Планка', muscleGroup: 'Кор', usesWeight: false },
  { id: 'ex-side-plank', name: 'Боковая планка', muscleGroup: 'Кор', usesWeight: false },
  { id: 'ex-crunch', name: 'Скручивания', muscleGroup: 'Кор', usesWeight: false },
  { id: 'ex-cable-crunch', name: 'Скручивания на блоке', muscleGroup: 'Кор', usesWeight: true },
  { id: 'ex-hanging-leg', name: 'Подъёмы ног в висе', muscleGroup: 'Кор', usesWeight: false },
  { id: 'ex-lying-leg', name: 'Подъёмы ног лёжа', muscleGroup: 'Кор', usesWeight: false },
  { id: 'ex-ab-wheel', name: 'Ролик для пресса', muscleGroup: 'Кор', usesWeight: false },
  { id: 'ex-russian', name: 'Русские скручивания', muscleGroup: 'Кор', usesWeight: false },
  { id: 'ex-pallof', name: 'Жим Паллофа', muscleGroup: 'Кор', usesWeight: true },
  // Кардио / функционал
  { id: 'ex-farmer', name: 'Прогулка фермера', muscleGroup: 'Функционал', usesWeight: true },
  { id: 'ex-kb-swing', name: 'Махи гирей', muscleGroup: 'Функционал', usesWeight: true },
  { id: 'ex-burpee', name: 'Бёрпи', muscleGroup: 'Функционал', usesWeight: false },
  { id: 'ex-box-jump', name: 'Запрыгивания на тумбу', muscleGroup: 'Функционал', usesWeight: false },
  { id: 'ex-row-erg', name: 'Гребной тренажёр', muscleGroup: 'Кардио', usesWeight: false },
  { id: 'ex-bike', name: 'Велотренажёр', muscleGroup: 'Кардио', usesWeight: false },
  { id: 'ex-treadmill', name: 'Беговая дорожка', muscleGroup: 'Кардио', usesWeight: false },
  { id: 'ex-ski-erg', name: 'Лыжный тренажёр', muscleGroup: 'Кардио', usesWeight: false },
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

/** Merge catalog seed into stored exercises (keep custom / renamed by id). */
export function mergeSeedExercises(existing: Exercise[]): Exercise[] {
  const byId = new Map(existing.map((e) => [e.id, e]))
  for (const seed of SEED_EXERCISES) {
    if (!byId.has(seed.id)) byId.set(seed.id, structuredClone(seed))
  }
  // Keep custom exercises (non-seed ids) + seed order first
  const seedIds = new Set(SEED_EXERCISES.map((e) => e.id))
  const merged = SEED_EXERCISES.map((s) => byId.get(s.id)!)
  for (const ex of existing) {
    if (!seedIds.has(ex.id)) merged.push(ex)
  }
  return merged
}

export function createSeedData(): AppData {
  return {
    version: 1,
    exercises: structuredClone(SEED_EXERCISES),
    programs: structuredClone(SEED_PROGRAMS),
    sessions: [],
  }
}
