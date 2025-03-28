'use client';

import Image from 'next/image';

export default function SupportedBy() {
  return (
    <section className="h-[75px] bg-[rgb(87,87,87)] flex items-center justify-center px-12 dark:bg-[rgb(58,58,58)]">
      <h2 className="text-xl font-semibold text-white tracking-wide mr-32"> 
        TECH STACK
      </h2>

      <div className="flex items-center gap-32"> 
        <Image src="/assets/nextjs_icon.png" alt="Next.js" width={50} height={45} />
        <Image src="/assets/tailwind_icon_white.png" alt="Tailwind CSS" width={60} height={50} />
        <Image src="/assets/appwrite_icon.png" alt="Appwrite" width={50} height={50} />
        <Image src="/assets/nodejs_icon.png" alt="Node.js" width={80} height={50} />
        <Image src="/assets/github_icon.png" alt="GitHub" width={65} height={50} />
      </div>
    </section>
  );
}
