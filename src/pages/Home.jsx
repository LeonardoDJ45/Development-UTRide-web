import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Clock,
  MapPin,
  Users,
  DollarSign,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function Home() {
  const [featuredRide, setFeaturedRide] = useState(null);
  const [loadingRide, setLoadingRide] = useState(true);

  const getShiftLabel = (timeStr) => {
    if (!timeStr) return 'Matutino';
    const hour = parseInt(timeStr.split(':')[0], 10);
    return hour < 13 ? 'Matutino' : 'Vespertino';
  };

  const fetchFeaturedRide = async () => {
    setLoadingRide(true);
    try {
      const { data, error } = await supabase
        .from('rides')
        .select(`
          id,
          nombre_conductor,
          apellido_conductor,
          origen,
          destino,
          marca_auto,
          modelo_auto,
          anio_auto,
          hora_salida,
          asientos_disponibles,
          precio_pasajero,
          estado
        `)
        .eq('estado', 'activo')
        .gt('asientos_disponibles', 0)
        .order('hora_salida', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setFeaturedRide(data || null);
    } catch (err) {
      console.error('Error al cargar el próximo viaje destacado:', err);
    } finally {
      setLoadingRide(false);
    }
  };

  useEffect(() => {
    fetchFeaturedRide();

    const channel = supabase
      .channel('public:rides:home')
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
      <section className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-12 gap-10 items-center">
        {/* Columna izquierda: Hero y acciones */}
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-red-50 text-[#B5121B]">
            <ShieldCheck className="h-4 w-4" />
            Movilidad Universitaria UTR
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[#171717]">
            Comparte tu trayecto hacia la{' '}
            <span className="text-[#B5121B]">Universidad Tecnológica El Retoño</span>
          </h1>

          <p className="text-base md:text-lg text-[#6B7280] max-w-2xl">
            Conecta con estudiantes y personal de tu comunidad para viajar de forma segura, económica y sustentable en turnos matutino y vespertino.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/viajes"
              className="inline-flex items-center gap-2 bg-[#B5121B] hover:bg-[#8F1720] text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Ver rutas disponibles
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/registro"
              className="inline-flex items-center gap-2 bg-[#F3F4F6] hover:bg-gray-200 border border-[#D1D5DB] text-[#171717] font-semibold px-6 py-3 rounded-lg transition"
            >
              Unirme a UTRide
            </Link>
          </div>
        </div>

        {/* Columna derecha: Tarjeta de Próximo Viaje Destacado (datos reales) */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-[#D1D5DB] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-4 mb-5">
              <div>
                <span className="text-xs font-semibold uppercase text-[#B5121B]">
                  En tiempo real
                </span>
                <h2 className="text-lg font-bold text-[#171717]">
                  Próximo Viaje Destacado
                </h2>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
                <Car className="h-5 w-5 text-[#B5121B]" />
              </div>
            </div>

            {loadingRide ? (
              <div className="py-10 text-center text-sm text-[#6B7280]">
                Consultando ruta activa...
              </div>
            ) : !featuredRide ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-sm font-semibold text-[#171717]">
                  No hay rutas activas en este momento
                </p>
                <p className="text-xs text-[#6B7280]">
                  Cuando un conductor publique un viaje desde la app móvil aparecerá aquí automáticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-full bg-red-50 text-[#B5121B]">
                    Turno {getShiftLabel(featuredRide.hora_salida)}
                  </span>
                  <span className="text-sm font-bold text-[#171717] flex items-center gap-1">
                    <Clock className="h-4 w-4 text-[#B5121B]" />
                    {featuredRide.hora_salida?.slice(0, 5)} hrs
                  </span>
                </div>

                <div className="space-y-3 bg-[#F3F4F6] p-4 rounded-xl">
                  <div className="flex items-start gap-2.5 text-sm">
                    <MapPin className="h-4 w-4 text-[#B5121B] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-[#6B7280] block">Punto de salida</span>
                      <span className="font-semibold text-[#171717]">{featuredRide.origen}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-sm">
                    <MapPin className="h-4 w-4 text-[#171717] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs text-[#6B7280] block">Destino</span>
                      <span className="font-semibold text-[#171717]">{featuredRide.destino}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#6B7280] space-y-1">
                  <p>
                    <strong className="text-[#171717]">Conductor:</strong>{' '}
                    {featuredRide.nombre_conductor} {featuredRide.apellido_conductor}
                  </p>
                  <p>
                    <strong className="text-[#171717]">Vehículo:</strong>{' '}
                    {featuredRide.marca_auto} {featuredRide.modelo_auto}{' '}
                    {featuredRide.anio_auto ? `(${featuredRide.anio_auto})` : ''}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D1D5DB] flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1 font-medium text-[#171717]">
                      <Users className="h-4 w-4 text-[#B5121B]" />
                      {featuredRide.asientos_disponibles} lugares
                    </span>
                    <span className="inline-flex items-center gap-0.5 font-semibold text-green-700">
                      <DollarSign className="h-4 w-4" />
                      {featuredRide.precio_pasajero} MXN
                    </span>
                  </div>

                  <Link
                    to="/viajes"
                    className="text-xs font-semibold text-[#B5121B] hover:text-[#8F1720]"
                  >
                    Ver más rutas →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}