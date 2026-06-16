import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import ResumeEditor from './pages/ResumeEditor';
import ResumePreview from './pages/ResumePreview';
import SharedResume from './pages/SharedResume';
import CoverLetters from './pages/CoverLetters';
import PortfolioGenerator from './pages/PortfolioGenerator';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e3f',
            color: '#fff',
            border: '1px solid rgba(108,71,255,0.3)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#6C47FF', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/r/:shareId" element={<SharedResume />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/resume/new" element={<ProtectedRoute><ResumeEditor /></ProtectedRoute>} />
        <Route path="/resume/:id/edit" element={<ProtectedRoute><ResumeEditor /></ProtectedRoute>} />
        <Route path="/resume/:id/preview" element={<ProtectedRoute><ResumePreview /></ProtectedRoute>} />
        <Route path="/cover-letters" element={<ProtectedRoute><CoverLetters /></ProtectedRoute>} />
        <Route path="/portfolio/:id" element={<ProtectedRoute><PortfolioGenerator /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
