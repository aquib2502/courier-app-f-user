"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const WalletSuccess = ({ amountAdded }) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/home?tab=recharge-wallet"); // redirect to wallet page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-8">
      <CheckCircle className="w-20 h-20 text-green-600 mb-6" />
      <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
      {amountAdded && (
        <p className="text-lg text-green-700 mb-6">
          ₹{amountAdded} has been added to your wallet.
        </p>
      )}
      <button
        onClick={handleGoBack}
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
      >
        Go to Wallet
      </button>
    </div>
  );
};

export default WalletSuccess;
