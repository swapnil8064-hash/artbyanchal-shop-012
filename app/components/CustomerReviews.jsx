"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function CustomerReviews() {
  const list = [
    {
      name: "Penny Albritoon",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      rating: 4.5,
      imageLink: "https://emilly-store1.myshopify.com/cdn/shop/files/bakery-testi-1.jpg?v=1721992196&width=512",
    },
    {
      name: "Oscar Nommanee",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      rating: 5,
      imageLink: "https://emilly-store1.myshopify.com/cdn/shop/files/bakery-testi-5.jpg?v=1721992196&width=512",
    },
    {
      name: "Emma Watsom",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      rating: 4.5,
      imageLink: "https://emilly-store1.myshopify.com/cdn/shop/files/bakery-testi-6.jpg?v=1721992197&width=512",
    },
  ];

  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(true), []);

  if (!visible) return null;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <div className="flex gap-1">
        {Array.from({ length: fullStars }, (_, i) => <Star key={i} size={14} className="text-pink-600" />)}
        {halfStar && <Star size={14} className="text-pink-400" />}
      </div>
    );
  };

  return (
    <section className="flex justify-center py-8 bg-[#fff0f5]">
      <div className="w-full max-w-[900px] flex flex-col gap-6 p-5">
        <h2 className="text-center text-xl font-bold text-pink-600">Our Customers Love Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-3 p-4 rounded-xl bg-white shadow hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={item.imageLink}
                alt={item.name}
                className="h-32 w-32 rounded-full object-cover mx-auto"
              />
              <h3 className="text-sm font-semibold text-center">{item.name}</h3>
              <div className="flex justify-center">{renderStars(item.rating)}</div>
              <p className="text-gray-600 text-xs text-center line-clamp-3">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
