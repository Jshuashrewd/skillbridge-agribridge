import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import LearnHubPage from './pages/LearnHubPage'
import SignInPage from './pages/SignInPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignInPage />} />
          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <LearnHubPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/learn" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
