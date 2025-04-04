"use client";

import { useTransition } from "react";
import { completeOrder } from "@/actions/complete-order-action";
import { OrderWithProducts } from "@/src/types";
import { formatCurrency } from "@/src/utils";
import { toast } from "react-toastify";

type OrderCardProps = {
  order: OrderWithProducts;
  mutate: () => void; // <-- para forzar revalidación
};

export default function OrderCard({ order, mutate }: OrderCardProps) {
  const [isPending, startTransition] = useTransition();

  function getOrderStatus(order: OrderWithProducts) {
    if (order.status) return "Completada";
    if (order.orderReadyAt) return "Preparada";
    return "En cocina";
  }

  const handleComplete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("order_id", order.id.toString());

      try {
        await completeOrder(formData);

        // ✅ Mostrar toast de éxito
        mutate();

        toast.success("Orden completada correctamente");
      } catch (error) {
        toast.error("Error al completar la orden");
      }
    });
  };

  return (
    <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:mt-0 lg:p-8 space-y-4">
      <p className="text-2xl font-medium text-gray-900">
        Cliente: {order.name}
      </p>
      <p className="text-lg font-medium text-gray-900">Productos Ordenados:</p>
      <dl className="mt-6 space-y-4">
        {order.orderProducts.map((product) => (
          <div
            key={product.productId}
            className="flex items-center gap-2 border-t border-gray-200 pt-4"
          >
            <dt className="flex items-center text-sm text-gray-600">
              <span className="font-black">({product.quantity})</span>
            </dt>
            <dd className="text-sm font-medium text-gray-900">
              {product.product.name}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">
            Total a Pagar:
          </dt>
          <dd className="text-base font-medium text-gray-900">
            {formatCurrency(order.total)}
          </dd>
        </div>
      </dl>

      <span
        className={`
  inline-block px-3 py-1 text-sm font-bold rounded-full
  ${
    order.status
      ? "bg-gray-800 text-white"
      : order.orderReadyAt
      ? "bg-green-600 text-white"
      : "bg-yellow-500 text-black"
  }
`}
      >
        {getOrderStatus(order)}
      </span>

      {!order.status && (
        <button
          onClick={handleComplete}
          disabled={isPending}
          className={`w-full mt-5 p-3 uppercase text-white font-bold rounded transition ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-800"
          }`}
        >
          {isPending ? "Procesando..." : "Marcar Orden Completada"}
        </button>
      )}
    </section>
  );
}
