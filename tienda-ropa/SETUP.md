# 🛠️ Setup - Instrucciones de Configuración

## 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxx
```

Obtén estas credenciales en: **Dashboard Supabase → Settings → API**

---

## 2. Tablas de Base de Datos

### Tabla: `tienda_configuracion`

```sql
CREATE TABLE tienda_configuracion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_tienda VARCHAR(100),
  email VARCHAR(100),
  telefono VARCHAR(20),
  whatsapp VARCHAR(20),
  descripcion TEXT,
  logo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO tienda_configuracion (nombre_tienda, email, telefono, whatsapp, descripcion)
VALUES (
  'Mi Tienda Ropa',
  'info@mitienda.com',
  '+51 999 999 999',
  '51999999999',
  'La mejor tienda de ropa'
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE tienda_configuracion ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
CREATE POLICY "Allow public read" ON tienda_configuracion
  FOR SELECT USING (true);
```

### Tabla: `usuarios`

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Habilitar Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden leer solo su propio perfil
CREATE POLICY "Users can read own profile" ON usuarios
  FOR SELECT USING (auth.uid()::text = id::text OR email = current_setting('app.user_email'));

-- Solo insertar (registro público)
CREATE POLICY "Enable insert for public" ON usuarios
  FOR INSERT WITH CHECK (true);

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON usuarios
  FOR UPDATE USING (auth.uid()::text = id::text);
```

### Tabla: `productos` (Opcional - Para futuro)

```sql
CREATE TABLE productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  imagen_url VARCHAR(255),
  categoria VARCHAR(50),
  genero VARCHAR(20),
  tallas TEXT[], -- JSON array
  colores TEXT[],
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar lectura pública
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON productos
  FOR SELECT USING (true);
```

### Tabla: `carrito` (Opcional - Por ahora uso localStorage)

```sql
CREATE TABLE carrito (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id),
  producto_id UUID REFERENCES productos(id),
  talla VARCHAR(10),
  color VARCHAR(50),
  cantidad INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: `pedidos` (Opcional - Para futuro)

```sql
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id),
  estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, enviado, entregado, cancelado
  total DECIMAL(10, 2) NOT NULL,
  direccion TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pedidos_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id),
  producto_id UUID REFERENCES productos(id),
  cantidad INT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  talla VARCHAR(10),
  color VARCHAR(50)
);
```

---

## 3. Pasos en Supabase

1. Ve al **SQL Editor** en tu dashboard de Supabase
2. Copia y ejecuta cada script SQL anterior
3. Verifica que las tablas fueron creadas correctamente

---

## 4. Variables en Header

En el header, el nombre de la tienda (`config.nombre_tienda`) se obtiene de la tabla `tienda_configuracion` y se carga automáticamente.

---

## 5. Autenticación

- **Login**: `/app/auth/login/page.tsx` - Busca usuarios en la base de datos
- **Token**: SHA256 de `email:hashedPassword` (se genera en el cliente)
- **Almacenamiento**: localStorage
  - `auth_token` - Token para verificar autenticación
  - `user_id` - ID del usuario
  - `user_email` - Email del usuario
  - `user_nombre` - Nombre del usuario

---

## 6. Carrito

- **Almacenamiento**: localStorage (clave: `carrito`)
- **Formato**: Array de objetos con estructura:
  ```json
  [
    {
      "producto_id": "uuid",
      "nombre": "Producto",
      "talla": "M",
      "color": "Rojo",
      "cantidad": 1,
      "precio": 99.99,
      "imagen": "url"
    }
  ]
  ```
- **Evento**: `carrito-actualizado` se dispara cuando cambia el carrito
- **Mini Carrito**: Se abre con click en el icono de carrito en el header

---

## 7. Pages Disponibles

| Página | Ruta | Descripción |
|--------|------|------------|
| Inicio | `/` | Homepage con productos |
| Tienda | `/productos` | Catálogo con filtros |
| Producto | `/productos/:id` | Detalle del producto |
| Carrito | `/carrito` | Carrito completo |
| Checkout | `/checkout` | Proceso de compra en 3 pasos |
| Cuenta | `/cuenta` | Dashboard del usuario |
| Login | `/auth/login` | Inicio de sesión y registro |
| Admin Config | `/admin/configuracion` | Configuración de la tienda |

---

## 8. Estructura de Componentes

```
app/
├── components/
│   ├── HeaderPremium.tsx       ← Header con logo, nav, carrito, cuenta
│   ├── FooterPremium.tsx       ← Footer con links y redes
│   ├── MiniCarrito.tsx         ← Panel lateral del carrito
│   ├── catalog/
│   │   ├── FiltrosCatalogo.tsx ← Filtros avanzados
│   │   └── ProductoCard.tsx    ← Tarjeta de producto
│   └── trust/
│       └── TrustSection.tsx    ← Señales de confianza
├── auth/
│   └── login/
│       └── page.tsx            ← Login + Registro
├── productos/
│   ├── page.tsx                ← Catálogo
│   └── [id]/
│       └── page.tsx            ← Detalle del producto
├── carrito/
│   └── page.tsx                ← Carrito completo
├── checkout/
│   └── page.tsx                ← Checkout en 3 pasos
├── cuenta/
│   └── page.tsx                ← Dashboard del usuario
└── admin/
    └── configuracion/
        └── page.tsx            ← Config de la tienda
```

---

## 9. ¿Próximos Pasos?

- [ ] Conectar tabla `productos` a Supabase
- [ ] Agregar método de pago (Stripe, Mercado Pago)
- [ ] Proteger rutas (redirect si no autenticado)
- [ ] Implementar búsqueda por nombre
- [ ] Cargar carrito desde base de datos después de login
- [ ] Emails de confirmación de pedidos
- [ ] Panel de admin más completo

---

**¡Preguntas?** Revisa el archivo [CLAUDE.md](./CLAUDE.md) para más contexto
