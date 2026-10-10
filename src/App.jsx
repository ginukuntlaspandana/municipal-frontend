import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { TrackPage } from './pages/TrackPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Citizen Pages
import { UserDashboard } from './pages/UserDashboard';
import { SubmitComplaintPage } from './pages/SubmitComplaintPage';
import { MyComplaintsPage } from './pages/MyComplaintsPage';
import { ComplaintDetailsPage } from './pages/ComplaintDetailsPage';
import { ProfilePage } from './pages/ProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AllComplaintsPage } from './pages/AllComplaintsPage';
import { AdminComplaintDetailsPage } from './pages/AdminComplaintDetailsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { ReportsPage } from './pages/ReportsPage';
import { AdminFeedbackPage } from './pages/AdminFeedbackPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Citizen Protected Routes */}
              <Route
                path="/citizen/dashboard"
                element={
                  <ProtectedRoute requiresCitizen>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/submit"
                element={
                  <ProtectedRoute requiresCitizen>
                    <SubmitComplaintPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/complaints"
                element={
                  <ProtectedRoute requiresCitizen>
                    <MyComplaintsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/complaints/:id"
                element={
                  <ProtectedRoute>
                    <ComplaintDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiresAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <ProtectedRoute requiresAdmin>
                    <AllComplaintsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints/:id"
                element={
                  <ProtectedRoute requiresAdmin>
                    <AdminComplaintDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/departments"
                element={
                  <ProtectedRoute requiresAdmin>
                    <DepartmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute requiresAdmin>
                    <AdminCategoriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute requiresAdmin>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/feedback"
                element={
                  <ProtectedRoute requiresAdmin>
                    <AdminFeedbackPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
