import { useState, useEffect } from 'react';
import { CircleAlert, Upload, Car } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export default function Perfil({ user, setUser, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('data');
  const [licenseFile, setLicenseFile] = useState(null);
  const [existingVehicleId, setExistingVehicleId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    matricula: user.matricula || '',
    phone: user.phone || '',
    career: user.career || 'Estudiante UTR',
  });

  const [driverForm, setDriverForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    plates: '',
  });

  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      matricula: user.matricula || '',
      phone: user.phone || '',
      career: user.career || 'Estudiante UTR',
    });

    // Cargar vehículo registrado desde public.vehicles
    const fetchUserVehicle = async () => {
      if (!user.id) return;
      const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('driver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setExistingVehicleId(data.id);
        setDriverForm({
          brand: data.brand || '',
          model: data.model || '',
          year: data.year || new Date().getFullYear(),
          plates: data.plates || '',
        });
      }
    };

    fetchUserVehicle();
  }, [user]);

  const handleSaveData = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        matricula: formData.matricula.trim(),
        phone: formData.phone.trim(),
        career: formData.career.trim(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      showToast('Error al actualizar perfil: ' + error.message, 'error');
      return;
    }

    setUser((prev) => ({
      ...prev,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
      matricula: formData.matricula.trim(),
      phone: formData.phone.trim(),
      career: formData.career.trim(),
    }));

    setIsEditing(false);
    showToast('Información del perfil actualizada exitosamente', 'success');
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    if (
      !driverForm.brand.trim() ||
      !driverForm.model.trim() ||
      !driverForm.plates.trim()
    ) {
      showToast('Completa marca, modelo y placas de tu vehículo', 'error');
      return;
    }

    setSaving(true);

    const vehiclePayload = {
      driver_id: user.id,
      brand: driverForm.brand.trim(),
      model: driverForm.model.trim(),
      year: Number(driverForm.year) || null,
      plates: driverForm.plates.trim().toUpperCase(),
    };

    // 1. Insertar o actualizar en public.vehicles
    const { data: savedVehicle, error: vehicleError } = existingVehicleId
      ? await supabase
          .from('vehicles')
          .update(vehiclePayload)
          .eq('id', existingVehicleId)
          .select()
          .single()
      : await supabase
          .from('vehicles')
          .insert([vehiclePayload])
          .select()
          .single();

    if (vehicleError) {
      setSaving(false);
      showToast('Error al guardar vehículo: ' + vehicleError.message, 'error');
      return;
    }

    if (savedVehicle) {
      setExistingVehicleId(savedVehicle.id);
    }

    // 2. Actualizar estado de solicitud en public.profiles
    const nextStatus =
      user.driverStatus === 'Verificado'
        ? 'Verificado'
        : 'Pendiente de validación';

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ driver_status: nextStatus })
      .eq('id', user.id);

    setSaving(false);

    if (profileError) {
      showToast('Error al actualizar estado: ' + profileError.message, 'error');
      return;
    }

    setUser((prev) => ({
      ...prev,
      driverStatus: nextStatus,
      vehicleModel: `${driverForm.brand.trim()} ${driverForm.model.trim()}`,
      vehiclePlates: driverForm.plates.trim().toUpperCase(),
    }));

    showToast(
      'Vehículo registrado y documentación enviada para revisión',
      'success'
    );
  };

  const displayName = user.name || user.email;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Cabecera de Perfil */}
      <div className="mb-6 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#B5121B] text-2xl font-black text-white shadow-md uppercase">
            {displayName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold text-[#171717]">{displayName}</h1>
              <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-[#B5121B]">
                {user.role}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">{user.email}</p>
            <p className="mt-0.5 text-xs font-semibold text-[#171717]">
              {user.career}
            </p>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('data')}
            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'data'
                ? 'bg-[#171717] text-white'
                : 'bg-gray-100 text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Datos Personales
          </button>
          <button
            onClick={() => setActiveTab('driver')}
            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'driver'
                ? 'bg-[#171717] text-white'
                : 'bg-gray-100 text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Validación Conductor
          </button>
        </div>
      </div>

      {/* Pestaña Datos Personales */}
      {activeTab === 'data' ? (
        <div className="rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-[#D1D5DB] pb-4">
            <h2 className="text-base font-bold text-[#171717]">
              Información de la Cuenta
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="cursor-pointer rounded-lg border border-[#B5121B] px-4 py-1.5 text-xs font-bold text-[#B5121B] hover:bg-red-50"
              >
                Editar información
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveData} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#171717]">
                    Nombre(s)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#171717]">
                    Apellido(s)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#171717]">
                    Matrícula escolar
                  </label>
                  <input
                    type="text"
                    value={formData.matricula}
                    onChange={(e) =>
                      setFormData({ ...formData, matricula: e.target.value })
                    }
                    placeholder="Ej. UTR2022-5303"
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#171717]">
                    Teléfono de contacto
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Ej. 449 553 6435"
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-[#171717]">
                    Carrera / Área universitaria
                  </label>
                  <input
                    type="text"
                    value={formData.career}
                    onChange={(e) =>
                      setFormData({ ...formData, career: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="cursor-pointer rounded-lg border border-[#D1D5DB] px-4 py-2 text-xs font-bold text-[#6B7280]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded-lg bg-[#B5121B] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#8F1720] disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-6 text-xs sm:grid-cols-2">
              <div>
                <span className="block text-[#6B7280]">Matrícula escolar</span>
                <span className="text-sm font-bold text-[#171717]">
                  {user.matricula || 'Sin registrar'}
                </span>
              </div>
              <div>
                <span className="block text-[#6B7280]">
                  Correo institucional
                </span>
                <span className="text-sm font-bold text-[#171717]">
                  {user.email}
                </span>
              </div>
              <div>
                <span className="block text-[#6B7280]">
                  Teléfono de contacto
                </span>
                <span className="text-sm font-bold text-[#171717]">
                  {user.phone || 'Sin registrar'}
                </span>
              </div>
              <div>
                <span className="block text-[#6B7280]">
                  Carrera universitaria
                </span>
                <span className="text-sm font-bold text-[#171717]">
                  {user.career}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Pestaña Validación Conductor */
        <div className="rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-2 flex items-center gap-2">
            <Car className="h-5 w-5 text-[#B5121B]" />
            <h2 className="text-base font-bold text-[#171717]">
              Verificación y Registro de Vehículo
            </h2>
          </div>
          <p className="mb-6 text-xs text-[#6B7280]">
            Registra los datos de tu automóvil y adjunta tu documentación para solicitar la activación como conductor.
          </p>

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <CircleAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#F59E0B]" />
            <div className="text-xs text-[#171717]">
              <span className="font-bold">Estado actual: </span>
              <span className="font-semibold text-[#B5121B]">
                {user.driverStatus}
              </span>
              <p className="mt-0.5 text-[#6B7280]">
                Los documentos y placas son revisados por el Administrador Head institucional antes de habilitar el rol de Conductor.
              </p>
            </div>
          </div>

          <form onSubmit={handleDocumentSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#171717]">
                Licencia de Conducir (PDF o Imagen)
              </label>
              <div className="cursor-pointer rounded-xl border-2 border-dashed border-[#D1D5DB] bg-gray-50/50 p-4 text-center hover:border-[#B5121B]">
                <Upload className="mx-auto mb-1 h-6 w-6 text-[#6B7280]" />
                <span className="text-xs text-[#6B7280]">
                  {licenseFile
                    ? licenseFile.name
                    : 'Haz clic para seleccionar o arrastra tu archivo'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  id="lic-file"
                  onChange={(e) => setLicenseFile(e.target.files[0])}
                />
                <label
                  htmlFor="lic-file"
                  className="mt-2 block cursor-pointer text-[11px] font-bold text-[#B5121B]"
                >
                  Explorar equipo
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Marca del Vehículo <span className="text-[#B5121B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={driverForm.brand}
                  onChange={(e) =>
                    setDriverForm({ ...driverForm, brand: e.target.value })
                  }
                  placeholder="Ej. Nissan"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Modelo <span className="text-[#B5121B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={driverForm.model}
                  onChange={(e) =>
                    setDriverForm({ ...driverForm, model: e.target.value })
                  }
                  placeholder="Ej. Versa"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Año <span className="text-[#B5121B]">*</span>
                </label>
                <input
                  type="number"
                  min="1995"
                  max={new Date().getFullYear() + 1}
                  required
                  value={driverForm.year}
                  onChange={(e) =>
                    setDriverForm({ ...driverForm, year: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Placas del Vehículo <span className="text-[#B5121B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={driverForm.plates}
                  onChange={(e) =>
                    setDriverForm({ ...driverForm, plates: e.target.value })
                  }
                  placeholder="Ej. ABC-123-D"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs uppercase outline-none focus:border-[#B5121B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 w-full cursor-pointer rounded-lg bg-[#B5121B] py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-[#8F1720] disabled:opacity-50"
            >
              {saving ? 'Enviando...' : 'Enviar documentación para revisión'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}