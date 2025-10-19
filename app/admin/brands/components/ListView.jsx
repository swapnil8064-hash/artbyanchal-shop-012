"use client";

import { useBrands } from "@/lib/firestore/brands/read";
import { deleteBrand } from "@/lib/firestore/brands/write";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BrandListView() {
  const { data: brands, error, isLoading } = useBrands();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 px-4 md:px-6 py-6 md:py-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-pink-600 text-center mb-4">
        Brands
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-200">
        <table className="min-w-full bg-white rounded-xl border-separate border-spacing-y-4">
          <thead className="bg-pink-100 sticky top-0">
            <tr>
              <th className="font-semibold px-3 py-2 border-l rounded-l-lg text-center">SN</th>
              <th className="font-semibold px-3 py-2 text-center">Image</th>
              <th className="font-semibold px-3 py-2 text-left">Name</th>
              <th className="font-semibold px-3 py-2 border-r rounded-r-lg text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands?.map((item, index) => (
              <BrandRow key={item?.id} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BrandRow({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    setIsDeleting(true);
    try {
      await deleteBrand({ id: item?.id });
      toast.success("Brand deleted successfully!");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/brands?id=${item?.id}`);
  };

  return (
    <tr className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:bg-pink-50">
      <td className="px-3 py-2 border-l rounded-l-lg text-center">{index + 1}</td>
      <td className="px-3 py-2 text-center">
        <div className="flex justify-center">
          <img
            className="h-12 w-12 md:h-16 md:w-16 object-cover rounded-lg border-2 border-pink-200 shadow-sm"
            src={item?.imageURL || "/default-avatar.png"}
            alt={item?.name}
          />
        </div>
      </td>
      <td className="px-3 py-2">
        <span className="font-medium text-pink-600">{item?.name}</span>
      </td>
      <td className="px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleUpdate}
            disabled={isDeleting}
            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 active:scale-95 transition-transform p-2 rounded-lg text-white flex items-center justify-center shadow-md"
          >
            <Edit2 size={16} />
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 active:scale-95 transition-transform p-2 rounded-lg text-white flex items-center justify-center shadow-md relative"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
