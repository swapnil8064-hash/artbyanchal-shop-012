"use client";

import Link from "next/link";
import Slider from "react-slick";

export default function Collections({ collections }) {
  if (!collections || collections.length === 0) return null;

  const settings = {
    dots: false,
    infinite: collections.length > 2,
    speed: 3500,
    autoplay: collections.length > 2,
    autoplaySpeed: 3500,
    slidesToShow: collections.length >= 2 ? 2 : 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: collections.length >= 2 ? 2 : 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="py-8 md:py-12 px-4 md:px-10">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-pink-500 mb-6">
        Our Collections
      </h2>
      <Slider {...settings}>
        {collections.map((collection) => (
          <div key={collection?.id} className="px-2">
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
              {/* Text */}
              <div className="flex-1 flex flex-col gap-3">
                <h3 className="text-lg md:text-xl font-semibold text-black">
                  {collection?.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
                  {collection?.subTitle}
                </p>
                <Link href={`/collections/${collection?.id}`}>
                  <button className="mt-2 px-4 py-2 bg-pink-500 text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-pink-600 transition-colors duration-200">
                    SHOP NOW
                  </button>
                </Link>
              </div>

              {/* Image */}
              <div className="flex-1 flex justify-center md:justify-end">
                <Link href={`/collections/${collection?.id}`}>
                  <img
                    src={collection?.imageURL || "/default-avatar.png"}
                    alt={collection?.title || "Collection Image"}
                    className="h-40 md:h-56 w-full md:w-auto object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
