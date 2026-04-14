import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAdminToken } from '@/app/api/auth/validate'

export async function PATCH(request: NextRequest) {
  // 🔐 Validar autenticación
  const { isValid, error } = validateAdminToken(request)
  if (!isValid) return error!

  try {
    const { producto_id, talla_id, stock } = await request.json()

    if (!producto_id || !talla_id) {
      return NextResponse.json(
        { error: 'Producto y talla requeridos' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase
      .from('producto_tallas')
      .update({ stock: Math.max(0, stock) })
      .eq('producto_id', producto_id)
      .eq('talla_id', talla_id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Stock actualizado',
    })
  } catch (error) {
    console.error('Stock update error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el stock' },
      { status: 500 }
    )
  }
}
