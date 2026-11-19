import { Car, ExternalLink, MapPin } from 'lucide-react';

export default function Footer({ navigateTo }) {
  return (
    <footer className="border-t-4 border-[#B5121B] bg-[#171717] pt-14 pb-8 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Columna Marca */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B5121B] text-white">
                <Car className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                UT<span className="text-[#B5121B]">Ride</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Plataforma web de movilidad compartida diseñada exclusivamente para
              la comunidad estudiantil de la Universidad Tecnológica El Retoño.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <MapPin className="h-4 w-4 flex-shrink-0 text-[#B5121B]" />
              <span>Carretera a SLP Km. 68, El Retoño, El Llano, Ags.</span>
            </div>
          </div>

          {/* Columna Plataforma */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">
              Plataforma
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="transition-colors hover:text-white"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('how-it-works')}
                  className="transition-colors hover:text-white"
                >
                  ¿Cómo funciona?
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('requirements')}
                  className="transition-colors hover:text-white"
                >
                  Requisitos para conductor
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('rides')}
                  className="transition-colors hover:text-white"
                >
                  Explorar trayectos (MVP)
                </button>
              </li>
            </ul>
          </div>

          {/* Columna Universidad */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">
              Universidad
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="https://www.utr.edu.mx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-white"
                >
                  Portal UTR Oficial <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('faq')}
                  className="transition-colors hover:text-white"
                >
                  Preguntas frecuentes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="transition-colors hover:text-white"
                >
                  Mesa de ayuda y soporte
                </button>
              </li>
              <li>
                <span className="block pt-1 text-xs text-gray-500">
                  Modelo BIS: Bilingüe, Internacional y Sustentable
                </span>
              </li>
            </ul>
          </div>

          {/* Columna Proyecto */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-300 uppercase">
              Proyecto de Estadías
            </h3>
            <div className="space-y-2 rounded-lg border border-neutral-700 bg-neutral-800/80 p-3.5 text-xs text-gray-300">
              <p>
                <strong>Versión:</strong> 1.0 (MVP Web)
              </p>
              <p>
                <strong>Desarrollo:</strong> Leonardo Daniel Jiménez H. (Área
                TIC).
              </p>
              <span className="inline-block rounded bg-[#16A34A]/20 px-2 py-0.5 text-[10px] font-semibold text-[#16A34A]">
                API & Web Prototype Active
              </span>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 text-xs text-gray-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} UTRide · Universidad Tecnológica El
            Retoño. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 text-gray-400">
            <span
              className="cursor-pointer hover:text-white"
              onClick={() => navigateTo('faq')}
            >
              Aviso de Privacidad
            </span>
            <span>•</span>
            <span
              className="cursor-pointer hover:text-white"
              onClick={() => navigateTo('faq')}
            >
              Términos del Servicio
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}