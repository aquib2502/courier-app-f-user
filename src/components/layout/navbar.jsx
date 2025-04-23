"use client";
import React, { useState } from "react";
import { User, Wallet, Package, HelpCircle, Bell, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  return (
    <div className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-full px-6 py-3 flex items-center justify-between">
        {/* Left Section - Logo and Brand */}
        <div className="flex items-center">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent"
          >
            A.S Enterprise
          </motion.h1>
          <span className="text-gray-400 text-sm ml-4 px-2 py-1 bg-gray-100 rounded-md">Dashboard</span>
        </div>

        {/* Center - Search bar */}
        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders, shipments..."
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Section - Icons and Info */}
        <div className="flex items-center space-x-1 md:space-x-4">
          {/* Notifications */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 cursor-pointer relative"
              onClick={toggleNotifications}
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.div>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-700">Notifications</h3>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-emerald-500">
                      <p className="text-sm font-medium text-gray-800">New order received</p>
                      <p className="text-xs text-gray-500 mt-1">Order #125478 has been placed</p>
                      <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-800">Shipment update</p>
                      <p className="text-xs text-gray-500 mt-1">Order #125471 has been dispatched</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100 text-center">
                    <button className="text-emerald-600 text-sm hover:text-emerald-700">View all notifications</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wallet with Value */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center space-x-2 cursor-pointer p-2 rounded-md bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-100 transition-all duration-200"
          >
            <Wallet className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">Rs. 2,178.00</span>
          </motion.div>

          {/* Pickup Request */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:flex items-center space-x-2 cursor-pointer p-2 rounded-md bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-100 transition-all duration-200"
          >
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 font-medium">Pickup Request</span>
          </motion.div>

          {/* Support Center */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:flex items-center space-x-2 cursor-pointer p-2 rounded-md bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border border-yellow-100 transition-all duration-200"
          >
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <span className="text-amber-600 font-medium">Support</span>
          </motion.div>

          {/* User Profile */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2 cursor-pointer ml-2 p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-medium">
                JS
              </div>
              <ChevronDown className="w-4 h-4 text-emerald-700 hidden md:block" />
            </motion.div>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-800">John Smith</p>
                    <p className="text-xs text-gray-500">john@example.com</p>
                  </div>
                  <div className="py-1">
                    <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </button>
                    <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help & Support
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;