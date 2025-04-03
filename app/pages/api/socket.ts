// pages/api/socket.ts
export const config = {
    api: {
      bodyParser: false,
    },
  }
  
  import { Server } from "socket.io"
  import type { NextApiRequest } from "next"
  import type { NextApiResponseServerIO } from "@/src/types"
  
  export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (!res.socket.server.io) {
      const io = new Server(res.socket.server, {
        path: "/api/socket_io",
      })
  
      io.on("connection", (socket) => {
        console.log("✅ Cliente conectado:", socket.id)
  
        socket.on("orden-nueva", (orden) => {
          socket.broadcast.emit("orden-nueva", orden)
        })
  
        socket.on("orden-preparada", (ordenId) => {
          socket.broadcast.emit("orden-preparada", ordenId)
        })
      })
  
      res.socket.server.io = io
      console.log("✅ Socket.IO server inicializado")
    }
  
    res.end()
  }
  