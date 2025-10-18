"use client";

import Slider from "react-slick";
import Link from "next/link";

export default function Collections({ collections }) {
  if (!collections?.length) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: Math.min(collections.length, 2),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(collections.length, 2) } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="overflow-hidden p-5 md:p-10">
      <Slider {...settings}>
        {(collections.length <= 2 ? [...collections, ...collections] : collections).map((collection, idx) => (
          <div key={idx} className="px-2">
            <div className="flex flex-col md:flex-row gap-4 p-5 md:p-7 bg-gradient-to-tr from-[#ffe4e1] to-[#ff69b4] rounded-xl shadow-md transition-transform duration-300 hover:scale-105">
              <div className="flex-1 flex flex-col gap-4 justify-center">
                <h3 className="font-bold text-lg md:text-xl">{collection?.title}</h3>
                <p className="text-gray-700 text-xs md:text-sm line-clamp-2">{collection?.subTitle}</p>
                <Link href={`/collections/${collection?.id}`}>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs md:text-sm px-4 py-2 rounded-lg">
                    SHOP NOW
                  </button>
                </Link>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={collection?.imageURL}
                  alt={collection?.title}
                  className="h-24 md:h-40 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
