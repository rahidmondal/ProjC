import Navbar from "./Components/Navbar/page";
import Footer from "./Components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to My Website
        </h1>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
