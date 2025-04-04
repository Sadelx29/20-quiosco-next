"use client";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { useStore } from "@/src/store";
import ProductDetails from "./ProductDetails";
import { formatCurrency } from "@/src/utils";
import { createOrder } from "@/actions/create-order-action";
import { OrderSchema } from "@/src/schema";
import { useTransition } from "react";


export default function OrderSummary() {
  const order = useStore((state) => state.order);
  const [isPending, startTransition] = useTransition();

  const clearOrder = useStore((state) => state.clearOrder);
  const total = useMemo(
    () => order.reduce((total, item) => total + item.quantity * item.price, 0),
    [order]
  );

  const handleCreateOrder = (formData: FormData) => {
    startTransition(async () => {
      const data = {
        name: formData.get("name"),
        total,
        order,
      };

      const result = OrderSchema.safeParse(data);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          toast.error(issue.message);
        });
        return;
      }

      const response = await createOrder(data);
      if (response?.errors) {
        response.errors.forEach((issue) => {
          toast.error(issue.message);
        });
      }
      // Emitir el evento de socket

      toast.success("Pedido Realizado Correctamente");
      clearOrder();
    });
  };

  return (
    <aside className="lg:h-screen lg:overflow-y-scroll md:w-64 lg:w-96 p-5">
      <h1 className="text-4xl text-center font-black">Mi Pedido</h1>

      {order.length === 0 ? (
        <p className="text-center my-10">El pedido esta vacio</p>
      ) : (
        <div className="mt-5">
          {order.map((item) => (
            <ProductDetails key={item.id} item={item} />
          ))}

          <p className="text-2xl mt-20 text-center">
            Total a pagar: {""}
            <span className="font-bold">{formatCurrency(total)}</span>
          </p>

          <form className="w-full mt-10 space-y-5" action={handleCreateOrder}>
            <input
              type="text"
              placeholder="Tu Nombre"
              className="bg-white border border-gray-100 p-2 w-full"
              name="name"
              required
            />

            <input
              disabled={isPending}
              className={`w-full mt-5 p-3 uppercase text-white font-bold rounded transition ${
                isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-800"
              }`}
              type="submit"
              value={isPending ? "Procesando..." : "Confirmar Pedido"}
            />
          </form>
        </div>
      )}
    </aside>
  );
}
