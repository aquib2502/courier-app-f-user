"use client";
import React, { useState } from "react";
import { 
  Home, Package, FileText, Wallet, ChevronDown, ChevronUp, Dot, LogOut, Settings, Calculator 
} from "lucide-react"; // Import Calculator icon for Rate Calculator
import Link from "next/link";
import AddOrder from "../orders/addOrder";  // Import AddOrder component
import Draft from "../orders/Drafts";
import Ready from "../orders/Ready";
import Packed from "../orders/Packed";
import Manifested from "../orders/Manifested";
import Dispatched from "../orders/Dispatched";
import Received from "../orders/Recieved";
import Cancelled from "../orders/Cancelled";
import RateCalculator from "../RateCalculator/RateCalculator";
import Dashboard from "../dashboard/dashboard";

const HomePage = () => {
  const [isOrdersOpen, setIsOrdersOpen] = useState(false); // State for Orders dropdown
  const [isMultiBoxOpen, setIsMultiBoxOpen] = useState(false); // State for MultiBox dropdown
  const [isWalletOpen, setIsWalletOpen] = useState(false); // State for Wallet dropdown
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State for Settings dropdown
  const [activeTab, setActiveTab] = useState(""); // State for active tab (for "Add Order")

  const toggleOrders = () => setIsOrdersOpen(!isOrdersOpen);
  const toggleMultiBox = () => setIsMultiBoxOpen(!isMultiBoxOpen);
  const toggleWallet = () => setIsWalletOpen(!isWalletOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  // Active and inactive tab styles
  const activeTabStyle = "bg-blue-600 text-white rounded-md";
  const inactiveTabStyle = "text-gray-300 hover:bg-emerald-800 rounded-md";

  const handleActiveTab = (tab) => {
    setActiveTab(tab); // Update activeTab state when a tab is clicked
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white p-6 min-h-screen flex flex-col justify-between">
        
        <div>
          <div className="flex items-center justify-center mb-8">
            <Home className="w-8 h-8 text-emerald-400 mr-2" />
            <h2 className="text-2xl font-bold">A.S Enterprise</h2>
          </div>

          <ul className="space-y-4">
            {/* Dashboard Link */}
            <li>
              <div onClick={() => handleActiveTab("dashboard")} className="flex items-center space-x-4 py-2 cursor-pointer">
                <Calculator className="w-6 h-6 text-white" />
                <span>Dashboard</span>
              </div>
            </li>

            {/* Orders Dropdown */}
            <li>
              <div onClick={toggleOrders} className="flex items-center space-x-4 py-2 cursor-pointer">
                <Package className="w-6 h-6 text-white" />
                <span>Orders</span>
                {isOrdersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              <div
                className={`ml-8 transition-all duration-300 ease-in-out overflow-hidden ${
                  isOrdersOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="mt-1 space-y-1 text-sm">
                  {["Add Order", "Drafts", "Ready", "Packed", "Manifested", "Dispatched", "Received", "Cancelled"].map((item) => (
                    <li key={item} className="flex items-center space-x-2 py-1 mr-16 font-bold">
                      <Dot className="w-3 h-3 text-emerald-300" />
                      <button
                        onClick={() => handleActiveTab(item.toLowerCase().replace(" ", "-"))}
                        className={`block w-full py-1 px-3 transition-all duration-300 ${
                          activeTab === item.toLowerCase().replace(" ", "-") ? activeTabStyle : inactiveTabStyle
                        }`}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Rate Calculator Tab - New Addition */}
            <li>
              <div onClick={() => handleActiveTab("rate-calculator")} className="flex items-center space-x-4 py-2 cursor-pointer">
                <Calculator className="w-6 h-6 text-white" />
                <span>Rate Calculator</span>
              </div>
            </li>

            {/* MultiBox Orders Dropdown */}
            <li>
              <div onClick={toggleMultiBox} className="flex items-center space-x-4 py-2 cursor-pointer">
                <FileText className="w-6 h-6 text-white" />
                <span>MultiBox Orders</span>
                {isMultiBoxOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              <div
                className={`ml-8 transition-all duration-300 ease-in-out overflow-hidden ${
                  isMultiBoxOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="mt-1 space-y-1 text-sm">
                  {["Add Multibox Order", "Drafts", "Ready", "Packed", "Manifested", "Dispatched", "Processed", "Cancelled"].map((item) => (
                    <li key={item} className="flex items-center space-x-2 py-1">
                      <Dot className="w-3 h-3 text-emerald-300" />
                      <Link href={`/multibox-orders/${item.toLowerCase().replace(" ", "-")}`} className="block">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Wallet Dropdown */}
            <li>
              <div onClick={toggleWallet} className="flex items-center space-x-4 py-2 cursor-pointer">
                <Wallet className="w-6 h-6 text-white" />
                <span>Wallet</span>
                {isWalletOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              <div
                className={`ml-8 transition-all duration-300 ease-in-out overflow-hidden ${
                  isWalletOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="mt-1 space-y-1 text-sm">
                  {["Recharge Wallet", "Wallet History", "Transactions"].map((item) => (
                    <li key={item} className="flex items-center space-x-2 py-1">
                      <Dot className="w-3 h-3 text-emerald-300" />
                      <Link href={`/wallet/${item.toLowerCase().replace(" ", "-")}`} className="block">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Settings Dropdown */}
            <li>
              <div onClick={toggleSettings} className="flex items-center space-x-4 py-2 cursor-pointer">
                <Settings className="w-6 h-6 text-white" />
                <span>Settings</span>
                {isSettingsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
              <div
                className={`ml-8 transition-all duration-300 ease-in-out overflow-hidden ${
                  isSettingsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="mt-1 space-y-1 text-sm">
                  {["Profile", "Pickup Addresses", "Preferences"].map((item) => (
                    <li key={item} className="flex items-center space-x-2 py-1">
                      <Dot className="w-3 h-3 text-emerald-300" />
                      <Link href={`/settings/${item.toLowerCase().replace(" ", "-")}`} className="block">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>

        {/* Adjusted Logout Button */}
        <div className="mt-2"> {/* Changed mt-4 to mt-2 */}
          <button className="flex items-center space-x-2 text-white py-2 px-4 hover:bg-emerald-800 rounded w-full">
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Conditionally render Add Order form */}
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "add-order" && <AddOrder />}
        {activeTab === "drafts" && <Draft />}
        {activeTab === "ready" && <Ready />}
        {activeTab === "packed" && <Packed />}
        {activeTab === "manifested" && <Manifested />}
        {activeTab === "dispatched" && <Dispatched />}
        {activeTab === "received" && <Received />}
        {activeTab === "cancelled" && <Cancelled />}
        {activeTab === "rate-calculator" && <RateCalculator />} {/* Placeholder for the Rate Calculator Tab */}
      </div>
    </div>
  );
};

export default HomePage;
