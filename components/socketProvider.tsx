"use client"

import { useEffect } from "react"
import { socket } from "@/src/lib/socket-client"

export default function SocketProvider() {
  useEffect(() => {
    fetch("/api/socket") // inicializa servidor
    socket.connect()

    socket.on("connect", () => {
      console.log("🔌 Socket conectado:", socket.id)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return null
}
