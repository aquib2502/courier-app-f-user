"use client";
import React, { useEffect, useState, useRef} from "react";
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

const HomePage = () => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isManifestedOpen, setIsManifestedOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isClient, setIsClient] = useState(false);
  const [balance, setBalance] = useState(0);

  const toggleOrders = () => setIsOrdersOpen(!isOrdersOpen);
  const toggleWallet = () => setIsWalletOpen(!isWalletOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

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

    const token = localStorage.getItem("token");
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
        const response = await fetch(`http://localhost:5000/api/wallet/balance/${userId}`);
        const data = await response.json();
        setBalance(data.balance || 0);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    // fetchWalletBalance();
  }, [router, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`, { shallow: true });
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar balance={balance} />
      
      <div className="flex flex-grow">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-72 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white p-6 flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="flex items-center justify-center mb-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-2xl font-bold text-white px-4 py-2 rounded-lg bg-emerald-700/30 backdrop-blur-sm"
              >
                Order Management
              </motion.div>
            </div>

            <ul className="space-y-2">
              {/* Dashboard Link */}
              <motion.li whileHover={{ x: 5 }}>
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
              <motion.li whileHover={{ x: 5 }}>
                <div
                  onClick={toggleOrders}
                  className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg hover:bg-emerald-800/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <Package className="w-5 h-5" />
                    <span className="font-medium">Orders</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOrdersOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isOrdersOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      transition={{ duration: 0.2 }}
                      className="ml-4 pl-4 border-l border-emerald-600/50 mt-1"
                    >
                      <ul className="space-y-1">
                        {[
                          "Add Order",
                          "Drafts",
                          "Ready",
                          "Packed",
                          "Manifested",
                          "Dispatched",
                          "Received",
                          "Cancelled",
                        ].map((item) => (
                          <motion.li
                            key={item}
                            whileHover={{ x: 3 }}
                            className="my-1"
                          >
                            <button
                              onClick={() =>
                                handleActiveTab(
                                  item.toLowerCase().replace(" ", "-")
                                )
                              }
                              className={`flex items-center w-full py-2 px-3 rounded-md text-sm transition-all duration-200 ${
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
              <motion.li whileHover={{ x: 5 }}>
                <div
                  onClick={() => setIsManifestedOpen(!isManifestedOpen)}
                  className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg hover:bg-emerald-800/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">Manifested</span>
                  </div>
                  <motion.div

                    animate={{ rotate: isManifestedOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isManifestedOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      transition={{ duration: 0.2 }}
                      className="ml-4 pl-4 border-l border-emerald-600/50 mt-1"
                    >
                      <ul className="space-y-1">
                        {["Manifest", "Pickup Request"].map((item) => (
                          <motion.li
                            key={item}
                            whileHover={{ x: 3 }}
                            className="my-1"
                          >
                            <button
                              onClick={() =>
                                handleActiveTab(
                                  item.toLowerCase().replace(" ", "-")
                                )
                              }
                              className={`flex items-center w-full py-2 px-3 rounded-md text-sm transition-all duration-200 ${
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
              <motion.li whileHover={{ x: 5 }}>
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
              <motion.li whileHover={{ x: 5 }}>
                <div
                  onClick={toggleWallet}
                  className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg hover:bg-emerald-800/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <Wallet className="w-5 h-5" />
                    <span className="font-medium">Wallet</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isWalletOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isWalletOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      transition={{ duration: 0.2 }}
                      className="ml-4 pl-4 border-l border-emerald-600/50 mt-1"
                    >
                      <ul className="space-y-1">
                        {["Recharge Wallet", "Wallet History", "Transactions"].map((item) => (
                          <motion.li key={item} whileHover={{ x: 3 }} className="my-1">
                            <button
                              onClick={() =>
                                handleActiveTab(item.toLowerCase().replace(" ", "-"))
                              }
                              className={`flex items-center w-full py-2 px-3 rounded-md text-sm transition-all duration-200 ${
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
              <motion.li whileHover={{ x: 5 }}>
                <div
                  onClick={toggleSettings}
                  className="flex items-center justify-between py-3 px-4 cursor-pointer rounded-lg hover:bg-emerald-800/50 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isSettingsOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isSettingsOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      transition={{ duration: 0.2 }}
                      className="ml-4 pl-4 border-l border-emerald-600/50 mt-1"
                    >
                      <ul className="space-y-1">
                        {["Profile", "Pickup Addresses", "Preferences"].map(
                          (item) => (
                            <motion.li
                              key={item}
                              whileHover={{ x: 3 }}
                              className="my-1"
                            >
                              <Link
                                href={`/settings/${item
                                  .toLowerCase()
                                  .replace(" ", "-")}`}
                                className="flex items-center w-full py-2 px-3 rounded-md text-sm text-gray-200 hover:bg-emerald-700/30 transition-all duration-200"
                              >
                                {item}
                              </Link>
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

          {/* Logout Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6"
          >
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-3 w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex-1 p-8 overflow-y-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
              {activeTab === "rate-calculator" && <RateCalculator /> && <CreateManifest />}
              {activeTab === "recharge-wallet" && (
                <RechargeWallet onRecharge={handleRecharge} />
              )}
              {activeTab === "wallet-history" && <WalletHistory />}
              {activeTab === "transactions" && <TransactionHistory />}
              {activeTab === "manifest" && <ManifestListing />}
              {activeTab === "pickup-request" && <PickupRequest />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;