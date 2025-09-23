import React from "react";
import Link from "next/link";
import { 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/#about-us" },
      { name: "Contact Us", href: "/#contact-us" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms" },
      // { name: "Cookie Policy", href: "/cookie-policy" }, 
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Shipping Policy", href: "/shipping-policy" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300 text-base">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <Package className="h-10 w-10 text-emerald-500" />
              <span className="ml-3 text-3xl font-bold text-white">
                THE TRACE EXPRESS
              </span>
            </div>
            {/* <p className="text-gray-400 text-base leading-relaxed">
              Your trusted partner for domestic and international shipping
              solutions. We deliver with speed, security, and reliability.
            </p> */}

            <div className="space-y-5 text-gray-300">
              <div>
                <p className="text-white font-semibold text-lg">
                  24/7 Support Hotline
                </p>
                <p className="flex items-center mt-1">
                  <Phone size={18} className="text-emerald-500 mr-2" />
                  +91 9167077853
                </p>
              </div>

              <div>
                <p className="text-white font-semibold text-lg">Email Support</p>
                <p className="flex items-center mt-1">
                  <Mail size={18} className="text-emerald-500 mr-2" />
                  thetraceexpress@gmail.com
                </p>
              </div>

              <div>
                <p className="text-white font-semibold text-lg">
                  Global Headquarters
                </p>
                <p className="flex items-start mt-1">
                  <MapPin size={18} className="text-emerald-500 mr-2 mt-1" />
                  Marol, Andheri (East), Mumbai, India
                </p>
              </div>

              <div>
                <p className="text-white font-semibold text-lg">Business Hours</p>
                <p className="mt-1">
                  24/7 Operations <br />
                  Support: Mon-Fri 11AM - 11PM
                </p>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-xl border-b border-gray-700 pb-2">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-emerald-500 transition-colors text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-xl border-b border-gray-700 pb-2">
              Policies
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-emerald-500 transition-colors text-base"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* WhatsApp Link */}
        <div className="mt-12 flex justify-center">
          <a
            href="https://wa.me/918419958646"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full shadow-md transition text-base font-semibold"
          >
            <MessageCircle size={22} className="mr-2" />
            Chat with us on WhatsApp
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p className="mb-4 md:mb-0">
            © {currentYear} THE TRACE EXPRESS. All rights reserved.
          </p>
          {/* <p className="text-gray-400">Made with ❤️ A&A Technologies </p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
