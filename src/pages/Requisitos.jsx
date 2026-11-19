import { CircleCheckBig, ShieldCheck } from 'lucide-react';

export default function Requisitos({ navigateTo, user, setAuthModal }) {
  const requirementsList = [
    {
      title: 'Ser miembro activo de la UTR',
      desc: 'Contar con correo institucional vigente (@utr.edu.mx) como estudiante, docente o personal administrativo.',
    },
    {
      title: 'Licencia de conducir vigente',
      desc: 'Licencia de automovilista emitida por la Secretaría de Seguridad Pública u organismo estatal competente.',
    },
    {
      title: 'Vehículo en condiciones mecánicas óptimas',
      desc: 'Automóvil particular propio o familiar con placas vigentes y verificación vehicular al corriente.',
    },
    {
      title: 'Póliza de seguro vehicular',
      desc: 'Seguro de auto vigente con cobertura mínima de Responsabilidad Civil ante terceros.',
    },
    {
      title: 'Compromiso de puntualidad y seguridad',
      desc: 'Apegarse al reglamento de sana convivencia universitaria y respeto a los puntos de encuentro pactados.',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold tracking-wider text-[#B5121B] uppercase">
          Comunidad de Conductores
        </span>
        <h1 className="mt-3 text-3xl font-extrabold text-[#171717]">
          Requisitos para ser Conductor UTRide
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-[#6B7280]">
          Para garantizar la seguridad de todos los estudiantes, el proceso de
          alta de conductores solicita los siguientes documentos y lineamientos
          básicos.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:p-8">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#171717]">
          <ShieldCheck className="h-5 w-5 text-[#B5121B]" />
          Documentación y Condiciones
        </h3>

        <div className="space-y-4">
          {requirementsList.map((req, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-xl border border-gray-200 bg-[#F3F4F6] p-4"
            >
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-white">
                <CircleCheckBig className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#171717]">
                  {req.title}
                </h4>
                <p className="mt-0.5 text-xs text-[#6B7280]">{req.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#D1D5DB] pt-6 sm:flex-row">
          <div className="text-xs text-[#6B7280]">
            <strong>Nota:</strong> En esta versión MVP web, la verificación se
            procesa de manera demostrativa y asistida por el equipo de estadías.
          </div>

          {user.isAuthenticated ? (
            <button
              onClick={() => navigateTo('profile')}
              className="w-full rounded-lg bg-[#B5121B] px-6 py-2.5 text-sm font-bold text-white shadow transition-all hover:bg-[#8F1720] sm:w-auto"
            >
              Subir documentos en Mi Perfil
            </button>
          ) : (
            <button
              onClick={() => setAuthModal('login')}
              className="w-full rounded-lg bg-[#B5121B] px-6 py-2.5 text-sm font-bold text-white shadow transition-all hover:bg-[#8F1720] sm:w-auto"
            >
              Iniciar sesión para solicitar alta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}