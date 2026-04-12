import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAdminToken } from '@/app/api/auth/validate'

export async function POST(request: NextRequest) {
  // 🔐 Validar autenticación
  const { isValid, error } = validateAdminToken(request)
  if (!isValid) return error

  try {
    const formData = await request.formData()
    const productoId = formData.get('producto_id') as string
    const imagen = formData.get('imagen') as File

    if (!productoId) {
      return NextResponse.json(
        { error: 'ID del producto requerido' },
        { status: 400 }
      )
    }

    if (!imagen) {
      return NextResponse.json(
        { error: 'Imagen requerida' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Generar nombre único para la imagen
    const timestamp = Date.now()
    const fileName = `${productoId}-${timestamp}-${imagen.name}`
    const filePath = `productos/${fileName}`

    // Subir imagen
    const arrayBuffer = await imagen.arrayBuffer()
    const { error: uploadError, data } = await supabase.storage
      .from('Productos')
      .upload(filePath, arrayBuffer, {
        contentType: imagen.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Error al subir la imagen' },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('Productos')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData?.publicUrl

    // Actualizar producto con la nueva imagen
    const { error: updateError } = await supabase
      .from('productos')
      .update({ imagen_url: publicUrl })
      .eq('id', productoId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Error al actualizar producto' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      imagen_url: publicUrl,
      message: 'Imagen actualizada correctamente',
    })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
