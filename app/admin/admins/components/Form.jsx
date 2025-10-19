"use client";

import { useEffect, useState } from "react";
import { getAdmin } from "@/lib/firestore/admins/read_server";
import { createNewAdmin, updateAdmin } from "@/lib/firestore/admins/write";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // this is email/id from URL

  const [data, setData] = useState({
    id: "", // will store email/id
    name: "",
    email: "",
    imageURL: "",
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing admin if updating
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getAdmin({ id });
        if (!res) {
          toast.error("Admin Not Found!");
          return;
        }
        // Add `id` to data for updateAdmin
        setData({ ...res, id });
      } catch (err) {
        toast.error(err?.message);
      }
    };

    fetchData();
  }, [id]);

  const handleData = (key, value) => {
    setData((prev) => ({ ...(prev ?? {}), [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (id) {
        // Update admin
        await updateAdmin({ data, image });
        toast.success("Admin Updated Successfully!");
        router.push("/admin/admins");
      } else {
        // Create new admin
        await createNewAdmin({ data, image });
        toast.success("Admin Created Successfully!");
        setData({ id: "", name: "", email: "", imageURL: "" });
        setImage(null);
      }
    } catch (err) {
      toast.error(err?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center p-4 md:p-10 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-10 flex flex-col gap-6 overflow-y-auto scrollbar-thin scrollbar-thumb-deepPink-500 scrollbar-track-gray-200">
        <h1 className="text-3xl font-bold text-deepPink-600">
          {id ? "Update" : "Create"} Admin
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-5"
        >
          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">Profile Image</label>
            {(image || data.imageURL) && (
              <div className="flex justify-center p-2">
                <img
                  src={image ? URL.createObjectURL(image) : data.imageURL}
                  alt="Preview"
                  className="h-28 w-28 rounded-xl object-cover border-2 border-deepPink-300 shadow-md"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files.length > 0 && setImage(e.target.files[0])
              }
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-deepPink-300 cursor-pointer transition"
            />
          </div>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={data?.name ?? ""}
              onChange={(e) => handleData("name", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightBlue-300 transition"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={data?.email ?? ""}
              onChange={(e) => handleData("email", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightBlue-300 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold text-white text-lg transition-all
              ${
                isLoading
                  ? "bg-pink-300 cursor-not-allowed animate-pulse"
                  : "bg-gradient-to-r from-deepPink-500 to-pink-400 hover:from-pink-400 hover:to-deepPink-500 active:scale-95 shadow-lg"
              }`}
          >
            {isLoading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <>{id ? "Update Admin" : "Create Admin"}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
