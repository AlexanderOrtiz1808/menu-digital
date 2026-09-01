'use client';

import { useState } from 'react';
import { PRODUCTOS } from '../data/productos';
import TarjetaProducto from '../components/TarjetaProducto';
import FormularioPedido from '../components/FormularioPedido';


export default function Home() {
  const [carrito, setCarrito] = useState<{ [key: number]: number }>({});
  const [nombre, setNombre] = useState('');
  const [tipoEntrega, setTipoEntrega] = useState('Para llevar');
  const [metodoPago, setMetodoPago] = useState<'Efectivo' | 'Transferencia'>('Efectivo');
  const [pagaCon, setPagaCon] = useState('');
  const [notas, setNotas] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<'Todas' | 'Tacos' | 'Antojitos' | 'Bebidas'>('Todas');
  const [direccion, setDireccion] = useState('');

  const cambiarCantidad = (id: number, delta: number) => {
    setCarrito((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const calcularTotal = () => {
    return PRODUCTOS.reduce((total, prod) => total + prod.precio * (carrito[prod.id] || 0), 0);
  };

const generarMensajeWhatsApp = () => {
    const lineas: string[] = [];
    lineas.push('¡Hola! Quiero hacer un pedido:');
    lineas.push('');
    if (nombre) lineas.push(`👤 *Cliente:* ${nombre}`);
    lineas.push(`📍 *Modalidad:* ${tipoEntrega}`);
if (tipoEntrega === 'A domicilio' && direccion) {
  lineas.push(`🏠 *Dirección:* ${direccion}`);
}

let infoPago = `💳 *Pago:* ${metodoPago}`;
    if (metodoPago === 'Efectivo' && pagaCon) {
      const cambio = (parseFloat(pagaCon) || 0) - calcularTotal();
      infoPago += ` (Paga con $${pagaCon} MXN${cambio >= 0 ? `, Cambio: $${cambio} MXN` : ''})`;
    }
    lineas.push(infoPago);

    lineas.push('');
    lineas.push('📋 *Pedido:*');

    PRODUCTOS.filter((p) => (carrito[p.id] || 0) > 0).forEach((p) => {
      lineas.push(`• ${carrito[p.id]}x ${p.nombre} ($${p.precio * carrito[p.id]} MXN)`);
    });

    lineas.push('');
    if (notas) {
      lineas.push(`📝 *Notas:* ${notas}`);
      lineas.push('');
    }
    lineas.push(`*Total a pagar: $${calcularTotal()} MXN*`);

    const textoFormateado = lineas.join('\n');
    return `https://wa.me/523141255011?text=${encodeURIComponent(textoFormateado)}`;
  };

  const productosFiltrados =
    categoriaActiva === 'Todas'
      ? PRODUCTOS
      : PRODUCTOS.filter((p) => p.categoria === categoriaActiva);

  const total = calcularTotal();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-900 text-white pb-12">
      <h1 className="text-3xl font-bold mb-1 text-amber-400">Tacos El Universitario</h1>
      <p className="text-slate-400 mb-6">Menú Digital interactivo</p>

      {/* Categorías */}
      <div className="flex gap-2 max-w-sm w-full mb-6 overflow-x-auto pb-1">
        {(['Todas', 'Tacos', 'Antojitos', 'Bebidas'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              categoriaActiva === cat
                ? 'bg-amber-400 text-slate-900'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

{/* Lista de productos */}
      <div className="flex flex-col gap-3 max-w-sm w-full mb-6">
        {productosFiltrados.map((prod) => (
          <TarjetaProducto
            key={prod.id}
            producto={prod}
            cantidad={carrito[prod.id] || 0}
            cambiarCantidad={cambiarCantidad}
          />
        ))}
      </div>

{/* Formulario de envío y pago */}
      {total > 0 && (
<FormularioPedido
  nombre={nombre}
  setNombre={setNombre}
  tipoEntrega={tipoEntrega}
  setTipoEntrega={setTipoEntrega}
  direccion={direccion}
  setDireccion={setDireccion}
  metodoPago={metodoPago}
  setMetodoPago={setMetodoPago}
  pagaCon={pagaCon}
  setPagaCon={setPagaCon}
  notas={notas}
  setNotas={setNotas}
  total={total}
/>
      )}

{/* Espacio extra al final para que la barra flotante no tape el contenido */}
      <div className="h-40"></div>

      {/* Barra flotante inferior (solo aparece si hay productos) */}
      {total > 0 ? (
        <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 p-4 pb-6 z-50 flex justify-center shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.6)]">
          <div className="w-full max-w-sm flex flex-col gap-3">
            <div className="flex justify-between items-center px-2">
              <span className="text-lg font-semibold text-slate-300">Total a pagar:</span>
              <span className="text-2xl font-bold text-amber-400">${total} MXN</span>
            </div>
            
            <button
              onClick={() => {
                if (!nombre.trim()) return;
                window.open(generarMensajeWhatsApp(), '_blank');
              }}
              disabled={!nombre.trim() || (tipoEntrega === 'A domicilio' && !direccion.trim())}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                !nombre.trim() || (tipoEntrega === 'A domicilio' && !direccion.trim())
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 active:scale-95'
              }`}
            >
              🚀 Enviar pedido por WhatsApp
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 mb-10">
          <p className="text-slate-500 text-sm">Selecciona al menos un producto para pedir</p>
        </div>
      )}
    </main>
  );
}