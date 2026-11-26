import { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Users,
  Search,
  Calendar,
  Car,
  Plus,
  X,
  Info,
  Loader2,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function Viajes({
  user,
  setAuthModal,
  isAuthenticated,
  showToast,
}) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterShift, setFilterShift] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [newRide, setNewRide] = useState({
    origen: '',
    destino: 'Campus UTR El Retoño',
    hora_salida: '06:45',
    asientos_disponibles: 3,
    precio_pasajero: 10,
    marca_auto: '',
    modelo_auto: '',
    anio_auto: new Date().getFullYear(),
  });

  // Determinar turno automáticamente a partir de hora_salida (formato HH:MM:SS)
  const getShiftFromTime = (timeStr) => {
    if (!timeStr) return 'Matutino';
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (isNaN(hour)) return 'Matutino';
    return hour < 13 ? 'Matutino' : 'Vespertino';
  };

  // Formatear hora SQL (06:45:00 -> 06:45 hrs)
  const formatTime = (timeStr) => {
    if (!timeStr) return 'Horario por definir';
    return `${timeStr.slice(0, 5)} hrs`;
  };

  // Cargar únicamente rutas activas desde la tabla public.rides
  const fetchRides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('estado', 'activo')
      .order('id', { ascending: false });

    if (error) {
      showToast('Error al cargar las rutas: ' + error.message, 'error');
    } else {
      setRides(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRides();
  }, []);

  // Filtrado seguro por turno y búsqueda de texto usando columnas en español
  const filteredRides = rides.filter((ride) => {
    const rideShift = getShiftFromTime(ride.hora_salida);
    const matchesShift = filterShift === 'all' || rideShift === filterShift;

    const query = searchQuery.toLowerCase().trim();
    const fullDriver = `${ride.nombre_conductor || ''} ${ride.apellido_conductor || ''}`.toLowerCase();
    const originText = (ride.origen || '').toLowerCase();
    const destText = (ride.destino || '').toLowerCase();
    const carText = `${ride.marca_auto || ''} ${ride.modelo_auto || ''}`.toLowerCase();

    const matchesSearch =
      !query ||
      originText.includes(query) ||
      destText.includes(query) ||
      fullDriver.includes(query) ||
      carText.includes(query);

    return matchesShift && matchesSearch;
  });

  const handleInterestClick = (ride) => {
    if (!isAuthenticated) {
      setAuthModal('login');
      return;
    }
    setSelectedRide(ride);
  };

  const handlePublishRide = async (e) => {
    e.preventDefault();
    setPublishing(true);

    const { error } = await supabase.from('rides').insert([
      {
        driver_id: user.id,
        nombre_conductor: user.firstName || user.name || 'Conductor',
        apellido_conductor: user.lastName || 'UTR',
        origen: newRide.origen.trim(),
        destino: newRide.destino.trim(),
        marca_auto: newRide.marca_auto.trim() || 'Vehículo',
        modelo_auto: newRide.modelo_auto.trim() || 'Particular',
        anio_auto: Number(newRide.anio_auto) || null,
        hora_salida: newRide.hora_salida,
        asientos_disponibles: Number(newRide.asientos_disponibles),
        precio_pasajero: Number(newRide.precio_pasajero),
        estado: 'activo',
      },
    ]);

    setPublishing(false);

    if (error) {
      showToast('No se pudo publicar la ruta: ' + error.message, 'error');
      return;
    }

    showToast('Trayecto publicado en el catálogo universitario', 'success');
    setShowPublishModal(false);
    setNewRide({
      origen: '',
      destino: 'Campus UTR El Retoño',
      hora_salida: '06:45',
      asientos_disponibles: 3,
      precio_pasajero: 10,
      marca_auto: '',
      modelo_auto: '',
      anio_auto: new Date().getFullYear(),
    });
    fetchRides();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Encabezado y controles */}
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold tracking-wider text-[#B5121B] uppercase">
            Catálogo Universitario · Tiempo Real
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-[#171717]">
            Viajes y Trayectos hacia la UTR
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Consulta rutas programadas, horarios y disponibilidad de asientos publicados por la comunidad.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Buscador por zona, conductor o vehículo */}
          <div className="relative">
            <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar zona, conductor o auto..."
              className="w-60 rounded-lg border border-[#D1D5DB] bg-white py-2 pr-3 pl-9 text-xs outline-none focus:border-[#B5121B]"
            />
          </div>



        </div>
      </div>

      {/* Aviso de alcance MVP (Web vs App Móvil) */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-[#171717]">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2563EB]" />
        <p>
          <strong>Consulta de disponibilidad:</strong> En esta plataforma web puedes explorar los horarios, puntos de salida y cupos activos. La solicitud inmediata y seguimiento en ruta se sincronizan con la aplicación móvil <strong>UTRide</strong>.
        </p>
      </div>

      {/* Listado de rutas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white py-16 text-[#6B7280]">
          <Loader2 className="mb-2 h-8 w-8 animate-spin text-[#B5121B]" />
          <span className="text-xs font-semibold">
            Cargando trayectos desde Supabase...
          </span>
        </div>
      ) : filteredRides.length === 0 ? (
        <div className="rounded-2xl border border-[#D1D5DB] bg-white p-12 text-center">
          <Car className="mx-auto mb-3 h-10 w-10 text-[#6B7280]" />
          <h3 className="text-base font-bold text-[#171717]">
            No se encontraron rutas activas con esos filtros
          </h3>
          <p className="mt-1 text-xs text-[#6B7280]">
            Prueba limpiando el buscador o seleccionando "Todos los turnos".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredRides.map((ride) => {
            const driverFullName =
              `${ride.nombre_conductor || 'Conductor'} ${ride.apellido_conductor || 'UTR'}`.trim();
            const vehicleInfo =
              [ride.marca_auto, ride.modelo_auto, ride.anio_auto]
                .filter(Boolean)
                .join(' ') || 'Vehículo Universitario';
            const shiftLabel = getShiftFromTime(ride.hora_salida);
            const priceLabel =
              ride.precio_pasajero !== null && ride.precio_pasajero !== undefined
                ? `$${ride.precio_pasajero} MXN`
                : '$10 MXN';

            return (
              <div
                key={ride.id}
                className="flex flex-col justify-between rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm transition-all hover:border-[#B5121B]/50 hover:shadow-md"
              >
                <div>
                  {/* Cabecera conductor */}
                  <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-[#B5121B] uppercase">
                        {driverFullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#171717]">
                          {driverFullName}
                        </div>
                        <div className="text-[11px] text-[#6B7280]">
                          {vehicleInfo}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-bold text-[#171717]">
                        {shiftLabel}
                      </span>
                      <span className="rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold text-[#16A34A] uppercase">
                        Activo
                      </span>
                    </div>
                  </div>

                  {/* Origen y Destino */}
                  <div className="space-y-3 py-4">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B5121B]" />
                      <div>
                        <span className="block text-[10px] font-bold text-[#6B7280] uppercase">
                          Punto de salida
                        </span>
                        <span className="text-xs font-semibold text-[#171717]">
                          {ride.origen || 'Origen no especificado'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#16A34A]" />
                      <div>
                        <span className="block text-[10px] font-bold text-[#6B7280] uppercase">
                          Destino
                        </span>
                        <span className="text-xs font-semibold text-[#171717]">
                          {ride.destino || 'Campus UTR El Retoño'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Métricas y botón */}
                <div>
                  <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl bg-[#F3F4F6] p-3 text-xs">
                    <div className="flex items-center gap-1.5 text-[#171717]">
                      <Clock className="h-4 w-4 text-[#B5121B]" />
                      <span className="font-semibold">
                        {formatTime(ride.hora_salida)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#171717]">
                      <Users className="h-4 w-4 text-[#B5121B]" />
                      <span className="font-semibold">
                        {ride.asientos_disponibles ?? 0} lugares
                      </span>
                    </div>
                    <div className="text-right text-sm font-bold text-[#16A34A]">
                      {priceLabel}
                    </div>
                  </div>

                  <div className="mb-3 flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Ruta activa · Comunidad Universitaria UTR</span>
                  </div>

                  <button
                    onClick={() => handleInterestClick(ride)}
                    className="w-full cursor-pointer rounded-lg bg-[#B5121B] py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#8F1720]"
                  >
                    {isAuthenticated
                      ? 'Ver detalles y punto de encuentro'
                      : 'Inicia sesión para ver detalles'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalles del Viaje */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-[#D1D5DB] pb-3">
              <h3 className="text-base font-bold text-[#171717]">
                Ficha del Trayecto Universitario
              </h3>
              <button
                onClick={() => setSelectedRide(null)}
                className="cursor-pointer rounded-lg p-1 text-[#6B7280] hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-[#F3F4F6] p-3.5">
                <p className="font-bold text-[#171717]">
                  {`${selectedRide.nombre_conductor || 'Conductor'} ${selectedRide.apellido_conductor || 'UTR'}`.trim()}
                </p>
                <p className="text-[#6B7280]">
                  {[
                    selectedRide.marca_auto,
                    selectedRide.modelo_auto,
                    selectedRide.anio_auto,
                  ]
                    .filter(Boolean)
                    .join(' ') || 'Vehículo Universitario'}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#6B7280] uppercase">
                  Punto de encuentro:
                </span>
                <p className="mt-0.5 font-semibold text-[#171717]">
                  {selectedRide.origen}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#6B7280] uppercase">
                  Destino y horario:
                </span>
                <p className="mt-0.5 font-semibold text-[#171717]">
                  {selectedRide.destino} · {formatTime(selectedRide.hora_salida)}
                </p>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-3">
                <span>
                  Cupo disponible:{' '}
                  <strong>{selectedRide.asientos_disponibles ?? 0} asientos</strong>
                </span>
                <span className="font-bold text-[#16A34A]">
                  Aportación: ${selectedRide.precio_pasajero ?? 10} MXN
                </span>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-[#171717]">
                Para apartar tu lugar en tiempo real y activar el seguimiento en mapa, busca esta ruta en la app móvil <strong>UTRide</strong>.
              </div>
            </div>

            <button
              onClick={() => setSelectedRide(null)}
              className="mt-5 w-full cursor-pointer rounded-lg bg-[#171717] py-2.5 text-xs font-bold text-white hover:bg-black"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal Publicar Nueva Ruta */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-[#D1D5DB] pb-3">
              <h3 className="text-base font-bold text-[#171717]">
                Publicar Trayecto Habitual
              </h3>
              <button
                onClick={() => setShowPublishModal(false)}
                className="cursor-pointer rounded-lg p-1 text-[#6B7280] hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePublishRide} className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-bold text-[#171717]">
                  Punto de salida *
                </label>
                <input
                  type="text"
                  required
                  value={newRide.origen}
                  onChange={(e) =>
                    setNewRide({ ...newRide, origen: e.target.value })
                  }
                  placeholder="Ej. Av. Siglo XXI y Mahatma Gandhi"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#B5121B]"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-[#171717]">
                  Destino *
                </label>
                <input
                  type="text"
                  required
                  value={newRide.destino}
                  onChange={(e) =>
                    setNewRide({ ...newRide, destino: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#B5121B]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Marca auto *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRide.marca_auto}
                    onChange={(e) =>
                      setNewRide({ ...newRide, marca_auto: e.target.value })
                    }
                    placeholder="Nissan"
                    className="w-full rounded-lg border border-[#D1D5DB] px-2.5 py-2 outline-none focus:border-[#B5121B]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRide.modelo_auto}
                    onChange={(e) =>
                      setNewRide({ ...newRide, modelo_auto: e.target.value })
                    }
                    placeholder="Versa"
                    className="w-full rounded-lg border border-[#D1D5DB] px-2.5 py-2 outline-none focus:border-[#B5121B]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Año *
                  </label>
                  <input
                    type="number"
                    required
                    value={newRide.anio_auto}
                    onChange={(e) =>
                      setNewRide({ ...newRide, anio_auto: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-2.5 py-2 outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Hora salida *
                  </label>
                  <input
                    type="time"
                    required
                    value={newRide.hora_salida}
                    onChange={(e) =>
                      setNewRide({ ...newRide, hora_salida: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-2.5 py-2 outline-none focus:border-[#B5121B]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Asientos *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={newRide.asientos_disponibles}
                    onChange={(e) =>
                      setNewRide({
                        ...newRide,
                        asientos_disponibles: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-2.5 py-2 outline-none focus:border-[#B5121B]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Tarifa ($ MXN) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={newRide.precio_pasajero}
                    onChange={(e) =>
                      setNewRide({
                        ...newRide,
                        precio_pasajero: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-2.5 py-2 outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={publishing}
                className="mt-2 w-full cursor-pointer rounded-lg bg-[#B5121B] py-2.5 font-bold text-white shadow hover:bg-[#8F1720] disabled:opacity-50"
              >
                {publishing ? 'Publicando...' : 'Publicar trayecto'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}