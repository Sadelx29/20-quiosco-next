import { prisma } from "@/src/lib/prisma"
import { NextRequest } from "next/server"
import type { NextApiResponseServerIO } from "@/src/types"

export async function POST(req: NextRequest, res: NextApiResponseServerIO) {
  const body = await req.json()

  try {
    const orden = await prisma.order.create({
      data: {
        name: body.name,
        total: body.total,
        orderProducts: {
          create: body.orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
    })

    // ✅ Emitir orden en tiempo real
    res.socket?.server?.io?.emit("orden-nueva", orden)

    return Response.json(orden, { status: 201 })
  } catch (error) {
    console.error("Error creando orden:", error)
    return Response.json({ error: "Error creando orden" }, { status: 500 })
  }
}
