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
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
      <div className="flex flex-col gap-4">
        {reviews?.map((item) => (
          <ReviewCard key={item?.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ item }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: product } = useProduct({ productId: item?.productId });

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    setIsLoading(true);
    try {
      await deleteReview({ uid: item?.uid, productId: item?.productId });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-3 bg-white border p-5 rounded-xl shadow-sm">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
          {item?.photoURL ? (
            <img src={item.photoURL} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-gray-500 flex items-center justify-center h-full w-full">
              {item?.displayName?.[0] ?? "U"}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold">{item?.displayName}</h1>

            {/* Rating */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < item?.rating ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
            </div>

            <Link href={`/products/${item?.productId}`}>
              <h1 className="text-xs text-blue-500 hover:underline">{product?.title}</h1>
            </Link>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className={`p-2 rounded-lg transition ${
              isLoading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            <Trash2 size={14} />
          </button>
        </div>

        <p className="text-sm text-gray-700 pt-1">{item?.message}</p>
      </div>
    </div>
  );
}
