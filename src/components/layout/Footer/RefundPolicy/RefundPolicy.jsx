// pages/refund-policy.jsx
import React from 'react';
import { RefreshCw, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
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
                At ShipEasy, we strive to provide the best shipping services. This refund policy outlines 
                the circumstances under which refunds are provided and the process for requesting them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="mr-2 text-emerald-600" size={20} />
                Eligible for Refund
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Shipments cancelled before pickup</li>
                <li>Duplicate payments</li>
                <li>Service not provided due to our error</li>
                <li>Overcharged amounts</li>
                <li>Failed deliveries due to our fault</li>
                <li>Damaged goods during transit (subject to insurance terms)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="mr-2 text-red-600" size={20} />
                Not Eligible for Refund
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Shipments already picked up</li>
                <li>Incorrect address provided by customer</li>
                <li>Refused delivery by recipient</li>
                <li>Customs clearance delays</li>
                <li>Force majeure events</li>
                <li>Prohibited items shipped</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="mr-2 text-emerald-600" size={20} />
                Refund Timeline
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="font-semibold text-emerald-600 mr-2">1-2 days:</span>
                    <span className="text-gray-700">Refund request review</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-emerald-600 mr-2">3-5 days:</span>
                    <span className="text-gray-700">Refund processing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-emerald-600 mr-2">5-10 days:</span>
                    <span className="text-gray-700">Refund credited to original payment method</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-emerald-600 mr-2">Instant:</span>
                    <span className="text-gray-700">Wallet credit refunds</span>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Refund Process
              </h2>
              <ol className="list-decimal pl-6 text-gray-700 space-y-3">
                <li>
                  <strong>Submit Request:</strong> Log into your account and submit a refund request 
                  with order details
                </li>
                <li>
                  <strong>Review:</strong> Our team will review your request within 1-2 business days
                </li>
                <li>
                  <strong>Approval:</strong> If approved, you'll receive a confirmation email
                </li>
                <li>
                  <strong>Processing:</strong> Refund will be processed to your original payment method
                </li>
                <li>
                  <strong>Confirmation:</strong> You'll receive a final confirmation once the refund is complete
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="mr-2 text-yellow-600" size={20} />
                Important Notes
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Refund amounts may be subject to cancellation fees</li>
                <li>Bank processing times may vary</li>
                <li>Partial refunds may be issued in certain circumstances</li>
                <li>Promotional discounts are non-refundable</li>
                <li>Wallet credits are non-refundable but can be used for future shipments</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Cancellation Fees
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Cancellation Time</th>
                      <th className="text-right py-2">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b">
                      <td className="py-2">Before pickup scheduled</td>
                      <td className="text-right">No fee</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Within 2 hours of pickup</td>
                      <td className="text-right">10% of shipping cost</td>
                    </tr>
                    <tr>
                      <td className="py-2">After pickup attempted</td>
                      <td className="text-right">25% of shipping cost</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                For refund-related queries or assistance, please contact us:
              </p>
              <div className="bg-emerald-50 rounded-lg p-6">
                <p className="text-gray-700">Email: refunds@shipeasy.com</p>
                <p className="text-gray-700">Phone: +91 1800-123-4567</p>
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