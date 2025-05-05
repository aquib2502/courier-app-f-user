// pages/terms.jsx
import React from 'react';
import { FileText, AlertCircle, CheckCircle, Ban, CreditCard } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center justify-center mb-8">
            <FileText className="h-12 w-12 text-emerald-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Terms of Service
          </h1>
          
          <div className="text-sm text-gray-600 mb-8 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700">
                By accessing or using ShipEasy's services, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, 
                you are prohibited from using or accessing our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="mr-2 text-emerald-600" size={20} />
                2. Payment Terms
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>2.1 Payment Methods:</strong> We accept various payment methods including credit cards, 
                  debit cards, UPI, and digital wallets. All payments are processed securely through our 
                  payment partners.
                </p>
                <p>
                  <strong>2.2 Wallet System:</strong> Users can maintain a wallet balance for faster transactions. 
                  Wallet funds are non-refundable but can be used for future shipments.
                </p>
                <p>
                  <strong>2.3 Pricing:</strong> All prices are listed in Indian Rupees (INR) unless otherwise 
                  specified. Prices may change without notice but will not affect existing orders.
                </p>
                <p>
                  <strong>2.4 Billing:</strong> You agree to provide accurate billing information and authorize 
                  us to charge your selected payment method for all services ordered.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="mr-2 text-emerald-600" size={20} />
                3. Service Usage
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>3.1 Account Registration:</strong> You must register for an account to use our services. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
                <p>
                  <strong>3.2 Shipping Services:</strong> We provide domestic and international shipping services 
                  subject to availability and compliance with shipping regulations.
                </p>
                <p>
                  <strong>3.3 Prohibited Items:</strong> You agree not to ship prohibited items as defined in 
                  our Shipping Policy. We reserve the right to refuse service for non-compliant shipments.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="mr-2 text-emerald-600" size={20} />
                4. Liability and Disclaimers
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>4.1 Limited Liability:</strong> Our liability for any shipment is limited to the 
                  declared value or the maximum liability specified in our insurance policy, whichever is lower.
                </p>
                <p>
                  <strong>4.2 Service Interruptions:</strong> We do not guarantee uninterrupted service and 
                  are not liable for any delays or interruptions beyond our reasonable control.
                </p>
                <p>
                  <strong>4.3 Third-Party Services:</strong> We are not responsible for services provided by 
                  third-party shipping partners beyond our direct control.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                5. Refunds and Cancellations
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>5.1 Cancellation Policy:</strong> Orders can be cancelled before pickup. Cancellation 
                  fees may apply based on the timing of cancellation.
                </p>
                <p>
                  <strong>5.2 Refund Process:</strong> Refunds are processed within 7-10 business days to the 
                  original payment method or as wallet credit, at our discretion.
                </p>
                <p>
                  <strong>5.3 Dispute Resolution:</strong> Any disputes regarding refunds must be raised within 
                  30 days of the transaction date.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Ban className="mr-2 text-emerald-600" size={20} />
                6. Termination
              </h2>
              <p className="text-gray-700">
                We reserve the right to terminate or suspend your account and access to our services at our 
                sole discretion, without notice, for conduct that we believe violates these Terms of Service 
                or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                7. Governing Law
              </h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of India. 
                Any disputes arising under these terms shall be subject to the exclusive jurisdiction 
                of the courts in Mumbai, Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                8. Contact Information
              </h2>
              <p className="text-gray-700">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 text-gray-700">
                <p>Email: legal@shipeasy.com</p>
                <p>Phone: +91 1800-123-4567</p>
                <p>Address: 123 Shipping Street, Mumbai, MH 400001</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;