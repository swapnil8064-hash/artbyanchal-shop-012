"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";
import { Heart, Handbag } from "lucide-react";
import Link from "next/link";

export default function HeaderClientButtons() {
  const { user } = useAuth();
  const { data } = useUser({ uid: user?.uid });

  const favoritesCount = data?.favorites?.length ?? 0;
  const cartCount = data?.carts?.length ?? 0;

  // Badge component for counts
  const Badge = ({ count }) => {
    if (count === 0) return null;
    return (
      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[8px] font-bold px-[3px] py-[1px] rounded-full animate-pulse">
        {count}
      </span>
    );
  };

  // Icon button component
  const IconButton = ({ href, icon, count, title }) => (
    <Link href={href} className="relative">
      <button
        title={title}
        className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-pink-50 transition-colors duration-200"
      >
        {icon}
        <Badge count={count} />
      </button>
    </Link>
  );

  return (
    <div className="flex items-center gap-2">
      <IconButton
        href="/favorites"
        icon={<Heart size={16} className={favoritesCount > 0 ? "text-pink-500" : "text-gray-400"} />}
        count={favoritesCount}
        title="My Favorites"
      />
      <IconButton
        href="/cart"
        icon={<Handbag size={16} className={cartCount > 0 ? "text-pink-500" : "text-gray-400"} />}
        count={cartCount}
        title="My Cart"
      />
    </div>
  );
}
