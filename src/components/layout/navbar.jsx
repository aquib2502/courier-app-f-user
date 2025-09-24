"use client";
import React, { useEffect, useState } from "react";
import { User, Wallet, Bell, ChevronDown, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { io } from "socket.io-client";
import axiosClient from "@/utils/axiosClient";

const Navbar = ({ balance }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [userData, setUserData] = useState({ fullname: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  const formatTabName = (tabName) => {
    if (!tabName) return "Dashboard";
    const nameWithSpaces = tabName.replace(/-/g, " ");
    return nameWithSpaces
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Socket & Notification Logic
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    let socketInstance;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(window.atob(base64));
      const userId = decoded?.userId;
      if (!userId) return;

      socketInstance = io(`${process.env.NEXT_PUBLIC_API_URL}`);
      socketInstance.emit("register", userId);
      socketInstance.on("new-notification", (data) => {
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    } catch (err) {
      console.error("Error decoding token:", err);
    }

    return () => {
      if (socketInstance) {
        socketInstance.off("new-notification");
        socketInstance.disconnect();
      }
    };
  }, []);

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await axiosClient.get("/api/notifications");

      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(
          response.data.notifications.filter((n) => !n.isRead).length
        );
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  fetchNotifications();
}, []);


  useEffect(() => {
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("userToken");

      // Decode token to get userId
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(window.atob(base64));
      const userId = decoded.userId;
      if (!userId) return;

      const response = await axiosClient.get(`/api/user/getuser/${userId}`);

      if (response.data?.user) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUserData();
}, [router]);

const handleLogout = () => {
  localStorage.removeItem("userToken");

  // Clear all relevant states
  setUserData({ fullname: "", email: "" });
  setNotifications([]);
  setUnreadCount(0);

  // Navigate to home
  router.push("/");
};


  const markAllAsRead = async () => {
  if (!notifications?.length) return;

  try {
    await Promise.all(
      notifications
        .filter((n) => !n.isRead)
        .map((n) => axiosClient.put(`/api/notifications/${n._id}/read`))
    );

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
    setUnreadCount(0);
  } catch (err) {
    console.error("Error marking notifications as read:", err);
  }
};


  const getInitials = () => {
    if (userData && userData.fullname) {
      return userData.fullname.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleMobileNavClick = (route) => {
    router.push(route);
    setShowMobileMenu(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notifications-container')) {
        setShowNotifications(false);
      }
      if (showProfileMenu && !event.target.closest('.profile-container')) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showProfileMenu]);

  const navigationButtons = [
    { name: "Home", route: "/" },
    { name: "About Us", route: "/#about-us" },
    { name: "Contact Us", route: "/#contact-us" },
    { name: "Login", route: "/login", guestOnly: true },
  ];

  return (
    <div className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-full px-3 sm:px-4 lg:px-6 py-2.5 lg:py-3 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center flex-shrink-0">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent cursor-pointer whitespace-nowrap"
            onClick={() => router.push("/")}
          >
            THE TRACE EXPRESS
          </motion.h1>
        </div>

        {/* Desktop Right - Notifications, Nav Buttons, Wallet, Profile */}
        <div className="hidden lg:flex items-center space-x-2 md:space-x-4">
          {/* Navigation Buttons */}
          <div className="flex space-x-3">
            {navigationButtons.map((btn, index) => {
              if (btn.guestOnly && userData.fullname) return null;
              return (
                <button
                  key={index}
                  onClick={() => router.push(btn.route)}
                  className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:text-white hover:bg-emerald-600 transition-all duration-200 shadow-sm hover:shadow-lg"
                >
                  {btn.name}
                </button>
              );
            })}
          </div>

          {/* Notifications */}
          <div className="relative notifications-container">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 cursor-pointer relative"
              onClick={toggleNotifications}
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
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
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">
                      Notifications
                    </h3>
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">
                        No notifications yet
                      </p>
                    ) : (
                      notifications.map((note, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-50 border-l-4 border-emerald-500"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {note.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {note.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wallet & Profile Menu */}
          {userData.fullname && (
            <>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center space-x-2 cursor-pointer p-2 rounded-md bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-100 transition-all duration-200"
              >
                <Wallet className="w-5 h-5 text-green-600" />
                <span className="text-green-600 font-medium">Rs.{userData.walletBalance ||  0}</span>
              </motion.div>

              <div className="relative profile-container">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 cursor-pointer ml-2 p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-medium">
                    {getInitials()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-emerald-700" />
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
                        {isLoading ? (
                          <p className="text-sm text-gray-500">
                            Loading user data...
                          </p>
                        ) : (
                          <>
                            <p className="font-medium text-gray-800">
                              {userData.fullname}
                            </p>
                            <p className="text-xs text-gray-500">
                              {userData.email}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            router.push("/home?tab=profile");
                            setShowProfileMenu(false);
                          }}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Mobile Right - Compact elements */}
        <div className="flex lg:hidden items-center space-x-1">
          {/* Mobile Notifications */}
          {userData.fullname && (
            <>
              <div className="relative notifications-container">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 cursor-pointer relative"
                  onClick={toggleNotifications}
                >
                  <Bell className="w-4 h-4 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </motion.div>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 max-w-[95vw] bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700 text-sm">
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-emerald-600 hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.map((note, index) => (
                            <div
                              key={index}
                              className={`px-4 py-3 hover:bg-gray-50 border-l-4 transition-colors ${
                                note.isRead ? 'border-gray-300' : 'border-emerald-500'
                              }`}
                            >
                              <p className="text-sm font-medium text-gray-800">
                                {note.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {note.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(note.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Wallet */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-1 cursor-pointer px-1.5 py-1 rounded-md bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-100 transition-all duration-200"
              >
                <Wallet className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600 font-medium text-xs">₹{userData.walletBalance ||  0}</span>
              </motion.div>

              {/* Mobile Profile */}
              <div className="relative profile-container">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleProfileMenu}
                  className="flex items-center cursor-pointer p-0.5 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-medium text-xs">
                    {getInitials()}
                  </div>
                </motion.div>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        {isLoading ? (
                          <p className="text-sm text-gray-500">
                            Loading user data...
                          </p>
                        ) : (
                          <>
                            <p className="font-medium text-gray-800 text-sm">
                              {userData.fullname}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {userData.email}
                            </p>
                          </>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            router.push("/home?tab=profile");
                            setShowProfileMenu(false);
                          }}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center transition-colors"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile Settings
                        </button>
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Hamburger Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 ml-1"
          >
            {showMobileMenu ? (
              <X className="w-4 h-4 text-gray-700" />
            ) : (
              <Menu className="w-4 h-4 text-gray-700" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navigationButtons.map((btn, index) => {
                if (btn.guestOnly && userData.fullname) return null;
                return (
                  <motion.button
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleMobileNavClick(btn.route)}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:text-white hover:bg-emerald-600 transition-all duration-200 shadow-sm hover:shadow-lg"
                  >
                    {btn.name}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;