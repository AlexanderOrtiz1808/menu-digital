'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [restaurante, setRestaurante] = useState<any>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para un nuevo producto
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Tacos');

  const router = useRouter();

  useEffect(() => {
    cargarDatosAdmin();
  }, []);

  const cargarDatosAdmin = async () => {
    setCargando(true);
    
    // 1. Obtener usuario autenticado
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    // 2. Obtener el restaurante del usuario
    const { data: restData, error: restError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (restError || !restData) {
      console.error('Error al obtener restaurante:', restError);
      setCargando(false);
      return;
    }

    setRestaurante(restData);

    // 3. Obtener los productos del restaurante
    const { data: prodData } = await supabase
      .from('products')
      .select('*')
      .eq('restaurant_id', restData.id);

    setProductos(prodData || []);
    setCargando(false);
  };

  const agregarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !precio || !restaurante) return;

    const { data, error } = await supabase.from('products').insert([
      {
        restaurant_id: restaurante.id,
        name: nombre,
        price: parseFloat(precio),
        category: categoria,
      },
    ]);

    if (error) {
      console.error('Error detallado de Supabase:', error);
      alert(`Error de Supabase: ${error.message}`);
    } else {
      setNombre('');
      setPrecio('');
      cargarDatosAdmin();
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Cargando tu panel de administración...</p>
      </main>
    );
  }
  const eliminarProducto = async (id: string) => {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este platillo?');
    if (!confirmacion) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el platillo');
    } else {
      cargarDatosAdmin(); // Esto recargará la lista automáticamente
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-400">{restaurante?.name || 'Mi Restaurante'}</h1>
          <p className="text-slate-400 text-sm">Slug actual: /{restaurante?.slug}</p>
        </div>
        <button
          onClick={cerrarSesion}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-4 py-2 rounded-lg border border-slate-700"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Formulario para agregar productos */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">Agregar Nuevo Platillo</h2>
        <form onSubmit={agregarProducto} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nombre del platillo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio ($)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
            required
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="Tacos">Tacos</option>
            <option value="Antojitos">Antojitos</option>
            <option value="Bebidas">Bebidas</option>
          </select>
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2 rounded-lg"
          >
            + Guardar Platillo
          </button>
        </form>
      </div>

      {/* Lista de productos */}
      <div>
        <div className="space-y-3">
          {productos.map((prod) => (
            <div
              key={prod.id}
              className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg text-white">{prod.name}</h3>
                <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full">
                  {prod.category}
                </span>
              </div>
              
              {/* Contenedor del precio y el botón juntos */}
              <div className="flex items-center gap-4">
                <p className="font-bold text-amber-400 text-xl">${prod.price} MXN</p>
                <button
                  onClick={() => eliminarProducto(prod.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg text-sm border border-red-500/30 transition-colors"
                  title="Eliminar platillo"
                >
                  🗑️
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}