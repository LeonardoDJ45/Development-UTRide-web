import { Car, LogOut, Menu, X } from 'lucide-react';

export default function Navbar({
  currentView,
  navigateTo,
  user,
  handleLogout,
  setAuthModal,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  const navItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'how-it-works', label: '¿Cómo funciona?' },
    { id: 'requirements', label: 'Requisitos Conductor' },
    { id: 'rides', label: 'Viajes y Rutas', badge: 'MVP' },
    { id: 'faq', label: 'Preguntas' },
    { id: 'contact', label: 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#D1D5DB]/80 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo UTRide */}
          <div
            className="flex cursor-pointer items-center space-x-3 py-2"
            onClick={() => navigateTo('home')}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B5121B] text-white shadow-md">
              <Car className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="flex items-center text-2xl leading-none font-black tracking-tight text-[#171717]">
                UT<span className="text-[#B5121B]">Ride</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-[#6B7280] uppercase">
                El Retoño
              </span>
            </div>
          </div>

          {/* Navegación Escritorio */}
          <nav className="hidden items-center space-x-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-red-50 font-semibold text-[#B5121B]'
                    : 'text-[#171717] hover:bg-gray-100 hover:text-[#B5121B]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded bg-[#B5121B]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#B5121B]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Acciones de Cuenta Escritorio */}
          <div className="hidden items-center space-x-3 lg:flex">
            {user.isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateTo('profile')}
                  className={`flex items-center space-x-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                    currentView === 'profile'
                      ? 'border-[#B5121B] bg-red-50 text-[#B5121B]'
                      : 'border-[#D1D5DB] bg-white hover:border-[#B5121B]'
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B5121B] text-xs font-bold text-white">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate text-xs font-semibold sm:text-sm">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="rounded-lg p-2 text-[#6B7280] transition-colors hover:bg-red-50 hover:text-[#DC2626]"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setAuthModal('login')}
                  className="rounded-lg border border-transparent px-4 py-2 text-sm font-semibold text-[#171717] transition-all hover:border-[#D1D5DB] hover:text-[#B5121B]"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setAuthModal('register')}
                  className="rounded-lg bg-[#B5121B] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#8F1720] active:scale-95"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Botón Menú Móvil */}
          <div className="flex items-center space-x-2 lg:hidden">
            {user.isAuthenticated && (
              <button
                onClick={() => navigateTo('profile')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B5121B] text-xs font-bold text-white"
              >
                {user.name.charAt(0)}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-[#171717] hover:text-[#B5121B] focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Menú Móvil */}
      {mobileMenuOpen && (
        <div className="space-y-2 border-b border-[#D1D5DB] bg-white px-4 pt-2 pb-5 lg:hidden">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left font-medium text-[#171717] hover:bg-red-50 hover:text-[#B5121B]"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="rounded bg-[#B5121B] px-2 py-0.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="flex flex-col gap-2 border-t border-[#D1D5DB] pt-4">
            {user.isAuthenticated ? (
              <>
                <button
                  onClick={() => navigateTo('profile')}
                  className="w-full rounded-lg border border-[#B5121B] py-2.5 text-center font-semibold text-[#B5121B]"
                >
                  Mi Perfil ({user.name.split(' ')[0]})
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-red-100 py-2.5 text-center font-semibold text-[#DC2626]"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModal('login');
                  }}
                  className="w-full rounded-lg border border-[#D1D5DB] py-2.5 text-center font-semibold text-[#171717]"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModal('register');
                  }}
                  className="w-full rounded-lg bg-[#B5121B] py-2.5 text-center font-semibold text-white"
                >
                  Registrarse con Correo UTR
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}