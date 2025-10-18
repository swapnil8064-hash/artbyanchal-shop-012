"use client";

import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { createUser } from "@/lib/firestore/user/write";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  const handleData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data?.email, data?.password);
      toast.success("Logged In Successfully");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      router.push("/account");
    }
  }, [user]);

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-gradient-to-tr from-pink-50 via-pink-100 to-white p-6 md:p-24">
      <section className="flex flex-col gap-6 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <img className="h-14 md:h-16" src="/logo.png" alt="Logo" />
        </div>

        {/* Login Form */}
        <div className="flex flex-col gap-6 bg-white shadow-lg rounded-2xl p-6 md:p-10 border border-pink-200">
          <h1 className="text-2xl md:text-3xl font-extrabold text-pink-600 text-center">
            Login With Email
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
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
            <input
              placeholder="Enter Your Password"
              type="password"
              value={data?.password || ""}
              onChange={(e) => handleData("password", e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition
                ${isLoading ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"}`}
            >
              {isLoading ? "Logging In..." : "Login"}
            </button>
          </form>

          {/* Links */}
          <div className="flex justify-between text-sm text-pink-600 font-medium">
            <Link href="/sign-up" className="hover:underline">
              New? Create Account
            </Link>
            <Link href="/forget-password" className="hover:underline">
              Forget Password?
            </Link>
          </div>

          <hr className="border-gray-300 my-4" />

          {/* Google Login */}
          <SignInWithGoogleComponent />
        </div>
      </section>
    </main>
  );
}

function SignInWithGoogleComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = credential.user;
      await createUser({
        uid: user?.uid,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      });
      toast.success("Logged in with Google!");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`w-full py-3 rounded-xl font-semibold text-white transition
        ${isLoading ? "bg-blue-200 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
    >
      {isLoading ? "Signing In..." : "Sign In With Google"}
    </button>
  );
}
