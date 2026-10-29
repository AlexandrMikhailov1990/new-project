import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTimer } from '../hooks/useTimer'
import {
  formatDate,
  formatDuration,
  formatKg,
  getExerciseHistory,
} from '../lib/stats'
import { useApp } from '../store/AppContext'

const DEFAULT_WORK = 45
const DEFAULT_REST = 90

export function SessionPage() {
  const { data, activeSession, addSet, removeSet, finishSession, abandonSession, updateActiveSession } =
    useApp()
  const timer = useTimer()
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [reps, setReps] = useState(10)
  const [weight, setWeight] = useState(40)
  const [workSeconds, setWorkSeconds] = useState(DEFAULT_WORK)
  const [restSeconds, setRestSeconds] = useState(DEFAULT_REST)
  const [customExerciseId, setCustomExerciseId] = useState('')

  const current = activeSession?.exercises[exerciseIndex]

  const history = useMemo(() => {
    if (!current || !activeSession) return null
    return getExerciseHistory(data.sessions, current.exerciseId, activeSession.id)
  }, [activeSession, current, data.sessions])

  useEffect(() => {
    if (!current) return
    const last = history?.lastSets.at(-1)
    if (last) {
      setReps(last.reps)
      if (last.weightKg != null) setWeight(last.weightKg)
      setWorkSeconds(last.workSeconds || DEFAULT_WORK)
      setRestSeconds(last.restSeconds || DEFAULT_REST)
    } else {
      setReps(current.usesWeight ? 8 : 12)
      setWeight(40)
      setWorkSeconds(DEFAULT_WORK)
      setRestSeconds(DEFAULT_REST)
    }
  }, [current?.exerciseId])

  if (!activeSession) {
    return (
      <section className="rise" style={{ paddingTop: 48 }}>
        <div className="page-header">
          <p className="eyebrow">Сессия</p>
          <h1>Готово к старту</h1>
          <p className="lede">Выберите день программы — и можно фиксировать подходы с таймером.</p>
        </div>
        <div className="stack" style={{ marginTop: 24 }}>
          <Link className="btn btn-primary btn-block" to="/programs">
            Выбрать программу
          </Link>
          <Link className="btn btn-secondary btn-block" to="/stats">
            Открыть статистику
          </Link>
        </div>
      </section>
    )
  }

  if (!current) {
    return (
      <section className="rise">
        <div className="empty">В этой сессии нет упражнений.</div>
      </section>
    )
  }

  const progress =
    timer.mode === 'idle' || !timer.remaining
      ? 0
      : timer.mode === 'work'
        ? ((workSeconds - timer.remaining) / workSeconds) * 100
        : ((restSeconds - timer.remaining) / restSeconds) * 100

  const saveSet = () => {
    addSet(current.exerciseId, {
      reps,
      weightKg: current.usesWeight ? weight : null,
      workSeconds,
      restSeconds,
    })
    timer.start('rest', restSeconds)
  }

  const availableToAdd = data.exercises.filter(
    (e) => !activeSession.exercises.some((log) => log.exerciseId === e.id),
  )

  const addExerciseToSession = () => {
    const exercise = data.exercises.find((e) => e.id === customExerciseId)
    if (!exercise) return
    updateActiveSession((session) => ({
      ...session,
      exercises: [
        ...session.exercises,
        {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          usesWeight: exercise.usesWeight,
          sets: [],
        },
      ],
    }))
    setCustomExerciseId('')
    setExerciseIndex(activeSession.exercises.length)
  }

  return (
    <section className="rise">
      <div className="page-header">
        <p className="eyebrow">
          {activeSession.programName} · {activeSession.dayName}
        </p>
        <h1>{current.exerciseName}</h1>
        <p className="muted tiny">
          Упражнение {exerciseIndex + 1} из {activeSession.exercises.length}
        </p>
      </div>

      <div
        className="timer-ring"
        data-mode={timer.mode}
        style={{ ['--progress' as string]: Math.max(0, Math.min(100, progress)) }}
      >
        <div>
          <strong>{formatDuration(timer.mode === 'idle' ? workSeconds : timer.remaining)}</strong>
          <small>
            {timer.mode === 'work' && 'Работа'}
            {timer.mode === 'rest' && 'Отдых'}
            {timer.mode === 'idle' && 'Таймер готов'}
          </small>
        </div>
      </div>

      <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => timer.start('work', workSeconds)}
        >
          Работа
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => timer.start('rest', restSeconds)}
        >
          Отдых
        </button>
        {timer.running ? (
          <button className="btn btn-ghost" type="button" onClick={timer.pause}>
            Пауза
          </button>
        ) : timer.mode !== 'idle' ? (
          <button className="btn btn-ghost" type="button" onClick={timer.resume}>
            Далее
          </button>
        ) : null}
        <button className="btn btn-ghost" type="button" onClick={timer.reset}>
          Сброс
        </button>
      </div>

      {history && (
        <div className="panel rise rise-delay-1" style={{ marginTop: 18 }}>
          <div className="row-between">
            <strong>Прошлые результаты</strong>
            <span className="chip chip-muted">{formatDate(history.lastSessionDate)}</span>
          </div>
          <div className="row" style={{ flexWrap: 'wrap', marginTop: 10, gap: 8 }}>
            <span className="chip">Лучший вес {formatKg(history.bestWeightKg)}</span>
            <span className="chip">Макс. повторы {history.bestReps ?? '—'}</span>
            <span className="chip chip-muted">
              Лучший объём{' '}
              {history.bestVolume != null ? `${Math.round(history.bestVolume)} кг` : '—'}
            </span>
          </div>
          {history.lastSets.length > 0 ? (
            <div style={{ marginTop: 8 }}>
              {history.lastSets.map((set, i) => (
                <div key={set.id} className="history-set">
                  <span>Подход {i + 1}</span>
                  <span>
                    {set.reps} повт.
                    {set.weightKg != null ? ` × ${formatKg(set.weightKg)}` : ''}
                    <span className="muted"> · отдых {formatDuration(set.restSeconds)}</span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted tiny" style={{ marginBottom: 0 }}>
              Для этого упражнения ещё нет истории — сегодняшние подходы станут ориентиром.
            </p>
          )}
        </div>
      )}

      <h2 className="section-title">Записать подход</h2>
      <div className="field-grid">
        <div className="field">
          <label htmlFor="reps">Повторы</label>
          <input
            id="reps"
            type="number"
            min={1}
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value) || 0)}
          />
        </div>
        {current.usesWeight ? (
          <div className="field">
            <label htmlFor="weight">Вес, кг</label>
            <input
              id="weight"
              type="number"
              min={0}
              step={0.5}
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) || 0)}
            />
          </div>
        ) : (
          <div className="field">
            <label>Вес</label>
            <input value="Свой вес" disabled />
          </div>
        )}
        <div className="field">
          <label htmlFor="work">Работа, сек</label>
          <input
            id="work"
            type="number"
            min={1}
            inputMode="numeric"
            value={workSeconds}
            onChange={(e) => setWorkSeconds(Number(e.target.value) || 0)}
          />
        </div>
        <div className="field">
          <label htmlFor="rest">Отдых, сек</label>
          <input
            id="rest"
            type="number"
            min={1}
            inputMode="numeric"
            value={restSeconds}
            onChange={(e) => setRestSeconds(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <button
        className="btn btn-primary btn-block"
        style={{ marginTop: 12 }}
        type="button"
        disabled={reps <= 0 || workSeconds <= 0 || restSeconds <= 0}
        onClick={saveSet}
      >
        Сохранить подход и отдых
      </button>

      <div className="set-list" style={{ marginTop: 16 }}>
        {current.sets.length === 0 && (
          <div className="empty">Пока нет подходов по этому упражнению.</div>
        )}
        {current.sets.map((set, i) => (
          <div key={set.id} className="set-row">
            <span className="chip">{i + 1}</span>
            <div>
              <strong>
                {set.reps} повт.
                {set.weightKg != null ? ` · ${formatKg(set.weightKg)}` : ''}
              </strong>
              <div className="tiny muted">
                работа {formatDuration(set.workSeconds)} · отдых {formatDuration(set.restSeconds)}
              </div>
            </div>
            <button
              className="btn btn-ghost"
              type="button"
              aria-label="Удалить подход"
              onClick={() => removeSet(current.exerciseId, set.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: 18 }}>
        <button
          className="btn btn-secondary"
          type="button"
          disabled={exerciseIndex === 0}
          onClick={() => setExerciseIndex((i) => Math.max(0, i - 1))}
        >
          Назад
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          disabled={exerciseIndex >= activeSession.exercises.length - 1}
          onClick={() =>
            setExerciseIndex((i) => Math.min(activeSession.exercises.length - 1, i + 1))
          }
        >
          Далее
        </button>
      </div>

      <div className="panel" style={{ marginTop: 18 }}>
        <strong>Упражнения сессии</strong>
        <div className="stack" style={{ marginTop: 10 }}>
          {activeSession.exercises.map((exercise, index) => (
            <button
              key={exercise.exerciseId}
              type="button"
              className="list-item"
              onClick={() => setExerciseIndex(index)}
              style={
                index === exerciseIndex
                  ? { borderColor: 'rgba(212, 255, 79, 0.55)' }
                  : undefined
              }
            >
              <strong>{exercise.exerciseName}</strong>
              <p>{exercise.sets.length} подходов</p>
            </button>
          ))}
        </div>

        {availableToAdd.length > 0 && (
          <div className="field-grid" style={{ marginTop: 12 }}>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="add-ex">Добавить упражнение</label>
              <select
                id="add-ex"
                value={customExerciseId}
                onChange={(e) => setCustomExerciseId(e.target.value)}
              >
                <option value="">Выберите…</option>
                {availableToAdd.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn btn-secondary btn-block"
              style={{ gridColumn: '1 / -1' }}
              type="button"
              disabled={!customExerciseId}
              onClick={addExerciseToSession}
            >
              Добавить в сессию
            </button>
          </div>
        )}
      </div>

      <div className="stack" style={{ marginTop: 18 }}>
        <button
          className="btn btn-primary btn-block"
          type="button"
          onClick={() => {
            timer.reset()
            finishSession()
          }}
        >
          Завершить тренировку
        </button>
        <button
          className="btn btn-danger btn-block"
          type="button"
          onClick={() => {
            timer.reset()
            abandonSession()
          }}
        >
          Отменить сессию
        </button>
      </div>
    </section>
  )
}
