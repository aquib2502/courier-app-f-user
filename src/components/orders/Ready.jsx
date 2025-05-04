"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Filter, Download, FilePlus, Search, RefreshCw, ExternalLink, Truck, Package } from "lucide-react";

const Ready = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  // Filter state variables
  const [orderDate, setOrderDate] = useState('');
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const toggleFilters = () => {
    setFilterVisible(!filterVisible);
  };

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Get userId from the JWT token stored in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      // Decode the token
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      if (!userId) {
        setError('Invalid token. User ID not found.');
        setLoading(false);
        return;
      }

      // Make the API request to fetch ready orders
      const response = await axios.get(`http://localhost:5000/api/user/orders/${userId}`);
      // Filter for only ready orders
      const readyOrders = response.data.data.filter(order => order.status === 'Ready');
      setOrders(readyOrders);
      setFilteredOrders(readyOrders);
      
      // Set last updated time
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      setError("Error fetching orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = orders.filter(order => 
        order.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${order.firstName} ${order.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchQuery, orders]);

  // Apply filters function
  const applyFilters = () => {
    let filtered = [...orders];

    if (orderDate) {
      filtered = filtered.filter((order) =>
        new Date(order.invoiceDate).toLocaleDateString("en-GB") === new Date(orderDate).toLocaleDateString("en-GB")
      );
    }

    if (orderId) {
      filtered = filtered.filter((order) => 
        order.invoiceNo.toLowerCase().includes(orderId.toLowerCase())
      );
    }

    if (customerName) {
      filtered = filtered.filter(
        (order) =>
          order.firstName.toLowerCase().includes(customerName.toLowerCase()) ||
          order.lastName.toLowerCase().includes(customerName.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  // Clear filters function
  const clearFilters = () => {
    setOrderDate('');
    setOrderId('');
    setCustomerName('');
    setFilteredOrders(orders);
    setCurrentPage(1);
  };

  // Handle export to CSV
  const exportToCsv = () => {
    console.log("Exporting to CSV");
  };

  // Format date helper function
  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-GB"); // Format as "DD/MM/YYYY"
  };

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-md border border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Ship</h2>
          <p className="text-sm text-gray-500">Manage your orders ready for shipment</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          <button 
            onClick={toggleFilters}
            className="flex items-center text-emerald-700 hover:text-emerald-800 bg-emerald-50 py-2 px-4 rounded-lg transition-all duration-300 hover:bg-emerald-100"
          >
            <Filter className="w-4 h-4 mr-2" />
            <span className="font-medium">Filters</span>
          </button>
          
          <button className="flex items-center bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-sm">
            <FilePlus className="w-4 h-4 mr-2" />
            <span className="font-medium">Bulk Invoice</span>
          </button>
          
          <button className="flex items-center bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-all duration-300 shadow-sm">
            <FilePlus className="w-4 h-4 mr-2" />
            <span className="font-medium">Bulk Label</span>
          </button>
          
          <button 
            onClick={exportToCsv}
            className="flex items-center bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="font-medium">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Refresh Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Search by order ID, customer name..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Last updated: {lastUpdated || 'Never'}</span>
          <button 
            onClick={fetchOrders} 
            className="p-2 text-emerald-600 hover:text-emerald-800 rounded-full hover:bg-emerald-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Section - Conditionally Rendered */}
      {filterVisible && (
        <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Orders</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="orderDate" className="block text-xs font-medium text-gray-600 mb-1">
                  Order Date
                </label>
                <input
                  type="date"
                  id="orderDate"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="orderId" className="block text-xs font-medium text-gray-600 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter Order ID"
                />
              </div>
              
              <div>
                <label htmlFor="customerDetails" className="block text-xs font-medium text-gray-600 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customerDetails"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter Customer Name"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="bg-white text-gray-600 py-1.5 px-4 mr-2 rounded-md text-sm border border-gray-300 hover:bg-gray-50"
            >
              Clear All
            </button>
            <button
              onClick={applyFilters}
              className="bg-emerald-600 text-white py-1.5 px-4 rounded-md text-sm hover:bg-emerald-700 transition-all duration-300"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-8 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Orders Table - Only shown when not loading and no error */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600">Order Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600">Order ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600">Customer Details</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600">Package Details</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-600 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(order.invoiceDate)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-emerald-700">{order.invoiceNo}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-800 font-medium">{order.firstName} {order.lastName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center mr-2 text-xs font-semibold text-emerald-800">
                            {order.productItems.length}
                          </div>
                          <span className="text-sm text-gray-700">
                            {order.productItems.length === 1 ? 'Package' : 'Packages'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center w-fit">
                          <Truck className="w-3 h-3 mr-1" />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="p-1.5 text-emerald-600 hover:text-emerald-800 rounded hover:bg-emerald-50">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100">
                            Process
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                      No ready orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination - Only show if we have orders */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
                    <span className="font-medium">
                      {indexOfLastOrder > filteredOrders.length ? filteredOrders.length : indexOfLastOrder}
                    </span>{" "}
                    of <span className="font-medium">{filteredOrders.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                        currentPage === 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-400 hover:bg-gray-50 cursor-pointer'
                      } ring-1 ring-inset ring-gray-300`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Generate page numbers */}
                    {[...Array(totalPages).keys()].map(number => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === number + 1
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                        currentPage === totalPages 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-400 hover:bg-gray-50 cursor-pointer'
                      } ring-1 ring-inset ring-gray-300`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Ready;