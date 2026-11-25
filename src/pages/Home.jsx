import {
  ArrowRight,
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

export default function Home({ navigateTo, setAuthModal, isAuthenticated }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#171717] py-20 text-white lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Columna Izquierda */}
            <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-gray-200">
                <Sparkles className="h-3.5 w-3.5 text-[#B5121B]" />
                <span>Movilidad Universitaria UTR</span>
              </div>

              <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Muévete con tu{' '}
                <span className="text-[#B5121B]">comunidad universitaria</span>.
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
                Conecta con compañeros y docentes de la Universidad Tecnológica
                El Retoño. Comparte trayectos diarios de forma segura, económica
                y organizada entre Aguascalientes y el campus El Retoño.
              </p>

              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row lg:justify-start">
                {isAuthenticated ? (
                  <button
                    onClick={() => navigateTo('rides')}
                    className="inline-flex items-center justify-center rounded-lg bg-[#B5121B] px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-[#8F1720]"
                  >
                    Ver Rutas Activas
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setAuthModal('register')}
                    className="inline-flex items-center justify-center rounded-lg bg-[#B5121B] px-7 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-[#8F1720]"
                  >
                    Comenzar ahora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                )}

                <button
                  onClick={() => navigateTo('rides')}
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/15"
                >
                  Explorar viajes
                </button>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4 text-center lg:text-left">
                <div>
                  <div className="text-xl font-bold text-white sm:text-2xl">
                    500+
                  </div>
                  <div className="text-xs text-gray-400">
                    Comunidad potencial UTR
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white sm:text-2xl">
                    100%
                  </div>
                  <div className="text-xs text-gray-400">
                    Correos @utr.edu.mx
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white sm:text-2xl">
                    40-60%
                  </div>
                  <div className="text-xs text-gray-400">
                    Ahorro en traslados
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta Viaje Destacado */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-gray-100 bg-white p-6 text-[#171717] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 animate-ping rounded-full bg-[#16A34A]" />
                    <span className="text-xs font-bold tracking-wider text-[#6B7280] uppercase">
                      Próximo Viaje Destacado
                    </span>
                  </div>
                  <span className="rounded bg-red-50 px-2 py-0.5 text-xs font-bold text-[#B5121B]">
                    Ruta Matutina
                  </span>
                </div>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-[#B5121B]">
                        A
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280]">
                          Salida (Aguascalientes)
                        </div>
                        <div className="text-sm font-bold text-[#171717]">
                          Parque Tres Centurias / Av. Madero
                        </div>
                      </div>
                    </div>

                    <div className="ml-3 border-l-2 border-dashed border-[#D1D5DB] py-1 pl-3 text-[11px] text-[#6B7280]">
                      Pasa por Ojocaliente y El Llano
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#171717] text-xs font-bold text-white">
                        B
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280]">
                          Destino (Campus)
                        </div>
                        <div className="text-sm font-bold text-[#171717]">
                          Universidad Tecnológica El Retoño
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-[#F3F4F6] p-3 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-[#171717]">
                      <Clock className="h-4 w-4 text-[#B5121B]" />
                      <span>06:45 AM</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-[#171717]">
                      <Users className="h-4 w-4 text-[#B5121B]" />
                      <span>3 asientos disp.</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#16A34A]">
                      <DollarSign className="h-4 w-4" />
                      <span>$18 MXN</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('rides')}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#171717] py-2.5 text-xs font-bold text-white transition-colors hover:bg-black"
                >
                  Ver disponibilidad completa
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Pilares */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-[#171717] sm:text-3xl">
            Movilidad universitaria, más conectada
          </h2>
          <p className="mt-2 text-sm text-[#6B7280] sm:text-base">
            Una plataforma pensada para superar los retos de transporte y
            distancias hacia el campus UTR.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-[#D1D5DB] bg-white p-6 shadow-sm transition-all hover:border-[#B5121B]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-[#B5121B]">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-[#171717]">Comunidad</h3>
            <p className="text-sm leading-relaxed text-[#6B7280]">
              Viaja exclusivamente con estudiantes, docentes y personal de la
              UTR. Fomenta el compañerismo y la ayuda mutua en cada trayecto.
            </p>
          </div>

          <div className="rounded-xl border border-[#D1D5DB] bg-white p-6 shadow-sm transition-all hover:border-[#B5121B]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-[#B5121B]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-[#171717]">
              Confianza y Seguridad
            </h3>
            <p className="text-sm leading-relaxed text-[#6B7280]">
              Todos los usuarios deben registrarse con su correo institucional
              (@utr.edu.mx). Los conductores pasan por verificación de licencia y
              auto.
            </p>
          </div>

          <div className="rounded-xl border border-[#D1D5DB] bg-white p-6 shadow-sm transition-all hover:border-[#B5121B]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-[#B5121B]">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-[#171717]">
              Ahorro y Alternativa
            </h3>
            <p className="text-sm leading-relaxed text-[#6B7280]">
              Evita esperas prolongadas en camiones YoVoy y combis. Comparte los
              gastos de gasolina con cuotas solidarias y justas para
              estudiantes.
            </p>
          </div>
        </div>
      </section>

      {/* Banner Conductor */}
      <section className="bg-[#B5121B] py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 md:flex-row lg:px-8">
          <div>
            <h3 className="text-2xl font-bold">
              ¿Tienes auto y viajas a la UTR diario?
            </h3>
            <p className="mt-1 text-sm text-white/90">
              Únete como conductor universitario, ayuda a tus compañeros y
              reduce tus gastos de combustible.
            </p>
          </div>
          <button
            onClick={() => navigateTo('requirements')}
            className="rounded-lg bg-white px-6 py-3 font-bold whitespace-nowrap text-[#B5121B] shadow-md transition-all hover:bg-gray-100"
          >
            Ver requisitos de conductor
          </button>
        </div>
      </section>
    </div>
  );
}