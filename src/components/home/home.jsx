"use client";
import React from "react";
import { Home, Package, FileText, Wallet, Calculator } from "lucide-react"; // Correct the icon names
import Link from "next/link"; // For routing to different pages

const HomePage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white p-4 min-h-screen">
        <div className="flex items-center justify-center mb-10">
          <Home className="w-8 h-8 text-emerald-400 mr-2" /> {/* Use the correct icon */}
          <h2 className="text-2xl font-bold">ShipGlobal</h2>
        </div>

        <ul className="space-y-6">
          {/* Dashboard Link */}
          <li>
            <Link href="/dashboard" className="flex items-center space-x-4">
              <Home className="w-6 h-6 text-white" />
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Orders Link */}
          <li>
            <Link href="/orders" className="flex items-center space-x-4">
              <Package className="w-6 h-6 text-white" />
              <span>Orders</span>
            </Link>
          </li>

          {/* MultiBox Orders Link */}
          <li>
            <Link href="/multibox-orders" className="flex items-center space-x-4">
              <FileText className="w-6 h-6 text-white" />
              <span>MultiBox Orders</span>
            </Link>
          </li>

          {/* Manifest Link */}
          <li>
            <Link href="/manifest" className="flex items-center space-x-4">
              <FileText className="w-6 h-6 text-white" />
              <span>Manifest</span>
            </Link>
          </li>

          {/* Wallet Link */}
          <li>
            <Link href="/wallet" className="flex items-center space-x-4">
              <Wallet className="w-6 h-6 text-white" />
              <span>Wallet</span>
            </Link>
          </li>

          {/* Rate Calculator Link */}
          <li>
            <Link href="/rate-calculator" className="flex items-center space-x-4">
              <Calculator className="w-6 h-6 text-white" />
              <span>Rate Calculator</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Add your main content here */}
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
      </div>
    </div>
  );
};

export default HomePage;
