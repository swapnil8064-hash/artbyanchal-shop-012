"use client";

import Slider from "react-slick";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import AddToCartButton from "./AddToCartButton";
import AuthContextProvider from "@/contexts/AuthContext";

export default function FeaturedProductSlider({ featuredProducts }) {
  if (!featuredProducts?.length) return null;

  const settings = {
    dots: false,
    infinite: true,
    speed: 3500,
    autoplay: true,
    autoplaySpeed: 3500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="overflow-hidden w-full py-5 md:py-10">
      <Slider {...settings}>
        {featuredProducts.map((product) => (
          <div key={product?.id}>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center bg-white md:px-20 md:py-16 px-5 py-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              
              {/* Left text & buttons */}
              <div className="flex-1 flex flex-col gap-4 md:gap-6">
                <h2 className="text-sm md:text-base text-pink-400 font-semibold">NEW ARRIVAL</h2>
                <Link href={`/products/${product?.id}`}>
                  <h1 className="text-2xl md:text-4xl font-bold text-black hover:text-pink-500 transition-colors duration-200 line-clamp-2">
                    {product?.title}
                  </h1>
                </Link>
                <p className="text-gray-600 text-xs md:text-sm max-w-md line-clamp-2">
                  {product?.shortDescription}
                </p>
                <AuthContextProvider>
                  <div className="flex gap-3 flex-wrap mt-2">
                    <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
                      <button className="px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg text-xs md:text-sm hover:bg-pink-600 transition-colors duration-200">
                        BUY NOW
                      </button>
                    </Link>
                    <AddToCartButton productId={product?.id} type="large" />
                    <FavoriteButton productId={product?.id} />
                  </div>
                </AuthContextProvider>
              </div>

              {/* Right image */}
              <div className="flex-1 flex justify-center md:justify-end">
                <Link href={`/products/${product?.id}`}>
                  <img
                    src={product?.featureImageURL}
                    alt={product?.title}
                    className="h-56 md:h-80 w-full md:w-auto object-cover rounded-xl hover:scale-105 transition-transform duration-300"
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
