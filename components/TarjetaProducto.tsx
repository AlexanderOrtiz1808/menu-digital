import { Producto } from '../types';

interface Props {
  producto: Producto;
  cantidad: number;
  cambiarCantidad: (id: number, delta: number) => void;
}

export default function TarjetaProducto({ producto, cantidad, cambiarCantidad }: Props) {
  return (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex justify-between items-center">
      <div className="text-left">
        <p className="font-semibold text-lg">{producto.emoji} {producto.nombre}</p>
        <p className="text-amber-400 font-bold">${producto.precio} MXN</p>
      </div>

      <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
        <button
          onClick={() => cambiarCantidad(producto.id, -1)}
          className="text-amber-400 font-bold text-xl px-1 hover:text-amber-300"
        >
          -
        </button>
        <span className="font-bold w-4 text-center">{cantidad}</span>
        <button
          onClick={() => cambiarCantidad(producto.id, 1)}
          className="text-amber-400 font-bold text-xl px-1 hover:text-amber-300"
        >
          +
        </button>
      </div>
    </div>
  );
}