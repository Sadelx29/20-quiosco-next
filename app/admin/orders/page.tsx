"use client";

import useSWR from "swr";
import OrderCard from "@/components/order/OrderCard";
import Heading from "@/components/ui/Heading";
import { OrderWithProducts } from "@/src/types";
import { useState } from "react";

export default function OrdersPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split("T")[0]; // YYYY-MM-DD
  });

  const url = `/admin/orders/api?date=${selectedDate}`;

  const fetcher = () =>
    fetch(url)
      .then((res) => res.json())
      .then((data) => data);
  const { data, isLoading } = useSWR<OrderWithProducts[]>(url, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });

  const [filter, setFilter] = useState<
    "ALL" | "KITCHEN" | "READY" | "COMPLETED"
  >("ALL");

  const filteredOrders =
    data?.filter((order) => {
      if (filter === "ALL") return true;
      if (filter === "KITCHEN") return !order.orderReadyAt;
      if (filter === "READY") return order.orderReadyAt && !order.status;
      if (filter === "COMPLETED") return order.status;
    }) || [];

  return (
    <>
      <Heading>Administrar Ordenes</Heading>

      <div className="mb-5">
        <label className="block mb-1 text-gray-700 font-semibold">
          Filtrar por fecha:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-4 py-2 rounded"
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mt-5 mb-8">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded ${
            filter === "ALL" ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter("KITCHEN")}
          className={`px-4 py-2 rounded ${
            filter === "KITCHEN" ? "bg-yellow-500 text-black" : "bg-gray-200"
          }`}
        >
          En cocina
        </button>
        <button
          onClick={() => setFilter("READY")}
          className={`px-4 py-2 rounded ${
            filter === "READY" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          Preparadas
        </button>
        <button
          onClick={() => setFilter("COMPLETED")}
          className={`px-4 py-2 rounded ${
            filter === "COMPLETED" ? "bg-gray-800 text-white" : "bg-gray-200"
          }`}
        >
          Completadas
        </button>
      </div>

      {isLoading ? (
        <p className="text-center">Cargando...</p>
      ) : filteredOrders.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-center">No hay órdenes para este estado.</p>
      )}
    </>
  );
}
