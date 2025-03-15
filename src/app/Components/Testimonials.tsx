export default function Feedback() {
  return (
    <section className="bg-[rgba(93,41,114,255)] py-16 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-12">
          FEEDBACK FROM CUSTOMERS
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-3xl font-bold w-12 h-12 flex items-center justify-center rounded-full leading-none">
              “
            </div>
            <div className="text-black text-lg font-bold mt-6">Prashant Kumar</div>
            <div className="text-gray-600 text-sm">Jun 20, 2024</div>
            <p className="text-gray-700 mt-4 text-lg">
              “It is a long established fact that a reader will be distracted by the readable 
              content of a page when looking at its layout”
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-3xl font-bold w-12 h-12 flex items-center justify-center rounded-full leading-none">
              “
            </div>
            <div className="text-black text-lg font-bold mt-6">Ravi Ranjan</div>
            <div className="text-gray-600 text-sm">Jun 20, 2024</div>
            <p className="text-gray-700 mt-4 text-lg">
              “It is a long established fact that a reader will be distracted by the readable 
              content of a page when looking at its layout”
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-3xl font-bold w-12 h-12 flex items-center justify-center rounded-full leading-none">
              “
            </div>
            <div className="text-black text-lg font-bold mt-6">Prince Kashish</div>
            <div className="text-gray-600 text-sm">Jun 20, 2024</div>
            <p className="text-gray-700 mt-4 text-lg">
              “It is a long established fact that a reader will be distracted by the readable 
              content of a page when looking at its layout”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}