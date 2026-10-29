import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ProgramsPage } from './pages/ProgramsPage'
import { SessionPage } from './pages/SessionPage'
import { StatsPage } from './pages/StatsPage'
import { AppProvider } from './store/AppContext'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="programs" element={<ProgramsPage />} />
            <Route path="session" element={<SessionPage />} />
            <Route path="stats" element={<StatsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
