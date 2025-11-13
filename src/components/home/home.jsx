"use client";
import React, { useEffect, useState, useRef, Suspense, useCallback, useMemo} from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  Home,
  Package,
  FileText,
  Wallet,
  ChevronDown,
  ChevronUp,
  LogOut,
  Settings,
  Calculator,
  Activity,
  BarChart2,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import AddOrder from "../orders/AddOrder/AddOrder";
import Draft from "../orders/Drafts";
import Ready from "../orders/Ready";
import Packed from "../orders/Packed";
import Manifested from "../orders/Manifested/Manifested.jsx";
import Dispatched from "../orders/Dispatched";
import Received from "../orders/Recieved";
import Cancelled from "../orders/Cancelled";
import RateCalculator from "../RateCalculator/RateCalculator";
import Dashboard from "../dashboard/dashboard.jsx";
import Navbar from "../layout/navbar";
import { motion, AnimatePresence } from "framer-motion";
import RechargeWallet from "../wallet/RechargeWallet";
import WalletHistory from "../wallet/WalletHistory";
import TransactionHistory from "../wallet/TransactionHistory";
import Footer from "../layout/Footer/Footer";
import CreateManifest from "../orders/Manifested/CreateManifest";
import ManifestListing from "../manifested/Manifest";
import PickupRequest from "../manifested/PickupRequest";
import MyProfile from "../Settings/MyProfile";
import KYCDetails from "../Settings/KycDetails";
import PickupAddresses from "../Settings/PickupAddress";
import Dispute from "../orders/Dispute";
import MonthlyInvoice from "../wallet/MonthlyInvoice";

const HomePage = () => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isManifestedOpen, setIsManifestedOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isClient, setIsClient] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleOrders = () => setIsOrdersOpen(!isOrdersOpen);
  const toggleWallet = () => setIsWalletOpen(!isWalletOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const router = useRouter();
  const searchParams = useSearchParams()

  // Recharge handler
  const handleRecharge = (amount) => {
    setBalance((prev) => prev + amount);
  };

  // Function to update balance when order is placed
  const handleOrderPayment = (amount) => {
    setBalance((prev) => prev - amount);
  };

  useEffect(() => {
    setIsClient(true);

    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/");
      return;
    }

    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }

    // Fetch initial wallet balance
    const fetchWalletBalance = async () => {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.userId;

        // Fetch wallet balance from your API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet/balance/${userId}`);
        const data = await response.json();
        setBalance(data.balance || 0);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    // fetchWalletBalance();
  }, [router, searchParams]);


 const handleActiveTab = useCallback((tab) => {
  setActiveTab(tab);
  router.push(`?tab=${tab}`, { shallow: true });

  // Only close sidebar if on mobile
  if (window.innerWidth < 1024) {
    setIsSidebarOpen(false);
  }

  // Don't toggle dropdowns here — leave them as is
}, [router]);

  // Improved dropdown animation variants with smoother transitions
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    },
  };

  // Improved sidebar animation variants
  const sidebarVariants = {
    hidden: { 
      x: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: { 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
  };

  // Subtle hover animations
  const itemHoverVariants = {
    hover: {
      x: 3,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    }
  };

  // Memoized sidebar content to prevent re-renders
  const SidebarContent = useMemo(() => {
    const handleToggleOrders = () => setIsOrdersOpen(!isOrdersOpen);
    const handleToggleWallet = () => setIsWalletOpen(!isWalletOpen);
    const handleToggleManifested = () => setIsManifestedOpen(!isManifestedOpen);
    const handleToggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-center justify-center mb-6 lg:mb-10 p-4 lg:p-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="text-lg lg:text-2xl font-bold text-white px-3 lg:px-4 py-2 rounded-lg bg-emerald-700/30 backdrop-blur-sm text-center"
            >
              Order Management
            </motion.div>
          </div>

          <ul className="space-y-2 px-4 lg:px-0">
            {/* Dashboard Link */}
            <motion.li 
              variants={itemHoverVariants}
              whileHover="hover"
            >
              <div
                onClick={() => handleActiveTab("dashboard")}
                className={`flex items-center space-x-4 py-3 px-4 cursor-pointer rounded-lg transition-all duration-200
                  ${
                    activeTab === "dashboard"
                      ? "bg-emerald-700/90 text-white shadow-md"
                      : "text-white hover:bg-emerald-800/50"
                  }`}
              >
                <BarChart2 className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </div>
            </motion.li>

            {/* Orders Dropdown */}
            <motion.li 
              variants={itemHoverVariants}
              whileHover="hover"
            >
              <div
                onClick={handleToggleOrders}
                className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg hover:bg-emerald-800/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Orders</span>
                </div>
                <motion.div
                  animate={{ rotate: isOrdersOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>
              <AnimatePresence initial={false}>
                {isOrdersOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="ml-4 pl-4 border-l border-emerald-600/50 mt-1 overflow-hidden"
                  >
                    <ul className="space-y-1 py-1">
                      {[
                        "Add Order",
                        "Drafts",
                        "Ready",
                        "Packed",
                        "Manifested",
                        "Dispatched",
                        "Received",
                        "Disputed"
                      ].map((item, index) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: {
                              delay: index * 0.03,
                              duration: 0.2,
                              ease: "easeOut"
                            }
                          }}
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.15 }}
                          className="my-1"
                        >
                          <button
                            onClick={() =>
                              handleActiveTab(
                                item.toLowerCase().replace(" ", "-")
                              )
                            }
                            className={`flex items-center w-full py-2 px-3 rounded-md text-sm transition-all duration-150 ${
                              activeTab ===
                              item.toLowerCase().replace(" ", "-")
                                ? "bg-emerald-600/80 text-white"
                                : "text-gray-200 hover:bg-emerald-700/30"
                            }`}
                          >
                            <span
                              className={
                                activeTab ===
                                item.toLowerCase().replace(" ", "-")
                                  ? "font-medium"
                                  : ""
                              }
                            >
                              {item}
                            </span>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
           
            {/* Manifested Dropdown */}
            <motion.li 
              variants={itemHoverVariants}
              whileHover="hover"
            >
              <div
                onClick={handleToggleManifested}
                className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg hover:bg-emerald-800/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Manifested</span>
                </div>
                <motion.div
                  animate={{ rotate: isManifestedOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>
              <AnimatePresence initial={false}>
                {isManifestedOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="ml-4 pl-4 border-l border-emerald-600/50 mt-1 overflow-hidden"
                  >
                    <ul className="space-y-1 py-1">
                      {["Manifest", "Pickup Request"].map((item, index) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: {
                              delay: index * 0.03,
                              duration: 0.2,
                              ease: "easeOut"
                            }
                          }}
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.15 }}
                          className="my-1"
                        >
                          <button
                            onClick={() =>
                              handleActiveTab(
                                item.toLowerCase().replace(" ", "-")
                              )
                            }
                            className={`flex items-center w-full py-2 px-3 rounded-md text-sm transition-all duration-150 ${
                              activeTab ===
                              item.toLowerCase().replace(" ", "-")
                                ? "bg-emerald-600/80 text-white"
                                : "text-gray-200 hover:bg-emerald-700/30"
                            }`}
                          >
                            <span
                              className={
                                activeTab ===
                                item.toLowerCase().replace(" ", "-")
                                  ? "font-medium"
                                  : ""
                              }
                            >
                              {item}
                            </span>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
           
            {/* Rate Calculator Tab */}
            <motion.li 
              variants={itemHoverVariants}
              whileHover="hover"
            >
              <div
                onClick={() => handleActiveTab("rate-calculator")}
                className={`flex items-center space-x-4 py-3 px-4 cursor-pointer rounded-lg transition-all duration-200
                  ${
                    activeTab === "rate-calculator"
                      ? "bg-emerald-700/90 text-white shadow-md"
                      : "text-white hover:bg-emerald-800/50"
                  }`}
              >
                <Calculator className="w-5 h-5" />
                <span className="font-medium">Rate Calculator</span>
              </div>
            </motion.li>

            {/* Wallet Dropdown */}
            <motion.li 
              variants={itemHoverVariants}
              whileHover="hover"
            >
              <div
                onClick={handleToggleWallet}
                className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg hover:bg-emerald-800/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Wallet</span>
                </div>
                <motion.div
                  animate={{ rotate: isWalletOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>
              <AnimatePresence initial={false}>
                {isWalletOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="ml-4 pl-4 border-l border-emerald-600/50 mt-1 overflow-hidden"
                  >
                    <ul className="space-y-1 py-1">
                      {["Recharge Wallet", "Transactions", "Invoice"].map((item, index) => (
                        <motion.li 
                          key={item} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: {
                              delay: index * 0.03,
                              duration: 0.2,
                              ease: "easeOut"
                            }
                          }}
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.15 }}
                          className="my-1"
                        >
                          <button
                            onClick={() =>
                              handleActiveTab(item.toLowerCase().replace(" ", "-"))
                            }
                            className={`flex items-center w-full py-2 px-3 rounded-md text-sm transition-all duration-150 ${
                              activeTab === item.toLowerCase().replace(" ", "-")
                                ? "bg-emerald-600/80 text-white"
                                : "text-gray-200 hover:bg-emerald-700/30"
                            }`}
                          >
                            <span className={activeTab === item.toLowerCase().replace(" ", "-") ? "font-medium" : ""}>
                              {item}
                            </span>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>

            {/* Settings Dropdown */}
            <motion.li 
              variants={itemHoverVariants}
              whileHover="hover"
            >
              <div
                onClick={handleToggleSettings}
                className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg hover:bg-emerald-800/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </div>
                <motion.div
                  animate={{ rotate: isSettingsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>
              <AnimatePresence initial={false}>
                {isSettingsOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    className="ml-4 pl-4 border-l border-emerald-600/50 mt-1 overflow-hidden"
                  >
                    <ul className="space-y-1 py-1">
                      {["Profile", "Pickup Addresses", "KYC Details"].map(
                        (item, index) => (
                          <motion.li 
                            key={item} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                              opacity: 1, 
                              x: 0,
                              transition: {
                                delay: index * 0.03,
                                duration: 0.2,
                                ease: "easeOut"
                              }
                            }}
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.15 }}
                            className="my-1"
                          >
                            <button
                              onClick={() =>
                                handleActiveTab(item.toLowerCase().replace(" ", "-"))
                              }
                              className={`flex items-center w-full py-2 px-3 rounded-md text-sm transition-all duration-150 ${
                                activeTab === item.toLowerCase().replace(" ", "-")
                                  ? "bg-emerald-600/80 text-white"
                                  : "text-gray-200 hover:bg-emerald-700/30"
                              }`}
                            >
                              <span className={activeTab === item.toLowerCase().replace(" ", "-") ? "font-medium" : ""}>
                                {item}
                              </span>
                            </button>
                          </motion.li>
                        )
                      )}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          </ul>
        </div>
      </div>
    );
  }, [
    isOrdersOpen,
    isWalletOpen,
    isManifestedOpen,
    isSettingsOpen,
    activeTab,
    handleActiveTab,
    itemHoverVariants,
    dropdownVariants
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar balance={balance} />
      </Suspense>
      
      <div className="flex flex-grow relative">
        {/* Mobile Sidebar Toggle Button - Fixed to bottom right */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          onClick={toggleSidebar}
          className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 transition-all duration-200"
        >
          <motion.div
            animate={{ rotate: isSidebarOpen ? 90 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.div>
        </motion.button>

        {/* Desktop Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="hidden lg:block w-72 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white p-6 shadow-xl"
        >
{SidebarContent}
        </motion.div>

        {/* Mobile Sidebar Overlay */}
<AnimatePresence>
  {isSidebarOpen && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="lg:hidden fixed inset-0 bg-opacity-40 backdrop-blur-sm z-40"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={sidebarVariants}
        className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white z-50 shadow-2xl overflow-y-auto"
      >
        <div className="p-4 h-full flex flex-col">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full bg-emerald-700/30 hover:bg-emerald-700/50 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Sidebar Content */}
          {SidebarContent}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full"
            >
              {activeTab === "dashboard" && <Dashboard />}
              {activeTab === "add-order" && <AddOrder walletBalance={balance} onOrderPayment={handleOrderPayment} />}
              {activeTab === "drafts" && <Draft />}
              {activeTab === "ready" && <Ready />}
              {activeTab === "packed" && <Packed />}
              {activeTab === "manifested" && <Manifested /> }
              {activeTab === "dispatched" && <Dispatched />}
              {activeTab === "received" && <Received />}
              {activeTab === "cancelled" && <Cancelled />}
              {activeTab === "disputed" && <Dispute />} 
              {activeTab === "rate-calculator" && <RateCalculator />}
              {activeTab === "recharge-wallet" && (
                <RechargeWallet onRecharge={handleRecharge} />
              )}
              {activeTab === "wallet-history" && <WalletHistory />}
              {activeTab === "invoice" && <MonthlyInvoice />}
              {activeTab === "transactions" && <TransactionHistory />}
              {activeTab === "manifest" && <ManifestListing />}
              {activeTab === "pickup-request" && <PickupRequest />}
              {activeTab === "profile" && <MyProfile />}
              {activeTab === "pickup-addresses" && <PickupAddresses />}
              {activeTab === "kyc-details" && <KYCDetails />} 
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage