// pages/cookie-policy.jsx
'use client'
import React from 'react';
import { Cookie, Settings, BarChart, Shield, Info, ArrowLeftFromLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
const CookiePolicy = () => {
  const router = useRouter();
  const cookieTypes = [
    {
      name: "Essential Cookies",
      icon: Shield,
      description: "Required for basic site functionality",
      examples: ["Session management", "Security tokens", "User preferences"],
      canDisable: false
    },
    {
      name: "Performance Cookies",
      icon: BarChart,
      description: "Help us improve our website performance",
      examples: ["Page load times", "Error rates", "Feature usage"],
      canDisable: true
    },
    {
      name: "Functional Cookies",
      icon: Settings,
      description: "Enable enhanced functionality and personalization",
      examples: ["Language preferences", "Location data", "User interface settings"],
      canDisable: true
    },
    {
      name: "Marketing Cookies",
      icon: Info,
      description: "Used to deliver relevant advertisements",
      examples: ["Ad preferences", "Campaign tracking", "Social media integration"],
      canDisable: true
    }
  ];

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
            <Cookie className="h-12 w-12 text-emerald-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Cookie Policy
          </h1>
          
          <div className="text-sm text-gray-600 mb-8 text-center">
            Last updated: {new Date().toLocaleDateString()}
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What Are Cookies?
              </h2>
              <p className="text-gray-700">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                How We Use Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>To keep you signed in to your account</li>
                <li>To remember your preferences and settings</li>
                <li>To improve our website performance</li>
                <li>To analyze how you use our services</li>
                <li>To deliver personalized content and advertisements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Types of Cookies We Use
              </h2>
              <div className="space-y-6">
                {cookieTypes.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-3">
                        <Icon className="h-6 w-6 text-emerald-600 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                      </div>
                      <p className="text-gray-700 mb-3">{type.description}</p>
                      <div className="mb-2">
                        <span className="font-medium text-gray-900">Examples:</span>
                        <ul className="list-disc pl-6 mt-1">
                          {type.examples.map((example, idx) => (
                            <li key={idx} className="text-gray-600">{example}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-sm">
                        {type.canDisable ? (
                          <span className="text-emerald-600">✓ Can be disabled</span>
                        ) : (
                          <span className="text-gray-500">Required for site functionality</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Third-Party Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                We use services from third parties that may also set cookies on your device:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Google Analytics - for website analytics</li>
                <li>Payment processors - for secure transactions</li>
                <li>Social media platforms - for social sharing features</li>
                <li>Advertising partners - for relevant advertisements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Managing Cookies
              </h2>
              <p className="text-gray-700 mb-4">
                You can control and manage cookies in various ways:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Browser Settings</h3>
                <p className="text-gray-700 mb-4">
                  Most browsers allow you to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>See what cookies are stored and delete them individually</li>
                  <li>Block third-party cookies</li>
                  <li>Block all cookies from specific sites</li>
                  <li>Block all cookies from all sites</li>
                  <li>Delete all cookies when you close your browser</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Cookie Settings by Browser
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Google Chrome</span>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                    Manage cookies
                  </a>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Mozilla Firefox</span>
                  <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                    Manage cookies
                  </a>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Safari</span>
                  <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                    Manage cookies
                  </a>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Microsoft Edge</span>
                  <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700">
                    Manage cookies
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. We will notify you of any 
                material changes by posting the new policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="bg-emerald-50 rounded-lg p-6">
                <p className="text-gray-700">Email: privacy@shipeasy.com</p>
                <p className="text-gray-700">Phone: +91 1800-123-4567</p>
                <p className="text-gray-700">Address: 123 Shipping Street, Mumbai, MH 400001</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;