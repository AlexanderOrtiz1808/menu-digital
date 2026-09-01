interface Props {
  nombre: string;
  setNombre: (nombre: string) => void;
  tipoEntrega: string;
  setTipoEntrega: (tipo: string) => void;
  direccion: string;
  setDireccion: (direccion: string) => void;
  metodoPago: string;
  setMetodoPago: (metodo: 'Efectivo' | 'Transferencia') => void;
  pagaCon: string;
  setPagaCon: (cantidad: string) => void;
  notas: string;
  setNotas: (notas: string) => void;
  total: number;
}

export default function FormularioPedido({
  nombre, setNombre, tipoEntrega, setTipoEntrega,
  direccion, setDireccion, metodoPago, setMetodoPago,
  pagaCon, setPagaCon, notas, setNotas, total,
}: Props) {
  const montoIngresado = parseFloat(pagaCon) || 0;
  const cambio = montoIngresado - total;

  return (
    <div className="flex flex-col gap-3 max-w-sm w-full mb-6 bg-slate-800 border border-slate-700 p-4 rounded-xl">
      <h3 className="font-semibold text-amber-400 text-sm">Detalles del pedido</h3>

      <input
        type="text"
        placeholder="Tu nombre *"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className={`bg-slate-900 border rounded-xl p-2.5 text-sm text-white focus:outline-none transition-all ${
          !nombre.trim()
            ? 'border-red-500/50 focus:border-red-500'
            : 'border-slate-700 focus:border-amber-400'
        }`}
      />
      {!nombre.trim() && (
        <p className="text-[11px] text-red-400 px-1 -mt-1">
          ⚠️ Por favor ingresa tu nombre para continuar.
        </p>
      )}

      {/* Modalidad de entrega (3 opciones) */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { id: 'Para llevar', label: '🥡 Llevar' },
          { id: 'Comer aquí', label: '🍽️ Aquí' },
          { id: 'A domicilio', label: '🛵 Domicilio' },
        ].map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            onClick={() => setTipoEntrega(opcion.id)}
            className={`py-2 text-xs font-bold rounded-xl border transition-all ${
              tipoEntrega === opcion.id
                ? 'bg-amber-400 text-slate-900 border-amber-400'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            {opcion.label}
          </button>
        ))}
      </div>

      {/* Campo para dirección (solo visible en A domicilio) */}
      {tipoEntrega === 'A domicilio' && (
        <input
          type="text"
          placeholder="Calle, número y colonia"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
        />
      )}

      {/* Método de pago */}
      <div className="grid grid-cols-2 gap-2">
        {(['Efectivo', 'Transferencia'] as const).map((metodo) => (
          <button
            key={metodo}
            type="button"
            onClick={() => setMetodoPago(metodo)}
            className={`py-2 text-xs font-bold rounded-xl border transition-all ${
              metodoPago === metodo
                ? 'bg-amber-400 text-slate-900 border-amber-400'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            {metodo === 'Efectivo' ? '💵 Efectivo' : '💳 Transferencia'}
          </button>
        ))}
      </div>

      {/* Pago en efectivo y cambio */}
      {metodoPago === 'Efectivo' && (
        <div className="flex flex-col gap-1.5">
          <input
            type="number"
            placeholder="¿Con cuánto pagas? (ej. 200)"
            value={pagaCon}
            onChange={(e) => setPagaCon(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
          />

          {pagaCon !== '' && (
            cambio >= 0 ? (
              <p className="text-xs text-green-400 font-semibold px-1">
                💵 Cambio a entregar: <span className="text-amber-400 font-bold">${cambio} MXN</span>
              </p>
            ) : (
              <p className="text-xs text-red-400 font-medium px-1">
                ⚠️ Falta ${(cambio * -1)} MXN para completar
              </p>
            )
          )}
        </div>
      )}

      <input
        type="text"
        placeholder="Notas (ej. Sin cebolla)"
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
      />
    </div>
  );
}