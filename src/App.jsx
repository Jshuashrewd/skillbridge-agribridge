import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import CertificatePage from './pages/CertificatePage'
import CertificatesListPage from './pages/CertificatesListPage'
import CheckoutPage from './pages/CheckoutPage'
import CourseDetailPage from './pages/CourseDetailPage'
import CourseDiscoveryPage from './pages/CourseDiscoveryPage'
import CoursePlayerPage from './pages/CoursePlayerPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LearnerHubPage from './pages/LearnerHubPage'
import LoginPage from './pages/LoginPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SignUpPage from './pages/SignUpPage'
import VerifyCertificatePage from './pages/VerifyCertificatePage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify/:certId" element={<VerifyCertificatePage />} />
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
                  <CoursePlayerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/learn/:lessonId"
              element={
                <ProtectedRoute>
                  <CoursePlayerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/certificate"
              element={
                <ProtectedRoute>
                  <CertificatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learner"
              element={
                <ProtectedRoute>
                  <LearnerHubPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learner/certificates"
              element={
                <ProtectedRoute>
                  <CertificatesListPage />
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
