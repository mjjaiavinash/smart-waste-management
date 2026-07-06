import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center text-xs">♻️</div>
          <span className="text-sm font-semibold text-gray-200">SmartWaste</span>
        </div>
        <p className="text-sm text-gray-400">© 2024 Smart Waste Management System. All rights reserved.</p>
        <p className="text-sm text-gray-400">Keeping cities clean 🌱</p>
      </div>
    </footer>
  );
};

export default Footer;
