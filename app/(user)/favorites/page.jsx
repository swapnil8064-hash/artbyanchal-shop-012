"use client";

import { ProductCard } from "@/app/components/Products";
import { useAuth } from "@/contexts/AuthContext";
import { useProduct } from "@/lib/firestore/products/read";
import { useUser } from "@/lib/firestore/user/read";

export default function Page() {
  const { user } = useAuth();
  const { data, isLoading } = useUser({ uid: user?.uid });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-6 justify-center items-center p-5">
      <h1 className="text-2xl font-bold text-black">Favorites</h1>

      {(!data?.favorites || data?.favorites.length === 0) && (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <div className="flex justify-center">
            <img className="h-[200px]" src="/svgs/Empty-pana.svg" alt="No Favorites" />
          </div>
          <h1 className="text-gray-600 font-semibold text-lg">
            Please Add Products To Favorites
          </h1>
        </div>
      )}

      <div className="p-5 w-full md:max-w-[1200px] gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.favorites?.map((productId) => (
          <ProductItem productId={productId} key={productId} />
        ))}
      </div>
    </main>
  );
}

function ProductItem({ productId }) {
  const { data: product } = useProduct({ productId });
  return <ProductCard product={product} />;
}
