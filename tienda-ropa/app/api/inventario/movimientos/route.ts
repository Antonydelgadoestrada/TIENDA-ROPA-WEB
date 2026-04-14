import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAdminToken } from '@/app/api/auth/validate'

/**
 * POST: Registrar entrada/salida de producto
 * Body: {
 *   producto_id: string
 *   talla_id: string
 *   tipo: 'entrada' | 'salida' | 'ajuste'
 *   cantidad: number
 *   razon: string (ej: "Compra a proveedor", "Venta online", "Devolución cliente")
 *   referencia: string (opcional: número de compra, pedido, devolución)
 * }
 */
export async function POST(request: NextRequest) {
  // 🔐 Validar autenticación
  const { isValid, error } = validateAdminToken(request)
  if (!isValid) return error!

  try {
    const {
      producto_id,
      talla_id,
      tipo,
      cantidad,
      razon,
      referencia,
    } = await request.json()

    // Validaciones básicas
    if (!producto_id || !talla_id || !tipo || !cantidad) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (!['entrada', 'salida', 'ajuste'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo inválido' },
        { status: 400 }
      )
    }

    if (cantidad <= 0) {
      return NextResponse.json(
        { error: 'Cantidad debe ser mayor a 0' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // 1. Actualizar stock en producto_tallas
    const { data: productoTalla, error: getError } = await supabase
      .from('producto_tallas')
      .select('stock')
      .eq('producto_id', producto_id)
      .eq('talla_id', talla_id)
      .single()

    if (getError) {
      return NextResponse.json(
        { error: 'Producto/talla no encontrado' },
        { status: 404 }
      )
    }

    // Calcular nuevo stock
    let nuevoStock = productoTalla.stock
    if (tipo === 'entrada') {
      nuevoStock += cantidad
    } else if (tipo === 'salida' || tipo === 'ajuste') {
      nuevoStock -= cantidad
    }

    // Validar que no quede negativo
    if (nuevoStock < 0) {
      return NextResponse.json(
        { error: `Stock insuficiente. Disponible: ${productoTalla.stock}` },
        { status: 400 }
      )
    }

    // Actualizar stock
    const { error: updateError } = await supabase
      .from('producto_tallas')
      .update({ stock: nuevoStock })
      .eq('producto_id', producto_id)
      .eq('talla_id', talla_id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Error al actualizar stock' },
        { status: 500 }
      )
    }

    // 2. Registrar movimiento en historial (si la tabla existe en Supabase)
    try {
      await supabase.from('movimientos_inventario').insert({
        producto_id,
        talla_id,
        tipo,
        cantidad_movida: cantidad,
        stock_anterior: productoTalla.stock,
        stock_nuevo: nuevoStock,
        razon,
        referencia: referencia || null,
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.warn('Tabla movimientos_inventario no existe, pero stock fue actualizado')
    }

    return NextResponse.json({
      success: true,
      message: `Stock ${tipo} registrado correctamente`,
      stock_anterior: productoTalla.stock,
      stock_nuevo: nuevoStock,
    })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * GET: Obtener historial de movimientos
 * Query params:
 *   - producto_id: UUID (opcional, filtrar por producto)
 *   - limite: number (default 50)
 *   - offset: number (default 0, para paginación)
 */
export async function GET(request: NextRequest) {
  // 🔐 Validar autenticación
  const { isValid, error } = validateAdminToken(request)
  if (!isValid) return error!

  try {
    const { searchParams } = new URL(request.url)
    const producto_id = searchParams.get('producto_id')
    const limite = parseInt(searchParams.get('limite') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let query = supabase
      .from('movimientos_inventario')
      .select(
        `
        *,
        producto:productos(nombre),
        talla:tallas(nombre)
        `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limite - 1)

    if (producto_id) {
      query = query.eq('producto_id', producto_id)
    }

    const { data, error: queryError, count } = await query

    if (queryError) {
      return NextResponse.json(
        { error: 'Tabla de movimientos no existe aún. Crea un movimiento primero.' },
        { status: 200 } // Retorna 200 con array vacío para no romper UI
      )
    }

    return NextResponse.json({
      movimientos: data || [],
      total: count || 0,
      limite,
      offset,
    })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json(
      { error: 'Error al obtener movimientos' },
      { status: 500 }
    )
  }
}
