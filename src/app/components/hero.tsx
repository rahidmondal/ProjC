'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full h-[500px] flex items-center text-white bg-[#5C2972]">
      
      <div className="absolute inset-0">
        <Image
          src="/images/banner_homepage.png"
          alt="Hero Background"
          layout="fill"
          objectFit="contain"
          objectPosition="right center"
          quality={100}
          priority
        />
      </div>

      
      <div className="relative z-10 max-w-2xl px-6 ml-32 text-left">
        <h1 className="text-6xl font-bold leading-tight">
          Coming together is a beginning
        </h1>
      </div>

     
      <div className="absolute bottom-0 left-0 w-full h-[50px] bg-white"></div>
    </section>
  );
}
