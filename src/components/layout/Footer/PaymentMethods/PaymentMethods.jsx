// pages/payment-methods.jsx
import React from 'react';
import { CreditCard, Smartphone, Wallet, ShieldCheck, Building, RefreshCw } from 'lucide-react';

const PaymentMethods = () => {
  const paymentOptions = [
    {
      category: "Credit & Debit Cards",
      icon: CreditCard,
      description: "We accept all major credit and debit cards",
      methods: [
        { name: "Visa", logo: "/images/payment/visa.png" },
        { name: "Mastercard", logo: "/images/payment/mastercard.png" },
        { name: "American Express", logo: "/images/payment/amex.png" },
        { name: "RuPay", logo: "/images/payment/rupay.png" }
      ]
    },
    {
      category: "UPI & Digital Wallets",
      icon: Smartphone,
      description: "Quick and secure digital payment options",
      methods: [
        { name: "UPI", logo: "/images/payment/upi.png" },
        { name: "Google Pay", logo: "/images/payment/gpay.png" },
        { name: "PhonePe", logo: "/images/payment/phonepe.png" },
        { name: "Paytm", logo: "/images/payment/paytm.png" }
      ]
    },
    {
      category: "ShipEasy Wallet",
      icon: Wallet,
      description: "Pre-load funds for faster checkout",
      methods: [
        { name: "Wallet Balance", logo: "/images/payment/wallet.png" },
        { name: "Auto-reload", logo: "/images/payment/auto-reload.png" }
      ]
    },
    {
      category: "Net Banking",
      icon: Building,
      description: "Direct bank transfers from major banks",
      methods: [
        { name: "HDFC Bank", logo: "/images/payment/hdfc.png" },
        { name: "ICICI Bank", logo: "/images/payment/icici.png" },
        { name: "SBI", logo: "/images/payment/sbi.png" },
        { name: "Axis Bank", logo: "/images/payment/axis.png" }
      ]
    }
  ];

  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: "PCI DSS Compliant",
      description: "We maintain the highest level of payment security standards"
    },
    {
      icon: RefreshCw,
      title: "3D Secure Authentication",
      description: "Additional layer of security for card transactions"
    },
    {
      icon: CreditCard,
      title: "Tokenization",
      description: "Your card details are encrypted and stored securely"
    },
    {
      icon: ShieldCheck,
      title: "SSL Encryption",
      description: "All transactions are protected with 256-bit SSL encryption"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
        <button
      onClick={() => router.push('/home')}
      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
    >
      <ArrowLeftFromLine size={20} />
      <span>Back</span>
    </button>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Methods</h1>
          <p className="text-xl text-gray-600">Secure and convenient payment options for all your shipping needs</p>
        </div>

        {/* Payment Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {paymentOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Icon className="h-8 w-8 text-emerald-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">{option.category}</h3>
                </div>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {option.methods.map((method, idx) => (
                    <div key={idx} className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                      <img src={method.logo} alt={method.name} className="h-8 object-contain" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Payment Security</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
                  <Icon className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Process */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Our Payment Process Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold mb-2">Select Service</h3>
              <p className="text-gray-600 text-sm">Choose your shipping service and enter shipment details</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold mb-2">Choose Payment</h3>
              <p className="text-gray-600 text-sm">Select your preferred payment method</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold mb-2">Secure Transaction</h3>
              <p className="text-gray-600 text-sm">Complete payment through our secure gateway</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-600 font-bold text-lg">4</span>
              </div>
              <h3 className="font-semibold mb-2">Confirmation</h3>
              <p className="text-gray-600 text-sm">Receive instant confirmation and tracking details</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
              <p className="text-gray-600">Yes, all payment information is encrypted using industry-standard SSL technology and we are PCI DSS compliant.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I save my payment method for future use?</h3>
              <p className="text-gray-600">Yes, you can securely save your payment methods in your account for faster checkout.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens if my payment fails?</h3>
              <p className="text-gray-600">If a payment fails, you'll be notified immediately and can try another payment method or contact our support team.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do refunds work?</h3>
              <p className="text-gray-600">Refunds are processed within 7-10 business days to your original payment method or as wallet credit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;