import Image from 'next/image';

const CTA = () => {
  return (
    <section className="w-full bg-[#1E1E1E] text-white py-12">
      <div className="max-w-6xl mx-auto px-8 grid grid-cols-5 gap-16 items-start">
        
        <div className="col-span-1 flex items-start justify-start">
          <Image src="/images/Lightlogo.png" alt="PROJ.C Logo" width={120} height={50} />
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-4">Home</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>About us</li>
            <li>Testimonials</li>
            <li>Contact Us</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-4">Connect</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>abc@gmail.com</li>
            <li>+91 4632365756</li>
            <li>Eloitte Eve, Parkville 3052, Melbourne Canada</li>
          </ul>
        </div>

        
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Please give feedback</h3>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 bg-transparent border border-gray-400 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          />
          <textarea
            placeholder="Your suggestion"
            className="w-full p-3 bg-transparent border border-gray-400 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          />
          <button className="w-full px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
            Submit
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;