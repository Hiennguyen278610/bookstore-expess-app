"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";  // Thay vì "swiper/swiper.css"
import "swiper/css/navigation";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bannerImages, smallBanners } from "@/constants/user.index";



export default function BannerSlider() {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-[1200px] lg:max-w-[850px] px-2 md:px-0 group">
      {/* Main banner */}
      <div className="relative">
        {/* Navigation Buttons */}
        <div
          ref={prevRef}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-50 cursor-pointer
             flex items-center justify-center w-10 h-10 rounded-full 
             bg-white/40 text-black/70 backdrop-blur-sm 
             opacity-0 group-hover:opacity-100 transition-all duration-300
             hover:bg-white/70 hover:scale-110"
        >
          <ChevronLeft size={20} />
        </div>

        <div
          ref={nextRef}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-50 cursor-pointer
             flex items-center justify-center w-10 h-10 rounded-full 
             bg-white/40 text-black/70 backdrop-blur-sm 
             opacity-0 group-hover:opacity-100 transition-all duration-300
             hover:bg-white/70 hover:scale-110"
        >
          <ChevronRight size={20} />
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          className="overflow-hidden w-full shadow-md"
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
        >
          {bannerImages.map((src, index) => (
            <SwiperSlide key={index}>
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                width={1200}
                height={400}
                className="w-full h-auto object-cover"
                priority={index === 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Sub banners */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {smallBanners.map((src, index) => (
          <div
            key={index}
            className="overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <Image
              src={src}
              alt={`Small Banner ${index + 1}`}
              width={400}
              height={200}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
