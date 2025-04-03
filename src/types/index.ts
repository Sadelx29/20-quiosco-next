import { Order, OrderProducts, Product } from "@prisma/client";
// src/types/next.d.ts
import type { Server as HTTPServer } from "http"
import type { Socket } from "net"
import type { Server as IOServer } from "socket.io"
import type { NextApiResponse } from "next"


export type OrderItem = Pick<Product, 'id' | 'name' | 'price'> & {
    quantity: number
    subtotal: number
} 

export type OrderWithProducts = Order & {
    orderProducts: (OrderProducts & {
        product: Product
    })[]
}


export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
      server: HTTPServer & {
        io: IOServer
      }
    }
  }
