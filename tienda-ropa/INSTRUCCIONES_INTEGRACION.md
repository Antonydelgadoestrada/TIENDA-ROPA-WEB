# Instrucciones para Completar la Integración

## Estado Actual ✅

Tu tienda ya tiene:
- ✅ Autenticación funcionando (login con contraseña)
- ✅ Panel de admin con sidebar
- ✅ Página de configuración en `/admin/configuracion`
- ✅ **NUEVA**: Página de inicio dinámica que lee la configuración
- ✅ **Iconos profesionales** en lugar de emojis (WhatsApp, Instagram, Facebook, TikTok, etc)

## 🚀 Pasos para Activar la Integración (3 pasos)

### Paso 1: Crear la Base de Datos

Ejecuta este SQL en tu Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS tienda_configuracion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_tienda TEXT DEFAULT 'Mi Tienda',
  descripcion TEXT DEFAULT 'Tienda de ropa online',
  email TEXT,
  telefono TEXT,
  whatsapp TEXT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  direccion TEXT,
  ciudad TEXT,
  horario TEXT,
  politica_devolucion TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insertar datos de prueba
INSERT INTO tienda_configuracion (nombre_tienda, email, telefono, whatsapp, instagram)
VALUES (
  'KiloPeru',
  'hola@kiloperu.com',
  '+51 999 888 777',
  '+51 999 888 777',
  '@kiloperu'
);
```

### Paso 2: Ingresar al Admin

1. Ve a `http://localhost:3000/admin/configuracion`
2. Inicia sesión con tu contraseña
3. Completa los campos:
   - **Nombre de Tienda**: El nombre que verá el cliente en la navbar
   - **Email**: Tu correo
   - **Teléfono**: Tu teléfono
   - **WhatsApp**: Tu número de WhatsApp
   - **Instagram**: Tu usuario (@usuario)
   - **Facebook**: Tu perfil
   - **Descripción**: Descripción corta de tu tienda
4. Haz clic en "Guardar" ✅

### Paso 3: Verificar en el Cliente

1. Ve a `http://localhost:3000` (la página de inicio pública)
2. Deberías ver:
   - ✅ El nombre de tu tienda en la navbar (donde decía "Cargando...")
   - ✅ Los botones de WhatsApp e Instagram (si los ingresaste)
   - ✅ El footer con tu email y teléfono
   - ✅ La descripción en el hero

## ✨ Características Implementadas

### En la Página de Inicio (`/`)
- **Header dinámico**: Muestra `nombre_tienda` de la configuración
- **Hero Section**: Muestra `descripcion` de la configuración
- **6 Productos destacados**: Se cargan desde la BD
- **Footer con contacto**: Email, teléfono, redes sociales con iconos profesionales
- **Links dinámicos**: WhatsApp, Instagram, Facebook, TikTok (iconos de Font Awesome/Material Design)
- **Diseño Premium**: Iconos profesionales en lugar de emojis

### En el Admin (`/admin`)
- Toda la configuración en `/admin/configuracion`
- Guardar cambios instantáneamente
- Cambios se ven en el cliente sin recargar (excepto la página)
- Diseño Clean con iconos profesionales

## 🔗 Links Importantes

- **Página pública**: http://localhost:3000
- **Página de admin**: http://localhost:3000/admin/configuracion
- **Supabase SQL**: https://app.supabase.com -> SQL Editor

## 🎨 Lo que Verá el Cliente

Cuando abras `http://localhost:3000`:

1. **Navbar**:
   - Logo + Nombre de tu tienda (desde la configuración)
   - Navegación (Inicio, Productos, Contacto)
   - Iconos profesionales de WhatsApp e Instagram

2. **Hero**:
   - Título grande con tu nombre de tienda
   - Descripción
   - Botón "Ver Catálogo"

3. **Productos**:
   - Grid de 6 productos destacados
   - Precio original + descuento
   - Badge mostrando descuento

4. **Footer**:
   - Email y teléfono con iconos
   - Links
   - Redes sociales con iconos profesionales (WhatsApp, Instagram, Facebook, TikTok)

## 🐛 Si Algo No Funciona

1. ¿No ves el nombre de la tienda en la navbar?
   - Verifica que ejecutaste el SQL
   - Verifica que ingresaste datos en `/admin/configuracion`
   - Recarga la página (Ctrl+R)

2. ¿Los botones de redes no aparecen?
   - Verifica que ingresaste el Instagram y WhatsApp en admin
   - Recarga la página (Ctrl+R)

3. ¿Errores en consola?
   - Abre DevTools (F12)
   - Ve a Console tab
   - Ver qué error aparece (generalmente es de Supabase URLs)

## 📝 Próximos Pasos (Después de esto)

1. Crear página de productos `/productos`
2. Crear página de detalle `/productos/[id]`
3. Implementar carrito de compras
4. Implementar checkout
5. Sistema de administración de productos
6. Sistema de pedidos

¡Listo! Tu página de inicio ahora es **100% dinámica** con diseño premium
