# Tienda Ropa - Sistema de Gestión

Plataforma elegante y profesional para gestión de inventario de tienda de ropa, construida con Next.js 16, Supabase y Tailwind CSS.

## 🎯 Características

- ✅ **Autenticación segura** - Sistema de login con contraseña
- ✅ **Gestión de productos** - Agregar prendas con imágenes, precios y categorías
- ✅ **Control de stock** - Gestión de stock por talla
- ✅ **Subida de imágenes** - Carga a Supabase Storage
- ✅ **Interfaz elegante** - Diseño profesional listo para producción
- ✅ **Responsivo** - Funciona en desktop, tablet y móvil
- ✅ **Validaciones robustas** - Manejo completo de errores

## 🚀 Quick Start

### 1. Instalación de dependencias

```bash
npm install
```

### 2. Configuración de variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Completa las variables:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
ADMIN_PASSWORD=tu_contraseña_admin_segura
```

### 3. Configurar Supabase

Asegúrate de que tu base de datos tenga estas tablas (ya creadas):

```sql
-- Categorías
create table categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null
);

-- Tallas
create table tallas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null
);

-- Productos
create table productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio decimal(10,2) not null,
  categoria_id uuid references categorias(id),
  imagen_url text,
  activo boolean default true,
  created_at timestamp default now()
);

-- Stock por talla
create table producto_tallas (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid references productos(id) on delete cascade,
  talla_id uuid references tallas(id),
  stock integer default 0
);

-- Insertar base de tallas
insert into tallas (nombre) values 
  ('XS'),('S'),('M'),('L'),('XL'),('XXL'),('XXXL'),('Único');
```

### 4. Crear Storage Bucket en Supabase

1. Ve a Supabase Dashboard
2. Crea un nuevo bucket llamado `productos`
3. Configura las políticas de acceso público

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📍 Estructura del Proyecto

```
tienda-ropa/
├── app/
│   ├── layout.tsx                 # Layout raíz
│   ├── page.tsx                   # Página de inicio (landing)
│   ├── login/
│   │   └── page.tsx               # Página de login
│   ├── admin/
│   │   └── agregar/
│   │       └── page.tsx           # Panel de agregar productos
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts    # API de login
│   │   │   └── logout/route.ts   # API de logout
│   │   └── productos/
│   │       └── agregar/route.ts  # API de agregar producto
│   └── globals.css                # Estilos globales
├── lib/
│   └── supabase.ts                # Cliente de Supabase
├── middleware.ts                  # Middleware de autenticación
├── next.config.ts                 # Configuración Next.js
├── tsconfig.json                  # Configuración TypeScript
└── package.json                   # Dependencias
```

## 🔐 Seguridad

- **Autenticación**: Sistema basado en contraseña con cookies httpOnly
- **Middleware**: Protege rutas `/admin/*` 
- **Validaciones**: Validaciones lado servidor y cliente
- **Variables secretas**: Token almacenado en cookies seguras

## 🎨 Diseño

- **Colors**: Paleta de emerald/teal para profesionalismo
- **Componentes**: Tarjetas, formularios y alerts personalizados
- **Responsive**: Mobile-first design
- **Production-ready**: Listo para Vercel

## 📦 Tecnologías

- **Next.js 16.2.3** - Framework React
- **React 19.2.4** - Librería UI
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Estilos
- **Supabase** - Backend y Storage
- **ESLint 9** - Code quality

## 🚢 Deploy en Vercel

```bash
npm install -g vercel
vercel
```

No olvides configurar las variables de entorno en el panel de Vercel.

## 📝 Notas

- Las imágenes se almacenan en Supabase Storage
- El stock se maneja por talla automáticamente
- Los cambios se guardan en base de datos en tiempo real
- La interfaz da feedback visual en cada acción

## 📧 Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.
