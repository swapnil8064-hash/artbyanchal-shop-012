"use client"; 

import { Rating } from "@mui/material";

export default function CustomerReviews() {
  const list = [
    { name: "Riya Mehta", message: "I ordered a personalized polaroid for my best friend’s birthday, and she absolutely loved it! Such a beautiful keepsake that we’ll cherish forever.", rating: 5 },
    { name: "Amit Desai", message: "The wallet cards I bought are perfect for gifting. The quality is excellent, and the prints are super clear. Definitely makes a thoughtful present.", rating: 4.5 },
    { name: "Sneha Kapoor", message: "Bought a photo frame for my living room, and it looks so classy. The packaging was neat, and it arrived safely. Great for displaying memories!", rating: 4.5 },
    { name: "Rohit Singh", message: "The personalized magazine is amazing! Full of memories, and the design is really premium. My parents loved it as an anniversary gift.", rating: 5 },
    { name: "Pooja Sharma", message: "These wallet cards are so cute and personal. I gave them to my sister for her birthday, and she was overjoyed. Definitely coming back for more!", rating: 5 },
    { name: "Ankit Verma", message: "The frames and polaroids are perfect for gifting during festivals. I bought some for Diwali gifts, and everyone appreciated the thoughtful touch.", rating: 4.5 },
  ];

  return (
    <section className="flex justify-center bg-white py-10">
      <div className="w-full md:max-w-[900px] flex flex-col gap-6 p-5">
        <h1 className="text-center font-bold text-2xl text-pink-600">
          Our Customers Love
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-3 p-5 rounded-xl border border-pink-100 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-tr from-softblue-50 via-white to-salmon-50"
            >
              <h1 className="text-base font-semibold text-black text-center">{item.name}</h1>
              <div className="flex justify-center">
                <Rating
                  size="small"
                  name={`customer-rating-${idx}`}
                  defaultValue={item.rating}
                  precision={0.5}
                  readOnly
                  sx={{ color: "#ec4899" }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
