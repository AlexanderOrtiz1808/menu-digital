interface Props {
  nombre: string;
  setNombre: (nombre: string) => void;
  tipoEntrega: string;
  setTipoEntrega: (tipo: string) => void;
  metodoPago: string;
  setMetodoPago: (metodo: 'Efectivo' | 'Transferencia') => void;
  pagaCon: string;
  setPagaCon: (cantidad: string) => void;
  notas: string;
  setNotas: (notas: string) => void;
}

export default function FormularioPedido({
  nombre, setNombre,
  tipoEntrega, setTipoEntrega,
  metodoPago, setMetodoPago,
  pagaCon, setPagaCon,
  notas, setNotas
}: Props) {
  return (
    <div className="flex flex-col gap-3 max-w-sm w-full mb-6 bg-slate-800 border border-slate-700 p-4 rounded-xl">
      <h2 className="text-md font-bold text-amber-400 text-left">Detalles del pedido</h2>

      <input
        type="text"
        placeholder="Tu nombre (opcional)"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTipoEntrega('Para llevar')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
            tipoEntrega === 'Para llevar'
              ? 'bg-amber-400 text-slate-900 border-amber-400'
              : 'bg-slate-900 text-slate-400 border-slate-700'
          }`}
        >
          🛍️ Para llevar
        </button>
        <button
          type="button"
          onClick={() => setTipoEntrega('Comer aquí')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
            tipoEntrega === 'Comer aquí'
              ? 'bg-amber-400 text-slate-900 border-amber-400'
              : 'bg-slate-900 text-slate-400 border-slate-700'
          }`}
        >
          🍽️ Comer aquí
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMetodoPago('Efectivo')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
            metodoPago === 'Efectivo'
              ? 'bg-amber-400 text-slate-900 border-amber-400'
              : 'bg-slate-900 text-slate-400 border-slate-700'
          }`}
        >
          💵 Efectivo
        </button>
        <button
          type="button"
          onClick={() => setMetodoPago('Transferencia')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
            metodoPago === 'Transferencia'
              ? 'bg-amber-400 text-slate-900 border-amber-400'
              : 'bg-slate-900 text-slate-400 border-slate-700'
          }`}
        >
          💳 Transferencia
        </button>
      </div>

      {metodoPago === 'Efectivo' && (
        <input
          type="number"
          placeholder="¿Con cuánto pagas? (ej. 200)"
          value={pagaCon}
          onChange={(e) => setPagaCon(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
        />
      )}

      <input
        type="text"
        placeholder="Notas (ej. Sin cebolla)"
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
      />
    </div>
  );
}