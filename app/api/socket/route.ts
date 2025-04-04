// app/api/socket/route.ts
import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/src/types"

export const dynamic = "force-dynamic"; // importante para App Router

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    console.log("Socket.IO server creando 🚀");

    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
    });

    io.on("connection", (socket) => {
      console.log("🟢 Cliente conectado", socket.id);

      socket.on("orden-nueva", (orden) => {
        console.log("📦 Orden nueva recibida", orden);
        socket.broadcast.emit("orden-nueva", orden);
      });

      socket.on("orden-preparada", (ordenId) => {
        console.log("✅ Orden preparada", ordenId);
        socket.broadcast.emit("orden-preparada", ordenId);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("⚠️ Socket.IO ya estaba iniciado");
  }

  res.end();
}
