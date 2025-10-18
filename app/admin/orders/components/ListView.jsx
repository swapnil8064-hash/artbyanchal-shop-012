"use client";

import { useAllOrders } from "@/lib/firestore/orders/read";
import { useUser } from "@/lib/firestore/user/read";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);

  useEffect(() => setLastSnapDocList([]), [pageLimit]);

  const { data: orders, error, isLoading, lastSnapDoc } = useAllOrders({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDocList.at(-1),
  });

  const handleNextPage = () => setLastSnapDocList([...lastSnapDocList, lastSnapDoc]);
  const handlePrePage = () => setLastSnapDocList(lastSnapDocList.slice(0, -1));

  if (isLoading) {
    return (
      <div className="flex justify-center py-48">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-deepPink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl w-full overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="px-3 py-2 border-y border-l rounded-l-lg text-center">SN</th>
            <th className="px-3 py-2 border-y text-left">Customer</th>
            <th className="px-3 py-2 border-y text-left">Total Price</th>
            <th className="px-3 py-2 border-y text-left">Total Products</th>
            <th className="px-3 py-2 border-y text-left">Payment Mode</th>
            <th className="px-3 py-2 border-y text-left">Status</th>
            <th className="px-3 py-2 border-y border-r rounded-r-lg text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((item, index) => (
            <Row key={item?.id} item={item} index={index + lastSnapDocList.length * pageLimit} />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-3 text-sm">
        <button
          onClick={handlePrePage}
          disabled={isLoading || lastSnapDocList.length === 0}
          className="px-4 py-1 rounded-lg border bg-white hover:bg-lightPink-100 disabled:opacity-50"
        >
          Previous
        </button>
        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(Number(e.target.value))}
          className="px-3 py-1 rounded-lg border"
        >
          {[3,5,10,20,100].map((num) => <option key={num} value={num}>{num} Items</option>)}
        </select>
        <button
          onClick={handleNextPage}
          disabled={isLoading || orders?.length === 0}
          className="px-4 py-1 rounded-lg border bg-white hover:bg-lightPink-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Row({ item, index }) {
  const { data: user } = useUser({ uid: item?.uid });
  const totalAmount = item?.checkout?.line_items?.reduce((prev, curr) => prev + (curr?.price_data?.unit_amount / 100) * curr?.quantity, 0);

  return (
    <tr>
      <td className="px-3 py-2 border-y border-l rounded-l-lg text-center">{index + 1}</td>
      <td className="px-3 py-2 border-y whitespace-nowrap">
        <div className="flex items-center gap-2">
          <img src={user?.photoURL || "/default-avatar.png"} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="font-semibold">{user?.displayName}</span>
            <span className="text-xs text-gray-600">{user?.email}</span>
          </div>
        </div>
      </td>
      <td className="px-3 py-2 border-y whitespace-nowrap">₹ {totalAmount}</td>
      <td className="px-3 py-2 border-y">{item?.checkout?.line_items?.length}</td>
      <td className="px-3 py-2 border-y">
        <span className="bg-lightBlue-100 text-lightBlue-600 text-xs rounded-lg px-2 py-1 uppercase">{item?.paymentMode}</span>
      </td>
      <td className="px-3 py-2 border-y">
        <span className="bg-green-100 text-green-600 text-xs rounded-lg px-2 py-1 uppercase">{item?.status ?? "pending"}</span>
      </td>
      <td className="px-3 py-2 border-y border-r rounded-r-lg text-center">
        <Link href={`/admin/orders/${item?.id}`}>
          <button className="px-3 py-1 bg-deepPink-500 text-white text-xs rounded-lg hover:bg-salmonPink-500 transition-colors">View</button>
        </Link>
      </td>
    </tr>
  );
}
