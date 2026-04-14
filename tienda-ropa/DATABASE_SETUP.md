# 🗄️ Guía de Configuración de Base de Datos

## Paso 1: Preparar las Tablas en Supabase

Este proyecto requiere que ejecutes el SQL del archivo `SETUP_ADMIN_TABLES.sql` en tu instancia de Supabase.

### Instrucciones:

1. **Abre tu proyecto en Supabase**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto "tienda-ropa"

2. **Accede al SQL Editor**
   - En el panel izquierdo, haz clic en "SQL Editor"
   - O ve a: SQL → New Query

3. **Copia y pega el contenido del archivo SETUP_ADMIN_TABLES.sql**
   - Abre el archivo `SETUP_ADMIN_TABLES.sql` en la raíz de tu proyecto
   - Copia TODO el contenido
   - Pégalo en el SQL Editor de Supabase

4. **Ejecuta la query**
   - Haz clic en el botón "Run" (o presiona Ctrl+Enter)
   - Espera a que se complete, verás un checkmark verde cuando termine

5. **Verifica las tablas creadas**
   - En el panel izquierdo de Supabase, ve a "Tables"
   - Deberías ver 12 nuevas tablas:
     ✓ productos
     ✓ variantes_producto
     ✓ pedidos
     ✓ detalles_pedido
     ✓ historial_pedidos
     ✓ clientes
     ✓ cupones
     ✓ configuracion_tienda
     ✓ categorias
     ✓ admin_users
     ✓ auditoria_admin
     ✓ zonas_envio

---

## Paso 2: Estructura de Datos Importante

### Tabla: productos
```
- id (UUID, PK)
- nombre (VARCHAR)
- descripcion (TEXT)
- precio_base (DECIMAL)
- precio_descuento (DECIMAL)
- estado (VARCHAR) -> 'borrador', 'publicado', 'agotado'
- stock_total (INT)
- categoria (VARCHAR)
- imagen_url (VARCHAR)
- created_at (TIMESTAMP)
```

### Tabla: pedidos
```
- id (UUID, PK)
- numero_pedido (VARCHAR, UNIQUE)
- cliente_id (UUID, FK)
- estado (VARCHAR) -> 'pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'
- total (DECIMAL)
- metodo_pago (VARCHAR)
- created_at (TIMESTAMP)
```

### Tabla: cupones
```
- id (UUID, PK)
- codigo (VARCHAR, UNIQUE)
- tipo (VARCHAR) -> 'porcentaje', 'monto_fijo'
- valor (DECIMAL)
- activo (BOOLEAN)
- fecha_fin (TIMESTAMP)
- created_at (TIMESTAMP)
```

---

## Paso 3: Verificar la Conexión

Una vez ejecutado el SQL, el panel admin debería funcionar correctamente:

1. Inicia el servidor: `npm run dev`
2. Accede a http://localhost:3000/admin (requiere estar logueado como admin)
3. Deberías ver las métricas del dashboard cargando correctamente

---

## Solucionar Errores Comunes

### Error: "column 'estado' does not exist"
**Solución:** Esto significa que la tabla `productos` no tiene la columna `estado`. 

**Tres opciones para resolver:**

**Opción 1: Limpiar y recrear TODAS las tablas (RECOMENDADO)**
1. Va a SQL Editor en Supabase
2. Ejecuta este script para eliminar todo:
   ```sql
   -- Elimina todas las tablas del admin (usa CASCADE para eliminar referencias)
   DROP TABLE IF EXISTS auditoria_admin CASCADE;
   DROP TABLE IF EXISTS admin_users CASCADE;
   DROP TABLE IF EXISTS zonas_envio CASCADE;
   DROP TABLE IF EXISTS categorias CASCADE;
   DROP TABLE IF EXISTS configuracion_tienda CASCADE;
   DROP TABLE IF EXISTS cupones CASCADE;
   DROP TABLE IF EXISTS clientes CASCADE;
   DROP TABLE IF EXISTS historial_pedidos CASCADE;
   DROP TABLE IF EXISTS detalles_pedido CASCADE;
   DROP TABLE IF EXISTS pedidos CASCADE;
   DROP TABLE IF EXISTS variantes_producto CASCADE;
   DROP TABLE IF EXISTS productos CASCADE;
   ```
3. Luego pega TODO el contenido de `SETUP_ADMIN_TABLES.sql` nuevamente
4. Ejecuta

**Opción 2: Agregar la columna faltante**
   ```sql
   -- Si solo le falta la columna estado
   ALTER TABLE productos ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'publicado';
   ```

**Opción 3: Verificar tabla existente**
   ```sql
   -- Ver todas las columnas
   SELECT column_name FROM information_schema.columns WHERE table_name = 'productos';
   ```

### Error: "table already exists"
**Solución:** El SQL usa `CREATE TABLE IF NOT EXISTS`, así que no hay problema. Solo ejecuta de nuevo.

### Error de Permisos
**Solución:** Asegúrate de que la conexión de Supabase tiene permisos de lectura/escritura. Ve a Authentication → Roles en Supabase.

---

## Paso 4: Cargar Datos de Prueba (Opcional)

```sql
-- Crear una categoría
INSERT INTO categorias (nombre, descripcion) VALUES 
('Camisetas', 'Camisetas de algodón'),
('Pantalones', 'Pantalones variados'),
('Accesorios', 'Complementos y accesorios');

-- Crear un producto
INSERT INTO productos (nombre, descripcion, precio_base, stock_total, categoria, estado)
VALUES ('Camiseta Premium', 'Camiseta de algodón 100%', 49.99, 50, 'Camisetas', 'publicado');

-- Crear un cupón
INSERT INTO cupones (codigo, tipo, valor, minimo_compra, activo)
VALUES ('BIENVENIDA20', 'porcentaje', 20, 0, true);
```

---

## Paso 5: Usar el Panel Admin

### Dashboard
- Ver métricas en tiempo real
- Accesos rápidos a funciones principales
- Últimos pedidos

### Productos
- Agregar nuevos productos
- Editar productos existentes
- Gestionar stock y variantes

### Pedidos
- Ver lista de pedidos
- Cambiar estado (pendiente → entregado)
- Ver detalles y cliente

### Clientes
- Ver lista de clientes
- Historial de compras
- Total gastado

### Cupones
- Crear descuentos sobre porcentaje o monto
- Establecer compra mínima
- Ver usos

### Configuración
- Datos de la tienda
- Métodos de pago
- Modo mantenimiento

---

## ¿Problemas?

Si aún tienes problemas:
1. ✅ Verifica que el SQL se ejecutó completamente (sin errores)
2. ✅ Recarga el navegador (Ctrl+Shift+R para limpiar caché)
3. ✅ Reinicia el servidor `npm run dev`
4. ✅ Revisa la consola del navegador (F12) para errores de JavaScript
5. ✅ Verifica los variables de entorno en `.env.local`

---

¡Ahora estás listo para usar el panel administrativo! 🚀
