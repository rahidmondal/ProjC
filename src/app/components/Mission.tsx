import Image from "next/image";

export default function OurMission() {
  return (
    <section className="bg-white py-16 text-center dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center space-y-16">
          <div className="flex flex-col md:flex-row items-center md:space-x-12">
            <Image src="/images/Collab1.png" alt="Collaboration Image 1" width={300} height={300} />
            <div className="text-left md:text-right">
              <h2 className="text-4xl font-bold text-black  dark:text-white">Our Mission</h2>
              <p className="text-gray-700 text-xl max-w-md dark:text-white">
                To empower individuals by providing a seamless platform for collaboration, learning, and innovation.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row-reverse items-center md:space-x-12">
            <Image src="/images/Collab2.png" alt="Collaboration Image 2" width={300} height={300} />
            <div className="text-left md:text-left">
              <h2 className="text-4xl font-bold text-black dark:text-white">Create Projects</h2>
              <p className="text-gray-700 text-xl max-w-md dark:text-white">
                Provide a project title, description, goals, and required skills to attract the right team members.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:space-x-12">
            <Image src="/images/Collab3.png" alt="Collaboration Image 3" width={300} height={300} />
            <div className="text-left md:text-right">
              <h2 className="text-4xl font-bold text-black dark:text-white">Find Team</h2>
              <p className="text-gray-700 text-xl max-w-md dark:text-white">
                Search for contributors with the skills you need and invite them to join your project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}