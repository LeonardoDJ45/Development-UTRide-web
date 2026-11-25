import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Car,
  Search,
  Edit3,
  CheckCircle2,
  UserX,
  UserCheck,
  Route,
  Ban,
  Trash2,
  Loader2,
  X,
  Save,
  Clock,
  MapPin,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function AdminDashboard({ user, showToast }) {
  const [mainSection, setMainSection] = useState('users'); // 'users' | 'rides'
  const [usersList, setUsersList] = useState([]);
  const [vehiclesMap, setVehiclesMap] = useState({});
  const [ridesList, setRidesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [userFilter, setUserFilter] = useState('all'); // 'all' | 'drivers' | 'pending' | 'passengers'
  const [rideFilter, setRideFilter] = useState('all'); // 'all' | 'activo' | 'cancelado'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal de edición de usuario/conductor
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    matricula: '',
    career: '',
    phone: '',
    role: 'Pasajero',
    driver_status: 'Sin solicitud',
    vehicle_id: null,
    brand: '',
    model: '',
    year: '',
    plates: '',
  });

  const fetchAllData = async () => {
    setLoading(true);

    // 1. Perfiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('first_name', { ascending: true });

    if (profilesError) {
      showToast('Error al cargar usuarios: ' + profilesError.message, 'error');
    } else {
      setUsersList(profilesData || []);
    }

    // 2. Vehículos
    const { data: vehiclesData } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    const vMap = {};
    (vehiclesData || []).forEach((v) => {
      if (!vMap[v.driver_id]) {
        vMap[v.driver_id] = v;
      }
    });
    setVehiclesMap(vMap);

    // 3. Rutas
    const { data: ridesData, error: ridesError } = await supabase
      .from('rides')
      .select('*')
      .order('id', { ascending: false });

    if (ridesError) {
      showToast('Error al cargar rutas: ' + ridesError.message, 'error');
    } else {
      setRidesList(ridesData || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (!user?.isAdminHead) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <ShieldCheck className="mx-auto mb-3 h-12 w-12 text-[#DC2626]" />
        <h2 className="text-xl font-bold text-[#171717]">Acceso Restringido</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Esta sección es exclusiva para cuentas con rol de Administrador Head.
        </p>
      </div>
    );
  }

  // Acción rápida: Validar o Dar de Alta como Conductor
  const handleApproveDriver = async (targetUser) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        role: 'Conductor',
        driver_status: 'Verificado',
      })
      .eq('id', targetUser.id);

    if (error) {
      showToast('Error al validar conductor: ' + error.message, 'error');
      return;
    }

    showToast(
      `${targetUser.first_name} ha sido validado y dado de alta como Conductor`,
      'success'
    );
    fetchAllData();
  };

  // Acción rápida: Dar de Baja como Conductor (revoca rol y cancela sus rutas activas)
  const handleRevokeDriver = async (targetUser) => {
    const confirmed = window.confirm(
      `¿Confirmas dar de baja como conductor a ${targetUser.first_name} ${targetUser.last_name}? Pasará a rol Pasajero y sus rutas activas se marcarán como canceladas.`
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        role: 'Pasajero',
        driver_status: 'Dado de baja',
      })
      .eq('id', targetUser.id);

    if (error) {
      showToast('Error al dar de baja conductor: ' + error.message, 'error');
      return;
    }

    // Dar de baja sus rutas activas automáticamente
    await supabase
      .from('rides')
      .update({ estado: 'cancelado' })
      .eq('driver_id', targetUser.id)
      .eq('estado', 'activo');

    showToast(
      `Conductor ${targetUser.first_name} dado de baja y rutas suspendidas`,
      'info'
    );
    fetchAllData();
  };

  // Acción sobre rutas: Dar de baja (cambiar estado a cancelado)
  const handleDeactivateRide = async (ride) => {
    const { error } = await supabase
      .from('rides')
      .update({ estado: 'cancelado' })
      .eq('id', ride.id);

    if (error) {
      showToast('No se pudo dar de baja la ruta: ' + error.message, 'error');
      return;
    }

    showToast(`Ruta #${ride.id} dada de baja correctamente`, 'info');
    fetchAllData();
  };

  // Acción sobre rutas: Reactivar ruta
  const handleReactivateRide = async (ride) => {
    const { error } = await supabase
      .from('rides')
      .update({ estado: 'activo' })
      .eq('id', ride.id);

    if (error) {
      showToast('No se pudo reactivar la ruta: ' + error.message, 'error');
      return;
    }

    showToast(`Ruta #${ride.id} reactivada`, 'success');
    fetchAllData();
  };

  // Acción sobre rutas: Eliminar registro permanentemente
  const handleDeleteRide = async (ride) => {
    const confirmed = window.confirm(
      `¿Eliminar permanentemente la ruta "${ride.origen} → ${ride.destino}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    const { error } = await supabase.from('rides').delete().eq('id', ride.id);

    if (error) {
      showToast(
        'No se puede eliminar (puede tener reservas vinculadas). Usa "Dar de baja" en su lugar.',
        'error'
      );
      return;
    }

    showToast(`Ruta #${ride.id} eliminada`, 'success');
    fetchAllData();
  };

  // Abrir modal de edición
  const openEditModal = (targetUser) => {
    const userVehicle = vehiclesMap[targetUser.id];
    setEditingUser(targetUser);
    setEditForm({
      first_name: targetUser.first_name || '',
      last_name: targetUser.last_name || '',
      matricula: targetUser.matricula || '',
      career: targetUser.career || 'Estudiante UTR',
      phone: targetUser.phone || '',
      role: targetUser.role || 'Pasajero',
      driver_status: targetUser.driver_status || 'Sin solicitud',
      vehicle_id: userVehicle?.id || null,
      brand: userVehicle?.brand || '',
      model: userVehicle?.model || '',
      year: userVehicle?.year || '',
      plates: userVehicle?.plates || '',
    });
  };

  const handleSaveUserChanges = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Si el admin marca estado "Verificado", asegurar que el rol también sea "Conductor"
    const finalRole =
      editForm.driver_status === 'Verificado' ? 'Conductor' : editForm.role;

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        matricula: editForm.matricula.trim(),
        career: editForm.career.trim(),
        phone: editForm.phone.trim(),
        role: finalRole,
        driver_status: editForm.driver_status,
      })
      .eq('id', editingUser.id);

    if (profileError) {
      setSaving(false);
      showToast('Error al actualizar perfil: ' + profileError.message, 'error');
      return;
    }

    // Guardar o actualizar vehículo en public.vehicles
    if (editForm.brand.trim() || editForm.model.trim() || editForm.plates.trim()) {
      const vehiclePayload = {
        driver_id: editingUser.id,
        brand: editForm.brand.trim() || 'Por definir',
        model: editForm.model.trim() || 'Por definir',
        year: editForm.year ? Number(editForm.year) : null,
        plates: editForm.plates.trim().toUpperCase(),
      };

      if (editForm.vehicle_id) {
        await supabase
          .from('vehicles')
          .update(vehiclePayload)
          .eq('id', editForm.vehicle_id);
      } else {
        await supabase.from('vehicles').insert([vehiclePayload]);
      }
    }

    setSaving(false);
    showToast('Cambios guardados exitosamente', 'success');
    setEditingUser(null);
    fetchAllData();
  };

  // Filtrado de usuarios
  const filteredUsers = usersList.filter((u) => {
    const isDriver =
      u.role === 'Conductor' || u.driver_status === 'Verificado';
    const isPending = u.driver_status === 'Pendiente de validación';

    if (userFilter === 'drivers' && !isDriver) return false;
    if (userFilter === 'pending' && !isPending) return false;
    if (userFilter === 'passengers' && (isDriver || isPending)) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const fullName = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    const matricula = (u.matricula || '').toLowerCase();

    return fullName.includes(q) || email.includes(q) || matricula.includes(q);
  });

  // Filtrado de rutas
  const filteredRides = ridesList.filter((r) => {
    if (rideFilter !== 'all' && (r.estado || '').toLowerCase() !== rideFilter) {
      return false;
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const driver = `${r.nombre_conductor || ''} ${r.apellido_conductor || ''}`.toLowerCase();
    const origin = (r.origen || '').toLowerCase();
    const dest = (r.destino || '').toLowerCase();

    return driver.includes(q) || origin.includes(q) || dest.includes(q);
  });

  // Métricas
  const totalDrivers = usersList.filter(
    (u) => u.role === 'Conductor' || u.driver_status === 'Verificado'
  ).length;
  const pendingDrivers = usersList.filter(
    (u) => u.driver_status === 'Pendiente de validación'
  ).length;
  const activeRidesCount = ridesList.filter(
    (r) => (r.estado || '').toLowerCase() === 'activo'
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Cabecera */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-bold tracking-wider text-[#B5121B] uppercase">
            <ShieldCheck className="h-3.5 w-3.5" /> Administración Central UTRide
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-[#171717]">
            Panel de Control · Administrador Head
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Alta, validación y baja de conductores, edición de pasajeros y control de rutas activas.
          </p>
        </div>

        {/* Selector Principal de Módulo */}
        <div className="inline-flex rounded-xl border border-[#D1D5DB] bg-white p-1 shadow-sm">
          <button
            onClick={() => {
              setMainSection('users');
              setSearchQuery('');
            }}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              mainSection === 'users'
                ? 'bg-[#171717] text-white'
                : 'text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            <Users className="h-4 w-4" /> Usuarios y Conductores
          </button>
          <button
            onClick={() => {
              setMainSection('rides');
              setSearchQuery('');
            }}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              mainSection === 'rides'
                ? 'bg-[#B5121B] text-white'
                : 'text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            <Route className="h-4 w-4" /> Rutas y Viajes ({ridesList.length})
          </button>
        </div>
      </div>

      {/* Tarjetas de Indicadores */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase">
            Comunidad Registrada
          </span>
          <p className="mt-1 text-2xl font-black text-[#171717]">
            {usersList.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase">
            Conductores Verificados
          </span>
          <p className="mt-1 text-2xl font-black text-[#16A34A]">
            {totalDrivers}
          </p>
        </div>

        <div className="rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase">
            Solicitudes por Validar
          </span>
          <p className="mt-1 text-2xl font-black text-[#F59E0B]">
            {pendingDrivers}
          </p>
        </div>

        <div className="rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase">
            Rutas Activas
          </span>
          <p className="mt-1 text-2xl font-black text-[#B5121B]">
            {activeRidesCount}
          </p>
        </div>
      </div>

      {/* SECCIÓN 1: GESTIÓN DE USUARIOS Y CONDUCTORES */}
      {mainSection === 'users' ? (
        <>
          <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#D1D5DB] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setUserFilter('all')}
                className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  userFilter === 'all'
                    ? 'bg-[#171717] text-white'
                    : 'bg-gray-100 text-[#6B7280] hover:text-[#171717]'
                }`}
              >
                Todos ({usersList.length})
              </button>
              <button
                onClick={() => setUserFilter('pending')}
                className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  userFilter === 'pending'
                    ? 'bg-[#F59E0B] text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Por Validar ({pendingDrivers})
              </button>
              <button
                onClick={() => setUserFilter('drivers')}
                className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  userFilter === 'drivers'
                    ? 'bg-[#B5121B] text-white'
                    : 'bg-gray-100 text-[#6B7280] hover:text-[#171717]'
                }`}
              >
                Conductores ({totalDrivers})
              </button>
              <button
                onClick={() => setUserFilter('passengers')}
                className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  userFilter === 'passengers'
                    ? 'bg-[#171717] text-white'
                    : 'bg-gray-100 text-[#6B7280] hover:text-[#171717]'
                }`}
              >
                Pasajeros
              </button>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-[#6B7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, correo o matrícula..."
                className="w-full rounded-lg border border-[#D1D5DB] py-2 pr-3 pl-9 text-xs outline-none focus:border-[#B5121B] sm:w-72"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#D1D5DB] bg-white py-16 text-[#6B7280]">
              <Loader2 className="mb-2 h-8 w-8 animate-spin text-[#B5121B]" />
              <span className="text-xs font-semibold">
                Cargando padrón universitario...
              </span>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#D1D5DB] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#D1D5DB] bg-[#F3F4F6] text-[11px] font-bold text-[#6B7280] uppercase">
                    <tr>
                      <th className="px-5 py-3.5">Usuario / Matrícula</th>
                      <th className="px-5 py-3.5">Contacto</th>
                      <th className="px-5 py-3.5">Rol</th>
                      <th className="px-5 py-3.5">Estado Conductor / Vehículo</th>
                      <th className="px-5 py-3.5 text-right">Gestión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((u) => {
                      const vehicle = vehiclesMap[u.id];
                      const isDriver =
                        u.role === 'Conductor' ||
                        u.driver_status === 'Verificado';

                      return (
                        <tr key={u.id} className="hover:bg-gray-50/80">
                          <td className="px-5 py-4">
                            <div className="font-bold text-[#171717]">
                              {u.first_name} {u.last_name}
                            </div>
                            <div className="text-[11px] text-[#6B7280]">
                              {u.matricula || 'Sin matrícula'} ·{' '}
                              {u.career || 'UTR'}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-[#171717]">{u.email}</div>
                            <div className="text-[11px] text-[#6B7280]">
                              {u.phone || 'Sin teléfono'}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                isDriver
                                  ? 'bg-red-50 text-[#B5121B]'
                                  : 'bg-gray-100 text-[#171717]'
                              }`}
                            >
                              {u.role || 'Pasajero'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-[11px] font-bold ${
                                u.driver_status === 'Verificado'
                                  ? 'bg-green-50 text-[#16A34A]'
                                  : u.driver_status === 'Pendiente de validación'
                                    ? 'bg-amber-50 text-amber-700'
                                    : u.driver_status === 'Dado de baja'
                                      ? 'bg-red-50 text-[#DC2626]'
                                      : 'text-[#6B7280]'
                              }`}
                            >
                              {u.driver_status || 'Sin solicitud'}
                            </span>
                            {vehicle && (
                              <div className="mt-0.5 text-[11px] text-[#6B7280]">
                                {vehicle.brand} {vehicle.model} ({vehicle.plates})
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {/* Botón Validar / Dar de alta Conductor */}
                              {!isDriver ? (
                                <button
                                  onClick={() => handleApproveDriver(u)}
                                  title="Validar y dar de alta como Conductor"
                                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#16A34A] px-2.5 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-green-700"
                                >
                                  <UserCheck className="h-3.5 w-3.5" /> Alta Conductor
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRevokeDriver(u)}
                                  title="Dar de baja como Conductor"
                                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-[#DC2626] hover:bg-[#DC2626] hover:text-white"
                                >
                                  <UserX className="h-3.5 w-3.5" /> Baja Conductor
                                </button>
                              )}

                              {/* Botón Editar Datos */}
                              <button
                                onClick={() => openEditModal(u)}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#D1D5DB] bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#171717] transition-colors hover:border-[#B5121B] hover:text-[#B5121B]"
                              >
                                <Edit3 className="h-3.5 w-3.5" /> Editar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* SECCIÓN 2: GESTIÓN Y BAJA DE RUTAS */
        <>
          <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#D1D5DB] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setRideFilter('all')}
                className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  rideFilter === 'all'
                    ? 'bg-[#171717] text-white'
                    : 'bg-gray-100 text-[#6B7280] hover:text-[#171717]'
                }`}
              >
                Todas ({ridesList.length})
              </button>
              <button
                onClick={() => setRideFilter('activo')}
                className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  rideFilter === 'activo'
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-green-50 text-[#16A34A] hover:bg-green-100'
                }`}
              >
                Activas ({activeRidesCount})
              </button>
              <button
                onClick={() => setRideFilter('cancelado')}
                className={`cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  rideFilter === 'cancelado'
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-red-50 text-[#DC2626] hover:bg-red-100'
                }`}
              >
                Dadas de Baja
              </button>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-[#6B7280]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar ruta por origen, destino o conductor..."
                className="w-full rounded-lg border border-[#D1D5DB] py-2 pr-3 pl-9 text-xs outline-none focus:border-[#B5121B] sm:w-80"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#D1D5DB] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#D1D5DB] bg-[#F3F4F6] text-[11px] font-bold text-[#6B7280] uppercase">
                  <tr>
                    <th className="px-5 py-3.5">ID / Conductor</th>
                    <th className="px-5 py-3.5">Trayecto (Origen → Destino)</th>
                    <th className="px-5 py-3.5">Horario y Cupo</th>
                    <th className="px-5 py-3.5">Estado</th>
                    <th className="px-5 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRides.map((r) => {
                    const isActive = (r.estado || '').toLowerCase() === 'activo';
                    return (
                      <tr key={r.id} className="hover:bg-gray-50/80">
                        <td className="px-5 py-4">
                          <span className="font-mono text-[11px] font-bold text-[#6B7280]">
                            #{r.id}
                          </span>
                          <div className="font-bold text-[#171717]">
                            {r.nombre_conductor} {r.apellido_conductor}
                          </div>
                          <div className="text-[11px] text-[#6B7280]">
                            {r.marca_auto} {r.modelo_auto} {r.anio_auto || ''}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 font-semibold text-[#171717]">
                            <MapPin className="h-3.5 w-3.5 text-[#B5121B]" />
                            {r.origen}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#6B7280]">
                            <MapPin className="h-3.5 w-3.5 text-[#16A34A]" />
                            {r.destino}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 font-semibold text-[#171717]">
                            <Clock className="h-3.5 w-3.5 text-[#B5121B]" />
                            {r.hora_salida ? r.hora_salida.slice(0, 5) : '--:--'} hrs
                          </div>
                          <div className="mt-0.5 text-[11px] text-[#6B7280]">
                            {r.asientos_disponibles ?? 0} asientos · $
                            {r.precio_pasajero ?? 10} MXN
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                              isActive
                                ? 'bg-green-50 text-[#16A34A]'
                                : 'bg-red-50 text-[#DC2626]'
                            }`}
                          >
                            {r.estado || 'sin estado'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {isActive ? (
                              <button
                                onClick={() => handleDeactivateRide(r)}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-[11px] font-bold text-amber-800 hover:bg-amber-600 hover:text-white"
                              >
                                <Ban className="h-3.5 w-3.5" /> Dar de baja ruta
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReactivateRide(r)}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-green-300 bg-green-50 px-2.5 py-1.5 text-[11px] font-bold text-[#16A34A] hover:bg-[#16A34A] hover:text-white"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Reactivar
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteRide(r)}
                              title="Eliminar registro"
                              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#DC2626] hover:bg-[#DC2626] hover:text-white"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal de Edición de Usuario / Conductor */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-[#D1D5DB] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#171717]">
                  Editar Perfil y Permisos
                </h3>
                <p className="text-[11px] text-[#6B7280]">{editingUser.email}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="cursor-pointer rounded-lg p-1 text-[#6B7280] hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserChanges} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Nombre(s)
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.first_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, first_name: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#B5121B]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Apellido(s)
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.last_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, last_name: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Matrícula
                  </label>
                  <input
                    type="text"
                    value={editForm.matricula}
                    onChange={(e) =>
                      setEditForm({ ...editForm, matricula: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#B5121B]"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-bold text-[#171717]">
                  Carrera / Área
                </label>
                <input
                  type="text"
                  value={editForm.career}
                  onChange={(e) =>
                    setEditForm({ ...editForm, career: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#B5121B]"
                />
              </div>

              {/* Control de Rol y Validación de Conductor */}
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#F3F4F6] p-3">
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Rol en Sistema
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] bg-white px-2.5 py-2 outline-none focus:border-[#B5121B]"
                  >
                    <option value="Pasajero">Pasajero</option>
                    <option value="Conductor">Conductor</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-bold text-[#171717]">
                    Estado Conductor
                  </label>
                  <select
                    value={editForm.driver_status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, driver_status: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] bg-white px-2.5 py-2 outline-none focus:border-[#B5121B]"
                  >
                    <option value="Sin solicitud">Sin solicitud</option>
                    <option value="Pendiente de validación">
                      Pendiente de validación
                    </option>
                    <option value="Verificado">Verificado (Alta)</option>
                    <option value="Dado de baja">Dado de baja</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>
              </div>

              {/* Datos del Vehículo (Tabla vehicles) */}
              <div className="border-t border-gray-200 pt-3">
                <h4 className="mb-2 font-bold text-[#171717]">
                  Datos del Vehículo (Alta / Edición de Conductor)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[#6B7280]">Marca</label>
                    <input
                      type="text"
                      value={editForm.brand}
                      onChange={(e) =>
                        setEditForm({ ...editForm, brand: e.target.value })
                      }
                      placeholder="Ej. Nissan"
                      className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#B5121B]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[#6B7280]">Modelo</label>
                    <input
                      type="text"
                      value={editForm.model}
                      onChange={(e) =>
                        setEditForm({ ...editForm, model: e.target.value })
                      }
                      placeholder="Ej. Versa"
                      className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#B5121B]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[#6B7280]">Año</label>
                    <input
                      type="number"
                      value={editForm.year}
                      onChange={(e) =>
                        setEditForm({ ...editForm, year: e.target.value })
                      }
                      placeholder="2021"
                      className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 outline-none focus:border-[#B5121B]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[#6B7280]">Placas</label>
                    <input
                      type="text"
                      value={editForm.plates}
                      onChange={(e) =>
                        setEditForm({ ...editForm, plates: e.target.value })
                      }
                      placeholder="ABC-123-D"
                      className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 uppercase outline-none focus:border-[#B5121B]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="cursor-pointer rounded-lg border border-[#D1D5DB] px-4 py-2 font-bold text-[#6B7280]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#B5121B] px-5 py-2 font-bold text-white shadow hover:bg-[#8F1720] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}