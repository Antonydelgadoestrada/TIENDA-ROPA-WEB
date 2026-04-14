import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAdminToken } from '@/app/api/auth/validate'

export async function PUT(request: NextRequest) {
  // 🔐 Validar autenticación
  const { isValid, error } = validateAdminToken(request)
  if (!isValid) return error!

  try {
    const { id, nombre, precio, descripcion } = await request.json()

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

    const { error } = await supabase
      .from('productos')
      .update({
        ...(nombre && { nombre }),
        ...(precio && { precio: parseFloat(precio) }),
        ...(descripcion !== undefined && { descripcion }),
      })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Producto actualizado correctamente',
    })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el producto' },
      { status: 500 }
    )
  }
}
