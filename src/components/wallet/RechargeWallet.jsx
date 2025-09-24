"use client";
import React, { useState } from "react";
import { 
  Wallet, PlusCircle, CreditCard, Zap, Shield, ArrowRight, 
  TrendingUp, Clock, Star, Gift, CheckCircle, Info,
  Smartphone, Globe, Lock, Award
} from "lucide-react";
import axios from "axios";

const RechargeWallet = ({ onRecharge }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  // Quick amount buttons for better UX
  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet/recharge-wallet`, 
        {amount, userId})

        if(response?.data?.checkoutPageUrl){
          window.location.href = response.data.checkoutPageUrl;
        }
    } catch (err) {
      console.error("Axios Error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Something went wrong while initiating payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const features = [
    { icon: Shield, title: "Bank-Level Security", desc: "256-bit SSL encryption protects your data" },
    { icon: Zap, title: "Instant Processing", desc: "Money added to wallet immediately" },
    { icon: Award, title: "Trusted Platform", desc: "Used by 10M+ users nationwide" },
    { icon: Lock, title: "PCI Compliant", desc: "Meeting highest security standards" }
  ];

  const paymentMethods = [
    { icon: CreditCard, name: "Credit & Debit Cards", desc: "Visa, Mastercard, RuPay" },
    { icon: Smartphone, name: "UPI Payments", desc: "Google Pay, PhonePe, Paytm" },
    { icon: Globe, name: "Net Banking", desc: "All major banks supported" },
    { icon: Wallet, name: "Digital Wallets", desc: "PayPal, Amazon Pay & more" }
  ];

  const benefits = [
    "No hidden charges or fees",
    "24/7 customer support",
    "Instant refund policy",
    "Multiple payment options",
    "Transaction history tracking",
    "Mobile app compatibility"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Wallet Recharge
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Add money to your wallet securely and enjoy seamless transactions across our platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Main Recharge Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm sticky top-6">
              {/* Header with Gradient Background */}
              <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-2">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm mr-3">
                      <PlusCircle className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Add Money</h2>
                  </div>
                  <p className="text-emerald-100 text-sm">Quick & secure recharge</p>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Amount Input */}
                <div className="space-y-4">
                  <label className="block text-gray-800 text-base font-semibold">
                    Enter Amount
                  </label>
                  
                  <div className="relative">
                    <div className={`
                      relative border-2 rounded-xl transition-all duration-300 bg-gray-50 
                      ${focusedInput ? 'border-emerald-500 bg-white shadow-lg' : 'border-gray-200'}
                      ${amount ? 'border-emerald-400' : ''}
                    `}>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-lg">
                        ₹
                      </div>
                      <input
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onFocus={() => setFocusedInput(true)}
                        onBlur={() => setFocusedInput(false)}
                        className="w-full bg-transparent pl-8 pr-4 py-4 text-xl font-semibold text-gray-800 placeholder-gray-400 focus:outline-none rounded-xl"
                      />
                      {amount && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    
                    {amount && Number(amount) > 0 && (
                      <div className="mt-2 text-right">
                        <span className="text-sm text-gray-500">You're adding </span>
                        <span className="text-emerald-600 font-bold text-lg">{formatCurrency(amount)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="space-y-3">
                  <label className="block text-gray-700 text-sm font-medium">
                    Quick Select
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        onClick={() => handleQuickAmount(quickAmount)}
                        className={`
                          px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all duration-200
                          ${amount === quickAmount.toString() 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50'
                          }
                          hover:shadow-md active:scale-95
                        `}
                      >
                        ₹{quickAmount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recharge Button */}
                <button
                  onClick={handleRechargeClick}
                  disabled={loading || !amount || Number(amount) <= 0}
                  className={`
                    w-full relative overflow-hidden rounded-xl py-4 font-semibold text-lg transition-all duration-300 
                    ${loading || !amount || Number(amount) <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl active:scale-[0.98]'
                    }
                  `}
                >
                  <div className="relative z-10 flex items-center justify-center space-x-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-5 h-5" />
                        <span>Recharge Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Features & Info */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-emerald-600" />
                Payment Methods
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <method.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{method.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{method.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-blue-600" />
                Security & Trust
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <feature.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{feature.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-500" />
                Why Choose Our Wallet?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
                <TrendingUp className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">10M+</div>
                <div className="text-xs text-emerald-100">Happy Users</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <Clock className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">&lt;2s</div>
                <div className="text-xs text-blue-100">Avg Processing</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <Shield className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs text-purple-100">Secure</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <Award className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-xs text-orange-100">User Rating</div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Info className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-2">Need Help?</h4>
                  <p className="text-indigo-100 text-sm mb-4">
                    Our support team is available 24/7 to assist you with any recharge issues.
                  </p>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargeWallet;