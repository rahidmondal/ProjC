'use client';

import Image from 'next/image';

export default function SupportedBy() {
  return (
    <section className="h-[75px] bg-[rgb(98,98,98)] flex items-center justify-center px-12">
      <h2 className="text-xl font-semibold text-white tracking-wide mr-20">
        SUPPORTED BY
      </h2>

      <div className="flex items-center space-x-20">
        <Image src="/images/sponser_pic.png" alt="Sponsor 1" width={150} height={50} />
        <Image src="/images/sponser_pic.png" alt="Sponsor 2" width={150} height={50} />
        <Image src="/images/sponser_pic.png" alt="Sponsor 3" width={150} height={50} />
        <Image src="/images/sponser_pic.png" alt="Sponsor 4" width={150} height={50} />
      </div>
    </section>
  );
}
