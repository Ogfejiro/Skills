"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules"; // ✅ fixed import
import {Navigation} from "swiper/modules"
import "swiper/css/navigation";

const WhyAttendSection = () => {
  const slides = [
    {
      src: "https://images.unsplash.com/photo-1515165562835-c4c2b7c8f4c8",
      caption: "Networking: Meet top Web3 professionals and enthusiasts.",
    },
    {
      src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
      caption: "Learning: Gain insights from expert talks and panels.",
    },
    {
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      caption: "Innovation: Discover cutting-edge Web3 projects and ideas.",
    },
    {
      src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      caption: "Community: Join a vibrant Web3 community.",
    },
  ];

  return (
    <section className="w-full py-20 bg-black text-white px-6 md:px-20">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-10">
        Why You Should Attend
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1.2}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
        }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg h-60 flex items-center justify-center">
              <img
                src={slide.src}
                alt={`Why Attend ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4 text-center">
                <p className="text-white text-sm md:text-base">{slide.caption}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default WhyAttendSection;
