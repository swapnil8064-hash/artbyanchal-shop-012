"use client";

import { getBrand } from "@/lib/firestore/brands/read_server";
import { createNewBrand, updateBrand } from "@/lib/firestore/brands/write";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function BrandForm() {
  const [data, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getBrand({ id });
      if (!res) toast.error("Brand Not Found!");
      else setData(res);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleData = (key, value) => {
    setData((prev) => ({ ...(prev ?? {}), [key]: value }));
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      await createNewBrand({ data, image });
      toast.success("Brand Created Successfully!");
      setData(null);
      setImage(null);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateBrand({ data, image });
      toast.success("Brand Updated Successfully!");
      setData(null);
      setImage(null);
      router.push(`/admin/brands`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center px-4 md:px-6 py-8 md:py-12 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-pink-600 text-center">
          {id ? "Update" : "Create"} Brand
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            id ? handleUpdate() : handleCreate();
          }}
          className="flex flex-col gap-5"
        >
          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-sm font-medium">
              Brand Image <span className="text-red-500">*</span>
            </label>
            {image && (
              <div className="flex justify-center">
                <img
                  className="h-28 w-28 md:h-32 md:w-32 rounded-xl object-cover border-2 border-pink-300 shadow-lg"
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files.length > 0 && setImage(e.target.files[0])
              }
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 cursor-pointer transition-colors"
            />
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-medium">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Brand Name"
              value={data?.name ?? ""}
              onChange={(e) => handleData("name", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold text-white text-sm md:text-base transition-all ${
              isLoading
                ? "bg-pink-300 cursor-not-allowed animate-pulse"
                : "bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 active:scale-95 shadow-lg"
            }`}
          >
            {isLoading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <span>{id ? "Update Brand" : "Create Brand"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
