// pages/refund-policy.jsx
'use client'
import React from 'react';
import { RefreshCw, AlertCircle, Clock, ArrowLeftFromLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
const RefundPolicy = () => {

  const router = useRouter()
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <button
      onClick={() => router.push('/home')}
      className="flex items-center gap-2 px-4 py-2  text-black rounded-md  hover:cursor-pointer"
    >
      <ArrowLeftFromLine size={20} />
      <span>Back</span>
    </button>
          <div className="flex items-center justify-center mb-8">
            <RefreshCw className="h-12 w-12 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Refund Policy
          </h1>

          <div className="text-sm text-gray-600 mb-8 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Overview
              </h2>
              <p className="text-gray-700">
                At TraceExpress, we do not provide automatic refunds. If you wish to cancel a shipment, 
                you may request a refund by providing your order details and a valid reason for cancellation. 
                Refunds will only be granted at our discretion after reviewing the request.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="mr-2 text-emerald-600" size={20} />
                Refund Request Timeline
              </h2>
              <p className="text-gray-700">
                Once you submit a cancellation request, our team will review it and determine if a refund is applicable. 
                This review typically takes 1-3 business days. If approved, the refund will be processed to your original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                How to Request a Refund
              </h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-3">
                <li>
                  Email your order details and reason for cancellation to: 
                  <strong> thetraceexpress@gmail.com</strong>
                </li>
                <li>
                  Our team will review your request and assess the validity of the reason provided.
                </li>
                <li>
                  If approved, you will receive confirmation and the refund will be processed accordingly.
                </li>
                <li>
                  Please note: Submission of a request does not guarantee a refund.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="mr-2 text-yellow-600" size={20} />
                Important Notes
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Refunds are only provided at the discretion of TraceExpress</li>
                <li>Invalid or incomplete requests may be declined</li>
                <li>Refund processing times may vary depending on payment method and bank</li>
                <li>No automatic refunds are offered for any shipment cancellations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                For refund-related queries or assistance, please contact us:
              </p>
              <div className="bg-emerald-50 rounded-lg p-6">
                <p className="text-gray-700">Email: thetraceexpress@gmail.com</p>
                <p className="text-gray-700">Support Hours: 24/7</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
