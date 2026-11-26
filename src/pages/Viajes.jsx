import React, { useState, useEffect, useMemo } from 'react';
import {
  Car,
  Clock,
  MapPin,
  Search,
  Users,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Info,
  X
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function Viajes() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState('todos'); // 'todos' | 'matutino' | 'vespertino'
  const [selectedRide, setSelectedRide] = useState(null);

  // Clasificación automática por horario (< 13:00 Matutino, >= 13:00 Vespertino)
  const getShiftFromTime = (timeStr) => {
    if (!timeStr) return 'matutino';
    const hour = parseInt(timeStr.split(':')[0], 10);
    return hour < 13 ? 'matutino' : 'vespertino';
  };

  // Consulta real a Supabase (tabla rides)
  const fetchActiveRides = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('rides')
        .select(`
          id,
          driver_id,
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
        .order('hora_salida', { ascending: true });

      if (sbError) throw sbError;
      setRides(data || []);
    } catch (err) {
      console.error('Error al consultar rutas activas:', err);
      setError('No se pudieron cargar las rutas activas. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveRides();

    // Suscripción en tiempo real para reflejar cambios hechos desde la app móvil
    const channel = supabase
      .channel('public:rides')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rides' },
        () => {
          fetchActiveRides();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filtrado combinado por turno y texto
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      const shift = getShiftFromTime(ride.hora_salida);
      const matchesShift = selectedShift === 'todos' || shift === selectedShift;

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchesShift;

      const driverFullName = `${ride.nombre_conductor || ''} ${ride.apellido_conductor || ''}`.toLowerCase();
      const vehicleInfo = `${ride.marca_auto || ''} ${ride.modelo_auto || ''} ${ride.anio_auto || ''}`.toLowerCase();
      const origin = (ride.origen || '').toLowerCase();
      const destination = (ride.destino || '').toLowerCase();

      const matchesSearch =
        origin.includes(term) ||
        destination.includes(term) ||
        driverFullName.includes(term) ||
        vehicleInfo.includes(term);

      return matchesShift && matchesSearch;
    });
  }, [rides, selectedShift, searchTerm]);

  return (
    <div className="bg-white min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-[#D1D5DB] pb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#171717]">Rutas Activas</h1>
            <p className="text-[#6B7280] mt-1">
              Consulta los trayectos disponibles publicados por conductores de la comunidad UTR.
            </p>
          </div>

          <button
            onClick={fetchActiveRides}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#D1D5DB] text-sm font-medium text-[#171717] hover:bg-[#F3F4F6] transition self-start md:self-auto cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#B5121B]' : ''}`} />
            Actualizar rutas
          </button>
        </div>

        {/* Barra de búsqueda y filtro por turno */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="h-5 w-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por punto de salida, destino, conductor o vehículo..."
              className="w-full pl-11 pr-4 py-2.5 border border-[#D1D5DB] rounded-lg text-sm focus:outline-none focus:border-[#B5121B]"
            />
          </div>

          <div className="flex gap-2">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'matutino', label: 'Matutino' },
              { id: 'vespertino', label: 'Vespertino' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedShift(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  selectedShift === tab.id
                    ? 'bg-[#B5121B] text-white'
                    : 'bg-[#F3F4F6] text-[#171717] hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="text-center py-16 text-[#6B7280]">
            Cargando rutas activas desde la base de datos...
          </div>
        )}

        {/* Estado de error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && filteredRides.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[#D1D5DB] rounded-xl">
            <Car className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#171717]">No hay rutas activas disponibles</h3>
            <p className="text-sm text-[#6B7280] mt-1">
              Intenta cambiar el filtro de turno o vuelve a consultar más tarde.
            </p>
          </div>
        )}

        {/* Grid de tarjetas de rutas reales */}
        {!loading && !error && filteredRides.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRides.map((ride) => {
              const shiftLabel = getShiftFromTime(ride.hora_salida) === 'matutino' ? 'Matutino' : 'Vespertino';
              return (
                <div
                  key={ride.id}
                  className="bg-white border border-[#D1D5DB] rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-full bg-red-50 text-[#B5121B]">
                        Turno {shiftLabel}
                      </span>
                      <span className="text-sm font-bold text-[#171717] flex items-center gap-1">
                        <Clock className="h-4 w-4 text-[#B5121B]" />
                        {ride.hora_salida?.slice(0, 5)} hrs
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-[#B5121B] mt-0.5 shrink-0" />
                        <div>
                          <span className="text-xs text-[#6B7280] block">Origen</span>
                          <span className="font-medium text-[#171717]">{ride.origen}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-700 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-xs text-[#6B7280] block">Destino</span>
                          <span className="font-medium text-[#171717]">{ride.destino}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 text-xs text-[#6B7280] space-y-1">
                      <p>
                        <strong className="text-[#171717]">Conductor:</strong>{' '}
                        {ride.nombre_conductor} {ride.apellido_conductor}
                      </p>
                      <p>
                        <strong className="text-[#171717]">Vehículo:</strong>{' '}
                        {ride.marca_auto} {ride.modelo_auto} {ride.anio_auto ? `(${ride.anio_auto})` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#D1D5DB] flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="inline-flex items-center gap-1 font-medium text-[#171717]">
                        <Users className="h-4 w-4 text-[#B5121B]" />
                        {ride.asientos_disponibles} lugares
                      </span>
                      <span className="inline-flex items-center gap-0.5 font-semibold text-green-700">
                        <DollarSign className="h-4 w-4" />
                        {ride.precio_pasajero} MXN
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedRide(ride)}
                      className="text-xs font-semibold text-[#B5121B] hover:text-[#8F1720] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="h-4 w-4" />
                      Detalles
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal informativo de punto de encuentro (solo lectura) */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#171717]">Detalle del trayecto</h3>
              <button
                onClick={() => setSelectedRide(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-[#171717]">
              <p><strong>Conductor:</strong> {selectedRide.nombre_conductor} {selectedRide.apellido_conductor}</p>
              <p><strong>Punto de salida:</strong> {selectedRide.origen}</p>
              <p><strong>Destino:</strong> {selectedRide.destino}</p>
              <p><strong>Horario:</strong> {selectedRide.hora_salida?.slice(0, 5)} hrs</p>
              <p><strong>Vehículo:</strong> {selectedRide.marca_auto} {selectedRide.modelo_auto} {selectedRide.anio_auto}</p>
              <p><strong>Asientos disponibles:</strong> {selectedRide.asientos_disponibles}</p>
              <p><strong>Aportación solidaria:</strong> ${selectedRide.precio_pasajero} MXN</p>
            </div>

            <div className="mt-5 p-3 bg-[#F3F4F6] rounded-lg text-xs text-[#6B7280]">
              Para apartar un lugar o coordinar el punto exacto de encuentro, inicia sesión en la aplicación móvil <strong>UTRide</strong> con tu correo institucional.
            </div>

            <button
              onClick={() => setSelectedRide(null)}
              className="mt-5 w-full bg-[#171717] hover:bg-black text-white py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}