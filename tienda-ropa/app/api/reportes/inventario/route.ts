import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAdminToken } from '@/app/api/auth/validate'

/**
 * GET: Obtener estadísticas de inventario
 * Retorna:
 * - Total productos activos
 * - Total stock acumulado
 * - Productos con stock bajo (<5)
 * - Productos sin stock
 * - Valor total del inventario
 */
export async function GET(request: NextRequest) {
  const { isValid, error } = validateAdminToken(request)
  if (!isValid) return error

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Obtener todos los productos activos con su stock
    const { data: productosConStock, error: err1 } = await supabase
      .from('productos')
      .select(
        `
        id,
        nombre,
        precio,
        activo,
        producto_tallas (
          stock
        )
        `
      )
      .eq('activo', true)

    if (err1) throw err1

    // Calcular estadísticas
    let totalProductos = productosConStock?.length || 0
    let totalStock = 0
    let totalValue = 0
    let stockBajo = 0
    let sinStock = 0
    const productosDetalle: any[] = []

    productosConStock?.forEach((p: any) => {
      const stockProducto = p.producto_tallas?.reduce((sum: number, pt: any) => sum + (pt.stock || 0), 0) || 0
      totalStock += stockProducto
      totalValue += p.precio * stockProducto

      productosDetalle.push({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        stock_total: stockProducto,
        valor_total: p.precio * stockProducto,
      })

      if (stockProducto === 0) {
        sinStock++
      } else if (stockProducto < 5) {
        stockBajo++
      }
    })

    return NextResponse.json({
      resumen: {
        total_productos: totalProductos,
        total_stock: totalStock,
        valor_inventario: totalValue.toFixed(2),
        stock_bajo: stockBajo,
        sin_stock: sinStock,
      },
      productos: productosDetalle.sort((a: any, b: any) => a.stock_total - b.stock_total).slice(0, 10),
    })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json(
      { error: 'Error al calcular estadísticas' },
      { status: 500 }
    )
  }
}
