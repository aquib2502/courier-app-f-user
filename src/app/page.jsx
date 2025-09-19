'use client'
import React, { Suspense, useState } from 'react';
import { 
  Globe, 
  Package, 
  Truck, 
  Shield, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X,
  ChevronRight,
  Ship,
  Plane,
  CheckCircle,
  Router
} from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/Footer/Footer';
import { useRouter } from 'next/navigation';
// Navbar Component
const LpNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-lg z-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Ship className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">TraceExpress</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['Home', 'About Us', 'Contact Us'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
              <div className="flex space-x-2">
                <button className="text-emerald-600 hover:text-emerald-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Login
                </button>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Register
                </button>
              </div>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-emerald-600 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {['Home', 'About Us', 'Contact Us'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              <button className="w-full text-left text-emerald-600 hover:text-emerald-700 px-3 py-2 rounded-md text-base font-medium">
                Login
              </button>
              <button className="w-full text-left bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-base font-medium">
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};



const ContactUs = () => {
  return (
    <section id="contact-us" className="py-20 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-emerald-600">Support</span> Information
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help you 24/7. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid lg:grid-cols gap-12">
          <div className="space-y-8">
            {[
              { icon: Phone, title: '24/7 Support Hotline', info: '+91 8419958646', desc: 'Call us anytime for immediate assistance' },
              { icon: Mail, title: 'Email Support', info: 'thetraceexpress@gmail.com', desc: 'Send us your queries and we\'ll respond within 2 hours' },
              { icon: MapPin, title: 'Global Headquarters', info: 'Marol, Andheri (East), Mumbai, India', desc: 'Visit our main office for in-person consultations' },
              { icon: Clock, title: 'Business Hours', info: '24/7 Operations, Support: Mon-Fri 11AM - 11PM', desc: 'Our operations run around the clock' },
            ].map((contact, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <contact.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{contact.title}</h3>
                    <p className="text-emerald-600 font-medium mb-2">{contact.info}</p>
                    <p className="text-gray-600 text-sm">{contact.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* {/* <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div> 
          </div> */}
        </div>
      </div>
    </section>
  );
};


// Home Component
const Home = () => {
  const router = useRouter()

  const handleRedirect =  () =>{
    try {
       const token = localStorage.getItem("userToken");
        if (!token) {
          router.push("/login");
          return;
        }
        else{
          router.push('/home?tab=add-order')
        }

    } catch (error) {
      console.error('Error redirecting', error)
    }
  }

  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="mb-12 lg:mb-0">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                <Globe className="w-4 h-4 mr-2" />
                Global Shipping Solutions
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="text-emerald-600">International</span><br />
                  Shipping
                </h1>
                
                <div className="space-y-2 text-lg lg:text-xl text-gray-700">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Door-to-Door Delivery
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3" />
                    Easy Documentation and Customs Clearance Support
                  </div>
                </div>
                
                <p className="text-xl lg:text-2xl text-gray-800 font-semibold">
                  Your product deserves a <span className="text-emerald-600">'Global Stage'</span>
                </p>
                
                <p className="text-lg text-gray-600">
                  We have a tailor-made shipping option for everyone, especially <span className="font-semibold text-emerald-600">You!</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                onClick={handleRedirect}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button 
                onClick={()=>{router.push('/#about-us')}}
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-emerald-50 rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
                  <Globe className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800">Global Reach</h3>
                  <p className="text-sm text-gray-600 mt-2">Worldwide delivery network</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
                  <Truck className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800">Fast Delivery</h3>
                  <p className="text-sm text-gray-600 mt-2">Express shipping options</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
                  <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800">Secure</h3>
                  <p className="text-sm text-gray-600 mt-2">Insurance & tracking</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
                  <Clock className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800">24/7 Support</h3>
                  <p className="text-sm text-gray-600 mt-2">Always here to help</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl transform rotate-6 opacity-20"></div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: '200+', label: 'Countries Served' },
            { number: '1M+', label: 'Packages Delivered' },
            { number: '99.9%', label: 'Delivery Success' },
            { number: '24/7', label: 'Customer Support' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-600">{stat.number}</div>
              <div className="text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Us Component
const AboutUs = () => {
  return (
    <section id="about-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            United by <span className="text-emerald-600">Passion</span>, Driven by <span className="text-emerald-600">Purpose</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At the heart of our business lies a deep passion for innovation and a relentless drive to transform the e-commerce and logistics industry.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">What We Do?</h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Making international shipping simple and affordable for businesses of all sizes. We bridge the gap between global commerce and local businesses, providing seamless logistics solutions that empower growth.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: Package, title: 'Smart Packaging', desc: 'Optimized packaging solutions for every product type' },
                { icon: Globe, title: 'Global Network', desc: 'Extensive worldwide shipping and delivery network' },
                { icon: Shield, title: 'Secure Handling', desc: 'Advanced security measures and insurance coverage' }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-emerald-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 lg:mt-0">
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full h-full">
                  <div className="bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
                    <Ship className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200 mt-8">
                    <Plane className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200">
                    <Truck className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200 mt-4">
                    <Package className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200 -mt-4">
                    <Globe className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-200 mt-8">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl p-8 lg:p-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose TraceExpress?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Star, title: 'Premium Service', desc: 'White-glove treatment for every shipment' },
              { icon: Clock, title: 'Time Efficiency', desc: 'Fastest delivery times in the industry' },
              { icon: Shield, title: 'Complete Protection', desc: 'Full insurance and damage protection' },
              { icon: Globe, title: 'Global Presence', desc: 'Offices and partners in 200+ countries' },
              { icon: Phone, title: 'Expert Support', desc: 'Dedicated account managers' },
              { icon: Package, title: 'Smart Solutions', desc: 'AI-powered logistics optimization' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// // Contact Us Component
// const ContactUs = () => {
//   return (
//     <section id="contact-us" className="py-20 bg-gradient-to-br from-emerald-50 to-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
//             <span className="text-emerald-600">Support</span> Information
//           </h2>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             We're here to help you 24/7. Reach out to us through any of the channels below.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-12">
//           <div className="space-y-8">
//             {[
//               {
//                 icon: Phone,
//                 title: '24/7 Support Hotline',
//                 info: '+91 8419958646',
//                 desc: 'Call us anytime for immediate assistance'
//               },
//               {
//                 icon: Mail,
//                 title: 'Email Support',
//                 info: 'thetraceexpress@gmail.com',
//                 desc: 'Send us your queries and we\'ll respond within 2 hours'
//               },
//               {
//                 icon: MapPin,
//                 title: 'Global Headquarters',
//                 info: 'Marol, Andheri (East), Mumbai, India',
//                 desc: 'Visit our main office for in-person consultations'
//               },
//               {
//                 icon: Clock,
//                 title: 'Business Hours',
//                 info: '24/7 Operations, Support: Mon-Fri 11AM - 11PM',
//                 desc: 'Our operations run around the clock'
//               }
//             ].map((contact, index) => (
//               <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
//                 <div className="flex items-start space-x-4">
//                   <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <contact.icon className="w-6 h-6 text-emerald-600" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900 mb-1">{contact.title}</h3>
//                     <p className="text-emerald-600 font-medium mb-2">{contact.info}</p>
//                     <p className="text-gray-600 text-sm">{contact.desc}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
//             <div className="space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <div className="block text-sm font-medium text-gray-700 mb-2">First Name</div>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
//                     placeholder="John"
//                   />
//                 </div>
//                 <div>
//                   <div className="block text-sm font-medium text-gray-700 mb-2">Last Name</div>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
//                     placeholder="Doe"
//         </div>
//       </div>
//     </section>
//   );
// };

// Footer Component
const LpFooter = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Ship className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold">TraceExpress</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted partner for international shipping solutions. Making global commerce simple and accessible for businesses worldwide.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons can be added here */}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About Us', 'Contact Us', 'Track Package', 'Get Quote'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {['International Shipping', 'Express Delivery', 'Customs Clearance', 'Packaging Solutions', 'Cargo Insurance'].map((service) => (
                <li key={service}>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-200">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 TraceExpress. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <a key={link} href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const page = () =>{
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar should be responsive */}
      <Suspense fallback={<div>Loading Navbar...</div>}>
        <Navbar balance={1000} /> {/* pass balance if required */}
      </Suspense>
      
      <main className="overflow-x-hidden">
        <Home />
        <AboutUs />
        <ContactUs />
      </main>

      <Footer />
    </div>
  );
}
export default page;