import { useState, useEffect } from 'react';
import { CircleAlert, CircleCheckBig, X } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import ComoFunciona from './pages/ComoFunciona';
import Requisitos from './pages/Requisitos';
import Preguntas from './pages/Preguntas';
import Contacto from './pages/Contacto';
import Viajes from './pages/Viajes';
import Perfil from './pages/Perfil';
import Legal from './pages/Legal';
import AdminDashboard from './pages/AdminDashboard';

const EMPTY_USER = {
  id: null,
  isAuthenticated: false,
  isAdminHead: false,
  firstName: '',
  lastName: '',
  name: '',
  email: '',
  matricula: '',
  career: 'Estudiante UTR',
  phone: '',
  role: 'Pasajero',
  driverVerified: false,
  driverStatus: 'Sin solicitud',
  vehicleModel: '',
  vehiclePlates: '',
};

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [legalTab, setLegalTab] = useState('privacy');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [user, setUser] = useState(EMPTY_USER);

  const loadUserProfile = async (authUser) => {
    if (!authUser) {
      setUser(EMPTY_USER);
      return;
    }

    // 1. Verificar si el usuario pertenece a administradores_head
    const { data: adminRecord } = await supabase
      .from('administradores_head')
      .select('id, activo')
      .or(`user_id.eq.${authUser.id},email.ilike.${authUser.email}`)
      .eq('activo', true)
      .maybeSingle();

    const isAdminHead = Boolean(adminRecord);

    // 2. Obtener perfil desde public.profiles
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (profile && !error) {
      setUser({
        id: profile.id,
        isAuthenticated: true,
        isAdminHead,
        firstName: profile.first_name,
        lastName: profile.last_name,
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        email: profile.email,
        matricula: profile.matricula || '',
        career: profile.career || 'Estudiante UTR',
        phone: profile.phone || '',
        role: profile.role || 'Pasajero',
        driverVerified: profile.driver_status === 'Verificado',
        driverStatus: profile.driver_status || 'Sin solicitud',
        vehicleModel: profile.vehicle_model || '',
        vehiclePlates: profile.vehicle_plates || '',
      });
    } else {
      setUser({
        ...EMPTY_USER,
        id: authUser.id,
        isAuthenticated: true,
        isAdminHead,
        name: authUser.email.split('@')[0],
        email: authUser.email,
      });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUserProfile(session.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(EMPTY_USER);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(EMPTY_USER);
    showToast('Sesión cerrada correctamente', 'info');
    setCurrentView('home');
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLegal = (tab) => {
    setLegalTab(tab);
    navigateTo('legal');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6] font-sans text-[#171717] selection:bg-[#B5121B] selection:text-white">
      {/* Notificación flotante (Toast) */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 transition-transform">
          <div
            className={`flex items-center space-x-3 rounded-lg px-5 py-3 text-white shadow-xl ${
              toastMessage.type === 'error'
                ? 'bg-[#DC2626]'
                : toastMessage.type === 'info'
                  ? 'bg-[#2563EB]'
                  : 'bg-[#16A34A]'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <CircleAlert className="h-5 w-5 flex-shrink-0" />
            ) : (
              <CircleCheckBig className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toastMessage.message}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-white/80 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Encabezado */}
      <Navbar
        currentView={currentView}
        navigateTo={navigateTo}
        user={user}
        handleLogout={handleLogout}
        setAuthModal={setAuthModal}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Contenido Principal */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <Home
            navigateTo={navigateTo}
            setAuthModal={setAuthModal}
            isAuthenticated={user.isAuthenticated}
          />
        )}
        {currentView === 'how-it-works' && (
          <ComoFunciona setAuthModal={setAuthModal} />
        )}
        {currentView === 'requirements' && (
          <Requisitos
            navigateTo={navigateTo}
            user={user}
            setAuthModal={setAuthModal}
          />
        )}
        {currentView === 'rides' && (
          <Viajes
            user={user}
            setAuthModal={setAuthModal}
            isAuthenticated={user.isAuthenticated}
            showToast={showToast}
          />
        )}
        {currentView === 'faq' && <Preguntas />}
        {currentView === 'contact' && <Contacto showToast={showToast} />}
        {currentView === 'profile' && (
          <Perfil user={user} setUser={setUser} showToast={showToast} />
        )}
        {currentView === 'admin' && (
          <AdminDashboard user={user} showToast={showToast} />
        )}
        {currentView === 'legal' && (
          <Legal
            activeTab={legalTab}
            setActiveTab={setLegalTab}
            navigateTo={navigateTo}
          />
        )}
      </main>

      {/* Modales de Autenticación */}
      {authModal && (
        <AuthModal
          modalType={authModal}
          setModalType={setAuthModal}
          setUser={setUser}
          showToast={showToast}
          navigateTo={navigateTo}
        />
      )}

      {/* Pie de página */}
      <Footer navigateTo={navigateTo} openLegal={openLegal} />
    </div>
  );
}