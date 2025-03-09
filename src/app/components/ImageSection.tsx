import Image from "next/image";

const ImageSection = () => {
  return (
    <section className="w-full flex justify-center bg-white py-0">
  <div className="max-w-5xl w-full flex justify-center overflow-hidden">
    <Image 
      src="/images/homepage1.png" 
      alt="Teamwork Illustration" 
      width={800} 
      height={400} 
      className="object-cover"
        />
      </div>
    </section>
  );
};

export default ImageSection;
