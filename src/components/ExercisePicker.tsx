import { useMemo, useState } from 'react'
import { filterExercises } from '../lib/search'
import type { Exercise } from '../types'

type Props = {
  exercises: Exercise[]
  /** Already selected ids (hidden or marked). */
  excludeIds?: string[]
  multi?: boolean
  selectedIds?: string[]
  onToggle?: (exerciseId: string) => void
  onPick?: (exercise: Exercise) => void
  title?: string
  maxHeight?: number | string
}

export function ExercisePicker({
  exercises,
  excludeIds = [],
  multi = false,
  selectedIds = [],
  onToggle,
  onPick,
  title = 'Упражнения',
  maxHeight = 280,
}: Props) {
  const [query, setQuery] = useState('')
  const excluded = useMemo(() => new Set(excludeIds), [excludeIds])
  const selected = useMemo(() => new Set(selectedIds), [selectedIds])

  const list = useMemo(() => {
    const base = exercises.filter((e) => !excluded.has(e.id))
    return filterExercises(base, query)
  }, [exercises, excluded, query])

  const byGroup = useMemo(() => {
    const map = new Map<string, Exercise[]>()
    for (const ex of list) {
      const arr = map.get(ex.muscleGroup) ?? []
      arr.push(ex)
      map.set(ex.muscleGroup, arr)
    }
    return [...map.entries()]
  }, [list])

  return (
    <div className="exercise-picker">
      <div className="field">
        <label htmlFor="ex-search">{title}</label>
        <input
          id="ex-search"
          type="search"
          enterKeyHint="search"
          placeholder="Поиск: жим, тяга, присед…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>
      <p className="tiny muted" style={{ margin: '6px 0 0' }}>
        Найдено: {list.length}
      </p>
      <div className="stack" style={{ marginTop: 10, maxHeight, overflow: 'auto' }}>
        {list.length === 0 && <div className="empty">Ничего не найдено.</div>}
        {byGroup.map(([group, items]) => (
          <div key={group}>
            <div className="tiny muted" style={{ marginBottom: 6, fontWeight: 700 }}>
              {group}
            </div>
            <div className="stack" style={{ gap: 6 }}>
              {items.map((exercise) => {
                const on = selected.has(exercise.id)
                return (
                  <button
                    key={exercise.id}
                    type="button"
                    className="row"
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      minHeight: 48,
                      width: '100%',
                      padding: '8px 4px',
                    }}
                    onClick={() => {
                      if (multi && onToggle) onToggle(exercise.id)
                      else if (onPick) onPick(exercise)
                    }}
                  >
                    {multi ? (
                      <span className={`check ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
                    ) : (
                      <span className="chip chip-muted" style={{ flexShrink: 0 }}>
                        +
                      </span>
                    )}
                    <span>
                      {exercise.name}
                      <span className="muted tiny">
                        {' '}
                        · {exercise.usesWeight ? 'вес' : 'свой вес'}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
