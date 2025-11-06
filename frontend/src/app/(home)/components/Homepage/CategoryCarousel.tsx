"use client";
import Image from "next/image";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Swiper styles
import "swiper/css";  // Thay vì "swiper/swiper.css"
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { categories } from "@/constants/user.index";

const CategoryCarousel = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative w-full mt-8 flex justify-center group">
      <div className="relative w-full max-w-[1200px] mx-auto px-4">
        {/* Navigation Buttons */}
        <div
          ref={prevRef}
          className="absolute left-0 top-3/7 -translate-y-1/2 z-50 cursor-pointer
             flex items-center justify-center w-10 h-10 rounded-full 
             bg-white/80 text-black/70 shadow-lg
             lg:opacity-0 group-hover:opacity-100 transition-all duration-300
             hover:bg-white hover:scale-110 hover:shadow-xl"
        >
          <ChevronLeft size={20} />
        </div>

        <div
          ref={nextRef}
          className="absolute right-0 top-3/7 -translate-y-1/2 z-50 cursor-pointer
             flex items-center justify-center w-10 h-10 rounded-full 
             bg-white/80 text-black/70 shadow-lg
             lg:opacity-0 group-hover:opacity-100 transition-all duration-300
             hover:bg-white hover:scale-110 hover:shadow-xl"
        >
          <ChevronRight size={20} />
        </div>

        {/* Swiper with equal slides */}
        <Swiper
          modules={[Navigation]}
          loop
          onBeforeInit={(swiper) => {
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation !== "boolean"
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          breakpoints={{
            320: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            480: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 8,
              spaceBetween: 20,
            },
          }}
          className="w-full"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.label}>
              {/* Each slide has its own group */}
              <div className="group/cat flex flex-col items-center justify-center cursor-pointer w-full">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-gray-200 shadow-sm group-hover/cat:shadow-md transition-all duration-300 mx-auto">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full group-hover/cat:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-xs sm:text-sm mt-2 text-gray-700 group-hover/cat:text-green-600 font-medium text-center max-w-[100px] sm:max-w-[112px] line-clamp-2 leading-tight px-1 transition-colors duration-300">
                  {cat.label}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoryCarousel;
