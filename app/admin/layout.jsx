"use client";

import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "./components/AdminLayout";

export default function Layout({ children }) {
  return (
    <AuthContextProvider>
      <AdminChecking>{children}</AdminChecking>
    </AuthContextProvider>
  );
}

function AdminChecking({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/login");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-deepPink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <h1 className="text-lg font-semibold">Please Login First!</h1>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
