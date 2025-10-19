"use client";

import { useCollections } from "@/lib/firestore/collections/read";
import { deleteCollection } from "@/lib/firestore/collections/write";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CollectionListView() {
  const { data: collections, error, isLoading } = useCollections();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-lightPink-300 border-t-deepPink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-4 md:pr-5 md:px-0 px-4">
      <h1 className="text-2xl font-bold text-deepPink-600 mb-4">Collections</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">SN</th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-center">Image</th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-left">Title</th>
              <th className="font-semibold border-y bg-white px-3 py-2 text-left">Products</th>
              <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections?.map((item, index) => (
              <CollectionRow key={item.id} item={item} index={index} router={router} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CollectionRow({ item, index, router }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    setIsDeleting(true);
    try {
      await deleteCollection({ id: item.id });
      toast.success("Collection deleted successfully");
    } catch (err) {
      toast.error(err?.message);
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => {
    router.push(`/admin/collections?id=${item.id}`);
  };

  return (
    <tr className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
      <td className="border-y px-3 py-2 border-l rounded-l-lg text-center">{index + 1}</td>
      <td className="border-y px-3 py-2 text-center">
        <img
          className="h-10 w-10 object-cover rounded-lg border-2 border-lightPink-300 shadow-sm mx-auto"
          src={item.imageURL || "/default-avatar.png"}
          alt={item.title}
        />
      </td>
      <td className="border-y px-3 py-2 font-medium text-deepPink-600">{item.title}</td>
      <td className="border-y px-3 py-2">{item.products?.length || 0}</td>
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
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
