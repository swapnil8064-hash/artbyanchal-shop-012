"use client";

import { updateOrderStatus } from "@/lib/firestore/orders/write";
import toast from "react-hot-toast";

export default function ChangeOrderStatus({ order }) {
  const handleChangeStatus = async (status) => {
    try {
      if (!status) {
        toast.error("Please Select Status");
        return;
      }
      await toast.promise(
        updateOrderStatus({ id: order?.id, status: status }),
        {
          error: (e) => e?.message,
          loading: "Updating...",
          success: "Successfully Updated",
        }
      );
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <select
      value={order?.status || ""}
      onChange={(e) => handleChangeStatus(e.target.value)}
      name="change-order-status"
      id="change-order-status"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <option value="">Update Status</option>
      <option value="pending">Pending</option>
      <option value="packed">Packed</option>
      <option value="picked up">Picked Up</option>
      <option value="in transit">In Transit</option>
      <option value="out for delivery">Out For Delivery</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
