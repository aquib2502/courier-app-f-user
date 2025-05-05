// components/orders/AddOrder/BuyerDetails.jsx
import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

const BuyerDetails = ({ formData, errors, handleInputChange, handleContinueShipment }) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <MapPin className="mr-3 text-emerald-600" size={28} />
        Buyer Shipping Details
      </h3>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Select Pickup Address *</label>
        <select 
          className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          value={formData.pickupAddress}
          onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
        >
          <option value="">Select Pickup Address</option>
          <option value="warehouse1">Warehouse 1</option>
          <option value="warehouse2">Warehouse 2</option>
        </select>
        {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">First Name *</label>
          <input 
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
          <input
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Mobile Number *</label>
          <input
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.mobile ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Alternate Mobile Number</label>
          <input 
            placeholder="Enter alternate mobile number"
            className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Email *</label>
          <input 
            placeholder="Enter email address"
            className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Country *</label>
          <select 
            value={formData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.country ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Country</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
          </select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">State *</label>
          <select
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.state ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select State</option>
            <option value="California">California</option>
            <option value="New York">New York</option>
          </select>
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Address Line 1 *</label>
          <input
            placeholder="Enter street address"
            value={formData.address1}
            onChange={(e) => handleInputChange("address1", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.address1 ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Address Line 2 *</label>
          <input 
            placeholder="Apartment, suite, unit, etc."
            value={formData.address2}
            onChange={(e) => handleInputChange("address2", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.address2 ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.address2 && <p className="text-red-500 text-sm mt-1">{errors.address2}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Landmark</label>
          <input 
            placeholder="Nearby landmark"
            className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Pincode *</label>
          <input
            placeholder="Enter pincode"
            value={formData.pincode}
            onChange={(e) => handleInputChange("pincode", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.pincode ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">City *</label>
          <input
            placeholder="Enter city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.city ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-6">
        <input 
          type="checkbox" 
          id="same-address" 
          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
        />
        <label htmlFor="same-address" className="text-gray-700">
          Shipping & Billing Address are same
        </label>
      </div>

      <button
        onClick={handleContinueShipment}
        className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <span>Continue to Shipment Details</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default BuyerDetails;