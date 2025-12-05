"use client";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";  
import { brandLogos } from "@/constants/user.index";

const BrandCarousel = () => {
  return (
    <div className="w-full bg-gray-50 py-12 rounded-2xl my-8 mb-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Đối Tác & Nhà Xuất Bản
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đồng hành cùng những thương hiệu sách uy tín nhất
          </p>
        </div>

        {/* Logo Slider */}
        <Swiper
          modules={[Autoplay]}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 20 },
            480: { slidesPerView: 3, spaceBetween: 30 },
            640: { slidesPerView: 4, spaceBetween: 40 },
            768: { slidesPerView: 5, spaceBetween: 40 },
            1024: { slidesPerView: 6, spaceBetween: 50 },
          }}
          className="w-full"
        >
          {brandLogos.map((logo, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center p-2 h-24">
                <Image
                  src={logo}
                  alt={`Brand ${index + 1}`}
                  width={100}
                  height={60}
                  className="object-contain w-full h-full opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BrandCarousel;