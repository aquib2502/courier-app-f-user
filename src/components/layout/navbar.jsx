"use client";
import React, { useEffect, useState } from "react";
import { User, Wallet, Bell, ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { io } from "socket.io-client";

const Navbar = ({ balance }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState({ fullname: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

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
      const token = localStorage.getItem("userToken");
      if (!token) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notifications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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

  // User Data Fetching
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("userToken");
        // if (!token) {
        //   router.push("/login");
        //   return;
        // }

        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(window.atob(base64));
        const userId = decoded.userId;
        if (!userId) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/getuser/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.user) {
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
    router.push("/");
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      await Promise.all(
        notifications
          .filter((n) => !n.isRead)
          .map((n) =>
            axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${n._id}/read`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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

  return (
    <div className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-full px-6 py-3 flex items-center justify-between">
        {/* Left - Logo & Navigation */}
        <div className="flex items-center space-x-8">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent cursor-pointer"
            onClick={() => router.push("/")}
          >
            THE TRACE EXPRESS
          </motion.h1>

        
        </div>

 {/* Right - Notifications, Nav Buttons, Wallet, Profile */}
<div className="flex items-center space-x-2 md:space-x-4">
  {/* Navigation Buttons */}
  <div className="hidden md:flex space-x-3">
    {[
      { name: "Home", route: "/" },
      { name: "About Us", route: "/#about-us" },
      { name: "Contact Us", route: "/#contact-us" },
      { name: "Login", route: "/login", guestOnly: true },
    ].map((btn, index) => {
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
  <div className="relative">
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
            <h3 className="font-semibold text-gray-700">Notifications</h3>
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
                  <p className="text-sm font-medium text-gray-800">{note.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{note.message}</p>
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
        <span className="text-green-600 font-medium">Rs.{balance}</span>
      </motion.div>

      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleProfileMenu}
          className="flex items-center space-x-2 cursor-pointer ml-2 p-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-medium">
            {getInitials()}
          </div>
          <ChevronDown className="w-4 h-4 text-emerald-700 hidden md:block" />
        </motion.div>

        {/* Profile Dropdown */}
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
                  <p className="text-sm text-gray-500">Loading user data...</p>
                ) : (
                  <>
                    <p className="font-medium text-gray-800">{userData.fullname}</p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
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

      </div>
    </div>
  );
};

export default Navbar;
