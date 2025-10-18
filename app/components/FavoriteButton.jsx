"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateFavorites } from "@/lib/firestore/user/write";
import { Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ productId }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isLiked = data?.favorites?.includes(productId);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) {
        router.push("/login");
        throw new Error("Please login first!");
      }

      if (isLiked) {
        const newList = data?.favorites?.filter((id) => id !== productId);
        await updateFavorites({ list: newList, uid: user?.uid });
        toast.success("Removed from favorites");
      } else {
        await updateFavorites({
          list: [...(data?.favorites ?? []), productId],
          uid: user?.uid,
        });
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        relative flex items-center justify-center w-8 h-8 rounded-full 
        transition-all duration-200 ease-in-out 
        ${isLiked ? "bg-pink-500 text-white shadow-md scale-105" : "bg-white text-pink-500 border border-pink-400 hover:bg-pink-50"} 
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
      `}
      title={isLiked ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={16}
        className={`transition-transform duration-300 ${
          isLiked ? "animate-pulse" : ""
        }`}
      />
    </button>
  );
}
