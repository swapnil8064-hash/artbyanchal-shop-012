"use client";

import Slider from "react-slick";

export default function Brands({ brands }) {
  if (!brands?.length) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: Math.min(brands.length, 5),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(brands.length, 4) },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: Math.min(brands.length, 3) },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: Math.min(brands.length, 2) },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-6 justify-center overflow-hidden p-5 md:p-10">
      <h2 className="text-center font-bold text-lg md:text-xl text-pink-600">
        Our Brands
      </h2>
      <Slider {...settings}>
        {(brands.length <= 2 ? [...brands, ...brands] : brands).map((brand, idx) => (
          <div key={idx} className="px-2">
            <div className="flex flex-col gap-3 items-center justify-center transition-transform duration-300 hover:scale-105">
              <div className="h-20 md:h-24 w-full md:w-32 p-2 md:p-4 border rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center">
                <img
                  src={brand?.imageURL}
                  alt={brand?.name || "Brand"}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="text-xs md:text-sm font-semibold text-gray-700 text-center">
                {brand?.name}
              </h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
