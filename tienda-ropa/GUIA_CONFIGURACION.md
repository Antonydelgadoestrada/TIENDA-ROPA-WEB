# 📝 Guía: Configuración de la Tienda

## 🎯 Qué es

La página **Configuración** te permite personalizar los datos de tu tienda que aparecerán en:
- Tu sitio web
- Emails de confirmación
- Mensajes a clientes
- Footer de páginas

## 📋 Campos Disponibles

### 📌 Información Básica

| Campo | Uso |
|-------|-----|
| **Nombre de la Tienda** | Se muestra en el header de la web |
| **Email de Contacto** | Dónde reciben consultas los clientes |
| **Teléfono Principal** | Número de llamadas |
| **WhatsApp** | Número para mensajes WhatsApp Business |
| **Dirección** | Ubicación física de la tienda |
| **Ciudad** | Para envíos y contexto |
| **Descripción** | Breve resumen de tu tienda (mejora SEO) |
| **Horario de Atención** | Ej: "Lun-Vie: 09:00-18:00" |

### 📱 Redes Sociales

Conecta con tus clientes agregando:
- Instagram (@usuario)
- Facebook (nombre de página)
- TikTok (@usuario)

Estos se mostrarán en botones/links en tu tienda web.

### 📜 Políticas

Define:
- **Política de Devolución**: Los plazos y condiciones (ej: "30 días desde la compra")

## 💾 Cómo Usar

### Paso 1: Configurar la Base de Datos

**Primero una sola vez:**

1. Ve a https://app.supabase.com
2. Selecciona tu PROJECT
3. Click en **SQL Editor** (lado izquierdo)
4. Click en **New Query**
5. Copia el contenido de `SETUP_CONFIGURACION.sql`
6. Pégalo en el editor
7. Click en **Run** ▶️

### Paso 2: Llenar los Datos

1. Ve a tu panel: http://localhost:3000/admin
2. Click en **⚙️ Configuración** (en el sidebar izquierdo)
3. Llena todos los campos
4. Click **💾 Guardar Cambios**

### Paso 3: Verificar

Los datos se guardan automáticamente. Puedes volver en cualquier momento para editar.

## 🔄 Actualizar Configuración

Si valores cambios en tu tienda:
1. Edita los campos que necesites
2. Click **💾 Guardar Cambios**
3. ✅ Listo, se actualiza al instante

## 📊 Ejemplo Real

**Mi tienda actual:**
- Nombre: "Poleras Perú"
- Email: poleras@ejemplo.com
- Teléfono: +51 987 654 321
- WhatsApp: +51 987 654 321 (mismo número, es recomendado)
- Dirección: Av. Jirón 456, Miraflores
- Ciudad: Lima
- Instagram: @polerasperú
- Horario: Lun-Vie 10:00-19:00, Sab 11:00-15:00
- Política: "30 días para cambios, sin consultas. Costo de envío retorno por cliente"

## ⚠️ Importante

- **Verifica bien** los datos antes de guardar (especialmente email y teléfono)
- **Usa dos números** si tienes: uno para llamadas, otro para WhatsApp
- **Actualiza horarios** si cambian temporalmente
- **Mantén políticas claras** para evitar conflictos con clientes

## 🆘 Si hay error

Si no se guardó:
1. Verifica que la tabla exista en Supabase (ejecuta el SQL)
2. Recarga la página (F5)
3. Intenta de nuevo

¿Necesitas más campos? Avísame y los añado.
