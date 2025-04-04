"use client"
import useSWR from "swr"

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
  const url = "/api/orders/pending"

  const fetcher = () =>
    fetch(url).then((res) => res.json())

  const {
    data: ordenes = [],
    isLoading,
    mutate
  } = useSWR<Orden[]>(url, fetcher, {
    refreshInterval: 10000, // 🔁 actualiza cada 10 segundos
    revalidateOnFocus: true, // también refresca si el usuario vuelve a la pestaña

  })

  const marcarComoPreparada = async (id: number) => {
    try {
      await fetch(`/api/orders/${id}/ready`, {
        method: "PUT",
      })
      mutate() // 🔄 fuerza la recarga después de marcar como preparada
    } catch (error) {
      console.error("Error marcando orden:", error)
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">👨‍🍳 Módulo de Cocina</h1>

      {isLoading ? (
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
