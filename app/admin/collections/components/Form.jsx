"use client";

import { useEffect, useState } from "react";
import { getCollection } from "@/lib/firestore/collections/read_server";
import { createNewCollection, updateCollection } from "@/lib/firestore/collections/write";
import { useProducts, useProduct } from "@/lib/firestore/products/read";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function CollectionForm() {
  const [data, setData] = useState({ products: [] });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: products } = useProducts({ pageLimit: 2000 });
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // Fetch collection data if updating
  useEffect(() => {
    if (!id) return;
    getCollection({ id })
      .then(res => {
        if (!res) toast.error("Collection Not Found!");
        else setData({ ...res, products: res.products || [] });
      })
      .catch(err => toast.error(err?.message));
  }, [id]);

  // Handle field updates
  const handleData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // Create collection
  const handleCreate = async () => {
    if (!data.title || !data.subTitle) return toast.error("Title and Sub Title are required");
    if (!image) return toast.error("Please select an image");
    if (!data.products.length) return toast.error("Please select at least one product");

    setIsLoading(true);
    try {
      await createNewCollection({ data, image });
      toast.success("Collection Created Successfully");
      setData({ products: [] });
      setImage(null);
    } catch (err) {
      toast.error(err?.message);
    }
    setIsLoading(false);
  };

  // Update collection
  const handleUpdate = async () => {
    if (!data.title || !data.subTitle) return toast.error("Title and Sub Title are required");
    setIsLoading(true);
    try {
      await updateCollection({ data, image });
      toast.success("Collection Updated Successfully");
      router.push("/admin/collections");
    } catch (err) {
      toast.error(err?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen p-4 md:p-10">
      <div className="flex flex-col gap-6 bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-10">
        <h1 className="text-3xl font-bold text-deepPink-600 text-center">
          {id ? "Update" : "Create"} Collection
        </h1>

        <form
          onSubmit={e => { e.preventDefault(); id ? handleUpdate() : handleCreate(); }}
          className="flex flex-col gap-5"
        >
          {/* Image */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">
              Image <span className="text-red-500">*</span>
            </label>
            {(image || data.imageURL) && (
              <img
                src={image ? URL.createObjectURL(image) : data.imageURL}
                alt="Preview"
                className="h-28 w-28 rounded-xl object-cover border-2 border-deepPink-300 shadow-md self-center"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={e => e.target.files.length > 0 && setImage(e.target.files[0])}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-deepPink-300 transition-colors cursor-pointer"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Title"
              value={data?.title ?? ""}
              onChange={e => handleData("title", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightBlue-300 transition-all"
            />
          </div>

          {/* Sub Title */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">
              Sub Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Sub Title"
              value={data?.subTitle ?? ""}
              onChange={e => handleData("subTitle", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightBlue-300 transition-all"
            />
          </div>

          {/* Selected Products */}
          <div className="flex flex-wrap gap-2">
            {(data?.products || []).map(productId => (
              <ProductCard key={productId} productId={productId} setData={setData} />
            ))}
          </div>

          {/* Product Select */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">
              Select Product <span className="text-red-500">*</span>
            </label>
            <select
              onChange={e => {
                const value = e.target.value;
                if (!value) return;
                setData(prev => ({
                  ...prev,
                  products: [...(prev.products || []), value],
                }));
              }}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lightBlue-300 transition-all"
            >
              <option value="">Select Product</option>
              {products?.map(item => (
                <option key={item.id} disabled={data?.products?.includes(item.id)} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
              isLoading
                ? "bg-pink-300 cursor-not-allowed animate-pulse"
                : "bg-gradient-to-r from-deepPink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 active:scale-95 shadow-lg"
            }`}
          >
            {isLoading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : id ? "Update Collection" : "Create Collection"}
          </button>
        </form>
      </div>
    </div>
  );
}

function ProductCard({ productId, setData }) {
  const { data: product } = useProduct({ productId });

  if (!product) return null;

  return (
    <div className="flex items-center gap-2 bg-lightBlue-200 text-black px-3 py-1 rounded-full text-sm shadow-sm">
      <span>{product.title}</span>
      <button
        onClick={e => {
          e.preventDefault();
          setData(prev => ({
            ...prev,
            products: (prev.products || []).filter(id => id !== productId),
          }));
        }}
        className="hover:bg-red-500 hover:text-white p-1 rounded-full transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
