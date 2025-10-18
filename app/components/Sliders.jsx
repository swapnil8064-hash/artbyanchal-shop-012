"use client";

import Slider from "react-slick";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";
import AuthContextProvider from "@/contexts/AuthContext";

export default function FeaturedProductSlider({ featuredProducts }) {
  if (!featuredProducts?.length) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="overflow-hidden">
      <Slider {...settings}>
        {featuredProducts.map((product, idx) => (
          <div key={idx} className="px-2">
            <div className="flex flex-col-reverse md:flex-row items-center gap-4 p-5 md:px-20 md:py-16 bg-gradient-to-tr from-[#ffe4e1] to-[#ff69b4] rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
              
              {/* Left text & buttons */}
              <div className="flex-1 flex flex-col gap-4 md:gap-8">
                <h4 className="text-xs md:text-sm font-semibold text-pink-600">NEW FASHION</h4>
                <Link href={`/products/${product?.id}`}>
                  <h1 className="text-xl md:text-4xl font-bold text-black line-clamp-2">{product?.title}</h1>
                </Link>
                <p className="text-gray-700 text-xs md:text-sm line-clamp-2">{product?.shortDescription}</p>
                <AuthContextProvider>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
                      <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all">
                        BUY NOW
                      </button>
                    </Link>
                    <AddToCartButton productId={product?.id} type="large" />
                    <FavoriteButton productId={product?.id} />
                  </div>
                </AuthContextProvider>
              </div>

              {/* Right image */}
              <div className="flex-1 flex items-center justify-center">
                <Link href={`/products/${product?.id}`}>
                  <img
                    src={product?.featureImageURL}
                    alt={product?.title}
                    className="h-48 md:h-80 w-full object-cover rounded-lg shadow-md"
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
