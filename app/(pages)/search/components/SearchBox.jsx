"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const router = useRouter();

  useEffect(() => {
    setQuery(q ?? "");
  }, [q]);

  const handleSubmit = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    router.refresh();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex w-full max-w-md mx-auto gap-2 items-center"
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter Product Name ..."
        type="text"
        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
        required
      />
      <button
        type="submit"
        className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
      >
        <Search size={14} />
        Search
      </button>
    </form>
  );
}
