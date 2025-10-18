"use client";

import { getAdmin } from "@/lib/firestore/admins/read_server";
import { createNewAdmin, updateAdmin } from "@/lib/firestore/admins/write";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Form() {
  const [data, setData] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchData = async () => {
    try {
      const res = await getAdmin({ id });
      if (!res) {
        toast.error("Admin Not Found!");
      } else {
        setData(res);
      }
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
      await createNewAdmin({ data, image });
      toast.success("Successfully Created");
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
      await updateAdmin({ data, image });
      toast.success("Successfully Updated");
      setData(null);
      setImage(null);
      router.push(`/admin/admins`);
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center p-4 md:p-8">
      <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-lg w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl font-bold text-deepPink-500">
          {id ? "Update" : "Create"} Admin
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (id) handleUpdate();
            else handleCreate();
          }}
          className="flex flex-col gap-4"
        >
          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-600 text-sm font-medium">
              Image <span className="text-red-500">*</span>
            </label>
            {image && (
              <div className="flex justify-center items-center p-2">
                <img
                  className="h-28 w-28 rounded-xl object-cover border-2 border-lightPink-300 shadow-sm"
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files.length > 0 && setImage(e.target.files[0])}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-deepPink-300 transition-colors cursor-pointer"
            />
          </div>

          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              value={data?.name ?? ""}
              onChange={(e) => handleData("name", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightBlue-300 transition-all"
              required
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              value={data?.email ?? ""}
              onChange={(e) => handleData("email", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightBlue-300 transition-all"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all
              ${
                isLoading
                  ? "bg-pink-300 cursor-not-allowed animate-pulse"
                  : "bg-deepPink-500 hover:bg-salmonPink-500 active:scale-95 shadow-md"
              }`}
          >
            {isLoading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <>{id ? "Update" : "Create"}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
