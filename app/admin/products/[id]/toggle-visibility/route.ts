// app/api/products/[id]/toggle-visibility/route.ts
import { prisma } from "../../../../../src/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(
  _req: Request,
  { params }: { params: { id: string } }
) {

  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
  })

  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
  }



  const updated = await prisma.product.update({
    where: { id: product.id },
    data: { visible: !product.visible },
  })

  return NextResponse.json(updated)
}
