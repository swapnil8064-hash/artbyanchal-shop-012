"use client";

import { getCategory } from "@/lib/firestore/categories/read_server";
import { createNewCategory, updateCategory } from "@/lib/firestore/categories/write";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CategoryForm() {
  const [data, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => { if (id) fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const res = await getCategory({ id });
      if (!res) toast.error("Category Not Found!");
      else setData(res);
    } catch (error) { toast.error(error?.message); }
  };

  const handleData = (key, value) => setData(prev => ({ ...(prev ?? {}), [key]: value }));

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewCategory({ data, image });
      toast.success("Successfully Created");
      setData(null); setImage(null);
    } catch (error) { toast.error(error?.message); }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateCategory({ data, image });
      toast.success("Successfully Updated");
      router.push(`/admin/categories`);
    } catch (error) { toast.error(error?.message); }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen p-4 md:p-10">
      <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-deepPink-600 text-center">
          {id ? "Update" : "Create"} Category
        </h1>

        <form onSubmit={e => { e.preventDefault(); id ? handleUpdate() : handleCreate(); }} className="flex flex-col gap-5">
          {/* Image */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Image <span className="text-red-500">*</span></label>
            {image && (
              <div className="flex justify-center">
                <img className="h-28 w-28 rounded-xl object-cover border-2 border-deepPink-300 shadow-md" src={URL.createObjectURL(image)} alt="Preview" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={e => e.target.files.length > 0 && setImage(e.target.files[0])} className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-deepPink-300 cursor-pointer transition-colors" />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter Name" value={data?.name ?? ""} onChange={e => handleData("name", e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightBlue-300 transition-all" />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">Slug <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Enter Slug" value={data?.slug ?? ""} onChange={e => handleData("slug", e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightBlue-300 transition-all" />
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading} className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${isLoading ? "bg-pink-300 cursor-not-allowed animate-pulse" : "bg-gradient-to-r from-deepPink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 active:scale-95 shadow-lg"}`}>
            {isLoading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : id ? "Update Category" : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
