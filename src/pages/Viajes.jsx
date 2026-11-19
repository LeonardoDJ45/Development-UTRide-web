import { useState } from 'react';
import { Clock, MapPin, Users } from 'lucide-react';

export default function Viajes({
  setAuthModal,
  isAuthenticated,
  showToast,
}) {
  const [filterDestination, setFilterDestination] = useState('all');

  const mockRides = [
    {
      id: 1,
      driverName: 'Carlos M. (Estudiante TI)',
      vehicle: 'Nissan Versa · Blanco',
      origin: 'Ojocaliente I (Av. Ojocaliente & López Mateos)',
      destination: 'Campus UTR El Retoño',
      time: '06:45 AM',
      date: 'Lunes a Viernes',
      seatsAvailable: 3,
      price: '$18 MXN',
      shift: 'Matutino',
    },
    {
      id: 2,
      driverName: 'Mariana R. (Docente Idiomas)',
      vehicle: 'Chevrolet Aveo · Gris',
      origin: 'Plaza Patria / Centro Histórico Ags',
      destination: 'Campus UTR El Retoño',
      time: '07:00 AM',
      date: 'Lunes a Jueves',
      seatsAvailable: 2,
      price: '$22 MXN',
      shift: 'Matutino',
    },
    {
      id: 3,
      driverName: 'Luis E. (Mecatrónica)',
      vehicle: 'Volkswagen Gol · Rojo',
      origin: 'Fracc. Haciendas / Vistas de Ote.',
      destination: 'Campus UTR El Retoño',
      time: '12:30 PM',
      date: 'Lunes a Viernes',
      seatsAvailable: 3,
      price: '$20 MXN',
      shift: 'Vespertino',
    },
    {
      id: 4,
      driverName: 'Ing. Fernando G. (Personal UTR)',
      vehicle: 'Toyota Yaris · Azul',
      origin: 'Campus UTR El Retoño',
      destination: 'Ojocaliente / Morelos (Regreso a Ags)',
      time: '04:15 PM',
      date: 'Lunes a Viernes',
      seatsAvailable: 4,
      price: '$20 MXN',
      shift: 'Regreso',
    },
  ];

  const handleBookClick = (ride) => {
    if (!isAuthenticated) {
      setAuthModal('login');
      return;
    }
    showToast(
      `Solicitud de asiento enviada a ${ride.driverName} (Simulado MVP)`,
      'success'
    );
  };

  const filteredRides = mockRides.filter(
    (r) => filterDestination === 'all' || r.shift === filterDestination
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold tracking-wider text-[#B5121B] uppercase">
            Módulo Semanas 9-10
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-[#171717]">
            Viajes y Trayectos Universitarios
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Consulta salidas programadas por compañeros para coordinar traslados
            seguros al campus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#6B7280]">
            Filtrar turno:
          </label>
          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-xs focus:ring-1 focus:ring-[#B5121B] focus:outline-none"
          >
            <option value="all">Todos los turnos</option>
            <option value="Matutino">Turno Matutino</option>
            <option value="Vespertino">Turno Vespertino</option>
            <option value="Regreso">Rutas de Regreso</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredRides.map((ride) => (
          <div
            key={ride.id}
            className="flex flex-col justify-between rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#D1D5DB] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-[#B5121B]">
                    {ride.driverName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#171717]">
                      {ride.driverName}
                    </div>
                    <div className="text-[11px] text-[#6B7280]">
                      {ride.vehicle}
                    </div>
                  </div>
                </div>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-bold text-[#171717]">
                  {ride.shift}
                </span>
              </div>

              <div className="space-y-2.5 py-4">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B5121B]" />
                  <div>
                    <span className="block text-[10px] font-bold text-[#6B7280] uppercase">
                      Origen
                    </span>
                    <span className="text-xs font-semibold text-[#171717]">
                      {ride.origin}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#16A34A]" />
                  <div>
                    <span className="block text-[10px] font-bold text-[#6B7280] uppercase">
                      Destino
                    </span>
                    <span className="text-xs font-semibold text-[#171717]">
                      {ride.destination}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between rounded-xl bg-[#F3F4F6] p-3 text-xs">
                <div className="flex items-center gap-1 text-[#171717]">
                  <Clock className="h-4 w-4 text-[#6B7280]" />
                  <span className="font-semibold">{ride.time}</span>
                </div>
                <div className="flex items-center gap-1 text-[#171717]">
                  <Users className="h-4 w-4 text-[#6B7280]" />
                  <span className="font-semibold">
                    {ride.seatsAvailable} asientos
                  </span>
                </div>
                <div className="text-sm font-bold text-[#16A34A]">
                  {ride.price}
                </div>
              </div>

              <button
                onClick={() => handleBookClick(ride)}
                className="w-full rounded-lg bg-[#B5121B] py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#8F1720]"
              >
                Solicitar asiento en este viaje
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}