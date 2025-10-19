"use client";

import { useProducts } from "@/lib/firestore/products/read";
import { deleteProduct } from "@/lib/firestore/products/write";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const router = useRouter();

  useEffect(() => setLastSnapDocList([]), [pageLimit]);

  const { data: products, error, isLoading, lastSnapDoc } = useProducts({
    pageLimit,
    lastSnapDoc: lastSnapDocList?.length === 0 ? null : lastSnapDoc.at(-1),
  });

  const handleNextPage = () => setLastSnapDocList([...lastSnapDocList, lastSnapDoc]);
  const handlePrePage = () => setLastSnapDocList(lastSnapDocList.slice(0, -1));

  if (isLoading) {
    return (
      <div className="flex justify-center py-48">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="flex-1 flex flex-col gap-4 md:px-0 px-2 rounded-xl w-full overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead className="bg-white sticky top-0 shadow-md z-10">
          <tr>
            {["SN", "Image", "Title", "Price", "Stock", "Orders", "Status", "Actions"].map((header) => (
              <th
                key={header}
                className="px-3 py-3 font-semibold text-gray-700 text-left uppercase tracking-wider select-none"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products?.map((item, index) => (
            <Row
              key={item?.id}
              item={item}
              index={index + lastSnapDocList.length * pageLimit}
              router={router}
            />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm gap-2 flex-wrap">
        <button
          onClick={handlePrePage}
          disabled={lastSnapDocList.length === 0}
          className="px-4 py-1 rounded-lg border bg-white hover:bg-lightPink-100 disabled:opacity-50 transition-all"
        >
          Previous
        </button>
        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(Number(e.target.value))}
          className="px-3 py-1 rounded-lg border bg-white"
        >
          {[3, 5, 10, 20, 100].map((num) => (
            <option key={num} value={num}>
              {num} Items
            </option>
          ))}
        </select>
        <button
          onClick={handleNextPage}
          disabled={products?.length === 0}
          className="px-4 py-1 rounded-lg border bg-white hover:bg-lightPink-100 disabled:opacity-50 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Row({ item, index, router }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    setIsDeleting(true);
    try {
      await deleteProduct({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => router.push(`/admin/products/form?id=${item?.id}`);

  return (
    <tr className="bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow transform hover:scale-[1.01]">
      <td className="px-3 py-2 text-center text-gray-700 font-medium">{index + 1}</td>
      <td className="px-3 py-2 text-center">
        <img
          className="h-12 w-12 object-cover rounded-lg mx-auto"
          src={item?.featureImageURL}
          alt={item?.title}
        />
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-gray-900 font-medium flex items-center gap-2">
        {item?.title}
        {item?.isFeatured && (
          <span className="ml-2 bg-gradient-to-tr from-blue-500 to-indigo-400 text-white text-[10px] rounded-full px-3 py-1 font-bold shadow-sm">
            Featured
          </span>
        )}
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-gray-700">
        {item?.salePrice < item?.price && (
          <span className="text-xs text-gray-400 line-through mr-1">₹ {item?.price}</span>
        )}
        <span className="font-semibold">₹ {item?.salePrice}</span>
      </td>
      <td className="px-3 py-2 text-center text-gray-700 font-medium">{item?.stock}</td>
      <td className="px-3 py-2 text-center text-gray-700 font-medium">{item?.orders ?? 0}</td>
      <td className="px-3 py-2 text-center">
        <span
          className={`px-2 py-1 text-xs font-bold rounded-md ${
            item?.stock - (item?.orders ?? 0) > 0
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {item?.stock - (item?.orders ?? 0) > 0 ? "Available" : "Out Of Stock"}
        </span>
      </td>
      <td className="px-3 py-2 text-center">
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleUpdate}
            disabled={isDeleting}
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
