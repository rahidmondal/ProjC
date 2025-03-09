
const Footer = () => {
  return (
    <footer className="w-full bg-[#2D2D2D] text-white py-4">
      <div className="max-w-6xl mx-auto px-8 flex items-center">
        
        <p className="text-sm text-gray-400 mr-auto">&copy; 2025 ProjC. All rights reserved.</p>
        
        <div className="flex space-x-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;