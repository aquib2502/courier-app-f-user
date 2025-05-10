// components/layout/Footer.jsx
import React from 'react';
import Link from 'next/link';
import { 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  CreditCard, 
  FileText, 
  HelpCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Services', href: '/services' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Partner With Us', href: '/partners' }
    ],
    services: [
      { name: 'Domestic Shipping', href: '/services/domestic' },
      { name: 'International Shipping', href: '/services/international' },
      { name: 'Express Delivery', href: '/services/express' },
      { name: 'Freight Services', href: '/services/freight' },
      { name: 'Track Shipment', href: '/track' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Shipping Calculator', href: '/calculator' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Order Support', href: '/support/orders' },
      { name: 'Booking Guide', href: '/guide' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'Refund Policy', href: '/refund-policy' },
      { name: 'Shipping Policy', href: '/shipping-policy' }
    ],
    payment: [
      { name: 'Payment Methods', href: '/payment-methods' },
      { name: 'Security', href: '/security' },
      { name: 'Wallet Terms', href: '/wallet-terms' },
      { name: 'Transaction Policy', href: '/transaction-policy' },
      { name: 'Data Protection', href: '/data-protection' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      {/* <div className="bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-white">Subscribe to Our Newsletter</h3>
              <p className="text-emerald-100">Get updates on shipping offers and industry news</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 w-full md:w-80 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-900"
              />
              <button className="bg-gray-900 text-white px-6 py-2 rounded-r-lg hover:bg-gray-800 transition-colors flex items-center">
                Subscribe
                <ChevronRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Package className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-2xl font-bold text-white">THE TRACE EXPRESS</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for domestic and international shipping solutions. 
              We deliver with speed, security, and reliability.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin size={16} className="text-emerald-500 mr-2" />
                <span>123 Shipping Street, Mumbai, MH 400001</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="text-emerald-500 mr-2" />
                <span>+91 1800-123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="text-emerald-500 mr-2" />
                <span>support@THE TRACE EXPRESS.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-emerald-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-emerald-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-emerald-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal & Payment</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-emerald-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment and Security Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center">
              <Shield className="text-emerald-500 mr-2" size={20} />
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="text-emerald-500 mr-2" size={20} />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center">
              <FileText className="text-emerald-500 mr-2" size={20} />
              <span className="text-sm">PCI DSS Compliant</span>
            </div>
            <div className="flex items-center">
              <HelpCircle className="text-emerald-500 mr-2" size={20} />
              <span className="text-sm">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} THE TRACE EXPRESS. All rights reserved. | Made with ❤️ in India
          </div>
          <div className="flex space-x-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                  aria-label={social.label}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          <span className="text-sm text-gray-400">We accept:</span>
          <div className="flex items-center space-x-4">
            <img src="./payment/visa.png" alt="Visa" className="h-8" />
            
            <img src="./payment/paytm.png" alt="Paytm" className="h-8" />
            <img src="./payment/gpay.png" alt="Google Pay" className="h-8" />
            <img src="./payment/phone-pay.png" alt="PhonePe" className="h-8" />
          </div>
        </div>

        {/* Trust Badges
        <div className="mt-8 flex flex-wrap justify-center items-center gap-8">
          <div className="text-center">
            <img src="/images/badges/iso-certified.png" alt="ISO Certified" className="h-12 mx-auto mb-2" />
            <span className="text-xs text-gray-400">ISO 9001:2015</span>
          </div>
          <div className="text-center">
            <img src="/images/badges/gdpr.png" alt="GDPR Compliant" className="h-12 mx-auto mb-2" />
            <span className="text-xs text-gray-400">GDPR Compliant</span>
          </div>
          <div className="text-center">
            <img src="/images/badges/ssl.png" alt="SSL Secured" className="h-12 mx-auto mb-2" />
            <span className="text-xs text-gray-400">SSL Secured</span>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;