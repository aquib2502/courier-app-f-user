// components/orders/AddOrder/Sidebar.jsx
import React from 'react';
import { Check, MapPin, Box, Truck, DollarSign } from 'lucide-react';

const Sidebar = ({ currentStep, navigateToStep }) => {
  return (
    <div className="w-72 bg-white shadow-xl rounded-2xl p-8 m-6 h-fit sticky top-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Order</h1>
        <p className="text-sm text-gray-500">Complete all steps to place your order</p>
      </div>
      
      <ul className="space-y-3">
        <li 
          onClick={() => navigateToStep(1)}
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            currentStep === 1 ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200'
          }`}>
            <MapPin size={16} />
          </div>
          <div>
            <p className="font-semibold">Buyer Details</p>
            <p className="text-xs opacity-75">Shipping information</p>
          </div>
          {currentStep > 1 && <Check className="ml-auto text-emerald-600" size={16} />}
        </li>

        <li 
          onClick={() => navigateToStep(2)}
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            currentStep === 2 ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 
            currentStep > 2 ? 'text-gray-600 hover:bg-gray-50' : 
            'text-gray-400 cursor-not-allowed'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 2 ? 'bg-emerald-600 text-white' : 
            currentStep > 2 ? 'bg-gray-200' : 'bg-gray-100'
          }`}>
            <Box size={16} />
          </div>
          <div>
            <p className="font-semibold">Order Details</p>
            <p className="text-xs opacity-75">Products & invoice</p>
          </div>
          {currentStep > 2 && <Check className="ml-auto text-emerald-600" size={16} />}
        </li>

        <li 
          onClick={() => navigateToStep(3)}
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            currentStep === 3 ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 
            currentStep > 3 ? 'text-gray-600 hover:bg-gray-50' : 
            'text-gray-400 cursor-not-allowed'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 3 ? 'bg-emerald-600 text-white' : 
            currentStep > 3 ? 'bg-gray-200' : 'bg-gray-100'
          }`}>
            <Truck size={16} />
          </div>
          <div>
            <p className="font-semibold">Shipment Package</p>
            <p className="text-xs opacity-75">Choose delivery</p>
          </div>
          {currentStep > 3 && <Check className="ml-auto text-emerald-600" size={16} />}
        </li>

        <li 
          onClick={() => navigateToStep(4)}
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            currentStep === 4 ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 
            'text-gray-400 cursor-not-allowed'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 4 ? 'bg-emerald-600 text-white' : 'bg-gray-100'
          }`}>
            <DollarSign size={16} />
          </div>
          <div>
            <p className="font-semibold">Place Order</p>
            <p className="text-xs opacity-75">Review & pay</p>
          </div>
        </li>
      </ul>

      <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
        <p className="text-sm font-medium text-emerald-700">Need Help?</p>
        <p className="text-xs text-emerald-600 mt-1">Contact support for assistance</p>
      </div>
    </div>
  );
};

export default Sidebar;