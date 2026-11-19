import { useState } from 'react';
import { CircleAlert, Upload } from 'lucide-react';

export default function Perfil({ user, setUser, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    career: user.career,
    role: user.role,
  });
  const [activeTab, setActiveTab] = useState('data');
  const [licenseFile, setLicenseFile] = useState(null);

  const handleSaveData = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: formData.name,
      phone: formData.phone,
      career: formData.career,
      role: formData.role,
    }));
    setIsEditing(false);
    showToast('Información del perfil actualizada exitosamente', 'success');
  };

  const handleDocumentSubmit = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      driverStatus: 'Pendiente de validación',
      role: 'Conductor',
    }));
    showToast('Documentos recibidos para revisión escolar', 'success');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Cabecera de Perfil */}
      <div className="mb-6 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#B5121B] text-2xl font-black text-white shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold text-[#171717]">{user.name}</h1>
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
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'data'
                ? 'bg-[#171717] text-white'
                : 'bg-gray-100 text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Datos Personales
          </button>
          <button
            onClick={() => setActiveTab('driver')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'driver'
                ? 'bg-[#171717] text-white'
                : 'bg-gray-100 text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Validación Conductor
          </button>
        </div>
      </div>

      {/* Contenido Pestaña Datos Personales */}
      {activeTab === 'data' ? (
        <div className="rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-[#D1D5DB] pb-4">
            <h2 className="text-base font-bold text-[#171717]">
              Información de la Cuenta
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg border border-[#B5121B] px-4 py-1.5 text-xs font-bold text-[#B5121B] hover:bg-red-50"
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
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#171717]">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#171717]">
                    Carrera / Área
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

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#171717]">
                    Rol en el servicio
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B]"
                  >
                    <option value="Pasajero">Pasajero</option>
                    <option value="Conductor">Conductor</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg border border-[#D1D5DB] px-4 py-2 text-xs font-bold text-[#6B7280]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#B5121B] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#8F1720]"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-6 text-xs sm:grid-cols-2">
              <div>
                <span className="block text-[#6B7280]">Matrícula escolar</span>
                <span className="text-sm font-bold text-[#171717]">
                  {user.matricula}
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
                  {user.phone}
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
        /* Contenido Pestaña Validación Conductor */
        <div className="rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-2 text-base font-bold text-[#171717]">
            Verificación y Registro de Vehículo
          </h2>
          <p className="mb-6 text-xs text-[#6B7280]">
            Adjunta tu documentación para activar la posibilidad de publicar
            viajes desde la web o la app móvil.
          </p>

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <CircleAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#F59E0B]" />
            <div className="text-xs text-[#171717]">
              <span className="font-bold">Estado actual: </span>
              <span className="font-semibold text-[#B5121B]">
                {user.driverStatus}
              </span>
              <p className="mt-0.5 text-[#6B7280]">
                Los documentos son revisados por el equipo administrativo del
                proyecto institucional.
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
                  Modelo y Año del Auto
                </label>
                <input
                  type="text"
                  placeholder="Ej. Nissan Versa 2020"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Placas del Vehículo
                </label>
                <input
                  type="text"
                  placeholder="Ej. ABC-123-D"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-[#B5121B] py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-[#8F1720]"
            >
              Enviar documentación para revisión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}