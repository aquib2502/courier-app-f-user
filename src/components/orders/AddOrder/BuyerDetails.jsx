// components/orders/AddOrder/BuyerDetails.jsx
import React, { useState } from 'react';
import { User, Search } from 'lucide-react';
import SearchableSelect from '@/components/SearchableSelect';

const BuyerDetails = ({
  formData,
  pickupAddress,
  errors,
  handleInputChange,
  countries,
  states,
}) => {


  const [showStateDropdown, setShowStateDropdown] = useState(false);



  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-3">
        <User className="mr-3 text-emerald-600" size={24} />
        Buyer Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Pickup Address */}
        {pickupAddress.length > 0 && (
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-gray-700 font-medium mb-2">Pickup Address *</label>
            <select
              value={formData.pickupAddress}
              onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.pickupAddress ? 'border-red-300' : 'border-gray-300'
                }`}
            >
              <option value="">Select Pickup Address</option>
              {pickupAddress.map((addr, index) => (
                <option key={index} value={addr.addressLine1}>
                  {addr.addressLine1}, {addr.city}, {addr.pincode}
                </option>
              ))}
            </select>
            {errors.pickupAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>
            )}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Full Name *
          </label>
          <input
            name="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            autoComplete="name"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.fullName ? "border-red-300" : "border-gray-300"
              }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>


        {/* Mobile */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Mobile *</label>
          <input
            name="mobile"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={(e) => handleInputChange("mobile", e.target.value)}
            autoComplete="tel"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.mobile ? 'border-red-300' : 'border-gray-300'
              }`}
          />
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            name="email"
            placeholder="Enter email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            autoComplete="email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Address 1 */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Address 1 *</label>
          <input
            name="address1"
            placeholder="Enter address"
            value={formData.address1}
            onChange={(e) => handleInputChange("address1", e.target.value)}
            autoComplete="address-line1"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${errors.address1 ? 'border-red-300' : 'border-gray-300'
              }`}
          />
          {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
        </div>

        {/* Address 2 */}
        {/* Address 2 */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-gray-700 font-medium mb-2">
            Address 2
          </label>
          <input
            name="address2"
            placeholder="Enter additional address (optional)"
            value={formData.address2}
            onChange={(e) => handleInputChange("address2", e.target.value)}
            autoComplete="address-line2"
            className="w-full h-12 px-3 border border-gray-300 rounded-lg
      focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>


        {/* Country, State, City, Pincode – ONE ROW */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Country */}
            <SearchableSelect
              label="Country *"
              options={countries.map(c => c.name)}
              value={formData.country}
              onChange={(val) => {
                const selected = countries.find(c => c.name === val);
                handleInputChange("country", val);
                handleInputChange("countryCode", selected?.code || "");
                handleInputChange("state", "");
                handleInputChange("city", "");
              }}
              error={errors.country}
            />

            {/* State */}
            <SearchableSelect
              label="State *"
              options={states.map(s => s.label)}
              includeNotApplicable={true}
              value={
                states.find(s => s.code === formData.state)?.label || ""
              }
              onChange={(val) => {
                const selected = states.find(s => s.label === val);
                handleInputChange("state", selected?.code || "");
              }}
              disabled={!formData.countryCode}
              error={errors.state}
            />


            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                City *
              </label>
              <input
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                autoComplete="address-level2"
                className={`w-full h-12 px-3 rounded-lg border
          focus:outline-none focus:ring-2 focus:ring-emerald-500
          ${errors.city ? "border-red-300" : "border-gray-300"}`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Pincode *
              </label>
              <input
                name="pincode"
                placeholder="Enter pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                autoComplete="postal-code"
                className={`w-full h-12 px-3 rounded-lg border
          focus:outline-none focus:ring-2 focus:ring-emerald-500
          ${errors.pincode ? "border-red-300" : "border-gray-300"}`}
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
              )}
            </div>

          </div>
        </div>



      </div>
    </div>
  );
};

export default BuyerDetails;