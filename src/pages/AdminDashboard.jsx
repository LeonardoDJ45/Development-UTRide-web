import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Users,
  Car,
  UserPlus,
  UserMinus,
  Search,
  RefreshCw,
  MapPin,
  Clock
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function AdminDashboard({ user, profile, showToast }) {
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [profilesRes, ridesRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('rides').select('*')
      ]);

      if (profilesRes.error) {
        console.error('Error en profiles:', profilesRes.error);
        if (showToast) showToast(`Error usuarios: ${profilesRes.error.message}`, 'error');
      } else {
        setUsers(profilesRes.data || []);
      }

      if (ridesRes.error) {
        console.error('Error en rides:', ridesRes.error);
        if (showToast) showToast(`Error rutas: ${ridesRes.error.message}`, 'error');
      } else {
        setRides(ridesRes.data || []);
      }
    } catch (err) {
      console.error('Error general en AdminDashboard:', err);
      if (showToast) {
        showToast('No se pudieron cargar los datos del panel administrativo.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const isDriverRole = (role) => {
    const r = (role || '').toLowerCase();
    return r === 'driver' || r === 'conductor';
  };

  const isAdminRole = (u) => {
    const r = (u?.role || '').toLowerCase();
    return r === 'admin' || (u?.email || '').toLowerCase() === 'st5303@utr.edu.mx';
  };

  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const totalDrivers = users.filter((u) => isDriverRole(u.role)).length;
    const totalPassengers = users.filter((u) => !isAdminRole(u) && !isDriverRole(u.role)).length;
    const activeRides = rides.filter((r) => r.estado === 'activo').length;

    return {
      totalUsers,
      totalDrivers,
      totalPassengers,
      activeRides
    };
  }, [users, rides]);

  const handleDriverRoleToggle = async (targetUserId, makeDriver) => {
    const newRole = makeDriver ? 'Conductor' : 'Pasajero';
    setUpdatingId(targetUserId);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', targetUserId)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Supabase bloqueó la actualización (revisa políticas RLS).');
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u))
      );

      if (showToast) {
        showToast(
          makeDriver
            ? 'Usuario dado de alta como conductor.'
            : 'Usuario dado de baja como conductor.',
          'success'
        );
      }
    } catch (err) {
      console.error('Error al actualizar rol:', err);
      if (showToast) {
        showToast(`Error: ${err.message}`, 'error');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return users;

    return users.filter((u) => {
      const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
      const email = (u.email || '').toLowerCase();
      const matricula = (u.matricula || '').toLowerCase();
      const plates = (u.vehicle_plates || '').toLowerCase();

      return (
        fullName.includes(term) ||
        email.includes(term) ||
        matricula.includes(term) ||
        plates.includes(term)
      );
    });
  }, [users, searchTerm]);

  return (
    <div className="bg-[#F3F4F6] min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B5121B] bg-red-50 px-3 py-1 rounded-full mb-2">
              <Shield className="h-3.5 w-3.5" />
              Panel Administrativo • Admin Head
            </div>
            <h1 className="text-3xl font-bold text-[#171717]">Gestión y Supervisión UTRide</h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Control de comunidad universitaria, altas de conductores y rutas activas.
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white border border-[#D1D5DB] hover:bg-gray-50 text-[#171717] font-semibold px-4 py-2.5 rounded-xl text-sm transition self-start md:self-auto cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-[#B5121B]' : ''}`} />
            Actualizar datos
          </button>
        </div>

        {/* Tarjetas KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-[#D1D5DB] shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
              USUARIOS REGISTRADOS
            </p>
            <p className="text-3xl font-extrabold text-[#171717]">{metrics.totalUsers}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D1D5DB] shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
              CONDUCTORES REGISTRADOS
            </p>
            <p className="text-3xl font-extrabold text-[#16A34A]">{metrics.totalDrivers}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D1D5DB] shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
              PASAJEROS REGISTRADOS
            </p>
            <p className="text-3xl font-extrabold text-[#171717]">{metrics.totalPassengers}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D1D5DB] shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6B7280] mb-2">
              RUTAS ACTIVAS
            </p>
            <p className="text-3xl font-extrabold text-[#B5121B]">{metrics.activeRides}</p>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#171717] text-white'
                : 'bg-white text-[#171717] border border-[#D1D5DB] hover:bg-gray-50'
            }`}
          >
            <Users className="h-4 w-4" />
            Usuarios y Conductores ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('rides')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === 'rides'
                ? 'bg-[#171717] text-white'
                : 'bg-white text-[#171717] border border-[#D1D5DB] hover:bg-gray-50'
            }`}
          >
            <Car className="h-4 w-4" />
            Supervisión de Rutas ({rides.length})
          </button>
        </div>

        {/* Tabla de Usuarios */}
        {activeTab === 'users' && (
          <div className="bg-white border border-[#D1D5DB] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E5E7EB]">
              <div className="relative max-w-md">
                <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, correo, matrícula o placas..."
                  className="w-full pl-10 pr-4 py-2 border border-[#D1D5DB] rounded-xl text-sm focus:outline-none focus:border-[#B5121B]"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-[#6B7280]">
                Cargando registros de la comunidad UTR...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#6B7280]">
                No se encontraron usuarios registrados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-xs font-bold uppercase text-[#6B7280]">
                      <th className="py-3.5 px-5">Estudiante</th>
                      <th className="py-3.5 px-5">Matrícula / Carrera</th>
                      <th className="py-3.5 px-5">Vehículo Registrado</th>
                      <th className="py-3.5 px-5">Rol</th>
                      <th className="py-3.5 px-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-sm">
                    {filteredUsers.map((u) => {
                      const userIsDriver = isDriverRole(u.role);
                      const userIsAdmin = isAdminRole(u);
                      return (
                        <tr key={u.id} className="hover:bg-gray-50/70 transition">
                          <td className="py-4 px-5">
                            <p className="font-semibold text-[#171717]">
                              {u.first_name || u.last_name
                                ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                                : 'Sin nombre registrado'}
                            </p>
                            <p className="text-xs text-[#6B7280]">{u.email}</p>
                            {u.phone && <p className="text-xs text-[#6B7280]">{u.phone}</p>}
                          </td>

                          <td className="py-4 px-5">
                            <p className="font-medium text-[#171717]">{u.matricula || '—'}</p>
                            <p className="text-xs text-[#6B7280]">{u.career || 'Sin carrera'}</p>
                          </td>

                          <td className="py-4 px-5">
                            {u.vehicle_model || u.vehicle_plates ? (
                              <div>
                                <p className="font-medium text-[#171717]">
                                  {u.vehicle_model || 'Modelo no especificado'}
                                </p>
                                <span className="inline-block mt-0.5 text-xs font-mono bg-[#F3F4F6] px-2 py-0.5 rounded text-[#171717]">
                                  {u.vehicle_plates || 'SIN PLACAS'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-[#6B7280]">Sin vehículo</span>
                            )}
                          </td>

                          <td className="py-4 px-5">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                userIsAdmin
                                  ? 'bg-red-100 text-red-800'
                                  : userIsDriver
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-[#F3F4F6] text-[#6B7280]'
                              }`}
                            >
                              {userIsAdmin
                                ? 'Administrador'
                                : userIsDriver
                                ? 'Conductor'
                                : 'Pasajero'}
                            </span>
                          </td>

                          <td className="py-4 px-5 text-right">
                            {userIsAdmin ? (
                              <span className="text-xs font-semibold text-[#6B7280]">
                                Administrador
                              </span>
                            ) : userIsDriver ? (
                              <button
                                onClick={() => handleDriverRoleToggle(u.id, false)}
                                disabled={updatingId === u.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition cursor-pointer disabled:opacity-40"
                              >
                                <UserMinus className="h-3.5 w-3.5" />
                                Dar de baja
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDriverRoleToggle(u.id, true)}
                                disabled={updatingId === u.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 hover:bg-green-700 text-white transition cursor-pointer disabled:opacity-40"
                              >
                                <UserPlus className="h-3.5 w-3.5" />
                                Dar de alta
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tabla de Rutas */}
        {activeTab === 'rides' && (
          <div className="bg-white border border-[#D1D5DB] rounded-2xl shadow-sm overflow-hidden">
            {rides.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#6B7280]">
                No hay rutas registradas actualmente.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-xs font-bold uppercase text-[#6B7280]">
                      <th className="py-3.5 px-5">Conductor</th>
                      <th className="py-3.5 px-5">Trayecto</th>
                      <th className="py-3.5 px-5">Horario</th>
                      <th className="py-3.5 px-5">Asientos / Cuota</th>
                      <th className="py-3.5 px-5">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-sm">
                    {rides.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-4 px-5">
                          <p className="font-semibold text-[#171717]">
                            {r.nombre_conductor} {r.apellido_conductor}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {r.marca_auto} {r.modelo_auto} {r.anio_auto ? `(${r.anio_auto})` : ''}
                          </p>
                        </td>

                        <td className="py-4 px-5">
                          <p className="text-xs text-[#171717] flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#B5121B]" />
                            <strong>Origen:</strong> {r.origen}
                          </p>
                          <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3.5 w-3.5 text-gray-500" />
                            <strong>Destino:</strong> {r.destino}
                          </p>
                        </td>

                        <td className="py-4 px-5 font-medium text-[#171717]">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#B5121B]" />
                            {r.hora_salida?.slice(0, 5)} hrs
                          </span>
                        </td>

                        <td className="py-4 px-5">
                          <p className="font-medium text-[#171717]">
                            {r.asientos_disponibles} disponibles
                          </p>
                          <p className="text-xs font-semibold text-green-700">
                            ${r.precio_pasajero} MXN
                          </p>
                        </td>

                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                              r.estado === 'activo'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {r.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}