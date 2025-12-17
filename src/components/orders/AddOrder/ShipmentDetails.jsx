// components/orders/AddOrder/ShipmentDetails.jsx
import React from 'react';
import { Box } from 'lucide-react';

const ShipmentDetails = ({ formData, errors, handleInputChange }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-3">
        <Box className="mr-3 text-emerald-600" size={24} />
        Shipment Information
      </h3>
      
      <div className="bg-gray-50 p-6 rounded-xl mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Shipment Type</h4>
        <div className="flex space-x-6">
          {['CSB IV', 'CSB V'].map((type) => (
            <label key={type} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="shipmentType"
                value={type}
                className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                onChange={(e) => handleInputChange("shipmentType", e.target.value)}
                checked={formData.shipmentType === type}
              />
              <span className="text-gray-700 font-medium">{type}</span>
            </label>
          ))}
        </div>

        {/* Product Radio Buttons */}
        <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Product</h4>
        <div className="flex space-x-6">
          {[
            { label: 'Economy', value: 'ECONOMY-USPS' },
            { label: 'Standard', value: 'STANDARD' }
          ].map((product) => (
            <label key={product.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="product"
                value={product.value}
                className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                onChange={(e) => handleInputChange("product", e.target.value)}
                checked={formData.product === product.value}
              />
              <span className="text-gray-700 font-medium">{product.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Package Dimensions</h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Actual Weight (kg) *</label>
            <input
              name="weight"
              placeholder="Enter weight"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              autoComplete="on"
              className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                errors.weight ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Length (cm) *</label>
            <input 
              name="length"
              placeholder="Enter length"
              value={formData.length}
              onChange={(e) => handleInputChange("length", e.target.value)}
              autoComplete="on"
              className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                errors.length ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Width (cm) *</label>
            <input
              name="width"
              placeholder="Enter width"
              value={formData.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
              autoComplete="on"
              className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                errors.width ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Height (cm) *</label>
            <input
              name="height"
              placeholder="Enter height"
              value={formData.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              autoComplete="on"
              className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                errors.height ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;