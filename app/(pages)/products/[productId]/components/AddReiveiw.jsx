"use client";

import { useAuth } from "@/contexts/AuthContext";
import { addReview } from "@/lib/firestore/reviews/write";
import { useUser } from "@/lib/firestore/user/read";
import { useState } from "react";
import toast from "react-hot-toast";

// --- Custom Tailwind Rating Component (drop-in replacement for MUI <Rating />)
function Rating({ value, onChange, className = "" }) {
  const [hover, setHover] = useState(null);

  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const index = i + 1;
        const filled = hover ? index <= hover : index <= value;

        return (
          <svg
            key={index}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(null, index)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={filled ? "#ec4899" : "none"}
            stroke={filled ? "#ec4899" : "#d1d5db"}
            strokeWidth="1.6"
            className="w-7 h-7 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2.25l2.92 5.92 6.53.95-4.72 4.6 1.12 6.52L12 17.77 6.15 20.3l1.12-6.52L2.55 9.18l6.53-.95L12 2.25z"
            />
          </svg>
        );
      })}
    </div>
  );
}

export default function AddReview({ productId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const { data: userData } = useUser({ uid: user?.uid });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!user) throw new Error("Please log in first");

      await addReview({
        displayName: userData?.displayName,
        message,
        photoURL: userData?.photoURL,
        productId,
        rating,
        uid: user?.uid,
      });

      setMessage("");
      toast.success("Successfully Submitted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 rounded-2xl border border-pink-200 bg-white shadow-md w-full">
      <h1 className="text-lg md:text-xl font-semibold text-pink-600">
        Rate This Product
      </h1>

      <Rating
        value={rating}
        onChange={(event, newValue) => setRating(newValue)}
        className="mb-2"
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your thoughts about this product..."
        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition resize-none"
        rows={4}
      />

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full py-3 rounded-xl font-semibold text-white transition
          ${
            isLoading
              ? "bg-pink-300 cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600"
          }`}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
