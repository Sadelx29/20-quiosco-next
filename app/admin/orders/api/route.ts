import { prisma } from "@/src/lib/prisma"
import { getLocalDayRange } from "@/src/utils/index"


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams?.get("date")

  const {start, end} = getLocalDayRange('America/Santo_Domingo')



  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end
      }
    },
    orderBy: {
      createdAt: "asc"
    },
    include: {
      orderProducts: {
        include: {
          product: true
        }
      }
    }
  })

  return Response.json(orders)
}
