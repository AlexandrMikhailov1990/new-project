import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExercisePicker } from '../components/ExercisePicker'
import { createId } from '../lib/id'
import { useApp } from '../store/AppContext'
import type { Exercise, Program, ProgramDay } from '../types'

export function ProgramsPage() {
  const { data, startSession, startFreeSession, upsertProgram, deleteProgram, addExercise } =
    useApp()
  const navigate = useNavigate()
  const [editing, setEditing] = useState<Program | null>(null)
  const [creating, setCreating] = useState(false)

  const startDay = (program: Program, day: ProgramDay) => {
    startSession(program, day)
    navigate('/session')
  }

  return (
    <section className="rise">
      <div className="page-header">
        <p className="eyebrow">Программы</p>
        <h1>Выберите день</h1>
        <p className="muted">Стартовые сплиты можно править и дополнять своими упражнениями.</p>
      </div>

      <button
        className="btn btn-primary btn-block"
        style={{ marginTop: 12 }}
        type="button"
        onClick={() => {
          startFreeSession()
          navigate('/session')
        }}
      >
        Свободная тренировка
      </button>

      <div className="stack" style={{ marginTop: 16 }}>
        {data.programs.map((program, index) => (
          <article key={program.id} className={`panel rise rise-delay-${Math.min(index + 1, 3)}`}>
            <div className="row-between">
              <div>
                <strong style={{ fontFamily: 'var(--font-display)' }}>{program.name}</strong>
                <p className="muted tiny" style={{ margin: '6px 0 0' }}>
                  {program.description}
                </p>
              </div>
              <button className="btn btn-ghost" type="button" onClick={() => setEditing(program)}>
                Изменить
              </button>
            </div>

            <div className="stack" style={{ marginTop: 14 }}>
              {program.days.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  className="list-item"
                  onClick={() => startDay(program, day)}
                >
                  <strong>{day.name}</strong>
                  <p>
                    {day.exerciseIds
                      .map((id) => data.exercises.find((e) => e.id === id)?.name)
                      .filter(Boolean)
                      .slice(0, 3)
                      .join(' · ')}
                    {day.exerciseIds.length > 3 ? ` +${day.exerciseIds.length - 3}` : ''}
                  </p>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <button
        className="btn btn-secondary btn-block"
        style={{ marginTop: 16 }}
        type="button"
        onClick={() => setCreating(true)}
      >
        Новая программа
      </button>

      {(editing || creating) && (
        <ProgramEditor
          program={
            editing ?? {
              id: createId('prog'),
              name: '',
              description: '',
              days: [{ id: createId('day'), name: 'День 1', exerciseIds: [] }],
            }
          }
          exercises={data.exercises}
          onClose={() => {
            setEditing(null)
            setCreating(false)
          }}
          onSave={(program) => {
            upsertProgram(program)
            setEditing(null)
            setCreating(false)
          }}
          onDelete={
            editing
              ? () => {
                  deleteProgram(editing.id)
                  setEditing(null)
                }
              : undefined
          }
          onAddExercise={addExercise}
        />
      )}
    </section>
  )
}

function ProgramEditor({
  program,
  exercises,
  onClose,
  onSave,
  onDelete,
  onAddExercise,
}: {
  program: Program
  exercises: Exercise[]
  onClose: () => void
  onSave: (program: Program) => void
  onDelete?: () => void
  onAddExercise: (exercise: Omit<Exercise, 'id'> & { id?: string }) => Exercise
}) {
  const [draft, setDraft] = useState<Program>(structuredClone(program))

  const exerciseMap = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises])

  const toggleExercise = (dayId: string, exerciseId: string) => {
    setDraft((prev) => ({
      ...prev,
      days: prev.days.map((day) => {
        if (day.id !== dayId) return day
        const has = day.exerciseIds.includes(exerciseId)
        return {
          ...day,
          exerciseIds: has
            ? day.exerciseIds.filter((id) => id !== exerciseId)
            : [...day.exerciseIds, exerciseId],
        }
      }),
    }))
  }

  const addDay = () => {
    const day: ProgramDay = {
      id: createId('day'),
      name: `День ${draft.days.length + 1}`,
      exerciseIds: [],
    }
    setDraft((prev) => ({ ...prev, days: [...prev.days, day] }))
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Редактор программы"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{program.name ? 'Редактирование' : 'Новая программа'}</h2>

        <div className="stack">
          <div className="field">
            <label htmlFor="prog-name">Название</label>
            <input
              id="prog-name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="Например, Сила 4×"
            />
          </div>
          <div className="field">
            <label htmlFor="prog-desc">Описание</label>
            <textarea
              id="prog-desc"
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Кратко, для кого и как часто"
            />
          </div>

          {draft.days.map((day) => (
            <div key={day.id} className="panel" style={{ padding: 12 }}>
              <div className="field">
                <label>День</label>
                <input
                  value={day.name}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      days: prev.days.map((d) =>
                        d.id === day.id ? { ...d, name: e.target.value } : d,
                      ),
                    }))
                  }
                />
              </div>
              <div style={{ marginTop: 10 }}>
                <ExercisePicker
                  exercises={exercises}
                  multi
                  selectedIds={day.exerciseIds}
                  onToggle={(id) => toggleExercise(day.id, id)}
                  onCreate={onAddExercise}
                  title="Поиск / своё упражнение"
                  maxHeight={200}
                />
              </div>
              <p className="tiny muted" style={{ margin: '8px 0 0' }}>
                Выбрано:{' '}
                {day.exerciseIds.map((id) => exerciseMap.get(id)?.name).filter(Boolean).join(', ') ||
                  '—'}
              </p>
            </div>
          ))}

          <button className="btn btn-secondary" type="button" onClick={addDay}>
            Добавить день
          </button>
        </div>

        <div className="stack" style={{ marginTop: 16 }}>
          <button
            className="btn btn-primary btn-block"
            type="button"
            disabled={!draft.name.trim() || draft.days.every((d) => d.exerciseIds.length === 0)}
            onClick={() => onSave(draft)}
          >
            Сохранить
          </button>
          <button className="btn btn-secondary btn-block" type="button" onClick={onClose}>
            Отмена
          </button>
          {onDelete && (
            <button className="btn btn-danger btn-block" type="button" onClick={onDelete}>
              Удалить программу
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
