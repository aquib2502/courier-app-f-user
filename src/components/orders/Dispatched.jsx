"use client";
import React, { useState } from "react";
import { Filter, Download, FilePlus } from "lucide-react"; // Import Lucide icons

const Dispatched = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20); // Rows per page

  const toggleFilters = () => {
    setFilterVisible(!filterVisible); // Toggle filter visibility
  };

  // Pagination logic
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Simulated records for demonstration
  const records = [
    {
      date: "2025-03-29 21:58",
      orderId: "SG3250329269114934",
      customer: "Oneil Francis-Innis",
      details: "0.05 KG | CSB-IV",
      status: "Picked Up",
      lastMileAWB: "U0002938893568989",
    },
    {
      date: "2025-03-29 21:52",
      orderId: "SG3250329269119422",
      customer: "Natia Machitadze",
      details: "0.05 KG | CSB-IV",
      status: "Picked Up",
      lastMileAWB: "02655071396331",
    },
    {
      date: "2025-03-29 21:38",
      orderId: "SG3250329269115115",
      customer: "Sorin Constantinescu",
      details: "0.05 KG | CSB-IV",
      status: "Picked Up",
      lastMileAWB: "02655071396332",
    },
  ];

  // Determine which records to display based on the current page
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Dispatched Orders</h2>
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
          {currentRecords.map((record, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-sm text-gray-700">{record.date}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{record.orderId}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{record.customer}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{record.details}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{record.status}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{record.lastMileAWB}</td>
              <td className="px-4 py-2 text-sm text-gray-700">
                <button className="text-blue-600 hover:text-blue-800">Reprint Label</button>
                <button className="ml-4 text-blue-600 hover:text-blue-800">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* No Records Found */}
      {currentRecords.length === 0 && (
        <div className="mt-6 text-center text-gray-500">
          <p>No Records Found.</p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div>
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstRecord + 1}-{indexOfLastRecord} of {records.length} Records
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md"
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
          >
            Prev
          </button>
          <button
            className="bg-blue-500 text-white py-1 px-3 rounded-md"
            onClick={() => paginate(currentPage < Math.ceil(records.length / rowsPerPage) ? currentPage + 1 : currentPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dispatched;
