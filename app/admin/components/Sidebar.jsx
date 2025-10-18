"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import {
  Cat,
  Layers2,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  PackageOpen,
  ShieldCheck,
  ShoppingCart,
  Star,
  User,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const menuList = [
    { name: "Dashboard", link: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Products", link: "/admin/products", icon: <PackageOpen className="w-5 h-5" /> },
    { name: "Categories", link: "/admin/categories", icon: <Layers2 className="w-5 h-5" /> },
    { name: "Brands", link: "/admin/brands", icon: <Cat className="w-5 h-5" /> },
    { name: "Orders", link: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "Customers", link: "/admin/customers", icon: <User className="w-5 h-5" /> },
    { name: "Reviews", link: "/admin/reviews", icon: <Star className="w-5 h-5" /> },
    { name: "Collections", link: "/admin/collections", icon: <LibraryBig className="w-5 h-5" /> },
    { name: "Admins", link: "/admin/admins", icon: <ShieldCheck className="w-5 h-5" /> },
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
    <aside className="sticky top-0 flex flex-col bg-white border-r h-screen w-[260px] px-5 py-3 z-50">
      <div className="flex justify-center py-4">
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="h-8" />
        </Link>
      </div>
      <ul className="flex-1 flex flex-col gap-3 overflow-y-auto">
        {menuList.map((item, idx) => (
          <li key={idx}>
            <Link href={item.link}>
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-xl font-semibold transition-all duration-300
                ${pathname === item.link ? "bg-deepPink-500 text-white" : "bg-white text-black hover:bg-lightPink-100"}`}
              >
                {item.icon} <span>{item.name}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl hover:bg-lightPink-100 transition-colors"
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </aside>
  );
}
