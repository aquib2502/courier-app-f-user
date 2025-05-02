"use client";
import React from "react";
import { useState } from "react";
import { Wallet, PlusCircle } from "lucide-react";

const RechargeWallet = ({onRecharge}) => {
    const [amount, setAmount] = useState("");

    const handleRechargeClick = () => {
        if (amount) {
          onRecharge(Number(amount));  // 👈 call parent function
          setAmount("");
        }
      };


  return (
    <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-md border border-gray-200">
      <div className="flex items-center mb-6">
        <Wallet className="w-6 h-6 text-emerald-700 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Recharge Wallet</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <label className="block text-gray-700 mb-2 font-medium">Amount</label>
         <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
        <button
         onClick={handleRechargeClick}
        className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition">
          <PlusCircle className="inline-block w-4 h-4 mr-2" />
          Recharge Now
        </button>
      </div>
    </div>
  );
};

export default RechargeWallet;
