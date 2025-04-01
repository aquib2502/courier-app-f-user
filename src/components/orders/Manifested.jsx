"use client";
import React, { useState } from "react";
import { Filter, Download, FilePlus } from "lucide-react"; // Import Lucide icons

const Manifested = () => {
  const [filterVisible, setFilterVisible] = useState(false);

  const toggleFilters = () => {
    setFilterVisible(!filterVisible); // Toggle filter visibility
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Manifested Orders</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleFilters}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Filter className="w-5 h-5 mr-2" />
            <span>Filters</span>
          </button>
          <button className="flex items-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
            <FilePlus className="w-5 h-5 mr-2" />
            Bulk Invoice
          </button>
          <button className="flex items-center bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600">
            <FilePlus className="w-5 h-5 mr-2" />
            Bulk Label
          </button>
          <button className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
            <Download className="w-5 h-5 mr-2" />
            CSV
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {filterVisible && (
        <div className="mb-4 p-4 bg-gray-100 rounded-md">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="orderDate" className="block text-sm text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="orderDate"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="orderId" className="block text-sm text-gray-700">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Enter Order ID"
              />
            </div>
            <div>
              <label htmlFor="customerDetails" className="block text-sm text-gray-700">
                Customer
              </label>
              <input
                type="text"
                id="customerDetails"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Enter Customer Name"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="w-full table-auto mt-6 border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="px-4 py-2 text-sm text-gray-600">Date</th>
            <th className="px-4 py-2 text-sm text-gray-600">Order ID</th>
            <th className="px-4 py-2 text-sm text-gray-600">Customer</th>
            <th className="px-4 py-2 text-sm text-gray-600">Details</th>
            <th className="px-4 py-2 text-sm text-gray-600">Status</th>
            <th className="px-4 py-2 text-sm text-gray-600">Last Mile AWB</th>
            <th className="px-4 py-2 text-sm text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2 text-sm text-gray-700">2025-04-01</td>
            <td className="px-4 py-2 text-sm text-gray-700">ORD-123456</td>
            <td className="px-4 py-2 text-sm text-gray-700">John Doe</td>
            <td className="px-4 py-2 text-sm text-gray-700">2 Packages</td>
            <td className="px-4 py-2 text-sm text-gray-700">Manifested</td>
            <td className="px-4 py-2 text-sm text-gray-700">AWB-123456789</td>
            <td className="px-4 py-2 text-sm text-gray-700">
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </td>
          </tr>
          <tr>
            <td className="px-4 py-2 text-sm text-gray-700">2025-04-02</td>
            <td className="px-4 py-2 text-sm text-gray-700">ORD-123457</td>
            <td className="px-4 py-2 text-sm text-gray-700">Jane Smith</td>
            <td className="px-4 py-2 text-sm text-gray-700">1 Package</td>
            <td className="px-4 py-2 text-sm text-gray-700">Manifested</td>
            <td className="px-4 py-2 text-sm text-gray-700">AWB-123456790</td>
            <td className="px-4 py-2 text-sm text-gray-700">
              <button className="text-blue-600 hover:text-blue-800">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* No Records Found */}
      <div className="mt-6 text-center text-gray-500">
        <p>No Records Found.</p>
      </div>
    </div>
  );
};

export default Manifested;
