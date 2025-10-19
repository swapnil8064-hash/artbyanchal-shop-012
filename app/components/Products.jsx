"use client";

import Link from "next/link";
import { Suspense } from "react";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";
import MyRating from "./MyRating";

// StarRating replaced by MyRating for consistent color
export default function ProductsGridView({ products }) {
  return (
    <section className="w-full flex justify-center py-5 px-2 md:px-5">
      <div className="flex flex-col gap-5 max-w-[1200px] w-full">
        <h1 className="text-center font-bold text-xl md:text-2xl text-pink-500">
          Our Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products?.map((item) => (
            <ProductCard product={item} key={item?.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product }) {
  return (
    <div className="flex flex-col gap-3 border rounded-xl p-3 md:p-4 hover:shadow-lg transition-shadow duration-300 bg-white">
      {/* Product Image */}
      <div className="relative w-full">
        <Link href={`/products/${product?.id}`}>
          <img
            src={product?.featureImageURL}
            alt={product?.title}
            className="w-full h-48 md:h-56 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
          />
        </Link>
        <div className="absolute top-2 right-2">
          <FavoriteButton productId={product?.id} />
        </div>
      </div>

      {/* Product Title */}
      <Link href={`/products/${product?.id}`}>
        <h2 className="text-sm md:text-base font-semibold text-black line-clamp-2 hover:text-pink-500 transition-colors duration-200">
          {product?.title}
        </h2>
      </Link>

      {/* Price */}
      <div>
        <span className="text-green-600 font-semibold text-sm md:text-base">
          ₹{product?.salePrice}{" "}
        </span>
        <span className="line-through text-gray-400 text-xs md:text-sm">
          ₹{product?.price}
        </span>
      </div>

      {/* Short Description */}
      <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
        {product?.shortDescription}
      </p>

      {/* Rating */}
      <Suspense fallback={<p className="text-xs text-gray-400">Loading...</p>}>
        <RatingReview product={product} />
      </Suspense>

      {/* Stock */}
      {product?.stock <= (product?.orders ?? 0) && (
        <div className="text-red-500 text-xs font-semibold mt-1">Out of Stock</div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-2 items-center w-full flex-wrap">
        <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
          <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors duration-200">
            Buy Now
          </button>
        </Link>
        <AddToCartButton productId={product?.id} type="large" />
      </div>
    </div>
  );
}

// Rating Review
async function RatingReview({ product }) {
  const counts = await getProductReviewCounts({ productId: product?.id });
  return (
    <div className="flex items-center gap-2 mt-1">
      <MyRating value={counts?.averageRating ?? 0} />
      <span className="text-xs text-gray-500">
        {counts?.averageRating?.toFixed(1)} ({counts?.totalReviews})
      </span>
    </div>
  );
}
