import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Preguntas() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: '¿Quiénes pueden registrarse y utilizar UTRide?',
      a: 'Únicamente estudiantes regulares, docentes y personal administrativo en activo de la Universidad Tecnológica El Retoño. Es indispensable contar con correo institucional con dominio @utr.edu.mx.',
    },
    {
      q: '¿Cuánto cuesta un viaje y cómo se paga?',
      a: 'UTRide fomenta la aportación solidaria para gastos de gasolina y peajes (habitualmente entre $15 y $25 MXN por trayecto, comparable al costo de autobús o combi). Los acuerdos de entrega de cuota se realizan directamente entre los estudiantes participantes.',
    },
    {
      q: '¿La página web sustituye a la app móvil?',
      a: 'No. La página web funciona como plataforma complementaria e informativa para dar difusión, gestionar el perfil institucional y registrarse cómodamente desde computadoras de biblioteca o laptops. La app móvil continuará siendo el canal de geolocalización en ruta.',
    },
    {
      q: '¿Qué pasa si olvido mi contraseña?',
      a: 'Puedes restablecer tu acceso mediante la opción "¿Olvidaste tu contraseña?" en el formulario de inicio de sesión. El sistema enviará un enlace de verificación a tu correo institucional @utr.edu.mx.',
    },
    {
      q: '¿Cuáles son las medidas de seguridad del servicio?',
      a: 'Todos los perfiles están vinculados a la matrícula universitaria, evitando personas ajenas a la institución. Además, se revisa la vigencia de la licencia de conducir y seguro vehicular de los conductores registrados.',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-[#171717]">
          Preguntas Frecuentes
        </h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Respuestas a las dudas más habituales sobre la plataforma de movilidad
          UTRide.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-xl border border-[#D1D5DB] bg-white shadow-sm transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-[#171717] transition-colors hover:text-[#B5121B] sm:text-base"
            >
              <span>{faq.q}</span>
              {openIndex === idx ? (
                <ChevronUp className="h-5 w-5 flex-shrink-0 text-[#B5121B]" />
              ) : (
                <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#6B7280]" />
              )}
            </button>

            {openIndex === idx && (
              <div className="border-t border-gray-100 bg-gray-50/50 px-5 pt-1 pb-5 text-xs leading-relaxed text-[#6B7280] sm:text-sm">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}