-- ============================================
-- TABLAS PARA EL PANEL ADMINISTRATIVO
-- ============================================

-- 1. TABLA DE PRODUCTOS CON VARIANTES
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL(10, 2) NOT NULL,
  precio_descuento DECIMAL(10, 2),
  descuento_porcentaje INT DEFAULT 0,
  categoria VARCHAR(100),
  tipo VARCHAR(50),
  imagen_url VARCHAR(500),
  imagenes_adicionales TEXT[], -- JSON array de URLs
  estado VARCHAR(20) DEFAULT 'borrador', -- borrador, publicado, agotado
  stock_total INT DEFAULT 0,
  es_nuevo BOOLEAN DEFAULT true,
  es_oferta BOOLEAN DEFAULT false,
  material VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  thumbnail_url VARCHAR(500)
);

-- 2. TABLA DE VARIANTES (TALLA Y COLOR)
CREATE TABLE IF NOT EXISTS variantes_producto (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  talla VARCHAR(10),
  color VARCHAR(50),
  codigo_sku VARCHAR(50) UNIQUE,
  stock INT DEFAULT 0,
  precio_ajustado DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. TABLA DE PEDIDOS
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_pedido VARCHAR(20) UNIQUE NOT NULL,
  cliente_id UUID NOT NULL REFERENCES usuarios(id),
  estado VARCHAR(30) DEFAULT 'pendiente', -- pendiente, confirmado, preparando, enviado, entregado, cancelado
  subtotal DECIMAL(10, 2),
  descuento DECIMAL(10, 2) DEFAULT 0,
  envio DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50), -- tarjeta, transferencia, efectivo, etc
  numero_guia VARCHAR(50),
  direccion_envio TEXT,
  telefono_envio VARCHAR(20),
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. TABLA DE DETALLES DE PEDIDO
CREATE TABLE IF NOT EXISTS detalles_pedido (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES productos(id),
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2),
  talla VARCHAR(10),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. TABLA DE HISTORIAL DE ESTADOS
CREATE TABLE IF NOT EXISTS historial_pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  estado_anterior VARCHAR(30),
  estado_nuevo VARCHAR(30),
  razon TEXT,
  admin_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. TABLA DE CLIENTES (extendida)
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID UNIQUE REFERENCES usuarios(id),
  fecha_registro TIMESTAMP DEFAULT NOW(),
  total_gastado DECIMAL(10, 2) DEFAULT 0,
  cantidad_pedidos INT DEFAULT 0,
  estado VARCHAR(20) DEFAULT 'activo', -- activo, bloqueado, inactivo
  ultima_compra TIMESTAMP,
  notas_internas TEXT,
  director_referral VARCHAR(255),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. TABLA DE CUPONES/DESCUENTOS
CREATE TABLE IF NOT EXISTS cupones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  tipo VARCHAR(20), -- porcentaje, monto_fijo
  valor DECIMAL(10, 2) NOT NULL,
  minimo_compra DECIMAL(10, 2) DEFAULT 0,
  aplicable_a VARCHAR(50) DEFAULT 'todo', -- todo, categoria, producto_especifico
  categoria_id VARCHAR(100),
  producto_id UUID REFERENCES productos(id),
  fecha_inicio TIMESTAMP,
  fecha_fin TIMESTAMP,
  usos_permitidos INT DEFAULT 0,
  usos_realizados INT DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. TABLA DE CONFIGURACIÓN GENERAL
CREATE TABLE IF NOT EXISTS configuracion_tienda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_tienda VARCHAR(255) NOT NULL DEFAULT 'Tienda Ropa',
  email VARCHAR(255),
  telefono VARCHAR(20),
  whatsapp VARCHAR(20),
  logo_url VARCHAR(500),
  favicon_url VARCHAR(500),
  descripcion TEXT,
  direccion TEXT,
  ciudad VARCHAR(100),
  pais VARCHAR(100),
  modo_mantenimiento BOOLEAN DEFAULT false,
  mensaje_mantenimiento TEXT,
  politica_privacidad TEXT,
  terminos_condiciones TEXT,
  politica_devoluciones TEXT,
  costo_envio_fijo DECIMAL(10, 2),
  envio_gratis_minimo DECIMAL(10, 2),
  metodos_pago_activos TEXT[], -- JSON array: ['tarjeta', 'transferencia', 'efectivo']
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. TABLA DE CATEGORÍAS
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  icon_url VARCHAR(500),
  orden INT DEFAULT 0,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 10. TABLA DE ADMIN USERS (PERMISOS)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID UNIQUE REFERENCES usuarios(id),
  rol VARCHAR(50) DEFAULT 'moderador', -- superadmin, admin, moderador
  permisos TEXT[], -- JSON array de permisos
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 11. TABLA DE HISTORIAL DE AUDITORÍA
CREATE TABLE IF NOT EXISTS auditoria_admin (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  accion VARCHAR(100),
  tabla_afectada VARCHAR(50),
  registro_id VARCHAR(100),
  datos_anteriores JSONB,
  datos_nuevos JSONB,
  ip VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 12. TABLA DE ZONAS DE ENVÍO
CREATE TABLE IF NOT EXISTS zonas_envio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  ciudades TEXT[], -- JSON array
  costo DECIMAL(10, 2),
  dias_estimados INT,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_productos_estado ON productos(estado);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_fecha ON pedidos(created_at);
CREATE INDEX idx_clientes_usuario ON clientes(usuario_id);
CREATE INDEX idx_cupones_codigo ON cupones(codigo);
CREATE INDEX idx_cupones_activo ON cupones(activo);
CREATE INDEX idx_admin_users_usuario ON admin_users(usuario_id);
