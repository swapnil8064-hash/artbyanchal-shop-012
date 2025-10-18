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
        <div className="w-12 h-12 border-4 border-gray-300 border-t-deepPink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl w-full overflow-x-auto">
      <table className="border-separate border-spacing-y-3 min-w-full">
        <thead>
          <tr>
            {["SN","Image","Title","Price","Stock","Orders","Status","Actions"].map((header) => (
              <th key={header} className="px-3 py-2 font-semibold border-y bg-white border-l rounded-l-lg text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products?.map((item, index) => (
            <Row key={item?.id} item={item} index={index + lastSnapDocList.length * pageLimit} router={router} />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-3 text-sm">
        <button
          onClick={handlePrePage}
          disabled={lastSnapDocList.length === 0}
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
          disabled={products?.length === 0}
          className="px-4 py-1 rounded-lg border bg-white hover:bg-lightPink-100 disabled:opacity-50"
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
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">{index + 1}</td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <img className="h-10 w-10 object-cover mx-auto" src={item?.featureImageURL} alt="" />
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        {item?.title}{" "}
        {item?.isFeatured && (
          <span className="ml-2 bg-gradient-to-tr from-blue-500 to-indigo-400 text-white text-[10px] rounded-full px-3 py-1">
            Featured
          </span>
        )}
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        {item?.salePrice < item?.price && (
          <span className="text-xs text-gray-500 line-through">₹ {item?.price}</span>
        )} ₹ {item?.salePrice}
      </td>
      <td className="border-y bg-white px-3 py-2">{item?.stock}</td>
      <td className="border-y bg-white px-3 py-2">{item?.orders ?? 0}</td>
      <td className="border-y bg-white px-3 py-2">
        <span className={`px-2 py-1 text-xs font-bold rounded-md ${
          item?.stock - (item?.orders ?? 0) > 0 ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
        }`}>
          {item?.stock - (item?.orders ?? 0) > 0 ? "Available" : "Out Of Stock"}
        </span>
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 items-center justify-center">
          <button
            onClick={handleUpdate}
            disabled={isDeleting}
            className="p-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
