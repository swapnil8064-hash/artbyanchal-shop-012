"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef(null);

  const { user } = useAuth();
  const { data: admin, error, isLoading } = useAdmin({ email: user?.email });

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Close/open sidebar when route changes
  useEffect(() => {
    toggleSidebar();
  }, [pathname]);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-deepPink-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1 className="text-red-500">{error}</h1>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="h-screen w-screen flex flex-col gap-4 justify-center items-center">
        <h1 className="font-bold text-xl">You are not admin!</h1>
        <h2 className="text-gray-600">{user?.email}</h2>
        <button
          onClick={() => signOut(auth)}
          className="px-4 py-2 rounded-lg bg-deepPink-500 text-white hover:bg-salmonPink-500 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <main className="relative flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:hidden top-0 left-0 h-screen z-50 bg-white shadow-lg transition-transform duration-400 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-[260px]"
        }`}
      >
        <Sidebar />
      </div>

      <section className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <section className="pt-14 flex-1 bg-[#eff3f4]">{children}</section>
      </section>
    </main>
  );
}
