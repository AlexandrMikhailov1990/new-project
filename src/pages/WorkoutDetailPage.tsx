import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  formatDate,
  formatDuration,
  formatKg,
  sessionSetCount,
  sessionVolume,
} from '../lib/stats'
import { useApp } from '../store/AppContext'

export function WorkoutDetailPage() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { data, deleteSession } = useApp()
  const session = data.sessions.find((s) => s.id === sessionId)

  if (!session) {
    return (
      <section className="rise">
        <div className="page-header">
          <p className="eyebrow">История</p>
          <h1>Тренировка не найдена</h1>
        </div>
        <Link className="btn btn-primary btn-block" style={{ marginTop: 16 }} to="/stats">
          К статистике
        </Link>
      </section>
    )
  }

  return (
    <section className="rise">
      <div className="page-header">
        <p className="eyebrow">История</p>
        <h1>{session.programName}</h1>
        <p className="muted">
          {session.dayName} · {formatDate(session.finishedAt ?? session.startedAt)}
        </p>
      </div>

      <div className="field-grid" style={{ marginTop: 12 }}>
        <div className="panel">
          <div className="tiny muted">Подходов</div>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
            {sessionSetCount(session)}
          </strong>
        </div>
        <div className="panel">
          <div className="tiny muted">Объём</div>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
            {Math.round(sessionVolume(session))} кг
          </strong>
        </div>
      </div>

      <h2 className="section-title">Упражнения</h2>
      {session.exercises.length === 0 ? (
        <div className="empty">В этой тренировке нет упражнений.</div>
      ) : (
        <div className="stack">
          {session.exercises.map((exercise) => (
            <article key={exercise.exerciseId} className="panel">
              <strong style={{ fontFamily: 'var(--font-display)' }}>{exercise.exerciseName}</strong>
              {exercise.sets.length === 0 ? (
                <p className="muted tiny" style={{ margin: '8px 0 0' }}>
                  Подходы не записаны
                </p>
              ) : (
                <div className="set-list" style={{ marginTop: 10 }}>
                  {exercise.sets.map((set, i) => (
                    <div key={set.id} className="set-row">
                      <span className="chip">{i + 1}</span>
                      <div>
                        <strong>
                          {set.reps} повт.
                          {set.weightKg != null ? ` · ${formatKg(set.weightKg)}` : ''}
                        </strong>
                        <div className="tiny muted">
                          работа {formatDuration(set.workSeconds)} · отдых{' '}
                          {formatDuration(set.restSeconds)}
                        </div>
                      </div>
                      <span className="tiny muted">{formatDate(set.completedAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="stack" style={{ marginTop: 18 }}>
        <button className="btn btn-secondary btn-block" type="button" onClick={() => navigate('/stats')}>
          Назад к статистике
        </button>
        <button
          className="btn btn-danger btn-block"
          type="button"
          onClick={() => {
            deleteSession(session.id)
            navigate('/stats')
          }}
        >
          Удалить тренировку
        </button>
      </div>
    </section>
  )
}
