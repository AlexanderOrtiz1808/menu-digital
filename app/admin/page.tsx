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
  const [idEdicion, setIdEdicion] = useState<string | null>(null);
  const [necesitaOnboarding, setNecesitaOnboarding] = useState(false);
  const [nombreRestaurante, setNombreRestaurante] = useState('');
  const prepararEdicion = (producto: any) => {
    setNombre(producto.name);
    setPrecio(producto.price);
    setCategoria(producto.category);
    setIdEdicion(producto.id);
  };

  const cancelarEdicion = () => {
    setNombre('');
    setPrecio('');
    setCategoria('Tacos');
    setIdEdicion(null);
  };

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
      .maybeSingle();

    if (!restData) {
      // Si no hay restaurante, activamos el onboarding
      setNecesitaOnboarding(true);
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

    if (idEdicion) {
      // MODO EDICIÓN (UPDATE)
      const { error } = await supabase
        .from('products')
        .update({
          name: nombre,
          price: parseFloat(precio),
          category: categoria,
        })
        .eq('id', idEdicion);

      if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el platillo');
      } else {
        cancelarEdicion(); // Limpia el formulario y quita el modo edición
        cargarDatosAdmin(); // Recarga la lista para ver los cambios
      }
    } else {
      // MODO CREACIÓN (INSERT) - Lo que ya tenías
      const { error } = await supabase
        .from('products')
        .insert([
          {
            restaurant_id: restaurante.id,
            name: nombre,
            price: parseFloat(precio),
            category: categoria, 
          },
        ]);

      if (error) {
        console.error('Error al guardar:', error);
        alert('Error al crear el platillo');
      } else {
        setNombre('');
        setPrecio('');
        setCategoria('Tacos');
        cargarDatosAdmin();
      }
    }
  };
  const crearPerfilRestaurante = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generar un slug (ej: "Mi Taquería" -> "mi-taqueria")
    const slug = nombreRestaurante
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const { error } = await supabase
      .from('restaurants')
      .insert([
        { name: nombreRestaurante, slug, user_id: user?.id }
      ]);

    if (error) {
      alert('Hubo un error al crear tu restaurante.');
      setCargando(false);
    } else {
      setNecesitaOnboarding(false);
      cargarDatosAdmin(); // Recarga todo para mostrar el panel normal
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  const descargarQR = async () => {
    if (!restaurante?.slug) return;

    // Obtiene el dominio actual en el que está corriendo la app
    const urlMenu = `${window.location.origin}/${restaurante.slug}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(urlMenu)}`;

    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `QR-${restaurante.slug}.png`;
      link.click();
    } catch (err) {
      alert('Error al descargar el código QR');
    }
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Cargando tu panel de administración...</p>
      </main>
    );
  }
  if (necesitaOnboarding) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">¡Bienvenido! 🎉</h1>
          <p className="text-slate-400 mb-6">Para comenzar a crear tu menú digital, dinos cómo se llama tu negocio.</p>
          
          <form onSubmit={crearPerfilRestaurante} className="space-y-4">
            <input
              type="text"
              placeholder="Ej. Taquería El Paisa"
              value={nombreRestaurante}
              onChange={(e) => setNombreRestaurante(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-3 rounded-lg transition-colors"
            >
              Crear mi menú
            </button>
          </form>
        </div>
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
        <div className="flex items-center gap-3">
  <button
    type="button"
    onClick={descargarQR}
    className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center gap-2"
  >
    <span>📱</span> Descargar QR
  </button>

  <button
    type="button"
    onClick={cerrarSesion}
    className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
  >
    Cerrar Sesión
  </button>
</div>
      </div>

      {/* Formulario para agregar productos */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8">
        <h2 className="text-xl font-bold mb-4 text-white">
  {idEdicion ? '✏️ Editar Platillo' : 'Agregar Nuevo Platillo'}
</h2>
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
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded-lg flex-1 transition-colors text-sm"
            >
              {idEdicion ? 'Actualizar' : '+ Guardar'}
            </button>
            
            {idEdicion && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Cancelar
              </button>
            )}
          </div>
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
              {/* Lado derecho: Precio y Botones */}
              <div className="flex items-center gap-2">
                <p className="font-bold text-amber-400 text-xl mr-2">${prod.price} MXN</p>
                
                {/* Botón de Editar */}
                <button
                  onClick={() => prepararEdicion(prod)}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg text-sm border border-blue-500/30 transition-colors"
                  title="Editar platillo"
                >
                  ✏️
                </button>

                {/* Botón de Eliminar */}
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