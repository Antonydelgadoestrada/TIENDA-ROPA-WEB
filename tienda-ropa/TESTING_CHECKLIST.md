# ✅ LISTA DE VERIFICACIÓN - PANEL ADMINISTRATIVO

## Pre-Requisitos
- [ ] Node.js instalado (`node --version`)
- [ ] npm actualizado (`npm --version`)
- [ ] Variables de entorno configuradas (`.env.local`)
- [ ] Supabase project creado

## Paso 1: Base de Datos
- [ ] Abrí Supabase Dashboard
- [ ] Fui a SQL Editor
- [ ] Pegué TODO el contenido de `SETUP_ADMIN_TABLES.sql`
- [ ] Ejecuté la query (botón RUN)
- [ ] Esperé a que termine (checkmark verde)
- [ ] Verifiqué que aparecen las 12 tablas en el sidebar

## Paso 2: Servidor
- [ ] Ejecuté `npm run dev`
- [ ] El servidor arrancó en `http://localhost:3000`
- [ ] No hay errores de compilación

## Paso 3: Navegación
- [ ] Abrí `http://localhost:3000` ✅ Home funciona
- [ ] Navigué a `/admin` (requiere login)
- [ ] El admin layout carga correctamente
- [ ] La sidebar muestra los 6 módulos

## Paso 4: Dashboard
- [ ] Dashboard carga sin errores
- [ ] Veo 6 tarjetas de métricas
- [ ] La tabla de últimos pedidos es visible
- [ ] Los botones de acceso rápido están presentes

## Paso 5: Módulos
- [ ] ✅ **Dashboard** (`/admin`) - Carga correctamente
- [ ] ✅ **Productos** (`/admin/productos`) - Lista de productos
- [ ] ✅ **Pedidos** (`/admin/pedidos`) - Tabla de pedidos
- [ ] ✅ **Clientes** (`/admin/clientes`) - Lista de clientes
- [ ] ✅ **Cupones** (`/admin/cupones`) - Crear/editar cupones
- [ ] ✅ **Configuración** (`/admin/configuracion`) - Form de settings

## Paso 6: Funcionalidades

### Dashboard
- [ ] Carga métricas en tiempo real
- [ ] Muestra últimos 5 pedidos
- [ ] Botones de acceso rápido funcionan

### Productos
- [ ] Carga lista de productos
- [ ] Búsqueda funciona
- [ ] Filtros por estado funcionan
- [ ] Botón "Nuevo Producto" visible

### Pedidos
- [ ] Carga lista de pedidos
- [ ] Filtros por estado funcionan
- [ ] Cambio de estado funciona

### Clientes
- [ ] Carga lista de clientes
- [ ] Búsqueda por nombre/email funciona
- [ ] Muestra dinero gastado
- [ ] Muestra cantidad de pedidos

### Cupones
- [ ] Carga lista de cupones
- [ ] Puedo crear nuevo cupón
- [ ] Puedo activar/desactivar
- [ ] Puedo eliminar cupones

### Configuración
- [ ] Carga datos actuales
- [ ] Puedo editar nombre de tienda
- [ ] Puedo cambiar email/teléfono
- [ ] Puedo guardar cambios

## Paso 7: Autenticación
- [ ] Solo usuarios logueados pueden acceder a `/admin`
- [ ] Sin token, redirige a `/login`
- [ ] Botón de logout funciona
- [ ] Cierra sesión correctamente

## Posibles Errores y Soluciones

### ❌ "column 'estado' does not exist"
**Solución:** Ve a [DATABASE_SETUP.md](DATABASE_SETUP.md#solucionar-errores-comunes)
- [ ] Eliminé todas las tablas con DROP TABLE
- [ ] Ejecuté nuevamente SETUP_ADMIN_TABLES.sql
- [ ] Verifiqué que la tabla `productos` existe
- [ ] El error se resolvió

### ❌ "table does not exist"
**Solución:**
- [ ] Verifiqué que ejecuté el SQL completo
- [ ] Recargué la página (Ctrl+Shift+R)
- [ ] Reinicié el servidor (`npm run dev`)

### ❌ "Access Denied" o error de permisos
**Solución:**
- [ ] Verifiqué credenciales de Supabase
- [ ] Revisé `.env.local` con URL y API KEY correctas
- [ ] Reinicié el servidor

### ❌ Métrica muestra 0 en todo
**Solución (Normal si las tablas están vacías):**
- [ ] Agregué datos de prueba en Supabase
- [ ] O ignoro los 0s - funcionará cuando haya datos reales

### ❌ El dashboard redirije a home
**Solución:**
- [ ] Necesito estar logueado como usuario con admin-token
- [ ] Primero hago login en `/login`
- [ ] Luego intento acceder a `/admin`

## Documentación

- 📖 [ADMIN_PANEL.md](ADMIN_PANEL.md) - Guía completa del panel
- 📖 [DATABASE_SETUP.md](DATABASE_SETUP.md) - Setup de base de datos
- 📖 [SETUP_ADMIN_TABLES.sql](SETUP_ADMIN_TABLES.sql) - Schema SQL

## Status Final

- [ ] Todos los pasos completados
- [ ] No hay errores de compilación
- [ ] El servidor está corriendo en puerto 3000
- [ ] Todos los módulos están accesibles
- [ ] ¡Panel administrativo listo para usar! 🎉

---

**Si todo está marcado ✅, ¡tu panel administrativo está completamente funcional!**

Para más ayuda, consulta [DATABASE_SETUP.md](DATABASE_SETUP.md)
