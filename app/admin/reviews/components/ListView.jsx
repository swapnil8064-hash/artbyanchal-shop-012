"use client";

import { useProduct } from "@/lib/firestore/products/read";
import { useAllReview } from "@/lib/firestore/reviews/read";
import { deleteReview } from "@/lib/firestore/reviews/write";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const { data: reviews } = useAllReview();

  return (
    <div className="flex-1 flex flex-col gap-4 md:px-0 px-5 rounded-xl">
      {reviews?.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No reviews found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews?.map((item) => (
            <ReviewCard key={item?.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewCard({ item }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: product } = useProduct({ productId: item?.productId });

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setIsLoading(true);
    try {
      await deleteReview({ uid: item?.uid, productId: item?.productId });
      toast.success("Review successfully deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-white border rounded-xl p-5 shadow-md transition hover:shadow-lg">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {item?.photoURL ? (
            <img
              src={item.photoURL}
              alt={item.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400 font-semibold">
              {item?.displayName?.[0] ?? "U"}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-gray-800">{item?.displayName}</h2>

            {/* Rating */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < item?.rating ? "text-yellow-400" : "text-gray-300"}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Product Link */}
            <Link href={`/products/${item?.productId}`}>
              <span className="text-xs text-blue-500 hover:underline">
                {product?.title ?? "Loading..."}
              </span>
            </Link>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <p className="text-gray-700 text-sm">{item?.message}</p>
      </div>
    </div>
  );
}
