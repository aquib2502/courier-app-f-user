"use client";
import React, { useState } from "react";
import { Wallet, PlusCircle } from "lucide-react";
import axios from "axios";

const RechargeWallet = ({ onRecharge }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Decode JWT token manually
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return null;

      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(window.atob(base64));

      return decoded?.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleRechargeClick = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("User not logged in");
      return;
    }

    if (!amount || Number(amount) <= 0) return;

    setLoading(true);
    try{
      const response = await axios.post('http://localhost:5000/api/wallet/recharge-wallet', 
        {amount, userId})

        if(response?.data?.checkoutPageUrl){
          window.location.href = response.data.checkoutPageUrl; // ✅ Correct

        }
    } catch (err) {
      console.error("Axios Error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Something went wrong while initiating payment.");
    } finally {
      setLoading(false);
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
          disabled={loading}
          className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusCircle className="inline-block w-4 h-4 mr-2" />
          {loading ? "Processing..." : "Recharge Now"}
        </button>
      </div>
    </div>
  );
};

export default RechargeWallet;
