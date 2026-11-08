import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ExercisePicker } from '../components/ExercisePicker'
import { Stepper } from '../components/Stepper'
import { useTimer } from '../hooks/useTimer'
import { useWakeLock } from '../hooks/useWakeLock'
import {
  formatDate,
  formatDuration,
  formatKg,
  getExerciseHistory,
} from '../lib/stats'
import { useApp } from '../store/AppContext'
import type { Exercise } from '../types'

const DEFAULT_WORK = 45
const DEFAULT_REST = 90

export function SessionPage() {
  const navigate = useNavigate()
  const {
    data,
    activeSession,
    addSet,
    removeSet,
    finishSession,
    abandonSession,
    updateActiveSession,
    startFreeSession,
  } = useApp()
  const timer = useTimer()
  useWakeLock(timer.running)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [reps, setReps] = useState(10)
  const [weight, setWeight] = useState(40)
  const [workSeconds, setWorkSeconds] = useState(DEFAULT_WORK)
  const [restSeconds, setRestSeconds] = useState(DEFAULT_REST)
  const [showPicker, setShowPicker] = useState(false)

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

  const beginFree = () => {
    startFreeSession()
    setExerciseIndex(0)
    setShowPicker(true)
    navigate('/session')
  }

  if (!activeSession) {
    return (
      <section className="rise session-idle">
        <div className="page-header">
          <p className="eyebrow">Сессия</p>
          <h1>Готово к старту</h1>
          <p className="lede">
            Свободная тренировка — без программы: выбирайте упражнения по ходу. Или возьмите день из
            сплита.
          </p>
        </div>
        <div className="stack" style={{ marginTop: 24 }}>
          <button className="btn btn-primary btn-block" type="button" onClick={beginFree}>
            Свободная тренировка
          </button>
          <Link className="btn btn-secondary btn-block" to="/programs">
            Выбрать программу
          </Link>
          <Link className="btn btn-ghost btn-block" to="/stats">
            Открыть статистику
          </Link>
        </div>
      </section>
    )
  }

  const addExerciseToSession = (exercise: Exercise) => {
    if (activeSession.exercises.some((e) => e.exerciseId === exercise.id)) {
      setShowPicker(false)
      return
    }
    const nextIndex = activeSession.exercises.length
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
    setExerciseIndex(nextIndex)
    setShowPicker(false)
  }

  if (activeSession.exercises.length === 0 || showPicker) {
    return (
      <section className="rise">
        <div className="page-header">
          <p className="eyebrow">
            {activeSession.programName} · {activeSession.dayName}
          </p>
          <h1>{activeSession.exercises.length === 0 ? 'Добавьте упражнение' : 'Ещё упражнение'}</h1>
          <p className="muted tiny">Поиск по любой части названия.</p>
        </div>
        <div className="panel" style={{ marginTop: 12 }}>
          <ExercisePicker
            exercises={data.exercises}
            excludeIds={activeSession.exercises.map((e) => e.exerciseId)}
            onPick={addExerciseToSession}
            title="Каталог"
            maxHeight="55vh"
          />
        </div>
        {activeSession.exercises.length > 0 && (
          <button
            className="btn btn-secondary btn-block"
            style={{ marginTop: 12 }}
            type="button"
            onClick={() => setShowPicker(false)}
          >
            Назад к сессии
          </button>
        )}
        <button
          className="btn btn-danger btn-block"
          style={{ marginTop: 10 }}
          type="button"
          onClick={() => {
            timer.reset()
            abandonSession()
          }}
        >
          Отменить сессию
        </button>
      </section>
    )
  }

  if (!current) {
    return (
      <section className="rise">
        <div className="empty">Упражнение не выбрано.</div>
      </section>
    )
  }

  const durationTarget = timer.mode === 'work' ? workSeconds : restSeconds
  const progress =
    timer.mode === 'idle' || !timer.remaining || durationTarget <= 0
      ? 0
      : ((durationTarget - timer.remaining) / durationTarget) * 100

  const saveSet = () => {
    addSet(current.exerciseId, {
      reps,
      weightKg: current.usesWeight ? weight : null,
      workSeconds,
      restSeconds,
    })
    timer.start('rest', restSeconds)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleTimerTap = () => {
    if (timer.running) {
      timer.pause()
      return
    }
    if (timer.mode !== 'idle') {
      timer.resume()
      return
    }
    timer.start('work', workSeconds)
  }

  const completeWorkout = () => {
    timer.reset()
    finishSession()
    navigate('/stats')
  }

  return (
    <section className="rise session-active">
      <div className="page-header">
        <p className="eyebrow">
          {activeSession.programName} · {activeSession.dayName}
        </p>
        <h1 className="exercise-title">{current.exerciseName}</h1>
        <p className="muted tiny">
          Упражнение {exerciseIndex + 1} из {activeSession.exercises.length}
        </p>
      </div>

      <button
        type="button"
        className="timer-ring"
        data-mode={timer.mode}
        style={{ ['--progress' as string]: Math.max(0, Math.min(100, progress)) }}
        onClick={toggleTimerTap}
        aria-label={
          timer.running
            ? 'Пауза таймера'
            : timer.mode !== 'idle'
              ? 'Продолжить таймер'
              : 'Старт работы'
        }
      >
        <div>
          <strong>{formatDuration(timer.mode === 'idle' ? workSeconds : timer.remaining)}</strong>
          <small>
            {timer.mode === 'work' && (timer.running ? 'Работа · тап = пауза' : 'Пауза · тап = далее')}
            {timer.mode === 'rest' && (timer.running ? 'Отдых · тап = пауза' : 'Пауза · тап = далее')}
            {timer.mode === 'idle' && 'Тап = старт работы'}
          </small>
        </div>
      </button>

      <div className="timer-actions">
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
        <button className="btn btn-secondary" type="button" onClick={timer.reset}>
          Сброс
        </button>
      </div>

      {history && (
        <div className="panel rise rise-delay-1" style={{ marginTop: 16 }}>
          <div className="row-between wrap">
            <strong>Прошлые результаты</strong>
            <span className="chip chip-muted">{formatDate(history.lastSessionDate)}</span>
          </div>
          <div className="chip-row">
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
                  <span className="history-set-values">
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
        <Stepper id="reps" label="Повторы" value={reps} min={1} step={1} onChange={setReps} />
        {current.usesWeight ? (
          <Stepper
            id="weight"
            label="Вес, кг"
            value={weight}
            min={0}
            step={2.5}
            onChange={setWeight}
          />
        ) : (
          <div className="field">
            <label>Вес</label>
            <input value="Свой вес" disabled />
          </div>
        )}
        <Stepper
          id="work"
          label="Работа, сек"
          value={workSeconds}
          min={5}
          step={5}
          onChange={setWorkSeconds}
        />
        <Stepper
          id="rest"
          label="Отдых, сек"
          value={restSeconds}
          min={5}
          step={5}
          onChange={setRestSeconds}
        />
      </div>

      <div className="gym-dock" role="region" aria-label="Быстрые действия">
        <button
          className="btn btn-primary btn-block"
          type="button"
          disabled={reps <= 0 || workSeconds <= 0 || restSeconds <= 0}
          onClick={saveSet}
        >
          Сохранить подход и отдых
        </button>
      </div>

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
              className="btn btn-ghost btn-icon"
              type="button"
              aria-label="Удалить подход"
              onClick={() => removeSet(current.exerciseId, set.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="nav-pair" style={{ marginTop: 18 }}>
        <button
          className="btn btn-secondary btn-block"
          type="button"
          disabled={exerciseIndex === 0}
          onClick={() => setExerciseIndex((i) => Math.max(0, i - 1))}
        >
          Назад
        </button>
        <button
          className="btn btn-secondary btn-block"
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
        <button
          className="btn btn-secondary btn-block"
          style={{ marginTop: 12 }}
          type="button"
          onClick={() => setShowPicker(true)}
        >
          Добавить упражнение
        </button>
      </div>

      <div className="stack" style={{ marginTop: 18 }}>
        <button className="btn btn-primary btn-block" type="button" onClick={completeWorkout}>
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
