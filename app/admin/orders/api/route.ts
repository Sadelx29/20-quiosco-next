import { prisma } from "@/src/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get("date")

  const date = dateStr ? new Date(dateStr) : new Date()

  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  const orders = await prisma.order.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
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

  return Response.json(orders)
}
