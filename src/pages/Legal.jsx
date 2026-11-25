import { Shield, FileText, ArrowLeft } from 'lucide-react';

export default function Legal({ activeTab = 'privacy', setActiveTab, navigateTo }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Botón volver */}
      <button
        onClick={() => navigateTo('home')}
        className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#6B7280] transition-colors hover:text-[#B5121B]"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al inicio
      </button>

      {/* Encabezado y selector de documento */}
      <div className="mb-8 rounded-2xl border border-[#D1D5DB] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold tracking-wider text-[#B5121B] uppercase">
              Marco Normativo Institucional
            </span>
            <h1 className="mt-2 text-2xl font-extrabold text-[#171717] sm:text-3xl">
              {activeTab === 'privacy'
                ? 'Aviso de Privacidad'
                : 'Términos y Condiciones de Uso'}
            </h1>
            <p className="mt-1 text-xs text-[#6B7280]">
              Plataforma de Movilidad Universitaria UTRide · Universidad Tecnológica El Retoño
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-[#D1D5DB] bg-[#F3F4F6] p-1">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-[#B5121B] text-white shadow'
                  : 'text-[#6B7280] hover:text-[#171717]'
              }`}
            >
              <Shield className="h-3.5 w-3.5" /> Privacidad
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === 'terms'
                  ? 'bg-[#B5121B] text-white shadow'
                  : 'text-[#6B7280] hover:text-[#171717]'
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Términos
            </button>
          </div>
        </div>
      </div>

      {/* Contenido del documento */}
      <div className="space-y-6 rounded-2xl border border-[#D1D5DB] bg-white p-6 text-sm leading-relaxed text-[#374151] shadow-sm sm:p-8">
        {activeTab === 'privacy' ? (
          <>
            <section>
              <h2 className="mb-2 text-base font-bold text-[#171717]">
                1. Responsable del Tratamiento de Datos
              </h2>
              <p>
                El proyecto institucional <strong>UTRide</strong>, desarrollado dentro del Área de Tecnologías de la Información de la <strong>Universidad Tecnológica El Retoño (UTR)</strong>, con domicilio en Carretera a San Luis Potosí Km. 68, El Retoño, El Llano, Aguascalientes, es responsable del uso y protección de sus datos personales.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold text-[#171717]">
                2. Datos Personales Recabados
              </h2>
              <p className="mb-2">
                Para verificar su pertenencia a la comunidad universitaria y coordinar traslados seguros, recabamos exclusivamente:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-xs sm:text-sm">
                <li>Nombre completo y apellidos.</li>
                <li>Correo electrónico institucional con dominio <strong>@utr.edu.mx</strong>.</li>
                <li>Matrícula escolar, carrera o área de adscripción.</li>
                <li>Número telefónico de contacto (opcional para coordinación entre participantes).</li>
                <li>Para usuarios que soliciten el rol de <strong>Conductor</strong>: copia digital de licencia de conducir vigente, modelo, año y placas del vehículo.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold text-[#171717]">
                3. Finalidad del Uso de la Información
              </h2>
              <p>
                Sus datos se utilizan únicamente para autenticar su identidad estudiantil o docente, validar la documentación de conductores y mostrar la disponibilidad de rutas hacia y desde el campus. <strong>UTRide no comercializa, cede ni comparte datos personales con terceros externos a la institución.</strong>
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold text-[#171717]">
                4. Derechos ARCO y Contacto
              </h2>
              <p>
                Usted puede actualizar o eliminar sus datos personales en cualquier momento desde la sección <strong>Mi Perfil</strong> o enviando una solicitud al correo institucional <strong>soporte.utride@utr.edu.mx</strong>.
              </p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2 className="mb-2 text-base font-bold text-[#171717]">
                1. Naturaleza del Servicio (Movilidad Solidaria)
              </h2>
              <p>
                <strong>UTRide</strong> es una plataforma tecnológica sin fines de lucro creada para facilitar el contacto entre estudiantes, docentes y personal administrativo de la Universidad Tecnológica El Retoño que comparten rutas habituales hacia el campus. <strong>UTRide no opera como empresa de transporte público ni servicio de taxi ejecutivo.</strong>
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold text-[#171717]">
                2. Elegibilidad y Registro Institucional
              </h2>
              <p>
                El acceso está estrictamente limitado a miembros activos de la comunidad UTR con correo electrónico válido <strong>@utr.edu.mx</strong>. Toda cuenta inicia con el perfil de <strong>Pasajero</strong>; el alta como <strong>Conductor</strong> requiere validación previa de licencia vigente y datos vehiculares.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold text-[#171717]">
                3. Aportaciones Económicas Compartidas
              </h2>
              <p>
                Las cuotas sugeridas en cada ruta representan únicamente una aportación solidaria para dividir gastos de combustible y mantenimiento del vehículo entre los ocupantes. El acuerdo y entrega de dicha aportación se realiza directamente entre conductor y pasajeros.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-base font-bold text-[#171717]">
                4. Normas de Convivencia y Seguridad
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-xs sm:text-sm">
                <li>Respetar los horarios y puntos de encuentro acordados.</li>
                <li>Conducir respetando el reglamento de tránsito vigente y los límites de velocidad.</li>
                <li>Mantener un trato respetuoso acorde al reglamento interno de la Universidad Tecnológica El Retoño.</li>
                <li>El uso indebido de la plataforma o falsificación de documentos conlleva la suspensión inmediata de la cuenta.</li>
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}