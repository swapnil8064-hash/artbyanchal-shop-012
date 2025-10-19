"use client";

import { useAdmins } from "@/lib/firestore/admins/read";
import { deleteAdmin } from "@/lib/firestore/admins/write";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminListView() {
  const { data: admins, error, isLoading } = useAdmins();
  const router = useRouter();

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-lightPink-300 border-t-deepPink-500 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto scrollbar-thin scrollbar-thumb-deepPink-500 scrollbar-track-gray-200">
      <h1 className="text-3xl font-bold text-deepPink-600 mb-6">Admins</h1>
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full bg-white rounded-xl">
          <thead className="bg-deepPink-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-center font-medium">#</th>
              <th className="px-4 py-3 text-center font-medium">Image</th>
              <th className="px-4 py-3 text-left font-medium">Name & Email</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins?.map((item, index) => (
              <AdminRow key={item?.id || index} item={item} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminRow({ item, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    setIsDeleting(true);
    try {
      await deleteAdmin({ id: item?.id });
      toast.success("Admin Deleted Successfully!");
    } catch (err) {
      toast.error(err?.message || "Delete failed!");
    }
    setIsDeleting(false);
  };

  const handleUpdate = () => router.push(`/admin/admins?id=${item?.id}`);

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-4 py-3 text-center">{index + 1}</td>
      <td className="px-4 py-3 text-center">
        <img
          src={item?.imageURL || "/default-avatar.png"}
          alt={item?.name || "Admin"}
          className="h-12 w-12 object-cover rounded-xl border-2 border-deepPink-300 shadow-sm mx-auto"
        />
      </td>
      <td className="px-4 py-3">
        <h2 className="font-semibold text-deepPink-600">{item?.name || "No Name"}</h2>
        <p className="text-sm text-gray-500">{item?.email || "No Email"}</p>
      </td>
      <td className="px-4 py-3 text-center flex gap-2 justify-center">
        <button
          onClick={handleUpdate}
          disabled={isDeleting}
          className="bg-gradient-to-r from-lightBlue-400 to-lightBlue-500 hover:from-lightBlue-500 hover:to-lightBlue-400 text-white p-2 rounded-lg transition shadow-md"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 text-white p-2 rounded-lg transition relative shadow-md"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </td>
    </tr>
  );
}
