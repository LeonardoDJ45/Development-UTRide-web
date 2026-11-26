import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './services/supabaseClient';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Viajes from './pages/Viajes';
import Perfil from './pages/Perfil';
import AdminDashboard from './pages/AdminDashboard';
import ComoFunciona from './pages/ComoFunciona';
import Requisitos from './pages/Requisitos';
import Preguntas from './pages/Preguntas';
import Contacto from './pages/Contacto';
import Legal from './pages/Legal';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const loadUserProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setUser(null);
      setLoadingAuth(false);
      return;
    }

    try {
      const [{ data: profileData }, { data: adminHeadData }] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle(),
        supabase
          .from('administradores_head')
          .select('*')
          .eq('email', authUser.email)
          .maybeSingle(),
      ]);

      const isAdminAccount =
        profileData?.role?.toLowerCase() === 'admin' ||
        Boolean(adminHeadData) ||
        authUser.email?.toLowerCase() === 'st5303@utr.edu.mx';

      const firstName = profileData?.first_name || '';
      const lastName = profileData?.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();

      setUser({
        id: authUser.id,
        email: authUser.email,
        firstName,
        lastName,
        name: fullName || authUser.email.split('@')[0],
        matricula: profileData?.matricula || '',
        phone: profileData?.phone || '',
        career: profileData?.career || '',
        role: isAdminAccount ? 'admin' : profileData?.role || 'Pasajero',
        isAdmin: isAdminAccount,
        driverStatus: profileData?.driver_status || '',
        vehicleModel: profileData?.vehicle_model || '',
        vehiclePlates: profileData?.vehicle_plates || '',
      });
    } catch (err) {
      console.error('Error al cargar perfil de usuario:', err);
      const isFallbackAdmin = authUser.email?.toLowerCase() === 'st5303@utr.edu.mx';
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.email.split('@')[0],
        role: isFallbackAdmin ? 'admin' : 'Pasajero',
        isAdmin: isFallbackAdmin,
      });
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUserProfile(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentView('home');
    showToast('Sesión cerrada correctamente', 'info');
  };

  const isAuthenticated = Boolean(user);

  const toastStyles = {
    success: 'bg-[#16A34A] text-white',
    info: 'bg-[#2563EB] text-white',
    error: 'bg-[#DC2626] text-white',
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#171717]">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        isAuthenticated={isAuthenticated}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {loadingAuth ? (
          <div className="py-24 text-center text-sm text-[#6B7280]">
            Cargando sesión...
          </div>
        ) : (
          <>
            {currentView === 'home' && (
              <Home
                onNavigate={handleNavigate}
                onOpenAuth={openAuth}
                isAuthenticated={isAuthenticated}
              />
            )}

            {currentView === 'rides' && (
              <Viajes
                user={user}
                isAuthenticated={isAuthenticated}
                onOpenAuth={openAuth}
                showToast={showToast}
              />
            )}

            {currentView === 'how-it-works' && (
              <ComoFunciona onNavigate={handleNavigate} onOpenAuth={openAuth} />
            )}

            {currentView === 'requirements' && (
              <Requisitos onNavigate={handleNavigate} onOpenAuth={openAuth} />
            )}

            {currentView === 'faq' && <Preguntas onNavigate={handleNavigate} />}

            {currentView === 'contact' && <Contacto showToast={showToast} />}

            {currentView === 'legal' && <Legal onNavigate={handleNavigate} />}

            {currentView === 'profile' && isAuthenticated && (
              <Perfil user={user} setUser={setUser} showToast={showToast} />
            )}

            {currentView === 'admin' && isAuthenticated && user?.isAdmin && (
              <AdminDashboard user={user} profile={user} showToast={showToast} />
            )}
          </>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {authModal.isOpen && (
        <AuthModal
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ ...authModal, isOpen: false })}
          showToast={showToast}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold transition ${
            toastStyles[toast.type] || toastStyles.info
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}