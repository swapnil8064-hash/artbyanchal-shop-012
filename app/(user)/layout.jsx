"use client";

import AuthContextProvider, { useAuth } from "@/contexts/AuthContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <AuthContextProvider>
        <UserChecking>
          <section className="flex-1">{children}</section>
        </UserChecking>
      </AuthContextProvider>
      <Footer />
    </main>
  );
}

function UserChecking({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col gap-4 justify-center items-center">
        <h1 className="text-sm text-gray-600">You are not logged in!</h1>
        <Link href="/login">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl transition-all">
            Login
          </button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
