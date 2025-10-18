"use client";

import { useCategories } from "@/lib/firestore/categories/read";
import { deleteCategory } from "@/lib/firestore/categories/write";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CategoryListView() {
  const { data: categories, error, isLoading } = useCategories();

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="w-12 h-12 border-4 border-lightPink-300 border-t-deepPink-500 rounded-full animate-spin"></div>
    </div>
  );
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="flex-1 flex flex-col gap-4 md:pr-5 md:px-0 px-4">
      <h1 className="text-2xl font-bold text-deepPink-600 mb-4">Categories</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">SN</th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-center">Image</th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-left">Name</th>
              <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((item, index) => (
              <CategoryRow key={item?.id} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryRow({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    setIsDeleting(true);
    try {
      await deleteCategory({ id: item?.id });
      toast.success("Successfully Deleted");
    } catch (error) { toast.error(error?.message); }
    setIsDeleting(false);
  };

  const handleUpdate = () => router.push(`/admin/categories?id=${item?.id}`);

  return (
    <tr className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
      <td className="border-y px-3 py-2 border-l rounded-l-lg text-center">{index + 1}</td>
      <td className="border-y px-3 py-2 text-center">
        <div className="flex justify-center">
          <img className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-lg border-2 border-lightPink-300 shadow-sm" src={item?.imageURL || "/default-avatar.png"} alt={item?.name} />
        </div>
      </td>
      <td className="border-y px-3 py-2 font-medium text-deepPink-600">{item?.name}</td>
      <td className="border-y px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleUpdate}
            disabled={isDeleting}
            className="bg-lightBlue-300 hover:bg-lightBlue-400 active:scale-95 transition-transform p-2 rounded-lg text-white flex items-center justify-center"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-deepPink-500 hover:bg-salmonPink-500 active:scale-95 transition-transform p-2 rounded-lg text-white flex items-center justify-center relative"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : <Trash2 size={16} />}
          </button>
        </div>
      </td>
    </tr>
  );
}
