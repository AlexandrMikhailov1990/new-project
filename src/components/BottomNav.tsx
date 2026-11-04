import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Старт', end: true, icon: HomeIcon },
  { to: '/programs', label: 'Программы', end: false, icon: ProgramsIcon },
  { to: '/session', label: 'Сессия', end: false, icon: SessionIcon },
  { to: '/stats', label: 'Статистика', end: false, icon: StatsIcon },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
          <link.icon />
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  )
}

function ProgramsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
    </svg>
  )
}

function SessionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" strokeLinecap="round" />
    </svg>
  )
}

function StatsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" />
    </svg>
  )
}
