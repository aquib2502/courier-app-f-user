// components/orders/AddOrder/BuyerDetails.jsx
import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

const BuyerDetails = ({ formData, errors, pickupAddress,countries,  handleInputChange, handleContinueShipment,countryStateMap }) => {
    // ✅ Get states based on selected country
    // ✅ Dynamically derive states for selected country
  const states = formData.country && countryStateMap[formData.country]
    ? countryStateMap[formData.country]
    : [];
    
  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <MapPin className="mr-3 text-emerald-600" size={28} />
        Buyer Shipping Details
      </h3>
      
      <div className="mb-6">
  <label className="block text-gray-700 font-medium mb-2">Pickup Address *</label>
  <select
    value={formData.pickupAddress}
    onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
    className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
      errors.pickupAddress ? 'border-red-300' : 'border-gray-300'
    }`}
  >
    <option value="">Select Pickup Address</option>
    {pickupAddress.map((address, index) => (
      <option key={address._id} value={address.addressLine1}>
        {`${address.addressLine1}, ${address.city}, ${address.state} - ${address.postalCode}`}
      </option>
    ))}
  </select>

  {errors.pickupAddress && (
    <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>
  )}
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
  value={formData.email}
  onChange={(e) => handleInputChange("email", e.target.value)}
  className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
    errors.email ? "border-red-300" : "border-gray-300"
  }`}
/>

{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

        </div>

 {/* Country Dropdown */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Country *
        </label>
        <select
          value={formData.country}
          onChange={(e) => {
            const selectedCountry = e.target.value;
            handleInputChange("country", selectedCountry);
            handleInputChange("state", ""); // reset state when country changes
          }}
          className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
            errors.country ? "border-red-300" : "border-gray-300"
          }`}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="text-red-500 text-sm mt-1">{errors.country}</p>
        )}
      </div>

      {/* State Dropdown */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          State *
        </label>
        <select
          value={formData.state}
          onChange={(e) => handleInputChange("state", e.target.value)}
          className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
            errors.state ? "border-red-300" : "border-gray-300"
          }`}
          disabled={!formData.country}
        >
          <option value="">
            {formData.country ? "Select State" : "Select Country First"}
          </option>
          {formData.country && (
            states.length > 0 ? (
              states.map((st, idx) => (
                <option key={idx} value={st}>
                  {st}
                </option>
              ))
            ) : (
              <option value="N/A">No states available</option>
            )
          )}
        </select>
        {errors.state && (
          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
        )}
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

        {/* Address Line 1 */}
<div className="mb-6 mt-4">
  <label className="block text-gray-700 font-medium mb-2">Address Line 1 *</label>
  <input
    placeholder="Street address, P.O. box, company name, c/o"
    value={formData.address1}
    onChange={(e) => handleInputChange("address1", e.target.value)}
    className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
      errors.address1 ? "border-red-300" : "border-gray-300"
    }`}
  />
  {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
</div>

{/* Existing Address Line 2 */}
<div className="md:col-span-2">
  <label className="block text-gray-700 font-medium mb-2">Address Line 2 </label>
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
          <label className="block text-gray-700 font-medium mb-2 mt-4">Landmark</label>
          <input 
            placeholder="Nearby landmark"
            className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
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