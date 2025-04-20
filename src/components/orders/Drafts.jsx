"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";  // We will use axios to fetch data
import { Filter, Download, FilePlus } from "lucide-react"; // Import Lucide icons

const Draft = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [orders, setOrders] = useState([]);  // State to store the orders
  const [filteredOrders, setFilteredOrders] = useState([]);  // State for filtered orders
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Filter state variables
  const [orderDate, setOrderDate] = useState('');
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');

  const toggleFilters = () => {
    setFilterVisible(!filterVisible); // Toggle filter visibility
  };

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get userId from the JWT token stored in localStorage
        const token = localStorage.getItem('token');  // Assuming the token is stored in localStorage
        if (!token) {
          setError('User is not authenticated');
          setLoading(false);
          return;
        }

        // Decode the token (assuming it's a JWT token and has user data)
        const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decoding the payload part of the token
        const userId = decodedToken.userId;  // Extract userId from the decoded token

        if (!userId) {
          setError('Invalid token. User ID not found.');
          setLoading(false);
          return;
        }

        // Make the API request using the userId as 'user' in the URL
        const response = await axios.get(`http://localhost:5000/api/user/orders/${userId}`);
        setOrders(response.data.data);  // Set the orders in the state
        setFilteredOrders(response.data.data);  // Initially show all orders
      } catch (error) {
        setError("Error fetching orders");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();  // Fetch orders when the component mounts
  }, []);  // Empty dependency array ensures this runs once when the component mounts

   // Filter function to filter orders based on user input
   const filterOrders = () => {
    let filtered = [...orders];

    if (orderDate) {
      filtered = filtered.filter((order) =>
        new Date(order.invoiceDate).toLocaleDateString("en-GB") === new Date(orderDate).toLocaleDateString("en-GB")
      );
    }

    if (orderId) {
      filtered = filtered.filter((order) => order.invoiceNo.toLowerCase().includes(orderId.toLowerCase()));
    }

    if (customerName) {
      filtered = filtered.filter(
        (order) =>
          order.firstName.toLowerCase().includes(customerName.toLowerCase()) ||
          order.lastName.toLowerCase().includes(customerName.toLowerCase())
      );
    }

    setFilteredOrders(filtered);  // Set filtered orders in the state
  };

  // Function to clear all filters
  const clearFilters = () => {
    setOrderDate('');
    setOrderId('');
    setCustomerName('');
    setFilteredOrders(orders);  // Reset to the full list of orders
  };

  // Helper function to format the order date
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-GB"); // Format as "DD/MM/YYYY"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Draft Orders</h2>
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
          <button className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">
            <FilePlus className="w-5 h-5 mr-2" />
            Bulk Pay
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
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}  // Set order date value
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
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}  // Set order ID value
              />
            </div>
            <div>
              <label htmlFor="customerDetails" className="block text-sm text-gray-700">
                Customer Details
              </label>
              <input
                type="text"
                id="customerDetails"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Enter Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}  // Set customer name value
              />
            </div>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={filterOrders}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}  // Clear filters
              className="bg-gray-500 text-white py-2 px-4 ml-2 rounded-md hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500">
          <p>Loading orders...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <table className="w-full table-auto mt-6 border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="px-4 py-2 text-sm text-gray-600">Order Date</th>
              <th className="px-4 py-2 text-sm text-gray-600">Order ID</th>
              <th className="px-4 py-2 text-sm text-gray-600">Customer Details</th>
              <th className="px-4 py-2 text-sm text-gray-600">Package Details</th>
              <th className="px-4 py-2 text-sm text-gray-600">Shipping</th>
              <th className="px-4 py-2 text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-2 text-sm text-gray-700">{formatDate(order.invoiceDate)}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{order.invoiceNo}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{order.firstName} {order.lastName}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{order.productItems.length} Packages</td>
                <td className="px-4 py-2 text-sm text-gray-700">{order.status}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No Records Found */}
      {filteredOrders.length === 0 && !loading && !error && (
        <div className="mt-6 text-center text-gray-500">
          <p>No Records Found.</p>
        </div>
      )}
    </div>
  );
};

export default Draft;
