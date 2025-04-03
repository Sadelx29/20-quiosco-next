import { prisma } from "../../../../src/lib/prisma"

export async function GET() {
  const ordenes = await prisma.order.findMany({
    where: {
      orderReadyAt: null,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  })

  return Response.json(ordenes)
}
