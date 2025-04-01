"use client";
import React, { useState } from "react";
import { Filter, Download } from "lucide-react"; // Import Lucide icons

const Cancelled = () => {
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
      date: "2025-03-19 21:58",
      orderId: "SG3250319226678",
      customer: "Ms Terri Smith",
      details: "Package Volume:1 | Dead Weight:1 | Bill Weight:1",
      status: "Refunded",
    },
    {
      date: "2025-03-01 21:52",
      orderId: "SG32503012514267",
      customer: "Robert April",
      details: "Package Volume:1 | Dead Weight:1 | Bill Weight:1",
      status: "Refunded",
    },
    {
      date: "2025-02-28 21:38",
      orderId: "SG32502282512341",
      customer: "Robert April",
      details: "Package Volume:1 | Dead Weight:1 | Bill Weight:1",
      status: "Refunded",
    },
    {
      date: "2023-07-24 21:58",
      orderId: "SG32507242276512",
      customer: "Deborah Schuten",
      details: "Package Volume:1 | Dead Weight:1 | Bill Weight:1",
      status: "Cancelled",
    },
    {
      date: "2023-06-30 22:00",
      orderId: "SG32306303236892",
      customer: "Susan Kendall",
      details: "Package Volume:1 | Dead Weight:1 | Bill Weight:1",
      status: "Cancelled",
    },
  ];

  // Determine which records to display based on the current page
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Cancelled Orders</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleFilters}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <Filter className="w-5 h-5 mr-2" />
            <span>Filters</span>
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
                Order Date
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
            <th className="px-4 py-2 text-sm text-gray-600">Order Date</th>
            <th className="px-4 py-2 text-sm text-gray-600">Order ID</th>
            <th className="px-4 py-2 text-sm text-gray-600">Customer Details</th>
            <th className="px-4 py-2 text-sm text-gray-600">Package Details</th>
            <th className="px-4 py-2 text-sm text-gray-600">Status</th>
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
              <td className="px-4 py-2 text-sm text-gray-700">
                <span className="bg-green-200 text-green-600 px-2 py-1 rounded">{record.status}</span>
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">
                <button className="text-blue-600 hover:text-blue-800">View</button>
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

export default Cancelled;
