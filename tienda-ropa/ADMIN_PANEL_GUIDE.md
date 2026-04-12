# 🏪 Panel Administrativo Profesional v3 - Guía Completa

## 📋 Índice
1. [Introducción](#introducción)
2. [Dashboard Principal](#dashboard-principal)
3. [Gestión de Productos](#gestión-de-productos)
4. [Inventario: Entrada/Salida](#inventario)
5. [Gestión de Pedidos](#pedidos)
6. [Reportes y Analytics](#reportes)
7. [Flujos de Trabajo](#flujos-de-trabajo)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Introducción

Tu panel administrativo ahora es **profesional, completo y listo para producción**. Diseñado específicamente para empresarios de tienda de ropa, incluye:

✅ Gestión completa de productos  
✅ Control de inventario (entrada/salida/ajustes)  
✅ Dashboard con KPIs en tiempo real  
✅ Gestión de pedidos  
✅ Analytics y reportes  
✅ Seguridad profesional  

---

## 📊 Dashboard Principal

**Acceso:** `/admin/dashboard` (después de login)

### KPIs Principales (4 tarjetas grandes)

```
┌─────────────────────────────────────────────────────┐
│ 📊 TOTAL PRODUCTOS │ 💰 INGRESOS │ ⚠️ SIN STOCK │ 📦 BAJO │
│        85          │  S/. 12,450 │      3      │   7    │
└─────────────────────────────────────────────────────┘
```

**Qué significan:**
- **Total Productos**: Cuántos artículos tienes (activos e inactivos)
- **Ingresos Potenciales**: Valor total en dinero de todo tu inventario
- **Sin Stock**: Productos completamente agotados (necesitan reorden)
- **Stock Bajo**: Productos con menos de 5 unidades (pronto se agotarán)

### Accesos Rápidos (3 botones grandes)

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   📦 INVENTARIO  │  │    📋 PEDIDOS    │  │  📊 REPORTES     │
│ Entrada/Salida   │  │  Gestión órdenes │  │  Analytics       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

**Úsalos para:**
- **Inventario**: Cuando compras stock, haces devoluciones o ajustes
- **Pedidos**: Cuando quieres ver órdenes de clientes y cambiar estado
- **Reportes**: Para analizar tu negocio y detectar problemas

### Tabla de Productos

La tabla muestra todos tus productos con:
- Nombre + descripción
- Precio
- Botón 📦 Ver Stock
- Estado (✅ Activo / ❌ Inactivo)
- Botones de acción: ✏️ Editar, 🗑️ Desactivar

---

## 🛍️ Gestión de Productos

### Crear Nuevo Producto

**Acceso:** Dashboard → ➕ **Nuevo Producto**

**Proceso:**
1. Ingresar nombre exacto
2. Seleccionar categoría
3. Definir precio
4. Cargar foto (opcional pero recomendado)
5. Escribir descripción completa
6. Definir stock inicial por talla

**Ejemplo Real:**
```
Nombre: Polo Básico Azul Hombre S/M/L
Categoría: Hombres
Precio: S/. 49.90
Stock Inicial:
  - S: 15 unidades
  - M: 20 unidades
  - L: 18 unidades
Total: 53 unidades
```

### Editar Producto Completo

**Acceso:** Dashboard → Tabla → ✏️ **Editar**

#### Lo que puedes cambiar:

**📝 Nombre**
- Máx 100 caracteres
- Sé específico y descriptivo

**📸 Imagen**
- Click para cambiar
- Subir nueva foto al instante

**💰 Precio Base**
- Cambio inmediato en la tienda
- No afecta órdenes pasadas

**🏷️ Descuento (%)**
- Aplica automáticamente
- Ej: 20% OFF → S/. 100 → S/. 80

**📄 Descripción**
- Máx 500 caracteres
- Detalles: materiales, cuidado, instrucciones
- MUY IMPORTANTE para reducir devoluciones

**🏷️ Categoría**
- 👕 Hombres
- 👚 Mujeres
- 👶 Niños

**💾 Estado**
- ✅ Activo → Disponible en tienda
- ❌ Inactivo → Oculto (pero datos preservados)

### **NUEVO: Editar Stock Directamente**

**En la misma página de edición**, sección **"📦 Stock por Talla - Editable"**

**Cómo funciona:**
```
Para cada talla:
1. Click en botón ✏️ Editar
2. Ingresa nuevo stock
3. Selecciona razón del cambio
4. Click ✓ Guardar (automático)
```

**Razones de cambio:**
- Ajuste físico (conteo manual)
- Compra a proveedor
- Devolución cliente
- Merma/Daño

**Ejemplo:**
```
Talla M actual: 15 unidades
Cambio a: 12 unidades
Razón: Venta online
→ Automático: Registra -3 en historial de movimientos
```

---

## 📦 Inventario: Entrada y Salida

**Acceso:** Dashboard → 📦 **Inventario** o `/admin/inventario`

### Tres Tabs: Entrada, Salida, Historial

#### 📥 **ENTRADA DE PRODUCTO**

Usa cuando:
- Compras stock a proveedor
- Recibes devolución de cliente
- Recibe stock en consignación

**Campos:**
```
Producto:    [Seleccionar]
Talla:       [Seleccionar]
Cantidad:    [Número]
Referencia:  [OC-2024-001]  ← Número de compra
Razón:       [Compra a proveedor, Devolución cliente, etc.]
```

**Ejemplo:**
```
Producto: Polera Azul Hombre
Talla: M
Cantidad: +25
Referencia: OC-LXPP-2024-456
Razón: Compra a proveedor "La X Perfect Pants"

Resultado: Stock M: 10 → 35 (+25)
```

#### 📤 **SALIDA DE PRODUCTO**

Usa cuando:
- Realizas venta (manual si no usas carrito)
- Devolución al proveedor
- Pérdida/Robo/Daño

**Campos:**
```
Producto:    [Seleccionar]
Talla:       [Seleccionar]
Cantidad:    [Número]
Referencia:  [PED-5678]  ← Número de pedido
Razón:       [Venta online, Devolución proveedor, Daño, etc.]
```

**Ejemplo:**
```
Producto: Short Negro Mujer
Talla: S
Cantidad: -3
Referencia: PED-2024-5678
Razón: Venta online

Resultado: Stock S: 8 → 5 (-3)
```

#### 📋 **HISTORIAL DE MOVIMIENTOS**

Tabla que muestra TODO lo que pasó con tu inventario:

| Tipo | Producto | Talla | Cantidad | Stock Ant. | Stock Nuevo | Razón | Ref | Fecha |
|------|----------|-------|----------|-----------|-------------|-------|-----|-------|
| 📥 Entrada | Polo Azul | M | +25 | 10 | 35 | Compra | OC-456 | 12 abr 14:30 |
| 📤 Salida | Short Negro | S | -3 | 8 | 5 | Venta | PED-5678 | 12 abr 15:15 |

**Útil para:**
- Auditoría (¿dónde fue el stock?)
- Análisis (¿qué se vende más?)
- Problemas (¿por qué desapareció este producto?)

---

## 📋 Gestión de Pedidos

**Acceso:** Dashboard → 📋 **Pedidos** o `/admin/pedidos`

### Visión General

5 tarjetas mostrando estado de negocio:
```
Total: 12 | Pendiente: 3 | Procesando: 2 | Enviados: 4 | Total: S/. 2,450
```

### Filtrar por Estado

```
📋 Todos | ⏳ Pendientes | ⚙️ Procesando | 🚚 Enviados | ✓ Entregados
```

### Tabla de Pedidos

| Pedido | Cliente | Items | Total | Estado | Acción |
|--------|---------|-------|-------|--------|--------|
| #1001 | Juan García | 3 | S/. 250 | ⚙️ Procesando | [Selector estado] |
| #1002 | María López | 2 | S/. 180 | ⏳ Pendiente | [Selector estado] |

**Estados disponibles:**
- ⏳ **Pendiente**: No has procesado aún
- ⚙️ **Procesando**: Ya estás preparando
- 🚚 **Enviado**: En camino (correo/delivery)
- ✓ **Entregado**: Cliente lo recibió
- ✗ **Cancelado**: Orden cancelada

---

## 📊 Reportes y Analytics

**Acceso:** Dashboard → 📊 **Reportes** o `/admin/reportes`

### Tab 1: 📦 Inventario (Disponible AHORA)

**Resumen de Inventario (5 tarjetas):**
```
Total Prod. │ Stock Total │ Valor Inv. │ Stock Bajo │ Sin Stock
    85      │    2,340    │ S/. 12,450 │     7      │    3
```

**Qué hacer:**
- ✅ Valor alto = buena salud de inventario
- ⚠️ Stock bajo/sin stock = necesitas reordenar

**Tabla: Productos con Stock Bajo**

Ranking de productos que primero se agotan:

| Producto | Stock | Precio | Valor Total | Acción |
|----------|-------|--------|-------------|--------|
| Polera M | 2 | S/. 49 | S/. 98 | [Reordenar] |
| Jeans L | 4 | S/. 89 | S/. 356 | [Reordenar] |

**Recomendación automática:**
```
💡 Si tienes 3 productos sin stock → "Considera reordenar"
💡 Si tienes 7 con stock bajo → "Revisa regularmente"
```

### Tab 2: 💰 Ventas (Próximamente)

Cuando agregues carrito de compras, verás:
- Ventas totales por día/mes
- Ingresos
- Margen de ganancia
- Tendencias

### Tab 3: ⭐ Productos Top (Próximamente)

- Productos más vendidos
- Productos con mayor margen
- Tendencias estacionales

---

## 🔄 Flujos de Trabajo

### Flujo 1: Recibir Stock Nuevo

```
1. Proveedor envía compra (25 camisetas M)
2. Recibes en tienda
3. Vas a Dashboard → 📦 Inventario
4. Tab "Entrada"
5. Producto: Camiseta Azul
   Talla: M
   Cantidad: 25
   Referencia: OC-2024-001
   Razón: Compra a proveedor
6. Click ✓ Registrar Entrada
7. Automático: Stock actualizado (15 → 40)
              Movimiento registrado en historial
              KPI actualizado en dashboard
```

### Flujo 2: Venta Manual (If no usas carrito online)

```
1. Cliente compra 2 poleras negras talla L en tienda
2. Vas a Dashboard → 📦 Inventario
3. Tab "Salida"
4. Producto: Polera Negra
   Talla: L
   Cantidad: 2
   Referencia: VENTA-MANUAL-001
   Razón: Venta en tienda
5. Click ✓ Registrar Salida
6. Stock actualizado automáticamente
```

### Flujo 3: Editar Precio y Descuento

```
1. Necesitas liquidar shorts de verano
2. Vas a Dashboard → Tabla → Busca "Short"
3. Click ✏️ Editar
4. Precio Base: 79.90 (no cambies)
5. Descuento: 30%
   → Precio Final: S/. 55.93 (automático)
6. Click 💾 Guardar Cambios
7. En tienda aparece: "30% OFF, ahora S/. 55.93"
```

### Flujo 4: Producto Sin Stock

```
1. Dashboard muestra: "⚠️ Sin Stock: 3"
2. Click en 📊 Reportes
3. Ver tabla "Productos con Stock Bajo"
4. Identifica producto agotado
5. Click [Reordenar] → Ir a Inventario
6. Premium Entrada: compra más stock
7. Stock vuelve a positivo
```

### Flujo 5: Cambiar Estado de Pedido

```
1. Cliente compra por web (futura integración)
2. Pedido aparece en 📋 Pedidos con estado ⏳ Pendiente
3. Preparas paquete
4. Click selector: ⚙️ Procesando
5. Entregas a mensajero
6. Click selector: 🚚 Enviado
7. Cliente recibe
8. Click selector: ✓ Entregado
```

---

## 💡 Mejores Prácticas

### ✅ Hacer

| Acción | Beneficio |
|--------|----------|
| Actualizar stock diariamente | No prometes lo que no tienes |
| Usar referencias (OC, PED) | Auditoría completa |
| Revisar reportes semanalmente | Ver tendencias |
| Nombres específicos de productos | Clientes encuentran fácil |
| Fotos de calidad | Más conversión = más ventas |
| Descuentos estratégicos | Liquidas stock rápido |

### ❌ Evitar

| Error | Problema |
|-------|----------|
| No actualizar stock | Vendes dos veces lo mismo |
| Olvidar razones en movimientos | No auditas después |
| Nombres genéricos ("Ropa") | Cliente no sabe qué es |
| Fotos oscuras/borrosas | Se ve barato |
| Dejar productos agotados activos | Cliente se frustra |
| Cambiar precios sin registrar | Confusión en auditoría |

---

## 🎯 Estrategias de Negocio

### 1. Gestión Estacional

**Verano (Nov-Mar):**
```
✅ Activa: Shorts, sandalias, poleras ligeras
❌ Desactiva: Chaquetas, suéteres (pero preserva datos)
```

**Invierno (Abr-Oct):**
```
✅ Activa: Chaquetas, jeans, suéteres
❌ Desactiva: Shorts (temporada baja)
```

### 2. Control de Rotación

Usa tabla de historial para ver:
- Qué tallas se venden más
- Qué colores son preferidos
- Qué stock comprar más

### 3. Liquidación Eficiente

```
Método 1: Pequeño descuento (10-15%)
          Vender todo en 1 semana

Método 2: Descuento progresivo
          Semana 1: 10% OFF
          Semana 2: 20% OFF
          Semana 3: 30% OFF
          
Método 4: Bundle (2x1, 3x2)
          Vender más rápido juntos
```

### 4. Reorden Inteligente

```
Stock Bajo: Cuando cae a <5 → Pedir al proveedor
Stock Crítico: Cuando llega a 0 → URGE REORDEN INMEDIATA

Esperar a que baje a 3 para comprar = PERDIDA DE VENTAS
```

---

## 📞 Resumen de URLs

| Función | URL |
|---------|-----|
| Login | `/login` |
| Dashboard | `/admin/dashboard` |
| Agregar Producto | `/admin/agregar` |
| Editar Producto | `/admin/productos/[id]` |
| Inventario | `/admin/inventario` |
| Pedidos | `/admin/pedidos` |
| Reportes | `/admin/reportes` |
| Cerrar Sesión | POST `/api/auth/logout` |

---

## 🚀 Integración Futura

Cuando agregues:

1. **Carrito de Compras**
   - Pedidos se crean automáticamente
   - Stock se descuenta automático
   - 📋 Pedidos muestra órdenes reales

2. **Pasarela de Pagos**
   - Pedir cambio a pagada automática
   - Historial de pagos
   - Reportes de ingresos

3. **Emails**
   - Confirmación pedido
   - Cambio de estado
   - Bajo stock (notificación admin)

4. **Multi-tienda**
   - Sucursal A / Sucursal B
   - Stock por ubicación
   - Reportes por sucursal

---

## 🎓 Resumen

**Tu panel tiene:**

✅ **Gestión 360°**: Productos, inventario, pedidos  
✅ **Analytics Real-Time**: Sé exactamente cómo va tu negocio  
✅ **Auditoría Completa**: Cada movimiento registrado  
✅ **Profesional**: Como Shopify, pero para tu tienda  
✅ **Seguro**: Nadie más puede entrar  
✅ **Escalable**: Listo para crecer de 10 a 10,000 productos  

**Próximos pasos:**
1. Usar diariamente
2. Revisar reportes cada semana
3. Cuando estés listo, integra carrito de compras
4. Luego, pasarela de pagos

¡Bienvenido a la administración profesional de tu tienda!

---

**Status:** ✅ Completo y Listo  
**Última Actualización:** 12 Abril 2026  
**Versión:** 3.0 Profesional
