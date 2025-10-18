"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  const handleData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data?.email);
      toast.success("Reset Link has been sent to your email!");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-gradient-to-tr from-pink-50 via-pink-100 to-white p-6 md:p-24">
      <section className="flex flex-col gap-6 w-full max-w-md">
        <div className="flex justify-center">
          <img className="h-14 md:h-16" src="/logo.png" alt="Logo" />
        </div>

        <div className="flex flex-col gap-6 bg-white shadow-lg rounded-2xl p-6 md:p-10 border border-pink-200">
          <h1 className="text-2xl md:text-3xl font-extrabold text-pink-600 text-center">
            Forgot Password
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendEmail();
            }}
            className="flex flex-col gap-4"
          >
            <input
              placeholder="Enter Your Email"
              type="email"
              value={data?.email || ""}
              onChange={(e) => handleData("email", e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition
                ${isLoading ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"}`}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="flex justify-center text-sm text-pink-600 font-medium">
            <Link href="/login" className="hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
