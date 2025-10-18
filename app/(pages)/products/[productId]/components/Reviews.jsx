"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/lib/firestore/reviews/read";
import { deleteReview } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { Trash2, Star } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Reviews({ productId }) {
  const { data } = useReviews({ productId });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    setIsLoading(true);
    try {
      if (!user) throw new Error("Please log in first");
      await deleteReview({ uid: user.uid, productId });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  // Helper function to render stars manually
  const renderStars = (rating) => {
    const totalStars = 5;
    return (
      <div className="flex items-center mt-1">
        {[...Array(totalStars)].map((_, index) => (
          <Star
            key={index}
            size={18}
            className={`${
              index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 rounded-2xl border border-pink-200 w-full bg-white shadow-lg">
      <h1 className="text-xl md:text-2xl font-bold text-pink-600">Reviews</h1>
      <div className="flex flex-col gap-4">
        {data?.map((item) => (
          <div
            key={item?.id || item?.uid}
            className="flex gap-4 items-start bg-pink-50/50 rounded-xl p-3 md:p-4"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={item?.photoURL || "/default-avatar.png"}
                alt={item?.displayName || "User"}
                className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover border-2 border-pink-200"
              />
            </div>

            {/* Review Content */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-pink-700">
                    {item?.displayName}
                  </h2>
                  {renderStars(item?.rating || 0)}
                </div>

                {/* Delete Button */}
                {user?.uid === item?.uid && (
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className={`ml-2 p-2 rounded-full transition
                      ${
                        isLoading
                          ? "bg-pink-200 cursor-not-allowed"
                          : "bg-pink-500 hover:bg-pink-600 text-white"
                      }`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="text-gray-700 mt-1 text-sm md:text-base">
                {item?.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
