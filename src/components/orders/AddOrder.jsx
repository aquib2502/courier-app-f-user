"use client";
import React, { useState } from "react";
import { Check } from "lucide-react"; // Use Lucide icon

const AddOrder = () => {
  const [showShipment, setShowShipment] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showItem, setShowItem] = useState(false);

  const handleContinueShipment = () => {
    setShowShipment(true); 
  };

  const handleContinueOrder = () => {
    setShowOrder(true); 
  };

  const handleContinueItem = () => {
    setShowItem(true); 
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-emerald-700">Add Order</h2>

      {/* First Section: Buyer Shipping Details */}
      <div className="space-y-6">
        <div>
          <label className="block text-emerald-600 mb-2">Select Pickup Address *</label>
          <select className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Select Pickup Address</option>
            <option>Warehouse 1</option>
            <option>Warehouse 2</option>
          </select>
        </div>

        <h3 className="text-2xl font-semibold text-emerald-600">Buyer Shipping Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <input placeholder="First Name *" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Last Name *" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Mobile No. *" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Alternate Mobile No." className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Email *" className="p-3 border border-emerald-300 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <select className="w-full p-3 border border-emerald-300 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Select Country</option>
            <option>USA</option>
            <option>Canada</option>
          </select>
          <input placeholder="Address 1 *" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Landmark" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Address 2" className="p-3 border border-emerald-300 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Pincode *" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="City *" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <select className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Select State</option>
            <option>California</option>
            <option>New York</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <input type="checkbox" id="same-address" className="w-5 h-5 text-emerald-600" />
          <label htmlFor="same-address" className="text-emerald-600">Shipping & Billing Address are same.</label>
        </div>

        <button
          onClick={handleContinueShipment}
          className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>Continue</span>
        </button>
      </div>

      {/* Shipment Section (displayed after clicking Continue) */}
      {showShipment && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-emerald-600 mb-4">Shipment Type</h3>
          <div className="space-x-6">
            <label className="inline-flex items-center">
              <input type="radio" name="shipmentType" value="CSB IV" className="form-radio text-emerald-600" />
              <span className="ml-2">CSB IV</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name="shipmentType" value="CSB V" className="form-radio text-emerald-600" />
              <span className="ml-2">CSB V</span>
            </label>
          </div>

          <div className="mt-6">
            <h4 className="text-xl font-semibold text-emerald-600">Shipment Details</h4>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <input placeholder="Actual Weight" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input placeholder="Length" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input placeholder="Width" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input placeholder="Height" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <button
            onClick={handleContinueOrder}
            className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>Continue</span>
          </button>
        </div>
      )}

      {/* Order Details Section (displayed after clicking Continue in Shipment Section) */}
      {showOrder && (
        <div className="mt-8">
          <h4 className="text-xl font-semibold text-emerald-600">Order Details</h4>
          <div className="grid grid-cols-2 gap-6 mt-2">
            <input placeholder="Invoice No." className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input placeholder="Invoice Currency" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input placeholder="Order Date" type="date" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input placeholder="ETN Number" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <button
            onClick={handleContinueItem}
            className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>Continue</span>
          </button>
        </div>
      )}

      {/* Item Details Section (displayed after clicking Continue in Order Details Section) */}
      {showItem && (
        <div className="mt-8">
          <h4 className="text-xl font-semibold text-emerald-600">Item Details</h4>
          <div className="flex items-center space-x-4 mt-4">
            <input placeholder="Product Name" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input placeholder="SKU" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input placeholder="Quantity" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <input placeholder="Price" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button className="bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700">+ Add</button>
          </div>

          <button className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2">
            <Check className="w-5 h-5" />
            <span>Submit Order</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AddOrder;
