"use client";

import Link from "next/link"; // ✅ fixed import
import { Search, UserCircle2 } from "lucide-react";
import AuthContextProvider from "@/contexts/AuthContext";
import HeaderClientButtons from "./HeaderClientButtons";
import AdminButton from "./AdminButton";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const menuList = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about-us" },
    { name: "Contact", link: "/contact-us" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-md py-3 px-4 md:py-4 md:px-16 border-b flex items-center justify-between">
      {/* Logo */}
      <Link href={"/"}>
        <img className="h-6 md:h-8" src="/logo.png" alt="Logo" />
      </Link>

      {/* Menu (Desktop) */}
      <div className="hidden md:flex gap-3 items-center font-semibold">
        {menuList.map((item) => (
          <Link key={item.link} href={item.link}>
            <button className="text-sm px-4 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-500 transition-colors duration-200">
              {item.name}
            </button>
          </Link>
        ))}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-2">
        <AuthContextProvider>
          <AdminButton />
        </AuthContextProvider>

        {/* Search */}
        <Link href="/search">
          <button
            title="Search Products"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-pink-50 transition-colors duration-200"
          >
            <Search size={16} className="text-pink-500" />
          </button>
        </Link>

        {/* Favorites & Bag */}
        <AuthContextProvider>
          <HeaderClientButtons />
        </AuthContextProvider>

        {/* Account */}
        <Link href="/account">
          <button
            title="My Account"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-pink-50 transition-colors duration-200"
          >
            <UserCircle2 size={16} className="text-pink-500" />
          </button>
        </Link>

        {/* Logout */}
        <AuthContextProvider>
          <LogoutButton />
        </AuthContextProvider>
      </div>
    </nav>
  );
}

