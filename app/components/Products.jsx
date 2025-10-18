"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Handbag, Heart } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";
import { getProductReviewCounts } from "@/lib/firestore/products/count/read";

// Manual star rating component
function StarRating({ value }) {
  const fullStars = Math.floor(value);
  const halfStar = value - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-[#FF1493]">★</span>
      ))}
      {halfStar && <span className="text-[#FF1493]">☆</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      ))}
    </div>
  );
}

export default function ProductsGridView({ products }) {
  return (
    <section className="w-full flex justify-center py-5 px-2 md:px-5">
      <div className="flex flex-col gap-5 max-w-[1200px] w-full">
        <h1 className="text-center font-bold text-xl md:text-2xl text-black">
          Products
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
      <div className="relative w-full">
        <img
          src={product?.featureImageURL}
          alt={product?.title}
          className="w-full h-48 md:h-56 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <FavoriteButton productId={product?.id} />
        </div>
      </div>

      <Link href={`/products/${product?.id}`}>
        <h2 className="text-sm md:text-base font-semibold text-black line-clamp-2 hover:text-[#FF1493] transition-colors duration-200">
          {product?.title}
        </h2>
      </Link>

      <div>
        <span className="text-green-600 font-semibold text-sm md:text-base">
          ₹{product?.salePrice}{" "}
        </span>
        <span className="line-through text-gray-400 text-xs md:text-sm">
          ₹{product?.price}
        </span>
      </div>

      <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
        {product?.shortDescription}
      </p>

      <Suspense fallback={<p className="text-xs text-gray-400">Loading...</p>}>
        <RatingReview product={product} />
      </Suspense>

      {product?.stock <= (product?.orders ?? 0) && (
        <div className="text-red-500 text-xs font-semibold mt-1">Out of Stock</div>
      )}

      <div className="flex gap-2 mt-2 items-center w-full">
        <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
          <button className="flex-1 bg-[#FF1493] hover:bg-[#FF69B4] text-white py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors duration-200">
            Buy Now
          </button>
        </Link>
        <AddToCartButton productId={product?.id} type="large" />
      </div>
    </div>
  );
}

async function RatingReview({ product }) {
  const counts = await getProductReviewCounts({ productId: product?.id });
  return (
    <div className="flex items-center gap-2 mt-1">
      <StarRating value={counts?.averageRating ?? 0} />
      <span className="text-xs text-gray-500">
        {counts?.averageRating?.toFixed(1)} ({counts?.totalReviews})
      </span>
    </div>
  );
}
