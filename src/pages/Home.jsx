import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  DollarSign,
  ShieldCheck,
  Wallet,
  Car,
  Smartphone,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function Home({ onNavigate, onOpenAuth, isAuthenticated }) {
  const [featuredRide, setFeaturedRide] = useState(null);
  const [loadingRide, setLoadingRide] = useState(true);

  const getShiftLabel = (timeStr) => {
    if (!timeStr) return 'Ruta Activa';
    const hour = parseInt(timeStr.split(':')[0], 10);
    return hour < 13 ? 'Ruta Matutina' : 'Ruta Vespertina';
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(hour12).padStart(2, '0')}:${minuteStr} ${period}`;
  };

  const fetchFeaturedRide = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          id,
          nombre_conductor,
          apellido_conductor,
          origen,
          destino,
          hora_salida,
          asientos_disponibles,
          precio_pasajero,
          estado
        `)
        .eq('estado', 'activo')
        .gt('asientos_disponibles', 0)
        .order('hora_salida', { ascending: true })
        .limit(1);

      if (error) throw error;
      setFeaturedRide(data && data.length > 0 ? data[0] : null);
    } catch (err) {
      console.error('Error al cargar el próximo viaje destacado:', err);
      setFeaturedRide(null);
    } finally {
      setLoadingRide(false);
    }
  };

  useEffect(() => {
    fetchFeaturedRide();

    const channel = supabase
      .channel('home:featured-ride')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rides' },
        () => {
          fetchFeaturedRide();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen text-[#171717]">
      {/* 1. HERO SECTION: Base blanca con acentos en Rojo UTRide (#B5121B) y Negro Carbón (#171717) */}
      <section className="bg-white border-b border-[#D1D5DB] py-14 md:py-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          {/* Columna izquierda */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-[#F3F4F6] border border-[#D1D5DB] text-[#171717] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[#B5121B]" />
              <span>Movilidad Universitaria UTR</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight text-[#171717] leading-[1.1] mb-6">
              Muévete con tu{' '}
              <span className="text-[#B5121B]">comunidad universitaria</span>.
            </h1>

            <p className="text-[#4B5563] text-base md:text-lg leading-relaxed max-w-xl mb-8">
              Conecta con compañeros y docentes de la Universidad Tecnológica El Retoño. Comparte trayectos diarios de forma segura, económica y organizada entre Aguascalientes y el campus El Retoño.
            </p>

            {/* Botones primario (#B5121B) y secundario (#F3F4F6) */}
            <div className="flex flex-wrap items-center gap-4 pb-10 border-b border-[#D1D5DB]">
              <button
                onClick={() => onNavigate('rides')}
                className="bg-[#B5121B] hover:bg-[#8F1720] text-white font-semibold py-3.5 px-7 rounded-xl transition inline-flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Ver Rutas Activas</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {!isAuthenticated ? (
                <button
                  onClick={() => onOpenAuth('register')}
                  className="bg-[#F3F4F6] hover:bg-gray-200 text-[#171717] border border-[#D1D5DB] font-semibold py-3.5 px-7 rounded-xl transition cursor-pointer"
                >
                  Crear cuenta @utr.edu.mx
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="bg-[#F3F4F6] hover:bg-gray-200 text-[#171717] border border-[#D1D5DB] font-semibold py-3.5 px-7 rounded-xl transition cursor-pointer"
                >
                  ¿Cómo funciona?
                </button>
              )}
            </div>

            {/* Indicadores clave con acento rojo */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="border-l-2 border-[#B5121B] pl-3.5">
                <p className="text-2xl md:text-3xl font-extrabold text-[#171717]">500+</p>
                <p className="text-xs md:text-sm text-[#6B7280] mt-0.5">Comunidad potencial UTR</p>
              </div>
              <div className="border-l-2 border-[#171717] pl-3.5">
                <p className="text-2xl md:text-3xl font-extrabold text-[#171717]">100%</p>
                <p className="text-xs md:text-sm text-[#6B7280] mt-0.5">Correos @utr.edu.mx</p>
              </div>
              <div className="border-l-2 border-[#B5121B] pl-3.5">
                <p className="text-2xl md:text-3xl font-extrabold text-[#171717]">40-60%</p>
                <p className="text-xs md:text-sm text-[#6B7280] mt-0.5">Ahorro en traslados</p>
              </div>
            </div>
          </div>

          {/* Columna derecha: Marco gris claro (#F3F4F6) + Tarjeta con cabecera Negro Carbón (#171717) */}
          <div className="lg:col-span-5">
            <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-3xl p-3 sm:p-4">
              <div className="bg-white border border-[#D1D5DB] rounded-2xl overflow-hidden shadow-md">
                {/* Cabecera oscura para equilibrar el blanco */}
                <div className="bg-[#171717] text-white px-6 py-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Próximo viaje destacado
                  </span>

                  {!loadingRide && featuredRide && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#B5121B] text-white">
                      {getShiftLabel(featuredRide.hora_salida)}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  {loadingRide ? (
                    <div className="py-12 flex flex-col items-center justify-center text-[#6B7280] gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-[#B5121B]" />
                      <span className="text-sm">Consultando rutas disponibles...</span>
                    </div>
                  ) : featuredRide ? (
                    <>
                      {/* Origen y Destino reales */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3.5">
                          <div className="w-7 h-7 rounded-full bg-[#B5121B] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            A
                          </div>
                          <div>
                            <span className="text-xs text-[#6B7280] block">Salida</span>
                            <p className="font-bold text-[#171717] text-sm sm:text-base leading-snug">
                              {featuredRide.origen}
                            </p>
                          </div>
                        </div>

                        <div className="ml-3.5 pl-4 border-l-2 border-dashed border-[#D1D5DB] py-0.5">
                          <span className="text-xs font-medium text-[#6B7280]">
                            Conductor: {featuredRide.nombre_conductor} {featuredRide.apellido_conductor}
                          </span>
                        </div>

                        <div className="flex items-start gap-3.5">
                          <div className="w-7 h-7 rounded-full bg-[#171717] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            B
                          </div>
                          <div>
                            <span className="text-xs text-[#6B7280] block">Destino</span>
                            <p className="font-bold text-[#171717] text-sm sm:text-base leading-snug">
                              {featuredRide.destino}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Barra de horario, asientos y aportación reales */}
                      <div className="bg-[#F3F4F6] border border-[#D1D5DB] rounded-xl px-4 py-3 mb-5 flex items-center justify-between text-xs sm:text-sm">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#171717]">
                          <Clock className="h-4 w-4 text-[#B5121B]" />
                          {formatTime(featuredRide.hora_salida)}
                        </span>

                        <span className="inline-flex items-center gap-1.5 font-medium text-[#171717]">
                          <Users className="h-4 w-4 text-[#B5121B]" />
                          {featuredRide.asientos_disponibles}{' '}
                          {featuredRide.asientos_disponibles === 1 ? 'asiento' : 'asientos'}
                        </span>

                        <span className="inline-flex items-center font-bold text-[#16A34A]">
                          <DollarSign className="h-4 w-4" />
                          {featuredRide.precio_pasajero} MXN
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="py-10 text-center">
                      <Car className="h-9 w-9 text-gray-400 mx-auto mb-2.5" />
                      <p className="font-semibold text-[#171717] text-sm">
                        Sin rutas activas en este momento
                      </p>
                      <p className="text-xs text-[#6B7280] mt-1 mb-5">
                        Consulta el catálogo completo para revisar próximos horarios publicados.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => onNavigate('rides')}
                    className="w-full bg-[#B5121B] hover:bg-[#8F1720] text-white font-semibold py-3.5 px-5 rounded-xl text-sm transition inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ver disponibilidad completa</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE BENEFICIOS: Fondo Gris Claro (#F3F4F6) para contrastar las tarjetas blancas */}
      <section className="bg-[#F3F4F6] border-b border-[#D1D5DB] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B5121B]">
              Beneficios para la comunidad
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#171717] mt-1 mb-3">
              Movilidad universitaria, más conectada
            </h2>
            <p className="text-[#6B7280] text-base">
              Una plataforma diseñada para facilitar los traslados cotidianos hacia el campus en El Llano, Aguascalientes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#D1D5DB] shadow-sm hover:border-[#B5121B] transition">
              <div className="bg-[#171717] w-11 h-11 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg text-[#171717] mb-2">Entorno Verificado</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Acceso exclusivo mediante correo institucional <span className="font-semibold text-[#171717]">@utr.edu.mx</span> y verificación OTP.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#D1D5DB] shadow-sm hover:border-[#B5121B] transition">
              <div className="bg-[#B5121B] w-11 h-11 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg text-[#171717] mb-2">Ahorro Compartido</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Divide gastos de traslado mediante una aportación solidaria accesible para estudiantes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#D1D5DB] shadow-sm hover:border-[#B5121B] transition">
              <div className="bg-[#171717] w-11 h-11 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg text-[#171717] mb-2">Puntualidad</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Consulta horarios de salida para turnos matutino y vespertino con puntos de encuentro definidos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#D1D5DB] shadow-sm hover:border-[#B5121B] transition">
              <div className="bg-[#B5121B] w-11 h-11 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg text-[#171717] mb-2">Comunidad UTR</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                Fomenta el compañerismo universitario y reduce la huella de carbono en cada viaje al campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BLOQUE ECOSISTEMA: Tarjeta de alto contraste en Negro Carbón (#171717) sobre fondo blanco */}
      <section className="max-w-6xl mx-auto py-16 px-6 bg-white">
        <div className="bg-[#171717] text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg border-t-4 border-[#B5121B]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#ff8a90] mb-2">
              <Smartphone className="h-4 w-4 text-[#B5121B]" />
              Ecosistema UTRide
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Sincronizado con la aplicación móvil
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-5">
              Crea tu cuenta institucional, revisa las rutas activas en tiempo real y gestiona tu perfil desde la web. Para apartar asientos o publicar trayectos como conductor, utiliza la app móvil UTRide con las mismas credenciales.
            </p>
            <ul className="space-y-2 text-sm text-gray-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#B5121B] shrink-0" />
                Consulta en tiempo real de rutas activas y disponibilidad de asientos.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#B5121B] shrink-0" />
                Gestión centralizada de perfil universitario y validación vehicular.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigate('how-it-works')}
              className="bg-[#B5121B] hover:bg-[#8F1720] text-white font-semibold py-3 px-6 rounded-lg text-sm transition cursor-pointer text-center"
            >
              ¿Cómo funciona?
            </button>
            <button
              onClick={() => onNavigate('requirements')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold py-3 px-6 rounded-lg text-sm transition cursor-pointer text-center"
            >
              Requisitos de conductor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}