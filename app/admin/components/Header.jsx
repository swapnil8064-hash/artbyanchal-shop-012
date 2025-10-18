"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import { Menu } from "lucide-react";

export default function Header({ toggleSidebar }) {
  const { user } = useAuth();
  const { data: admin } = useAdmin({ email: user?.email });

  return (
    <header className="fixed top-0 w-full flex items-center justify-between gap-3 bg-white border-b px-4 py-3 z-20">
      {/* Mobile Menu */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-100 transition-colors">
          <Menu className="w-6 h-6 text-black" />
        </button>
      </div>

      <h1 className="text-xl font-semibold text-black flex-1">Dashboard</h1>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col text-right">
          <span className="font-semibold">{admin?.name}</span>
          <span className="text-gray-600 text-sm">{admin?.email}</span>
        </div>
        <img
          src={admin?.imageURL || "/default-avatar.png"}
          alt="Admin"
          className="w-10 h-10 rounded-full object-cover border-2 border-lightPink-300"
        />
      </div>
    </header>
  );
}
