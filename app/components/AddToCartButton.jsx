"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Handbag } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId, type }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isAdded = data?.carts?.find((item) => item?.id === productId);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) {
        router.push("/login");
        throw new Error("Please log in first!");
      }

      if (isAdded) {
        const newList = data?.carts?.filter((item) => item?.id !== productId);
        await updateCarts({ list: newList, uid: user?.uid });
      } else {
        await updateCarts({
          list: [...(data?.carts ?? []), { id: productId, quantity: 1 }],
          uid: user?.uid,
        });
      }

      toast.success(isAdded ? "Removed from cart" : "Added to cart");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  const baseClasses =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  if (type === "cute") {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`${baseClasses} ${
          isAdded
            ? "border-pink-400 text-pink-600 hover:bg-pink-50"
            : "border-pink-200 text-pink-500 hover:bg-pink-50"
        }`}
      >
        {!isAdded ? "Add to Bag" : "Remove from Bag"}
      </button>
    );
  }

  if (type === "large") {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`${baseClasses} bg-pink-500 text-white hover:bg-pink-600`}
      >
        <Handbag size={16} className="animate-bounce" />
        {!isAdded ? "Add to Bag" : "Remove"}
      </button>
    );
  }

  // Icon only variant
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${baseClasses} w-10 h-10 bg-pink-50 text-pink-500`}
    >
      <Handbag size={16} className={`${isAdded ? "text-pink-500" : ""}`} />
    </button>
  );
}
