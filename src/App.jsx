import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import CheckoutPage from './pages/CheckoutPage'
import CourseDetailPage from './pages/CourseDetailPage'
import CourseDiscoveryPage from './pages/CourseDiscoveryPage'
import CoursePlayerPlaceholderPage from './pages/CoursePlayerPlaceholderPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <CourseDiscoveryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId"
              element={
                <ProtectedRoute>
                  <CourseDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/learn"
              element={
                <ProtectedRoute>
                  <CoursePlayerPlaceholderPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/discover" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
