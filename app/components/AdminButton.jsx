"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import Link from "next/link";

export default function AdminButton() {
  const { user } = useAuth();
  const { data } = useAdmin({ email: user?.email });

  if (!data) return null;

  return (
    <Link href="/admin">
      <button
        className="
          text-sm md:text-base font-semibold px-4 py-2
          bg-gradient-to-r from-pink-500 to-pink-400
          text-white rounded-lg shadow-lg
          hover:from-pink-600 hover:to-pink-500
          transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-softblue-400
          focus:ring-offset-2 focus:ring-offset-white
          active:scale-95
        "
      >
        Admin
      </button>
    </Link>
  );
}
