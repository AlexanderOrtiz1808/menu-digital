import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Barra de navegación superior */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto w-full">
        <div className="text-2xl font-black text-amber-400">
          MenuQR<span className="text-white">.app</span>
        </div>
        <Link 
          href="/login" 
          className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg font-medium border border-slate-700 transition-colors"
        >
          Iniciar Sesión
        </Link>
      </nav>

      {/* Sección Principal (Hero) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-10 mb-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Tu menú digital en <span className="text-amber-400">cuestión de minutos.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl">
          Moderniza tu restaurante. Crea, edita y comparte tu menú a través de un código QR sin comisiones, sin descargas y 100% autogestionable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link 
            href="/login"
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-lg px-8 py-4 rounded-xl transition-transform hover:scale-105"
          >
            Comenzar Gratis Ahora
          </Link>
          <Link 
            href="/taqueria-prueba"
            target="_blank"
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg px-8 py-4 rounded-xl border border-slate-700 transition-colors"
          >
            Ver un menú de ejemplo
          </Link>
        </div>
      </div>

      {/* Pie de página */}
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} MenuQR App. Todos los derechos reservados.
      </footer>
    </main>
  );
}