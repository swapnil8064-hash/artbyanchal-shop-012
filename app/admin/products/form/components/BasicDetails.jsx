"use client";

import { useBrands } from "@/lib/firestore/brands/read";
import { useCategories } from "@/lib/firestore/categories/read";

export default function BasicDetails({ data, handleData }) {
  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  return (
    <section className="flex-1 flex flex-col gap-4 bg-white rounded-xl p-5 border shadow-sm">
      <h1 className="font-semibold text-lg text-gray-800">Basic Details</h1>

      {/* Product Name */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs font-medium" htmlFor="product-title">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Title"
          id="product-title"
          name="product-title"
          value={data?.title ?? ""}
          onChange={(e) => handleData("title", e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
          required
        />
      </div>

      {/* Short Description */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs font-medium" htmlFor="product-short-decription">
          Short Description <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Short Description"
          id="product-short-decription"
          name="product-short-decription"
          value={data?.shortDescription ?? ""}
          onChange={(e) => handleData("shortDescription", e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
          required
        />
      </div>

      {/* Brand */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs font-medium" htmlFor="product-brand">
          Brand <span className="text-red-500">*</span>
        </label>
        <select
          id="product-brand"
          name="product-brand"
          value={data?.brandId ?? ""}
          onChange={(e) => handleData("brandId", e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
          required
        >
          <option value="">Select Brand</option>
          {brands?.map((item) => (
            <option value={item?.id} key={item?.id}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs font-medium" htmlFor="product-category">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="product-category"
          name="product-category"
          value={data?.categoryId ?? ""}
          onChange={(e) => handleData("categoryId", e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
          required
        >
          <option value="">Select Category</option>
          {categories?.map((item) => (
            <option value={item?.id} key={item?.id}>
              {item?.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stock */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs font-medium" htmlFor="product-stock">
          Stock <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          placeholder="Enter Stock"
          id="product-stock"
          name="product-stock"
          value={data?.stock ?? ""}
          onChange={(e) => handleData("stock", e.target.valueAsNumber)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
          required
        />
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs font-medium" htmlFor="product-price">
          Price <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          placeholder="Enter Price"
          id="product-price"
          name="product-price"
          value={data?.price ?? ""}
          onChange={(e) => handleData("price", e.target.valueAsNumber)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
          required
        />
      </div>

      {/* Sale Price */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs font-medium" htmlFor="product-sale-price">
          Sale Price <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          placeholder="Enter Sale Price"
          id="product-sale-price"
          name="product-sale-price"
          value={data?.salePrice ?? ""}
          onChange={(e) => handleData("salePrice", e.target.valueAsNumber)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
          required
        />
      </div>

      {/* Featured */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs font-medium" htmlFor="product-is-featured-product">
          Is Featured Product <span className="text-red-500">*</span>
        </label>
        <select
          id="product-is-featured-product"
          name="product-is-featured-product"
          value={data?.isFeatured ? "yes" : "no"}
          onChange={(e) => handleData("isFeatured", e.target.value === "yes")}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
          required
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>
    </section>
  );
}
