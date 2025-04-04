"use client";

import { ProductsWithCategory } from "@/app/admin/products/page";
import { formatCurrency } from "@/src/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductTableProps = {
  products: ProductsWithCategory;
};

export default function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [visibilityChangingId, setVisibilityChangingId] = useState<
    number | null
  >(null);

  const toggleVisibility = async (id: number) => {

    setVisibilityChangingId(id);
    await fetch(`/admin/products/${id}/toggle-visibility`, { method: "PUT" });
    router.refresh(); // o mutate si usas SWR
    setVisibilityChangingId(null);
  };

  const handleEdit = (id: number) => {
    setLoadingId(id);
    router.push(`/admin/products/${id}/edit`);
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-20">
      <div className="mt-8 flow-root ">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 bg-white p-5 ">
            <table className="min-w-full divide-y divide-gray-300 ">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Producto
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Precio
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Categoría
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {product.category.name}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        onClick={() => toggleVisibility(product.id)}
                        disabled={visibilityChangingId === product.id}
                        className={`ml-4 ${
                          product.visible ? "text-red-600" : "text-green-600"
                        } hover:underline`}
                      >
                        {visibilityChangingId === product.id
                          ? "Cambiando..."
                          : product.visible
                          ? "Ocultar"
                          : "Mostrar"}
                      </button>

                      <button
                        onClick={() => handleEdit(product.id)}
                        disabled={loadingId === product.id}
                        className={`${
                          loadingId === product.id
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-indigo-600 hover:text-indigo-800"
                        }`}
                      >
                        {loadingId === product.id ? "Cargando..." : "Editar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
