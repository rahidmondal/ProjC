'use client';

import Image from 'next/image';

export default function Features() {
  return (
    <section className="bg-white py-16 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          “Success is best when it’s shared”
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src="/images/Collaboration-amico.png"
              alt="Feature Image"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
          <div className="w-full md:w-1/2 text-left">
            <p className="text-xl text-gray-700 leading-relaxed">
              For true achievement isn’t just about personal milestones but about the impact we create together. 
              When individuals come together, combining their skills, ideas, and efforts, they unlock possibilities 
              far greater than what they could achieve alone.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-36 mt-12">
          <div className="flex flex-col items-center text-center w-40">
            <Image src="/images/icon1.png" alt="Task Management" width={120} height={120} />
            <p className="mt-4 font-semibold text-gray-800 text-lg leading-tight">
              Tasks and Project <br /> Management
            </p>
          </div>
          <div className="flex flex-col items-center text-center w-40">
            <Image src="/images/icon2.png" alt="Collaborate" width={120} height={120} />
            <p className="mt-4 font-semibold text-gray-800 text-lg leading-tight">
              Collaborate and <br /> Communicate
            </p>
          </div>
          <div className="flex flex-col items-center text-center w-40">
            <Image src="/images/icon3.png" alt="Workload" width={120} height={120} />
            <p className="mt-4 font-semibold text-gray-800 text-lg leading-tight">
              Workload and <br /> Productivity
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}