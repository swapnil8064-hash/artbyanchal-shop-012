"use client";

import Slider from "react-slick";
import Image from "next/image";

export default function Brands({ brands }) {
  if (!brands || brands.length === 0) return null;

  const settings = {
    dots: false,
    infinite: brands.length > 3,
    speed: 3500,
    autoplay: brands.length > 3,
    autoplaySpeed: 3500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  const displayBrands = brands.length <= 2 ? [...brands, ...brands, ...brands] : brands;

  return (
    <div className="py-8 md:py-12 px-5 md:px-10">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-pink-500 mb-6">
        AVAILABLE
      </h2>
      <Slider {...settings}>
        {displayBrands.map((brand, idx) => (
          <div key={idx} className="px-2">
            <div className="flex flex-col gap-3 items-center justify-center">
              <div
                className="
                  h-24 md:h-28 w-full rounded-xl p-2 md:p-5
                  border-2 border-pink-400 bg-gradient-to-tr from-softblue-100 via-white to-salmon-100
                  shadow-lg hover:shadow-xl transition-all duration-300
                  overflow-hidden flex items-center justify-center
                "
              >
                <Image
                  src={brand?.imageURL}
                  alt={brand?.name || "Brand"}
                  className="h-full w-full object-contain"
                  width={150}
                  height={150}
                />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-black text-center">
                {brand?.name}
              </h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
