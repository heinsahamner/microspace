
import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { TopBar } from './components/layout/TopBar';
import { MobileNav } from './components/layout/MobileNav';
import { getMicrospaceContext } from './APIs/infolink'; // Import InfoLink API

// Pages
import { Dashboard } from './pages/Dashboard';
import { SubjectsPage } from './pages/Subjects';
import { SubjectDetail } from './pages/SubjectDetail';
import { FeedPage } from './pages/Feed';
import { Upload } from './pages/Upload';
import { Backpack } from './pages/Backpack';
import { Onboarding } from './pages/Onboarding';
import { UserProfile } from './pages/UserProfile';
import { EditProfile } from './pages/EditProfile';
import { Settings } from './pages/Settings';
import { Terms } from './pages/Terms';
import { AdminPanel } from './pages/AdminPanel';
import { AdminClaim } from './pages/AdminClaim';
import { Diagnostic } from './pages/Diagnostic';
import { PostDetail } from './pages/PostDetail';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200 pb-20 md:pb-0">
            <TopBar />
            <main className="pb-8">
                {children}
            </main>
            <MobileNav />
        </div>
    );
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    const { user, profile, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black text-gray-500">Carregando...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!profile?.group_id) {
        return <Onboarding />;
    }

    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
};

const PublicOnlyRoute = ({ children }: { children?: React.ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black text-gray-500">Carregando...</div>;
    if (user) return <Navigate to="/" replace />;
    return <>{children}</>;
};

const App: React.FC = () => {
  // --- INFOLINK LISTENER ---
  // Permite que outros apps/sites solicitem o contexto do Microspace via postMessage
  useEffect(() => {
      const handleMessage = async (event: MessageEvent) => {
          // Filtro de segurança básico (opcional: verificar event.origin se necessário)
          if (event.data === 'MICROSPACE_REQUEST_INFO') {
              console.log("InfoLink: Recebido pedido de contexto externo.");
              try {
                  const data = await getMicrospaceContext();
                  if (event.source) {
                      // Envia resposta de volta para quem chamou
                      (event.source as Window).postMessage({ 
                          type: 'MICROSPACE_INFO', 
                          payload: data 
                      }, { targetOrigin: event.origin }); // targetOrigin '*' permite qualquer origem (útil para dev), ajuste para prod.
                  }
              } catch (e) {
                  console.error("InfoLink Error:", e);
              }
          }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <AuthProvider>
        <ToastProvider>
            <Router>
                <Routes>
                    {/* Public Auth Routes */}
                    <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                    <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
                    <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
                    
                    {/* Diagnostic Route (Semi-Public) */}
                    <Route path="/diagnostic" element={<Diagnostic />} />

                    {/* Protected Routes */}
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/subjects" element={<ProtectedRoute><SubjectsPage /></ProtectedRoute>} />
                    <Route path="/subject/:id" element={<ProtectedRoute><SubjectDetail /></ProtectedRoute>} />
                    <Route path="/community" element={<ProtectedRoute><FeedPage type="community" /></ProtectedRoute>} />
                    <Route path="/official" element={<ProtectedRoute><FeedPage type="official" /></ProtectedRoute>} />
                    <Route path="/backpack" element={<ProtectedRoute><Backpack /></ProtectedRoute>} />
                    <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                    <Route path="/post/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
                    <Route path="/post/edit/:id" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                    <Route path="/u/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
                    <Route path="/claim-admin" element={<ProtectedRoute><AdminClaim /></ProtectedRoute>} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ToastProvider>
    </AuthProvider>
  );
};

export default App;
