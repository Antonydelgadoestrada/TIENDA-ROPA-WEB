import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAdminToken } from '@/app/api/auth/validate'

export async function DELETE(request: NextRequest) {
  // 🔐 Validar autenticación
  const { isValid, error } = validateAdminToken(request)
  if (!isValid) return error!

  try {
    const { id, desactivar } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID del producto requerido' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    if (desactivar) {
      // Desactivar
      await supabase
        .from('productos')
        .update({ activo: false })
        .eq('id', id)
    } else {
      // Eliminar completamente
      await supabase.from('productos').delete().eq('id', id)
    }

    return NextResponse.json({
      success: true,
      message: desactivar ? 'Producto desactivado' : 'Producto eliminado',
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el producto' },
      { status: 500 }
    )
  }
}
