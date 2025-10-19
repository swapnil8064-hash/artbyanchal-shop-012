"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const { user } = useAuth();
  if (!user) return null;

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to log out?")) return;

    try {
      await toast.promise(signOut(auth), {
        loading: "Logging out...",
        success: "Successfully logged out",
        error: (e) => e?.message,
      });
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      title="Logout"
      className="
        h-8 w-8 flex justify-center items-center rounded-full
        bg-white text-pink-500 shadow hover:bg-pink-50
        transition-all duration-300
      "
    >
      <LogOut size={16} />
    </button>
  );
}
