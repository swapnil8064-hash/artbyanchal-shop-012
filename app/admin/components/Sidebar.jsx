"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import { Archive, Box, HomeIcon, Layers, LogOut, Shield, ShoppingBagIcon, Star, TagIcon, Users } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuList = [
    { name: "Dashboard", link: "/admin", icon: HomeIcon },
    { name: "Products", link: "/admin/products", icon: Box },
    { name: "Categories", link: "/admin/categories", icon: Layers },
    { name: "Brands", link: "/admin/brands", icon: TagIcon },
    { name: "Orders", link: "/admin/orders", icon: ShoppingBagIcon },
    { name: "Customers", link: "/admin/customers", icon: Users },
    { name: "Reviews", link: "/admin/reviews", icon: Star },
    { name: "Collections", link: "/admin/collections", icon: Archive },
    { name: "Admins", link: "/admin/admins", icon: Shield },
  ];

  const handleLogout = async () => {
    try {
      await toast.promise(signOut(auth), {
        loading: "Logging out...",
        success: "Logged out successfully",
        error: (e) => e.message,
      });
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <aside className="sticky top-0 flex flex-col gap-10 bg-white shadow-lg border-r border-pink-100 px-5 py-6 h-screen w-[260px] z-50 overflow-y-auto scrollbar-none">
      {/* Logo */}
      <div className="flex justify-center py-4">
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Menu */}
      <ul className="flex-1 flex flex-col gap-3">
        {menuList.map((item, key) => (
          <Tab key={key} item={item} pathname={pathname} />
        ))}
      </ul>

      {/* Logout */}
      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className="flex gap-2 items-center px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-xl w-full justify-center transition-all duration-300"
        >
          <LogOut className="h-5 w-5 text-pink-500" /> Logout
        </button>
      </div>
    </aside>
  );
}

function Tab({ item, pathname }) {
  const isSelected = pathname === item.link;
  const Icon = item.icon;

  return (
    <Link href={item.link}>
      <li
        className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer
        ${
          isSelected
            ? "bg-gradient-to-r from-pink-500 to-pink-400 text-white shadow-lg scale-105"
            : "text-gray-800 hover:bg-pink-50 hover:text-pink-600 hover:shadow-sm hover:scale-105"
        }`}
      >
        <Icon
          className={`h-5 w-5 transition-all duration-300 
          ${isSelected ? "text-white" : "text-pink-500 group-hover:text-pink-600"}`}
        />
        <span className="transition-colors duration-300">
          {item.name}
        </span>
      </li>
    </Link>
  );
}
