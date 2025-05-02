"use client";
import React from "react";
import { Activity } from "lucide-react";

const TransactionHistory = () => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-md border border-gray-200">
      <div className="flex items-center mb-6">
        <Activity className="w-6 h-6 text-emerald-700 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-500 text-center">No transactions yet.</p>
      </div>
    </div>
  );
};

export default TransactionHistory;
