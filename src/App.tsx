import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QuotaProvider } from './context/QuotaContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';

// Pages
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { ImageGenerator } from './pages/ImageGenerator';
import { VideoGenerator } from './pages/VideoGenerator';
import { PhotoEditor } from './pages/PhotoEditor';
import { VideoEditor } from './pages/VideoEditor';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Dashboard } from './pages/Dashboard';
import { MyCreations } from './pages/MyCreations';
import { GenerationHistory } from './pages/GenerationHistory';
import { ProfileSettings } from './pages/ProfileSettings';
import { AdminDashboard } from './pages/AdminDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { AccessDenied } from './pages/AccessDenied';
import { NotFound } from './pages/NotFound';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading Flow AI Studio...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Role-Gated Route Component
const RoleRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: ('user' | 'admin' | 'super_admin')[];
}> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/access-denied" replace />;
  }
  return <>{children}</>;
};

// Main Layout Controller
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Show sidebar on internal studio routes
  const isStudioRoute = [
    '/dashboard',
    '/my-creations',
    '/generation-history',
    '/profile',
    '/admin',
    '/super-admin'
  ].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 font-['Inter']">
      <Navbar />
      <div className="flex-1 flex">
        {isStudioRoute && <Sidebar />}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <QuotaProvider>
        <Router>
          <MainLayout>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />

              {/* Creative Studios (Directly accessible or authenticated) */}
              <Route path="/image-generator" element={<ImageGenerator />} />
              <Route path="/video-generator" element={<VideoGenerator />} />
              <Route path="/photo-editor" element={<PhotoEditor />} />
              <Route path="/video-editor" element={<VideoEditor />} />

              {/* Authenticated Dashboard Workspaces */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-creations"
                element={
                  <ProtectedRoute>
                    <MyCreations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/generation-history"
                element={
                  <ProtectedRoute>
                    <GenerationHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />

              {/* Admin Workspaces */}
              <Route
                path="/admin"
                element={
                  <RoleRoute allowedRoles={['admin', 'super_admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/super-admin"
                element={
                  <RoleRoute allowedRoles={['super_admin']}>
                    <SuperAdminDashboard />
                  </RoleRoute>
                }
              />

              {/* Fallback & Error Status Routes */}
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </Router>
      </QuotaProvider>
    </AuthProvider>
  );
}

export default App;
