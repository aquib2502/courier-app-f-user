"use client";
import React from "react";
import { User, Wallet, Package, HelpCircle } from "lucide-react"; // Import necessary icons
import { motion } from "framer-motion"; // Optional: if you're using framer motion for animations

const Navbar = () => {
  return (
    <div className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto  py-4 flex  justify-between">
        {/* Left Section - Logo or Brand */}
        <div className="flex flex-col items-start">
          <h1 className="text-4xl font-extrabold text-emerald-700 tracking-wide hover:text-emerald-800 transition-colors duration-300">
            A.S Enterprise
          </h1>
        </div>

        {/* Right Section - Icons and Info */}
        <div className="flex items-center space-x-8">
          {/* Account Icon */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            <User className="w-6 h-6 text-gray-700 transition-colors duration-200 hover:text-emerald-600" />
            <span className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Account</span>
          </motion.div>

          {/* Wallet with Value */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer p-2 rounded-md bg-green-100 hover:bg-green-200 transition-all duration-200"
          >
            <Wallet className="w-6 h-6 text-green-600 transition-colors duration-200 hover:text-green-700" />
            <span className="text-green-600 hover:text-green-700 transition-colors duration-200">Rs. 2178.00</span>
          </motion.div>

          {/* Pickup Request */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer p-2 rounded-md bg-blue-100 hover:bg-blue-200 transition-all duration-200"
          >
            <Package className="w-6 h-6 text-blue-600 transition-colors duration-200 hover:text-blue-700" />
            <span className="text-blue-600 hover:text-blue-700 transition-colors duration-200">Pickup Request</span>
          </motion.div>

          {/* Support Center */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer p-2 rounded-md bg-yellow-100 hover:bg-yellow-200 transition-all duration-200"
          >
            <HelpCircle className="w-6 h-6 text-yellow-600 transition-colors duration-200 hover:text-yellow-700" />
            <span className="text-yellow-600 hover:text-yellow-700 transition-colors duration-200">Support Center</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
