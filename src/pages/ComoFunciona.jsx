import { useState } from 'react';

function StepCard({ stepNumber, title, description }) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#D1D5DB] bg-white p-6 shadow-sm">
      <div className="pointer-events-none absolute top-2 right-3 text-5xl font-black text-gray-100 select-none">
        0{stepNumber}
      </div>
      <div>
        <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full border border-red-100 bg-red-50 text-sm font-bold text-[#B5121B]">
          {stepNumber}
        </div>
        <h4 className="mb-2 text-base font-bold text-[#171717]">{title}</h4>
        <p className="text-xs leading-relaxed text-[#6B7280]">{description}</p>
      </div>
    </div>
  );
}

export default function ComoFunciona({ setAuthModal }) {
  const [roleTab, setRoleTab] = useState('passenger');

  const passengerSteps = [
    {
      stepNumber: '1',
      title: 'Crea tu cuenta UTR',
      description:
        'Ingresa con tu correo institucional (@utr.edu.mx) y valida tu matrícula estudiantil.',
    },
    {
      stepNumber: '2',
      title: 'Busca tu ruta',
      description:
        'Filtra por punto de partida en Aguascalientes o comunidades cercanas y horario de llegada a la UTR.',
    },
    {
      stepNumber: '3',
      title: 'Aparta tu asiento',
      description:
        'Confirma el punto de encuentro acordado con el conductor y coordina los detalles del viaje.',
    },
    {
      stepNumber: '4',
      title: 'Viaja seguro',
      description:
        'Llega puntual a clase compartiendo costos accesibles y apoyando a la movilidad universitaria.',
    },
  ];

  const driverSteps = [
    {
      stepNumber: '1',
      title: 'Registro de Conductor',
      description:
        'Inicia sesión y sube tu licencia de conducir y tarjeta de circulación para validación escolar.',
    },
    {
      stepNumber: '2',
      title: 'Publica tu trayecto',
      description:
        'Indica tu punto de salida, paradas intermedias, asientos disponibles y horario matutino o vespertino.',
    },
    {
      stepNumber: '3',
      title: 'Acepta compañeros',
      description:
        'Visualiza quién solicita asiento de tu misma carrera o facultad y aprueba su solicitud.',
    },
    {
      stepNumber: '4',
      title: 'Recibe apoyo de gasolina',
      description:
        'Recibe la aportación solidaria por asiento y cubre los gastos diarios de combustible de tu vehículo.',
    },
  ];

  const activeSteps = roleTab === 'passenger' ? passengerSteps : driverSteps;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold text-[#171717]">
          ¿Cómo funciona UTRide?
        </h1>
        <p className="mt-2 text-sm text-[#6B7280] sm:text-base">
          La plataforma está diseñada para ser ágil, segura y sencilla. Conoce
          los pasos para viajar como pasajero o compartir tu auto.
        </p>

        {/* Selector de rol */}
        <div className="mt-6 inline-flex rounded-xl border border-[#D1D5DB] bg-white p-1 shadow-sm">
          <button
            onClick={() => setRoleTab('passenger')}
            className={`rounded-lg px-5 py-2 text-sm font-bold transition-all ${
              roleTab === 'passenger'
                ? 'bg-[#B5121B] text-white shadow'
                : 'text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Como Pasajero
          </button>
          <button
            onClick={() => setRoleTab('driver')}
            className={`rounded-lg px-5 py-2 text-sm font-bold transition-all ${
              roleTab === 'driver'
                ? 'bg-[#B5121B] text-white shadow'
                : 'text-[#6B7280] hover:text-[#171717]'
            }`}
          >
            Como Conductor
          </button>
        </div>
      </div>

      {/* Tarjetas de pasos */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {activeSteps.map((step) => (
          <StepCard
            key={step.stepNumber}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>

      {/* CTA Final */}
      <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-[#D1D5DB] bg-white p-8 text-center shadow-sm">
        <h3 className="text-xl font-bold text-[#171717]">
          ¿Listo para comenzar a viajar juntos?
        </h3>
        <p className="mt-2 mb-6 text-sm text-[#6B7280]">
          El registro toma menos de dos minutos y solo requieres tu cuenta de
          correo UTR.
        </p>
        <button
          onClick={() => setAuthModal('register')}
          className="rounded-lg bg-[#B5121B] px-6 py-3 font-bold text-white shadow transition-all hover:bg-[#8F1720]"
        >
          Crear cuenta institucional
        </button>
      </div>
    </div>
  );
}