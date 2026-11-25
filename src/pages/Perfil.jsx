import { useState, useEffect } from 'react';
import { CircleAlert, Upload } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const CARRERAS_UTR = [
  'TICs',
  'Lengua Inglesa',
  'Mecatrónica',
  'Capital Humano',
  'Diseño',
];

export default function Perfil({ user, setUser, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('data');
  const [licenseFile, setLicenseFile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    matricula: user.matricula || '',
    phone: user.phone || '',
    career: user.career || '',
  });

  const [driverForm, setDriverForm] = useState({
    vehicleModel: user.vehicleModel || '',
    vehiclePlates: user.vehiclePlates || '',
  });

  useEffect(() => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      matricula: user.matricula || '',
      phone: user.phone || '',
      career: user.career || '',
    });
    setDriverForm({
      vehicleModel: user.vehicleModel || '',
      vehiclePlates: user.vehiclePlates || '',
    });
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
    if (!driverForm.vehicleModel.trim() || !driverForm.vehiclePlates.trim()) {
      showToast('Ingresa el modelo y las placas de tu vehículo', 'error');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        vehicle_model: driverForm.vehicleModel.trim(),
        vehicle_plates: driverForm.vehiclePlates.trim().toUpperCase(),
        driver_status: 'Pendiente de validación',
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      showToast('Error al enviar solicitud: ' + error.message, 'error');
      return;
    }

    setUser((prev) => ({
      ...prev,
      driverStatus: 'Pendiente de validación',
      vehicleModel: driverForm.vehicleModel.trim(),
      vehiclePlates: driverForm.vehiclePlates.trim().toUpperCase(),
    }));

    showToast('Documentos y datos del vehículo enviados para revisión', 'success');
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
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-[#B5121B]">
                {user.role || 'Pasajero'}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">{user.email}</p>
            <p className="mt-1 text-xs font-semibold text-[#171717]">
              {user.career || 'Estudiante UTR'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
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
                ? 'bg-[#B5121B] text-white'
                : 'bg-gray-100 text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Validación Conductor
          </button>
        </div>
      </div>

      {/* Contenido de Pestañas */}
      {activeTab === 'data' ? (
        <div className="rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-[#171717]">
              Información de la Cuenta
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="cursor-pointer rounded-lg border border-[#D1D5DB] px-4 py-1.5 text-xs font-bold text-[#171717] transition-colors hover:border-[#B5121B] hover:text-[#B5121B]"
              >
                Editar Perfil
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
                    placeholder="Ej. 202400123"
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
                    placeholder="449 000 0000"
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold text-[#171717]">
                    Carrera / Área universitaria
                  </label>
                  <select
                    required
                    value={formData.career}
                    onChange={(e) =>
                      setFormData({ ...formData, career: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                  >
                    <option value="" disabled>
                      Selecciona tu carrera...
                    </option>
                    {!CARRERAS_UTR.includes(formData.career) &&
                      formData.career && (
                        <option value={formData.career}>
                          {formData.career}
                        </option>
                      )}
                    {CARRERAS_UTR.map((carrera) => (
                      <option key={carrera} value={carrera}>
                        {carrera}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
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
                <span className="font-bold text-[#6B7280] uppercase">
                  Nombre Completo
                </span>
                <p className="mt-1 font-semibold text-[#171717]">
                  {displayName}
                </p>
              </div>
              <div>
                <span className="font-bold text-[#6B7280] uppercase">
                  Correo Institucional
                </span>
                <p className="mt-1 font-semibold text-[#171717]">
                  {user.email}
                </p>
              </div>
              <div>
                <span className="font-bold text-[#6B7280] uppercase">
                  Matrícula Escolar
                </span>
                <p className="mt-1 font-semibold text-[#171717]">
                  {user.matricula || 'No registrada'}
                </p>
              </div>
              <div>
                <span className="font-bold text-[#6B7280] uppercase">
                  Teléfono
                </span>
                <p className="mt-1 font-semibold text-[#171717]">
                  {user.phone || 'No registrado'}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="font-bold text-[#6B7280] uppercase">
                  Carrera / Área Universitaria
                </span>
                <p className="mt-1 font-semibold text-[#171717]">
                  {user.career || 'No especificada'}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col justify-between gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-[#171717]">
                Validación como Conductor
              </h3>
              <p className="text-xs text-[#6B7280]">
                Completa los datos de tu vehículo y adjunta tu licencia vigente.
              </p>
            </div>
            <span
              className={`self-start rounded-full px-3 py-1 text-xs font-bold sm:self-auto ${
                user.driverStatus === 'Verificado'
                  ? 'bg-green-100 text-[#16A34A]'
                  : user.driverStatus === 'Pendiente de validación'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-[#6B7280]'
              }`}
            >
              Estado: {user.driverStatus || 'Sin solicitud'}
            </span>
          </div>

          <form onSubmit={handleDocumentSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-bold text-[#171717]">
                  Marca, Modelo y Año del Vehículo *
                </label>
                <input
                  type="text"
                  required
                  value={driverForm.vehicleModel}
                  onChange={(e) =>
                    setDriverForm({
                      ...driverForm,
                      vehicleModel: e.target.value,
                    })
                  }
                  placeholder="Ej. Nissan Versa 2021"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 outline-none focus:border-[#B5121B]"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-[#171717]">
                  Placas del Vehículo *
                </label>
                <input
                  type="text"
                  required
                  value={driverForm.vehiclePlates}
                  onChange={(e) =>
                    setDriverForm({
                      ...driverForm,
                      vehiclePlates: e.target.value,
                    })
                  }
                  placeholder="Ej. ABC-123-D"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 uppercase outline-none focus:border-[#B5121B]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-bold text-[#171717]">
                Licencia de Conducir Vigente (PDF o Imagen)
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#F3F4F6]/60 p-6 text-center transition-colors hover:border-[#B5121B]">
                <Upload className="mb-2 h-6 w-6 text-[#B5121B]" />
                <span className="font-semibold text-[#171717]">
                  {licenseFile
                    ? `Archivo seleccionado: ${licenseFile.name}`
                    : 'Haz clic para adjuntar tu licencia de conducir'}
                </span>
                <span className="mt-1 text-[11px] text-[#6B7280]">
                  Formatos aceptados: JPG, PNG o PDF (máx. 5 MB)
                </span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
              <CircleAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <span>
                Tu solicitud será revisada por el Administrador Head de UTRide
                antes de habilitar la publicación de rutas.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="cursor-pointer rounded-lg bg-[#B5121B] px-5 py-2.5 font-bold text-white shadow hover:bg-[#8F1720] disabled:opacity-50"
              >
                {saving ? 'Enviando...' : 'Enviar solicitud de validación'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}