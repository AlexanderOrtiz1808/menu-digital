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
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          pagaCon={pagaCon}
          setPagaCon={setPagaCon}
          notas={notas}
          setNotas={setNotas}
          total={total}
        />
      )}

      {/* Resumen final */}
      <div className="max-w-sm w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mb-4 flex justify-between items-center">
        <span className="text-lg font-semibold">Total:</span>
        <span className="text-2xl font-bold text-amber-400">${total} MXN</span>
      </div>

      {total > 0 ? (
        <a
          href={generarMensajeWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-sm bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg text-center block"
        >
          Enviar pedido por WhatsApp 🚀
        </a>
      ) : (
        <p className="text-slate-500 text-sm">Selecciona al menos un producto para pedir</p>
      )}
    </main>
  );
}