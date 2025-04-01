"use client";
import React, { useState } from "react";
import { Check } from "lucide-react"; // Use Lucide icon

const AddOrder = () => {
  // State to manage which section should be shown
  const [showShipment, setShowShipment] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showItem, setShowItem] = useState(false);

  // Handle the "Continue" button click for each section
  const handleContinueShipment = () => {
    setShowShipment(true); // Show shipment details
  };

  const handleContinueOrder = () => {
    setShowOrder(true); // Show order details
  };

  const handleContinueItem = () => {
    setShowItem(true); // Show item details
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Order</h2>

      {/* First Section: Buyer Shipping Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-600 mb-1">Select Pickup Address *</label>
          <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Pickup Address</option>
            <option>Warehouse 1</option>
            <option>Warehouse 2</option>
          </select>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mt-6">Buyer Shipping Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="First Name *" className="p-2 border rounded" />
          <input placeholder="Last Name *" className="p-2 border rounded" />
          <input placeholder="Mobile No. *" className="p-2 border rounded" />
          <input placeholder="Alternate Mobile No." className="p-2 border rounded" />
          <input placeholder="Email *" className="p-2 border rounded col-span-2" />
          <select className="w-full p-2 border rounded col-span-2">
            <option>Select Country</option>
            <option>USA</option>
            <option>Canada</option>
          </select>
          <input placeholder="Address 1 *" className="p-2 border rounded" />
          <input placeholder="Landmark" className="p-2 border rounded" />
          <input placeholder="Address 2" className="p-2 border rounded col-span-2" />
          <input placeholder="Pincode *" className="p-2 border rounded" />
          <input placeholder="City *" className="p-2 border rounded" />
          <select className="w-full p-2 border rounded">
            <option>Select State</option>
            <option>California</option>
            <option>New York</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <input type="checkbox" id="same-address" className="w-4 h-4 text-blue-600" />
          <label htmlFor="same-address" className="text-gray-600">Shipping & Billing Address are same.</label>
        </div>

        <button
          onClick={handleContinueShipment} // This should trigger the state update
          className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>Continue</span>
        </button>
      </div>

      {/* Shipment Section (displayed after clicking Continue) */}
      {showShipment && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Shipment Type</h3>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input type="radio" name="shipmentType" value="CSB IV" className="form-radio" />
              <span className="ml-2">CSB IV</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="shipmentType" value="CSB V" className="form-radio" />
              <span className="ml-2">CSB V</span>
            </label>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-700">Shipment Details</h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <input placeholder="Actual Weight" className="p-2 border rounded" />
              <input placeholder="Length" className="p-2 border rounded" />
              <input placeholder="Width" className="p-2 border rounded" />
              <input placeholder="Height" className="p-2 border rounded" />
            </div>
          </div>

          <button
            onClick={handleContinueOrder} // Trigger showOrder
            className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>Continue</span>
          </button>
        </div>
      )}

      {/* Order Details Section (displayed after clicking Continue in Shipment Section) */}
      {showOrder && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-700">Order Details</h4>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <input placeholder="Invoice No." className="p-2 border rounded" />
            <input placeholder="Invoice Currency" className="p-2 border rounded" />
            <input placeholder="Order Date" type="date" className="p-2 border rounded" />
            <input placeholder="ETN Number" className="p-2 border rounded" />
          </div>

          <button
            onClick={handleContinueItem} // Trigger showItem
            className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>Continue</span>
          </button>
        </div>
      )}

      {/* Item Details Section (displayed after clicking Continue in Order Details Section) */}
      {showItem && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-700">Item Details</h4>
          <div className="flex items-center space-x-4 mt-2">
            <input placeholder="Product Name" className="p-2 border rounded" />
            <input placeholder="SKU" className="p-2 border rounded" />
            <input placeholder="Quantity" className="p-2 border rounded" />
            <input placeholder="Price" className="p-2 border rounded" />
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md">+ Add</button>
          </div>

          <button className="mt-6 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2">
            <Check className="w-5 h-5" />
            <span>Submit Order</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AddOrder;
