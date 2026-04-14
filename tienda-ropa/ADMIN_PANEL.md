# 🛍️ Panel Administrativo - Tienda de Ropa

## ⚡ Quick Start

### 1️⃣ Configurar Base de Datos (1 minuto)
```bash
# Ve a Supabase Dashboard
# SQL Editor → New Query
# Copia TODO el contenido de SETUP_ADMIN_TABLES.sql
# Pégalo y ejecuta (botón RUN)
```

📖 Instrucciones completas en: [DATABASE_SETUP.md](DATABASE_SETUP.md)

### 2️⃣ Iniciar el Servidor (1 minuto)
```bash
npm run dev
```
- 🌐 Abre http://localhost:3000
- 🔐 Accede a http://localhost:3000/admin (necesitas estar logueado como admin)

### 3️⃣ ¡Listo!
Comienza a usar los 6 módulos del admin:
- 📊 **Dashboard** - Métricas y resumen
- 👗 **Productos** - Gestiona catálogo
- 📦 **Pedidos** - Administra órdenes
- 👥 **Clientes** - Ver base de clientes
- 🎟️ **Cupones** - Crear descuentos
- ⚙️ **Configuración** - Ajustes de tienda

---

## 📚 Módulos Disponibles

### Dashboard 📊
- Ventas del día
- Pedidos nuevos
- Clientes nuevos
- Ingresos del mes
- Productos activos/agotados
- Últimos 5 pedidos

### Productos 👗
- Listar productos con búsqueda
- Filtrar activos/inactivos
- Ver stock total
- Editar detalles
- Desactivar productos
- Eliminar productos

### Pedidos 📦
- Ver todos los pedidos
- Cambiar estado (pendiente → entregado)
- Filtrar por estado
- Ver cliente y total
- Seguimiento
- Número de guía

### Clientes 👥
- Lista de clientes registrados
- Búsqueda por nombre/email
- Historial de compras
- Total gastado por cliente
- Ticket promedio
- Fecha de último pedido

### Cupones 🎟️
- Crear cupones por % o monto fijo
- Compra mínima requerida
- Fechas de expiración
- Activar/desactivar
- Ver contador de usos
- Eliminar códigos

### Configuración ⚙️
- Nombre de la tienda
- Email y teléfono
- Dirección
- Logo URL
- Tiempo de entrega
- Costo de envío
- Métodos de pago
- Modo mantenimiento

---

## 🔍 Solución de Problemas

### ❌ "column 'estado' does not exist"
→ Abre [DATABASE_SETUP.md](DATABASE_SETUP.md#solucionar-errores-comunes)

### ❌ "table does not exist"
→ Asegúrate de haber ejecutado completamente el SQL

### ❌ El dashboard muestra 0 en todo
→ Las tablas existen pero están vacías. Agrega datos de prueba.

### ❌ No puedo acceder a /admin
→ Necesitas token de admin. Verifica que estés logueado.

---

## 📂 Estructura de Archivos

```
app/
├── admin/
│   ├── page.tsx              ← Dashboard Principal
│   ├── layout.tsx            ← Layout con Sidebar
│   ├── components/
│   │   └── Sidebar.tsx      ← Menú de navegación
│   ├── productos/
│   │   └── page.tsx         ← Gestión productos
│   ├── pedidos/
│   │   └── page.tsx         ← Gestión pedidos
│   ├── clientes/
│   │   └── page.tsx         ← Gestión clientes (NUEVO)
│   ├── cupones/
│   │   └── page.tsx         ← Gestión cupones (NUEVO)
│   └── configuracion/
│       └── page.tsx         ← Configuración (ACTUALIZADO)
│
├── api/auth/
│   ├── validate/route.ts    ← Valida tokens
│   └── logout/route.ts      ← Cierra sesión
│
└── ...
```

---

## 🗄️ Tablas de Base de Datos

| Tabla | Descripción |
|-------|------------|
| `productos` | Catálogo de ropa |
| `variantes_producto` | Tallas y colores |
| `pedidos` | Órdenes de clientes |
| `detalles_pedido` | Items dentro de pedidos |
| `usuarios` | Cuentas de clientes |
| `clientes` | Datos extendidos de clientes |
| `cupones` | Códigos de descuento |
| `configuracion_tienda` | Ajustes generales |
| `categorias` | Categorías de productos |
| `admin_users` | Permisos de administradores |
| `auditoria_admin` | Historial de cambios |
| `zonas_envio` | Zonas de envío |

---

## 🚀 Características Principales

✅ **Autenticación segura** - Tokens SHA256
✅ **Dashboard en tiempo real** - Métricas actualizadas
✅ **CRUD completo** - Para productos, pedidos, cupones
✅ **Filtrado y búsqueda** - En todos los módulos
✅ **Estadísticas** - Ventas, clientes, ingresos
✅ **Descuentos** - Sistem de cupones flexible
✅ **Configuración** - Personaliza tu tienda
✅ **Responsive** - Funciona en móvil y desktop
✅ **Profesional** - Interfaz moderna con Tailwind CSS

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa [DATABASE_SETUP.md](DATABASE_SETUP.md)
2. Verifica que el SQL se ejecutó completamente
3. Recarga el navegador (Ctrl+Shift+R)
4. Reinicia el servidor (`npm run dev`)
5. Revisa la consola del navegador (F12)

---

**🎉 ¡Tu panel administrativo está listo para usar!**

Para más detalles, consulta [DATABASE_SETUP.md](DATABASE_SETUP.md)
