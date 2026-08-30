export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  emoji: string;
  categoria: 'Tacos' | 'Antojitos' | 'Bebidas';
}