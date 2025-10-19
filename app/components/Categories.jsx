"use client";

import Link from "next/link";
import Slider from "react-slick";

export default function Categories({ categories }) {
  if (!categories || categories.length === 0) return null;

  const settings = {
    dots: false,
    infinite: categories.length > 3,
    speed: 3500,
    autoplay: categories.length > 3,
    autoplaySpeed: 3500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="py-8 md:py-12 px-5 md:px-10">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-pink-500 mb-6">
        Shop By Category
      </h2>
      <Slider {...settings}>
        {categories.map((category) => (
          <Link key={category?.id} href={`/categories/${category?.id}`}>
            <div className="flex flex-col items-center gap-3 px-2 cursor-pointer">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full p-2 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center justify-center">
                <img
                  src={category?.imageURL}
                  alt={category?.name}
                  className="rounded-full object-cover h-full w-full hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-black text-center">
                {category?.name}
              </h3>
            </div>
          </Link>
        ))}
      </Slider>
    </div>
  );
}
