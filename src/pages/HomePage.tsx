import { Link } from 'react-router-dom'
import { completedSessions, formatDate, sessionVolume } from '../lib/stats'
import { useApp } from '../store/AppContext'

export function HomePage() {
  const { data, activeSession } = useApp()
  const recent = completedSessions(data.sessions)[0]

  return (
    <section className="hero-home">
      <div className="rise">
        <p className="eyebrow">Дневник зала</p>
        <h1 className="brand">
          Тренажёр<span>.</span>
        </h1>
        <p className="lede">
          Выберите программу, фиксируйте подходы и отдыхайте по таймеру — прогресс видно сразу.
        </p>
      </div>

      <div className="hero-cta rise rise-delay-1">
        {activeSession ? (
          <Link className="btn btn-primary btn-block" to="/session">
            Продолжить: {activeSession.dayName}
          </Link>
        ) : (
          <Link className="btn btn-primary btn-block" to="/programs">
            Начать тренировку
          </Link>
        )}
        <Link className="btn btn-secondary btn-block" to="/stats">
          Смотреть прогресс
        </Link>
      </div>

      <div className="panel rise rise-delay-2">
        <div className="row-between">
          <strong>Последняя тренировка</strong>
          <span className="chip chip-muted">{data.programs.length} программ</span>
        </div>
        {recent ? (
          <p className="muted" style={{ margin: '10px 0 0' }}>
            {recent.programName} · {recent.dayName}
            <br />
            {formatDate(recent.finishedAt)} · объём {Math.round(sessionVolume(recent))} кг
          </p>
        ) : (
          <p className="muted" style={{ margin: '10px 0 0' }}>
            Пока нет завершённых сессий. Первая тренировка задаст базу для рекордов.
          </p>
        )}
      </div>

      <p className="tiny muted rise rise-delay-3" style={{ marginTop: 8, lineHeight: 1.4 }}>
        В зале без Wi‑Fi: откройте сайт один раз по мобильной сети, затем «На экран Домой» —
        дальше приложение работает офлайн на этом телефоне.
      </p>
    </section>
  )
}
