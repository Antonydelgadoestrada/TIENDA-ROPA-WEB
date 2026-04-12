# 📊 Guía del Panel Administrativo

## Acceso al Dashboard

1. **URL**: http://localhost:3000/admin
2. **Contraseña**: `tiendaropa2024`
3. El acceso está protegido por middleware - sin autenticación no puedes ver ➖ admin.

---

## 🎯 Funcionalidades Principales

### 1. Estadísticas Generales (Card Superior)

- **Total Productos**: Cantidad total de artículos en la tienda
- **Activos**: Productos disponibles para compra
- **Inactivos**: Productos desactivados/pausados
- **Ingresos Potenciales**: Suma total de todos los precios (S/.)

### 2. Filtrado de Productos

Tres opciones de vista:
- **📋 Todos**: Muestra todos los productos (activos + inactivos)
- **✅ Activos**: Solo productos disponibles
- **❌ Inactivos**: Solo productos pausados

### 3. Tabla de Productos

Columnas:
- **Producto**: Nombre + descripción resumida
- **Precio**: Valor en S/. (Soles)
- **Stock**: Botón para ver desglose por talla
- **Estado**: Badge visual (Activo/Inactivo)
- **Acciones**: Botones para editar/desactivar

### 4. Edición de Productos

**Como usar:**

1. Haz clic en el botón **✏️ Editar** en la fila del producto
2. La fila se convierte en modo edición
3. Modifica:
   - Nombre del producto
   - Precio (en S/.)
   - (Descripción si es necesario)
4. Haz clic en **💾 Guardar** para guardar cambios
5. O **✕ Cancelar** para descartar

**Validaciones:**
- El nombre no puede estar vacío
- El precio debe ser un número válido
- Los cambios se guardan en tiempo real

### 5. Gestión de Stock por Talla

**Como usar:**

1. Haz clic en **📦 Ver Stock** en cualquier producto
2. Se abre un modal mostrando todas las tallas disponibles
3. Para cada talla puedes:
   - Restar stock con el botón **−**
   - Ver cantidad actual en el centro
   - Sumar stock con el botón **+**
4. Los cambios se aplican instantáneamente
5. Cierra con el botón **Cerrar**

**Características:**
- Las actualizaciones son en tiempo real
- El stock no puede ser negativo (se mantiene en 0 como mínimo)
- Visualización clara de inventario por tamaño

### 6. Desactivación de Productos

**Como usar:**

1. Haz clic en **🗑️ Desactivar** en la fila del producto
2. Se pide confirmación con el nombre del producto
3. Si confirmas, el producto pasa a estado "Inactivo"
4. El producto NO se borra de la base de datos, solo se oculta

**Nota:** Esta es una "soft-delete" - los datos permanecen en la BD para historial.

### 7. Agregar Nuevo Producto

**Desde el dashboard:**
- Haz clic en el botón **➕ Nuevo Producto** en la parte superior derecha
- Te lleva a `/admin/agregar` donde puedes:
  - Cargar nombre, precio, descripción
  - Subir imagen (opcional)
  - Definir stock inicial por talla
  - Seleccionar categoría

---

## 🔐 Seguridad

- ✅ Solo accesible con contraseña correcta
- ✅ Las cookies de sesión expiran en 7 días
- ✅ Middleware protege todas las rutas `/admin/*`
- ✅ Las cambios requieren confirmación donde es crítico

---

## 📱 Responsividad

- **Desktop**: Tabla completa con todas las columnas
- **Tablet**: Scroll horizontal en la tabla si es necesario
- **Mobile**: Interfaz adaptada (botones reducidos, texto truncado)

---

## 🔄 Flujo Completo de Administración

### Crear Nuevo Producto
```
Dashboard → ➕ Nuevo Producto → Llenar formulario → Guardar
```

### Editar Producto Existente
```
Dashboard → ✏️ Editar → Modificar datos → 💾 Guardar
```

### Ajustar Stock
```
Dashboard → 📦 Ver Stock → ± Botones → Cambios automáticos
```

### Pausar Producto
```
Dashboard → 🗑️ Desactivar → Confirmar → Producto inactivo
```

### Cambiar Filtro
```
Dashboard → Botón filtro (Todos/Activos/Inactivos) → Vista actualizada
```

---

## 🎨 Indicadores Visuales

| Elemento | Significado |
|----------|------------|
| 🟢 Emerald | Principal, acciones positivas |
| 🔵 Blue | Información, vistas |
| 🟡 Yellow | Edición |
| 🔴 Red | Peligro, desactivación |
| ⚫ Black/Gray | Neutral, cancelación |

---

## ⚠️ Troubleshooting

### "Error al cargar productos"
- Verifica conexión a Supabase
- Comprueba las variables de entorno (.env.local)
- Recarga la página (F5)

### "Error al actualizar"
- El nombre o precio puede estar vacío
- Intenta nuevamente
- Si persiste, revisa la consola del navegador

### No puedo editar/guardar
- Asegúrate de estar autenticado (cookie válida)
- Intenta cerrar sesión y volver a iniciar

### Stock no se actualiza
- Verifica conexión a internet
- Recarga el modal de stock
- Intenta en sesión incógnita (si hay caché old)

---

## 💡 Tips & Buenas Prácticas

1. **Actualizar precios**: Usa el modal de edición para cambios rápidos
2. **Monitorear stock**: Revisa regularmente las cantidades por talla
3. **Desactivar vs Eliminar**: Siempre desactiva en lugar de eliminar totalmente
4. **Nombres descriptivos**: Usa nombres claros y consistentes
5. **Descripciones útiles**: Incluye detalles que ayuden a los clientes

---

## 📞 Contacto & Soporte

Para bugs o sugerencias, revisa el archivo [CLAUDE.md](CLAUDE.md) o contacta al equipo de desarrollo.

**Última actualización**: 2024  
**Versión**: 1.0  
**Estado**: Producción ✅
