"use client";

import Slider from "react-slick";
import Link from "next/link";

export default function Categories({ categories }) {
  if (!categories?.length) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: Math.min(categories.length, 5),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(categories.length, 4) } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(categories.length, 3) } },
      { breakpoint: 480, settings: { slidesToShow: Math.min(categories.length, 2) } },
    ],
  };

  return (
    <div className="flex flex-col gap-6 justify-center overflow-hidden p-5 md:p-10">
      <h2 className="text-center font-bold text-lg md:text-xl text-pink-600">
        Shop By Category
      </h2>
      <Slider {...settings}>
        {(categories.length <= 2 ? [...categories, ...categories] : categories).map((category, idx) => (
          <Link key={idx} href={`/categories/${category?.id}`}>
            <div className="px-2 cursor-pointer">
              <div className="flex flex-col gap-3 items-center justify-center transition-transform duration-300 hover:scale-105">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border p-2 md:p-4 overflow-hidden bg-white shadow-sm flex items-center justify-center">
                  <img
                    src={category?.imageURL}
                    alt={category?.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-700 text-center">
                  {category?.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
}
