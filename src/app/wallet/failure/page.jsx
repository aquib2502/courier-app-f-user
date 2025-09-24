"use client";
import React from "react";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const WalletFailure = ({ amountAttempted }) => {
  const router = useRouter();

  const handleTryAgain = () => {
    router.push("/home?tab=recharge-wallet"); // Redirect back to wallet recharge page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-8">
      <XCircle className="w-20 h-20 text-red-600 mb-6" />
      <h1 className="text-3xl font-bold text-red-800 mb-2">
        Payment Failed!
      </h1>

      {amountAttempted && (
        <p className="text-lg text-red-700 mb-6">
          ₹{amountAttempted} could not be added to your wallet.
        </p>
      )}

      <p className="text-sm text-gray-600 mb-8">
        Please try again or contact support if the issue persists.
      </p>

      <button
        onClick={handleTryAgain}
        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
      >
        Try Again
      </button>
    </div>
  );
};

export default WalletFailure;
