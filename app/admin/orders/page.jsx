"use client";

import { useOrder } from "@/lib/firestore/orders/read";
import { useParams } from "next/navigation";
import ChangeOrderStatus from "./[orderId]/components/ChangeStatus";


export default function Page() {
  const { orderId } = useParams();
  const { data: order, error, isLoading } = useOrder({ id: orderId });

  if (isLoading) {
    return (
      <div className="flex justify-center py-48">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center py-5">{error}</div>;

  const totalAmount = order?.checkout?.line_items?.reduce(
    (prev, curr) => prev + (curr?.price_data?.unit_amount / 100) * curr?.quantity,
    0
  );

  const address = JSON.parse(order?.checkout?.metadata?.address ?? "{}");

  return (
    <main className="flex flex-col gap-6 p-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
        <ChangeOrderStatus order={order} />
      </div>

      {/* Order Info */}
      <div className="flex flex-col gap-4 border rounded-lg p-5 bg-white shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="bg-lightBlue-100 text-lightBlue-600 text-xs font-medium rounded-lg px-2 py-1 uppercase shadow-sm">
              {order?.paymentMode}
            </span>
            <span className="bg-green-100 text-green-600 text-xs font-medium rounded-lg px-2 py-1 uppercase shadow-sm">
              {order?.status ?? "pending"}
            </span>
            <span className="text-green-600 font-semibold text-sm">₹ {totalAmount}</span>
          </div>
          <p className="text-gray-500 text-xs">
            {order?.timestampCreate?.toDate()?.toLocaleString()}
          </p>
        </div>

        {/* Line Items */}
        <div className="flex flex-col gap-3 mt-3">
          {order?.checkout?.line_items?.map((product, idx) => (
            <div
              key={`${product?.price_data?.product_data?.name}-${idx}`}
              className="flex gap-3 items-center border rounded-lg p-2 hover:shadow-sm transition-shadow"
            >
              <img
                className="h-12 w-12 rounded-lg object-cover"
                src={product?.price_data?.product_data?.images?.[0]}
                alt={product?.price_data?.product_data?.name}
              />
              <div className="flex flex-col">
                <h2 className="font-medium text-gray-900">{product?.price_data?.product_data?.name}</h2>
                <p className="text-gray-500 text-xs">
                  ₹ {product?.price_data?.unit_amount / 100} × {product?.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      <h2 className="text-2xl font-semibold text-gray-900 mt-4">Address</h2>
      <div className="flex flex-col gap-2 border rounded-lg p-5 bg-white shadow-sm">
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(address).map(([key, value]) => (
              <tr key={key} className="hover:bg-pink-50 transition-colors duration-200">
                <td className="font-semibold pr-4 capitalize text-gray-700">{key.replace(/([A-Z])/g, " $1")}</td>
                <td className="text-gray-600">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
