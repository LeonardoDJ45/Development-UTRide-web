import { useState } from 'react';
import { CircleCheckBig } from 'lucide-react';

export default function Contacto({ showToast }) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    showToast(
      'Mensaje de contacto enviado al equipo del proyecto UTRide',
      'success'
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-[#171717]">
          Contacto y Soporte
        </h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          ¿Tienes dudas sobre el proyecto o requieres asistencia técnica con tu
          cuenta?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Información Lateral */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
            <h4 className="mb-2 text-xs font-bold tracking-wider text-[#6B7280] uppercase">
              Ubicación Campus
            </h4>
            <p className="text-xs leading-relaxed text-[#171717]">
              Universidad Tecnológica El Retoño.
              <br />
              Edificio de Tecnologías de la Información.
              <br />
              El Llano, Aguascalientes.
            </p>
          </div>

          <div className="rounded-xl border border-[#D1D5DB] bg-white p-5 shadow-sm">
            <h4 className="mb-2 text-xs font-bold tracking-wider text-[#6B7280] uppercase">
              Correo del Proyecto
            </h4>
            <p className="text-xs text-[#171717]">soporte.utride@utr.edu.mx</p>
            <p className="mt-1 text-[11px] text-[#6B7280]">
              Atención de Lunes a Viernes 08:00 a 16:00 hrs
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:p-8 md:col-span-2">
          {sent ? (
            <div className="space-y-3 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-[#16A34A]">
                <CircleCheckBig className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#171717]">
                ¡Mensaje Recibido!
              </h3>
              <p className="mx-auto max-w-sm text-xs text-[#6B7280]">
                Gracias por comunicarte. El equipo del proyecto dará seguimiento
                a tu solicitud a la brevedad.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 rounded-lg bg-[#B5121B] px-4 py-2 text-xs font-bold text-white"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Leonardo Daniel Jiménez"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B] focus:ring-1 focus:ring-[#B5121B]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Correo Institucional (@utr.edu.mx) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@utr.edu.mx"
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B] focus:ring-1 focus:ring-[#B5121B]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#171717]">
                  Mensaje o Consulta *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe tu duda o inconveniente técnico..."
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-xs outline-none focus:border-[#B5121B] focus:ring-1 focus:ring-[#B5121B]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#B5121B] py-3 text-xs font-bold text-white shadow transition-all hover:bg-[#8F1720]"
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}