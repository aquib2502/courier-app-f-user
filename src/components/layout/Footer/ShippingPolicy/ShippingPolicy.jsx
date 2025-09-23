// pages/shipping-policy.jsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, AlertCircle, Clock, ArrowLeftFromLine } from 'lucide-react';

const ShippingPolicy = () => {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Back Button */}
        <button
          onClick={() => router.push('/')}
            className="flex items-center gap-2 mb-8 px-4 py-2  text-black rounded-md hover:cursor-pointer"
          >
          <ArrowLeftFromLine size={20} />
          <span>Back</span>
        </button>
          <div className="flex items-center justify-center mb-8">
            <RefreshCw className="h-12 w-12 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Shipping Policy
          </h1>

          <div className="text-sm text-gray-600 mb-8 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shipping Rates
              </h2>
              <p className="text-gray-700">
                Shipping rates are calculated based on the weight of the package and the destination country. 
                Final charges will be displayed during checkout.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Estimated Delivery Time
              </h2>
             <p className="text-gray-700">
  Delivery times are typically <span className="font-semibold">within 2-3 weeks</span> and may vary depending on the destination and the size or type of the package. 
  We strive to deliver your shipment as quickly as possible, but please note that delays may occur due to customs, weather, or other unforeseen factors.
</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="mr-2 text-yellow-600" size={20} />
                Lost or Misplaced Parcels
              </h2>
              <p className="text-gray-700">
                In the unlikely event that a parcel is lost or misplaced, we will refund 30% of the shipping fees. 
                Please contact our support team to report any missing shipments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                For shipping-related queries or assistance, please contact us:
              </p>
              <div className="bg-emerald-50 rounded-lg p-6">
                <p className="text-gray-700">Email: thetraceexpress@gmail.com</p>
                <p className="text-gray-700">Mobile: +91 9167077853</p>
                <p className="text-gray-700">Support Hours: 24/7</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
