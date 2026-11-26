import React, { useState } from 'react';
import { Car, Menu, X, Shield, User, LogOut } from 'lucide-react';

export default function Navbar({
  currentView,
  onNavigate,
  user,
  isAuthenticated,
  onOpenAuth,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin =
    user?.role?.toLowerCase() === 'admin' ||
    user?.isAdmin === true ||
    user?.email?.toLowerCase() === 'st5303@utr.edu.mx';

  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'rides', label: 'Rutas Activas' },
    { id: 'how-it-works', label: '¿Cómo funciona?' },
    { id: 'requirements', label: 'Requisitos' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contacto' },
  ];

  const handleNavClick = (viewId) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#171717] text-white border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo UTRide */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="bg-[#B5121B] p-2 rounded-lg group-hover:bg-[#8F1720] transition">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            UT<span className="text-[#B5121B]">Ride</span>
          </span>
        </button>

        {/* Navegación Desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-medium transition cursor-pointer ${
                currentView === item.id
                  ? 'text-white font-bold border-b-2 border-[#B5121B] py-5'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}

          {isAuthenticated && isAdmin && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-[#B5121B] text-white'
                  : 'bg-red-500/20 text-[#ff8a90] border border-[#B5121B]/50 hover:bg-[#B5121B] hover:text-white'
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Panel Admin
            </button>
          )}
        </nav>

        {/* Acciones de sesión Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="text-sm font-semibold text-gray-200 hover:text-white px-3 py-2 transition cursor-pointer"
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="bg-[#B5121B] hover:bg-[#8F1720] text-white text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
              >
                Registrarse
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleNavClick('profile')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-white text-[#171717]'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <User className="h-4 w-4 text-[#B5121B]" />
                <span>{user?.firstName || user?.email?.split('@')[0] || 'Mi Perfil'}</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                title="Cerrar sesión"
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Botón menú móvil */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menú desplegable móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#171717] border-t border-white/10 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentView === item.id
                  ? 'bg-[#B5121B] text-white font-bold'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}

          {isAuthenticated && isAdmin && (
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-2 w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold bg-red-500/20 text-[#ff8a90] border border-[#B5121B]/40"
            >
              <Shield className="h-4 w-4" />
              Panel Admin
            </button>
          )}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2.5 rounded-lg border border-white/20 text-sm font-semibold text-white"
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#B5121B] text-sm font-semibold text-white"
                >
                  Registrarse
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile')}
                  className="w-full py-2.5 px-3 rounded-lg bg-white/10 text-left text-sm font-semibold text-white flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-[#B5121B]" />
                  Mi Perfil ({user?.email})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 px-3 rounded-lg text-left text-sm font-semibold text-red-400 hover:bg-white/5 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}