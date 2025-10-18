"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";
import { updateCarts } from "@/lib/firestore/user/write";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { user } = useAuth();
  const { data, isLoading } = useUser({ uid: user?.uid });

  if (isLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-6 justify-center items-center p-5">
      <h1 className="text-2xl md:text-3xl font-bold text-pink-600">Cart</h1>

      {(!data?.carts || data?.carts?.length === 0) && (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <img
            className="h-[200px] md:h-[250px]"
            src="/svgs/Empty-pana.svg"
            alt="Empty Cart"
          />
          <h1 className="text-gray-600 font-semibold text-lg">
            Please Add Products To Cart
          </h1>
        </div>
      )}

      <div className="p-5 w-full md:max-w-[900px] gap-4 grid grid-cols-1 md:grid-cols-2">
        {data?.carts?.map((item) => (
          <ProductItem item={item} key={item?.id} />
        ))}
      </div>

      {data?.carts?.length > 0 && (
        <Link href={`/checkout?type=cart`}>
          <button className="bg-pink-500 hover:bg-pink-600 transition text-white px-5 py-2 rounded-lg font-semibold">
            Checkout
          </button>
        </Link>
      )}
    </main>
  );
}

function ProductItem({ item }) {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });

  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: product } = useProduct({ productId: item?.id });

  const handleRemove = async () => {
    if (!confirm("Are you sure?")) return;
    setIsRemoving(true);
    try {
      const newList = data?.carts?.filter((d) => d?.id !== item?.id);
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error) {
      toast.error(error?.message);
    }
    setIsRemoving(false);
  };

  const handleUpdate = async (quantity) => {
    setIsUpdating(true);
    try {
      const newList = data?.carts?.map((d) =>
        d?.id === item?.id ? { ...d, quantity: parseInt(quantity) } : d
      );
      await updateCarts({ list: newList, uid: user?.uid });
    } catch (error) {
      toast.error(error?.message);
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex gap-4 items-center border p-4 rounded-2xl bg-white shadow-md">
      {/* Product Image */}
      <div className="h-16 w-16 md:h-20 md:w-20 p-1">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={product?.featureImageURL}
          alt={product?.title}
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1 flex-1">
        <h1 className="text-sm md:text-base font-semibold text-gray-800">
          {product?.title}
        </h1>
        <h1 className="text-green-500 text-sm md:text-base">
          ₹ {product?.salePrice}{" "}
          <span className="line-through text-xs text-gray-500">
            ₹ {product?.price}
          </span>
        </h1>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-1">
          <button
            onClick={() => handleUpdate(item?.quantity - 1)}
            disabled={isUpdating || item?.quantity <= 1}
            className={`p-1 rounded bg-pink-100 text-pink-600 hover:bg-pink-200 transition ${
              isUpdating || item?.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Minus size={14} />
          </button>
          <span className="font-medium">{item?.quantity}</span>
          <button
            onClick={() => handleUpdate(item?.quantity + 1)}
            disabled={isUpdating}
            className={`p-1 rounded bg-pink-100 text-pink-600 hover:bg-pink-200 transition ${
              isUpdating ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <div>
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className={`p-2 rounded-full transition ${
            isRemoving
              ? "bg-pink-200 cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600 text-white"
          }`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
