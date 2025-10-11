// pages/privacy-policy.jsx
'use client'
import React from 'react';
import { Shield, Lock, Eye, Database, Globe, Bell, ArrowLeftFromLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
const PrivacyPolicy = () => {
  const router =  useRouter()
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <button
      onClick={() => router.push('/')}
      className="flex items-center gap-2 px-4 py-2  text-black rounded-md hover:cursor-pointer"
    >
      <ArrowLeftFromLine size={20} />
      <span>Back</span>
    </button>
          <div className="flex items-center justify-center mb-8">
            <Shield className="h-12 w-12 text-emerald-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Privacy Policy
          </h1>
          
          <div className="text-sm text-gray-600 mb-8 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="mr-2 text-emerald-600" size={20} />
                Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Personal information (name, email, phone number, address)</li>
                <li>Payment information (credit card details, billing address)</li>
                <li>Shipping information (delivery address, recipient details)</li>
                <li>Account credentials (username, password)</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="mr-2 text-emerald-600" size={20} />
                How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Process and deliver your shipments</li>
                <li>Process payments and prevent fraud</li>
                <li>Communicate with you about your orders</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Improve our services and customer experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="mr-2 text-emerald-600" size={20} />
                Payment Security
              </h2>
              <p className="text-gray-700 mb-4">
                Your payment security is our priority. We implement industry-standard security measures:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>PCI DSS compliance for payment processing</li>
                <li>SSL/TLS encryption for data transmission</li>
                <li>Tokenization of sensitive payment information</li>
                <li>Regular security audits and monitoring</li>
                <li>Two-factor authentication for account access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="mr-2 text-emerald-600" size={20} />
                Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Payment processors for transaction completion</li>
                <li>Shipping partners for delivery services</li>
                <li>Law enforcement when required by law</li>
                <li>Third parties with your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="mr-2 text-emerald-600" size={20} />
                Your Rights and Choices
              </h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Disable cookies in your browser</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Data Retention
              </h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to provide our services 
                and comply with legal obligations. Payment information is securely stored and deleted 
                according to PCI DSS requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-4 text-gray-700">
                <p className="text-gray-700">Email: thetraceexpress@gmail.com</p>
                <p className="text-gray-700">Mobile: +91 9167077853</p>
                <p className="text-gray-700">Mobile ALT 1: +91 8419958646</p>
                <p className="text-gray-700">Mobile ALT 2: +91 8108735742</p>
                <p className="text-gray-700">Support Hours: 24/7</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;