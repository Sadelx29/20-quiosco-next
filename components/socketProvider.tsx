"use client"
import { ReactNode, useEffect } from "react"
import { socket } from "@/src/lib/socket-client"

export function SocketProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!socket.connected) socket.connect()
    return () => {
      socket.disconnect()
    }
  }, [])

  return <>{children}</>
}
