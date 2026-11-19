import { useState } from 'react';
import { CircleAlert, CircleCheckBig, X } from 'lucide-react';
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

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [user, setUser] = useState({
    isAuthenticated: false,
    name: 'Leonardo Daniel Jiménez',
    email: 'leonardo.jimenez@utr.edu.mx',
    matricula: 'UTR2022-5303',
    career: 'Ing. en Tecnologías de la Información',
    phone: '449 553 6435',
    role: 'Pasajero',
    driverVerified: false,
    driverStatus: 'Pendiente de validación',
    avatarColor: 'bg-red-800',
  });

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogout = () => {
    setUser((prev) => ({ ...prev, isAuthenticated: false }));
    showToast('Sesión cerrada correctamente', 'info');
    setCurrentView('home');
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <Footer navigateTo={navigateTo} />
    </div>
  );
}