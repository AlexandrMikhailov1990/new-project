import { useMemo, useState } from 'react'
import { filterExercises } from '../lib/search'
import type { Exercise } from '../types'

const GROUPS = ['Ноги', 'Грудь', 'Спина', 'Плечи', 'Руки', 'Кор', 'Функционал', 'Кардио', 'Своё']

type Props = {
  exercises: Exercise[]
  /** Already selected ids (hidden or marked). */
  excludeIds?: string[]
  multi?: boolean
  selectedIds?: string[]
  onToggle?: (exerciseId: string) => void
  onPick?: (exercise: Exercise) => void
  /** Persist into catalog; return the stored exercise (may reuse existing by name). */
  onCreate?: (draft: Omit<Exercise, 'id'>) => Exercise
  title?: string
  maxHeight?: number | string
  allowCreate?: boolean
}

export function ExercisePicker({
  exercises,
  excludeIds = [],
  multi = false,
  selectedIds = [],
  onToggle,
  onPick,
  onCreate,
  title = 'Упражнения',
  maxHeight = 280,
  allowCreate = true,
}: Props) {
  const [query, setQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newGroup, setNewGroup] = useState('Своё')
  const [usesWeight, setUsesWeight] = useState(true)

  const excluded = useMemo(() => new Set(excludeIds), [excludeIds])
  const selected = useMemo(() => new Set(selectedIds), [selectedIds])

  const list = useMemo(() => filterExercises(exercises, query), [exercises, query])

  const byGroup = useMemo(() => {
    const map = new Map<string, Exercise[]>()
    for (const ex of list) {
      const arr = map.get(ex.muscleGroup) ?? []
      arr.push(ex)
      map.set(ex.muscleGroup, arr)
    }
    return [...map.entries()]
  }, [list])

  const createAndUse = () => {
    const name = newName.trim()
    if (!name || !onCreate) return
    const exercise = onCreate({
      name,
      muscleGroup: newGroup,
      usesWeight,
    })
    setNewName('')
    setShowCreate(false)
    setQuery('')
    if (multi && onToggle) onToggle(exercise.id)
    else if (onPick) onPick(exercise)
  }

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
      <div className="row-between" style={{ marginTop: 8, flexWrap: 'wrap', gap: 8 }}>
        <p className="tiny muted" style={{ margin: 0 }}>
          Найдено: {list.length}
        </p>
        {allowCreate && onCreate && (
          <button
            className="btn btn-secondary"
            type="button"
            style={{ minHeight: 40, padding: '0 14px' }}
            onClick={() => {
              setShowCreate((v) => !v)
              if (!newName.trim() && query.trim()) setNewName(query.trim())
            }}
          >
            {showCreate ? 'Скрыть форму' : 'Своё упражнение'}
          </button>
        )}
      </div>

      {allowCreate && onCreate && showCreate && (
        <div className="panel" style={{ marginTop: 10, padding: 12 }}>
          <strong className="tiny">Новое в каталог</strong>
          <div className="stack" style={{ marginTop: 8 }}>
            <div className="field">
              <label htmlFor="ex-new-name">Название</label>
              <input
                id="ex-new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Например, Жим в Смите"
              />
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="ex-new-group">Группа</label>
                <select
                  id="ex-new-group"
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                >
                  {GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="ex-new-weight">Вес</label>
                <select
                  id="ex-new-weight"
                  value={usesWeight ? 'yes' : 'no'}
                  onChange={(e) => setUsesWeight(e.target.value === 'yes')}
                >
                  <option value="yes">Со штангой / гантелями</option>
                  <option value="no">Свой вес</option>
                </select>
              </div>
            </div>
            <button
              className="btn btn-primary btn-block"
              type="button"
              disabled={!newName.trim()}
              onClick={createAndUse}
            >
              {multi ? 'Создать и отметить' : 'Создать и добавить'}
            </button>
          </div>
        </div>
      )}

      <div className="stack" style={{ marginTop: 10, maxHeight, overflow: 'auto' }}>
        {list.length === 0 && (
          <div className="empty">
            Ничего не найдено.
            {allowCreate && onCreate ? ' Создайте своё упражнение выше.' : ''}
          </div>
        )}
        {byGroup.map(([group, items]) => (
          <div key={group}>
            <div className="tiny muted" style={{ marginBottom: 6, fontWeight: 700 }}>
              {group}
            </div>
            <div className="stack" style={{ gap: 6 }}>
              {items.map((exercise) => {
                const on = selected.has(exercise.id)
                const alreadyIn = !multi && excluded.has(exercise.id)
                return (
                  <button
                    key={exercise.id}
                    type="button"
                    className="row"
                    disabled={alreadyIn}
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      minHeight: 48,
                      width: '100%',
                      padding: '8px 4px',
                      opacity: alreadyIn ? 0.55 : 1,
                    }}
                    onClick={() => {
                      if (alreadyIn) return
                      if (multi && onToggle) onToggle(exercise.id)
                      else if (onPick) onPick(exercise)
                    }}
                  >
                    {multi ? (
                      <span className={`check ${on ? 'on' : ''}`}>{on ? '✓' : ''}</span>
                    ) : alreadyIn ? (
                      <span className="chip chip-muted" style={{ flexShrink: 0 }}>
                        ✓
                      </span>
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
                        {alreadyIn ? ' · уже в сессии' : ''}
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
