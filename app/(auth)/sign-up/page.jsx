"use client";


import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { createUser } from "@/lib/firestore/user/write";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  const handleData = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, data?.email, data?.password);
      await updateProfile(credential.user, { displayName: data?.name });
      await createUser({
        uid: credential.user.uid,
        displayName: data?.name,
        photoURL: credential.user.photoURL,
      });
      toast.success("Successfully Signed Up");
      router.push("/account");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-gradient-to-b from-[#FF91A4]/20 to-[#E75480]/10 p-10 md:p-24">
      <section className="flex flex-col gap-6 w-full max-w-md">
        <div className="flex justify-center">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </div>

        <div className="flex flex-col gap-4 bg-white rounded-2xl p-6 md:p-10 shadow-lg">
          <h1 className="text-2xl font-bold text-black text-center">Sign Up With Email</h1>

          <form
            onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Enter Your Name"
              value={data?.name || ""}
              onChange={(e) => handleData("name", e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <input
              type="email"
              placeholder="Enter Your Email"
              value={data?.email || ""}
              onChange={(e) => handleData("email", e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <input
              type="password"
              placeholder="Enter Your Password"
              value={data?.password || ""}
              onChange={(e) => handleData("password", e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-xl font-semibold text-white transition ${
                isLoading ? "bg-gray-400" : "bg-gradient-to-r from-[#E75480] to-[#FF91A4] hover:from-[#FF91A4] hover:to-[#E75480]"
              }`}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="flex justify-between text-sm text-[#6FA8DC] mt-2">
            <Link href="/login" className="font-semibold hover:underline">Already have an account? Sign In</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
