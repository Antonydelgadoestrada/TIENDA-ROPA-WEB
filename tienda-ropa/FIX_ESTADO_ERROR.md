# 🔧 SOLUCIÓN: Error "column 'estado' does not exist"

## ¿Qué causa este error?

Este error ocurre cuando:
1. La tabla `productos` NO tiene la columna `estado`
2. La tabla `pedidos` NO tiene la columna `estado`
3. El SQL no se ejecutó completamente en Supabase

No es un problema del código - es un problema de setup de base de datos.

---

## ✅ SOLUCIÓN RECOMENDADA (3 MINUTOS)

### Paso 1: Abre Supabase SQL Editor
```
https://supabase.com/dashboard
→ Tu proyecto
→ SQL Editor
→ New Query
```

### Paso 2: Limpia las tablas existentes
Copia y pega esto en el SQL Editor:

```sql
-- ELIMINA TODAS LAS TABLAS DEL ADMIN (con CASCADE para relaciones)
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

**Haz clic en RUN** y espera a que termine.

### Paso 3: Ejecuta el SQL completo
1. Abre el archivo `SETUP_ADMIN_TABLES.sql` en tu editor
2. **Copia TODO el contenido** (desde línea 1 a línea 197)
3. En Supabase SQL Editor, elige **New Query**
4. **Pega TODO el contenido**
5. Haz clic en **RUN**
6. ⏳ Espera a que termine (verás checkmark ✅ verde)

### Paso 4: Verifica que funcionó
En Supabase, ve a **Tables** en el sidebar izquierdo.

Deberías ver estas 12 tablas:
- ✅ productos
- ✅ variantes_producto
- ✅ pedidos
- ✅ detalles_pedido
- ✅ historial_pedidos
- ✅ usuarios
- ✅ clientes
- ✅ cupones
- ✅ configuracion_tienda
- ✅ categorias
- ✅ admin_users
- ✅ auditoria_admin
- ✅ zonas_envio

❌ Si NO ves todas, el SQL no se ejecutó bien. Intenta de nuevo.

### Paso 5: Prueba el dashboard
```bash
# En tu terminal
npm run dev
```

- Abre http://localhost:3000/admin
- El dashboard debería cargar sin errores
- Las métricas mostrarán 0 (normal si las tablas están vacías)

---

## 🔍 Verificación de la Tabla (Opcional)

Si quieres verificar que la columna existe:

```sql
-- Ver todas las columnas de la tabla productos
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'productos'
ORDER BY ordinal_position;
```

Deberías ver una columna llamada `estado` de tipo `character varying`.

```sql
-- Ver todas las columnas de la tabla pedidos
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pedidos'
ORDER BY ordinal_position;
```

Deberías ver una columna llamada `estado` de tipo `character varying`.

---

## ❌ Si el error persiste

### Opción A: Problemas de Ejecución Parcial
El SQL podría no haber ejecutado completamente. Síntomas:
- Solo algunas tablas existen
- Mensajes de error en rojo

**Solución:**
1. Ejecuta nuevamente los DROP TABLE
2. En una **NUEVA Query**, pega TODO el SETUP_ADMIN_TABLES.sql
3. Espera a que termine completamente

### Opción B: Conflicto de Usuario
Síntomas: "Permission denied" o "Insufficient privileges"

**Solución:**
1. Ve a Supabase → Authentication → User Management
2. Verifica que tienes permissions correctas
3. Intenta ejecutar desde incógnito/sin cache
4. Borra cookies del navegador (Ctrl+Shift+Delete)

### Opción C: Cache del Navegador
Síntomas: El error persiste aunque el SQL está correcto

**Solución:**
```bash
# Limpia cache de Next.js
rm -rf .next

# Recarga el navegador con Ctrl+Shift+R (limpia cache)
# O abre en modo incógnito
# Reinicia el servidor: npm run dev
```

---

## 📝 Checklist Final

Después de ejecutar el SQL:

- [ ] Eliminé todas las tablas antiguas con DROP TABLE
- [ ] Ejecuté SETUP_ADMIN_TABLES.sql completamente
- [ ] Veo las 12+ tablas en Supabase
- [ ] Recargué el navegador (Ctrl+Shift+R)
- [ ] Reinicié el servidor (npm run dev)
- [ ] El dashboard carga sin errores
- [ ] Las métricas muestran datos (o 0 si está vacío)

Si todo esto está marcado ✅, el error debe estar resuelto.

---

## 🆘 Si aún no funciona

1. **Revisa la consola del navegador** (F12 → Console)
   - Busca mensajes de error rojo
   - Copia el error completo

2. **Revisa los logs de Supabase**
   - Ve a Supabase Dashboard → Logs
   - Filtra por timestamp reciente
   - Busca errores SQL

3. **Intenta con datos simples**
   - Inserta un producto manualmente:
   ```sql
   INSERT INTO productos (nombre, precio_base, estado, stock_total)
   VALUES ('Test', 99.99, 'publicado', 10);
   ```
   - Si funciona, las columnas existen ✅

---

## 📚 Más Información

- [ADMIN_PANEL.md](ADMIN_PANEL.md) - Guía del panel
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Setup de BD
- [SETUP_ADMIN_TABLES.sql](SETUP_ADMIN_TABLES.sql) - Schema SQL

---

**¿El error fue resuelto? ✅**

Si sí, felicidades! Ahora puedes continuar configurando tu panel administrativo.

Si no, asegúrate de haber seguido cada paso exactamente.
