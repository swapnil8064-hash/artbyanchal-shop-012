"use client";

import { useOrder } from "@/lib/firestore/orders/read";
import { useParams } from "next/navigation";
import ChangeOrderStatus from "./components/ChangeStatus";

export default function Page() {
  const { orderId } = useParams();
  const { data: order, error, isLoading } = useOrder({ id: orderId });

  if (isLoading) {
    return (
      <div className="flex justify-center py-48">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-deepPink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  const totalAmount = order?.checkout?.line_items?.reduce((prev, curr) => {
    return prev + (curr?.price_data?.unit_amount / 100) * curr?.quantity;
  }, 0);

  const address = JSON.parse(order?.checkout?.metadata?.address ?? "{}");

  return (
    <main className="flex flex-col gap-4 p-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <ChangeOrderStatus order={order} />
      </div>

      <div className="flex flex-col gap-2 border rounded-lg p-4 bg-white">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="bg-lightBlue-100 text-lightBlue-600 text-xs rounded-lg px-2 py-1 uppercase">
              {order?.paymentMode}
            </span>
            <span className="bg-green-100 text-green-600 text-xs rounded-lg px-2 py-1 uppercase">
              {order?.status ?? "pending"}
            </span>
            <span className="text-green-600 font-semibold">₹ {totalAmount}</span>
          </div>
          <p className="text-gray-600 text-xs">
            {order?.timestampCreate?.toDate()?.toString()}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          {order?.checkout?.line_items?.map((product) => (
            <div key={product?.price_data?.product_data?.name} className="flex gap-2 items-center">
              <img
                className="h-10 w-10 rounded-lg object-cover"
                src={product?.price_data?.product_data?.images?.[0]}
                alt={product?.price_data?.product_data?.name}
              />
              <div>
                <h2 className="font-semibold">{product?.price_data?.product_data?.name}</h2>
                <p className="text-gray-500 text-xs">
                  ₹ {product?.price_data?.unit_amount / 100} × {product?.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-2xl font-semibold mt-4">Address</h1>
      <div className="flex flex-col gap-2 border rounded-lg p-4 bg-white">
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(address).map(([key, value]) => (
              <tr key={key}>
                <td className="font-semibold pr-4 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
