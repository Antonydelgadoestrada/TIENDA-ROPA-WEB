import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateAdminToken } from '@/app/api/auth/validate'

export async function POST(request: NextRequest) {
  // 🔐 Validar autenticación
  const { isValid, error } = validateAdminToken(request)
  if (!isValid) return error

  try {
    const formData = await request.formData()
    const nombre = formData.get('nombre') as string
    const precio = formData.get('precio') as string
    const descripcion = formData.get('descripcion') as string
    const categoria = formData.get('categoria') as string
    const imagen = formData.get('imagen') as File
    const stocksJson = formData.get('stocks') as string

    // Validaciones
    if (!nombre?.trim()) {
      return NextResponse.json(
        { error: 'El nombre del producto es obligatorio' },
        { status: 400 }
      )
    }

    if (!precio || isNaN(parseFloat(precio))) {
      return NextResponse.json(
        { error: 'El precio debe ser un número válido' },
        { status: 400 }
      )
    }

    if (parseFloat(precio) <= 0) {
      return NextResponse.json(
        { error: 'El precio debe ser mayor a 0' },
        { status: 400 }
      )
    }

    const stocks = JSON.parse(stocksJson || '{}')
    const totalStock = Object.values(stocks).reduce((a: number, b: any) => a + Number(b), 0)

    if (totalStock === 0) {
      return NextResponse.json(
        { error: 'Debe ingresar stock para al menos una talla' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    let imagenUrl = ''

    // Subir imagen si existe
    if (imagen && imagen.size > 0) {
      const buffer = await imagen.arrayBuffer()
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${imagen.name}`

      const { data, error: uploadError } = await supabase.storage
        .from('productos')
        .upload(filename, buffer, {
          contentType: imagen.type,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        // No retornar error, simplemente continuar sin imagen
        // return NextResponse.json(
        //   { error: 'Error al subir la imagen' },
        //   { status: 500 }
        // )
      } else if (data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('productos').getPublicUrl(data.path)

        imagenUrl = publicUrl
      }
    }

    // Insertar producto (sin categoria_id por ahora)
    const { data: producto, error: productoError } = await supabase
      .from('productos')
      .insert({
        nombre: nombre.trim(),
        precio: parseFloat(precio),
        descripcion: descripcion?.trim() || '',
        imagen_url: imagenUrl,
      })
      .select()
      .single()

    if (productoError) {
      console.error('Product insert error:', productoError)
      return NextResponse.json(
        { error: 'Error al guardar el producto' },
        { status: 500 }
      )
    }

    // Obtener todas las tallas
    const { data: tallas, error: tallasError } = await supabase
      .from('tallas')
      .select('id, nombre')

    if (!tallasError && tallas) {
      // Insertar stock por talla
      const stockInserts = Object.entries(stocks)
        .map(([tallaNombre, stock]) => {
          const talla = tallas.find(
            (t: any) => t.nombre === tallaNombre
          )
          return talla
            ? {
                producto_id: producto.id,
                talla_id: talla.id,
                stock: Number(stock) || 0,
              }
            : null
        })
        .filter(Boolean)

      if (stockInserts.length > 0) {
        const { error: stockError } = await supabase
          .from('producto_tallas')
          .insert(stockInserts)

        if (stockError) {
          console.error('Stock insert error:', stockError)
          // Continuamos aunque falle el stock
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Producto agregado exitosamente',
        product: producto,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
