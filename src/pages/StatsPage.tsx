import {
  completedSessions,
  formatDate,
  personalBests,
  sessionSetCount,
  sessionVolume,
  weeklyVolumeSeries,
} from '../lib/stats'
import { useApp } from '../store/AppContext'

export function StatsPage() {
  const { data, deleteSession } = useApp()
  const history = completedSessions(data.sessions)
  const weekly = weeklyVolumeSeries(data.sessions, 8)
  const maxVolume = Math.max(...weekly.map((w) => w.volume), 1)
  const bests = personalBests(data.sessions).slice(0, 8)
  const totalVolume = history.reduce((sum, s) => sum + sessionVolume(s), 0)
  const totalSets = history.reduce((sum, s) => sum + sessionSetCount(s), 0)

  return (
    <section className="rise">
      <div className="page-header">
        <p className="eyebrow">Статистика</p>
        <h1>Прогресс</h1>
        <p className="muted">История тренировок, объём и личные рекорды.</p>
      </div>

      <div className="field-grid" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="tiny muted">Тренировок</div>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>
            {history.length}
          </strong>
        </div>
        <div className="panel">
          <div className="tiny muted">Всего подходов</div>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>
            {totalSets}
          </strong>
        </div>
        <div className="panel" style={{ gridColumn: '1 / -1' }}>
          <div className="tiny muted">Суммарный объём</div>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem' }}>
            {Math.round(totalVolume)} кг
          </strong>
        </div>
      </div>

      <h2 className="section-title">Объём по неделям</h2>
      <div className="panel">
        <div className="stat-bar" aria-label="График объёма">
          {weekly.map((week) => (
            <div key={week.label}>
              <div
                className="bar"
                style={{ height: `${Math.max(8, (week.volume / maxVolume) * 110)}px` }}
                title={`${Math.round(week.volume)} кг`}
              />
              <span>{week.label}</span>
            </div>
          ))}
        </div>
        <p className="tiny muted" style={{ margin: '10px 0 0' }}>
          Высота столбца — тоннаж (вес × повторы) за неделю.
        </p>
      </div>

      <h2 className="section-title">Личные рекорды</h2>
      {bests.length === 0 ? (
        <div className="empty">Рекорды появятся после тренировок с весом.</div>
      ) : (
        <div className="stack">
          {bests.map((best) => (
            <div key={best.exerciseId} className="list-item" style={{ cursor: 'default' }}>
              <strong>{best.exerciseName}</strong>
              <p>
                {best.reps} × {best.weightKg} кг · объём {Math.round(best.volume)} кг
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title">История</h2>
      {history.length === 0 ? (
        <div className="empty">Завершённых тренировок пока нет.</div>
      ) : (
        <div className="stack">
          {history.map((session) => (
            <article key={session.id} className="panel">
              <div className="row-between">
                <div>
                  <strong style={{ fontFamily: 'var(--font-display)' }}>
                    {session.programName}
                  </strong>
                  <p className="muted tiny" style={{ margin: '4px 0 0' }}>
                    {session.dayName} · {formatDate(session.finishedAt)}
                  </p>
                </div>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => deleteSession(session.id)}
                >
                  Удалить
                </button>
              </div>
              <p className="muted" style={{ margin: '10px 0 0' }}>
                {sessionSetCount(session)} подходов · объём {Math.round(sessionVolume(session))} кг
              </p>
              <div className="tiny muted" style={{ marginTop: 8 }}>
                {session.exercises
                  .filter((e) => e.sets.length > 0)
                  .map((e) => e.exerciseName)
                  .join(' · ')}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
