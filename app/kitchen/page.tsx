"use client"

import { useEffect, useState } from "react"

type Orden = {
  id: number
  name: string
  total: number
  createdAt: string
  orderProducts: {
    quantity: number
    product: { name: string }
  }[]
}

export default function KitchenPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [cargando, setCargando] = useState(true)

  // 🟡 Obtener órdenes pendientes al cargar la vista
  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await fetch("/api/orders/pending")
        const data = await res.json()
        setOrdenes(data)
      } catch (error) {
        console.error("Error cargando órdenes:", error)
      } finally {
        setCargando(false)
      }
    }

    fetchOrdenes()
  }, [])

  // 🟢 Marcar como preparada
  const marcarComoPreparada = async (id: number) => {
    try {
      await fetch(`/api/orders/${id}/ready`, {
        method: "PUT",
      })
      setOrdenes(prev => prev.filter(o => o.id !== id))
    } catch (error) {
      console.error("Error marcando orden:", error)
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">👨‍🍳 Módulo de Cocina</h1>

      {cargando ? (
        <p className="text-gray-600">Cargando órdenes...</p>
      ) : ordenes.length === 0 ? (
        <p className="text-gray-600">No hay órdenes pendientes.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ordenes.map((orden) => (
            <li
              key={orden.id}
              className="bg-white border p-4 rounded-md shadow-sm"
            >
              <p className="font-semibold text-lg mb-2">
                Cliente: {orden.name}
              </p>
              <p className="mb-2">Total: ${orden.total.toFixed(2)}</p>
              <div className="text-sm text-gray-700 mb-4">
                {orden.orderProducts.map((item, idx) => (
                  <div key={idx}>
                    {item.quantity} × {item.product.name}
                  </div>
                ))}
              </div>
              <button
                onClick={() => marcarComoPreparada(orden.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Marcar como preparada
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
