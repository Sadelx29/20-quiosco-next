import { prisma } from "../../../../../src/lib/prisma"
import { NextRequest } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params?.id)

  const orden = await prisma.order.update({
    where: { id },
    data: {
      orderReadyAt: new Date(),
    },
  })

  return Response.json(orden)
}
