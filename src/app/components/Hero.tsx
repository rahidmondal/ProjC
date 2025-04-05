"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Hero() {
  const slides = [
    {
      image: "/assets/carousel1.png",
      text: "Coming together is a beginning",
    },
     {
      image: "/assets/carousel2.png",
      text: "Collaboration makes us stronger",
    },
    {
      image: "/assets/carousel3.png",
      text: "Build projects, grow together",
    },
    {
      image: "/assets/carousel4.png",
      text: "Find the right coding partners",
    },
    {
      image: "/assets/carousel5.png",
      text: "Enhance your skills through teamwork",
    },
    {
      image: "/assets/carousel6.png",
      text: "Turn ideas into real-world projects",
    },
  ];

  return (
    <section className="relative w-full h-[636px] text-white" style={{ backgroundColor: "rgba(91,41,115,255)" }}>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={`Carousel ${index + 1}`}
                fill
                style={{
                  objectFit: "contain",
                  objectPosition: "right center",
                }}
                sizes="100vw" 
                quality={100}
                priority
              />
            </div>

            {/* Text Overlay */}
            <div className="relative z-10 flex items-center h-full px-6 ml-32 max-w-2xl text-left">
              <h1 className="text-6xl font-bold leading-tight">{slide.text}</h1>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="hero-border w-full h-[50px] bg-white"></div>

      {/* Custom Swiper Arrow Styling */}
      <style jsx>{`
        :global(.swiper-button-next),
        :global(.swiper-button-prev) {
          color: white; /* Default for dark mode */
        }

        :global(.dark .swiper-button-next),
        :global(.dark .swiper-button-prev) {
          color: black; /* Change to black in light mode */
        }
      `}</style>
    </section>
  );
}