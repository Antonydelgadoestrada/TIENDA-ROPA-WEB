// Tipos compartidos para toda la aplicación

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  precio_original?: number
  descuento?: number
  imagen_url: string
  imagenes?: string[]
  color?: string
  talla?: string
  stock: number
  tallas_disponibles: string[]
  colores_disponibles: Color[]
  categoria: string
  tipo: string
  genero: 'hombre' | 'mujer' | 'unisex'
  temporada: 'primavera' | 'verano' | 'otoño' | 'invierno'
  material: string
  cuidados: string[]
  es_nuevo: boolean
  es_oferta: boolean
  vendidos: number
  calificacion?: number
  total_resenas?: number
  medidas: Medida[]
  created_at: string
  updated_at: string
}

export interface Color {
  nombre: string
  codigo_hex: string
  imagen_url?: string
}

export interface Medida {
  talla: string
  pecho?: number
  cintura?: number
  largo?: number
  caderas?: number
}

export interface CarritoItem {
  id: string
  producto_id: string
  producto: Producto
  cantidad: number
  talla: string
  color: string
  precio_unitario: number
  subtotal: number
}

export interface Carrito {
  items: CarritoItem[]
  subtotal: number
  envio: number
  descuento: number
  total: number
  descuento_falta_para_gratis?: number
}

export interface Pedido {
  id: string
  numero_pedido: string
  usuario_id: string
  items: CarritoItem[]
  subtotal: number
  envio: number
  descuento: number
  total: number
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado'
  metodo_pago: 'tarjeta' | 'transferencia' | 'contra_entrega' | 'billetera'
  datos_envio: DatosEnvio
  created_at: string
  updated_at: string
}

export interface DatosEnvio {
  nombre_completo: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  codigo_postal: string
  referencia?: string
}

export interface Usuario {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono?: string
  direccion?: string
  ciudad?: string
  codigo_postal?: string
  puntos: number
  created_at: string
}

export interface Resena {
  id: string
  producto_id: string
  usuario_id: string
  usuario_nombre: string
  calificacion: number // 1-5
  titulo: string
  contenido: string
  fotos?: string[]
  verificado: boolean
  helpful_count: number
  created_at: string
}

export interface Configuracion {
  nombre_tienda: string
  descripcion: string
  email?: string
  telefono?: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  tiktok?: string
  direccion?: string
  ciudad?: string
  horario?: string
  politica_devolucion?: string
}

export interface FiltrosProducto {
  busqueda?: string
  categoria?: string
  tipo?: string
  genero?: string
  talla?: string
  color?: string
  precio_min?: number
  precio_max?: number
  temporada?: string
  ordenar_por?: 'vendidos' | 'precio_asc' | 'precio_desc' | 'calificacion' | 'nuevo'
  vista?: 'grid' | 'lista'
}
