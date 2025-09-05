"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";
import { Filter, Download, FilePlus, Search, RefreshCw, ExternalLink, Truck, Package, Printer, X, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Packed = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [activeActionOrder, setActiveActionOrder] = useState(null);
  
  // Filter state variables
  const [orderDate, setOrderDate] = useState('');
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  
  // Modal state variables
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const barcodeRef = useRef(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const toggleFilters = () => {
    setFilterVisible(!filterVisible);
  };

  // Close action dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionOrder && !event.target.closest('.action-dropdown')) {
        setActiveActionOrder(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeActionOrder]);

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get userId from the JWT token stored in localStorage
      const token = localStorage.getItem('userToken');
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

      // Make the API request to fetch orders
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/orders/${userId}`);
      
      // Filter for only packed orders
      const packedOrders = response.data.data.filter(order => order.orderStatus === 'Packed');
      setOrders(packedOrders);
      setFilteredOrders(packedOrders);
      
      // Set last updated time
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Unable to fetch orders. Please try again.");
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
        order.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${order.firstName || ''} ${order.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchQuery, orders]);

  // Generate serial number when modal opens
  useEffect(() => {
    if (showBarcodeModal && selectedOrder) {
      // Generate a unique serial number (TE prefix + random 4 digits)
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newSerialNumber = `TE-${randomNum}`;
      setSerialNumber(newSerialNumber);
    }
  }, [showBarcodeModal, selectedOrder]);

  // Generate barcode when serial number is available
  useEffect(() => {
    if (showBarcodeModal && serialNumber && barcodeRef.current) {
      try {
        // Generate barcode using the serial number
        JsBarcode(barcodeRef.current, serialNumber, {
          format: "CODE128",
          width: 2,
          height: 70,
          displayValue: false, // Hide the text below barcode
          font: "Arial",
          fontSize: 12,
          margin: 10,
          background: "#ffffff"
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [showBarcodeModal, serialNumber]);

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
        order.invoiceNo?.toLowerCase().includes(orderId.toLowerCase())
      );
    }

    if (customerName) {
      filtered = filtered.filter(
        (order) =>
          order.firstName?.toLowerCase().includes(customerName.toLowerCase()) ||
          order.lastName?.toLowerCase().includes(customerName.toLowerCase())
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

  // Handle Print Label - Show modal with the barcode
  const handlePrintLabel = (order) => {
    setSelectedOrder(order);
    setShowBarcodeModal(true);
    setPrintSuccess(false);
    setIsPrinting(false);
  };

  // Toggle view actions dropdown
  const toggleActions = (orderId) => {
    setActiveActionOrder(activeActionOrder === orderId ? null : orderId);
  };

  // Handle Clone Order (stub for now)
  const handleCloneOrder = (order) => {
    console.log("Cloning order:", order._id);
    // Close dropdown
    setActiveActionOrder(null);
    // Show notification
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'fixed top-4 right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow-md z-50';
    notificationDiv.innerHTML = `
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        Clone functionality will be added soon
      </div>
    `;
    document.body.appendChild(notificationDiv);
    setTimeout(() => {
      document.body.removeChild(notificationDiv);
    }, 3000);
  };

  // Handle Cancel Order (stub for now)
  const handleCancelOrder = (order) => {
    console.log("Cancelling order:", order._id);
    // Close dropdown
    setActiveActionOrder(null);
    // Show notification
    const notificationDiv = document.createElement('div');
    notificationDiv.className = 'fixed top-4 right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow-md z-50';
    notificationDiv.innerHTML = `
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        Cancel functionality will be added soon
      </div>
    `;
    document.body.appendChild(notificationDiv);
    setTimeout(() => {
      document.body.removeChild(notificationDiv);
    }, 3000);
  };

  // Close the barcode modal
  const closeBarcodeModal = () => {
    setShowBarcodeModal(false);
    setTimeout(() => {
      setSelectedOrder(null);
      setIsPrinting(false);
      setPrintSuccess(false);
      setSerialNumber('');
    }, 300); // Wait for animation to complete
  };

  // Print the barcode label
  const printBarcode = () => {
    if (isPrinting) return; // Prevent multiple clicks
    
    setIsPrinting(true);
    
    try {
      const printContents = document.getElementById('barcode-print-area').innerHTML;
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        alert("Please allow pop-ups to print the label");
        setIsPrinting(false);
        return;
      }
      
      // Write the print content to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>Shipping Label - ${serialNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              @page { size: 105mm 148mm; margin: 0; }
              .print-container { width: 100%; height: 100%; }
              table { width: 100%; border-collapse: collapse; }
              td, th { padding: 8px; border: 1px solid #ddd; }
              .header { font-weight: bold; background-color: #f9f9f9; }
              .barcode-container { text-align: center; padding: 15px 0; }
              .serial-header { background-color: #dc2626; color: white; text-align: center; font-weight: bold; padding: 8px; }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContents}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      
      // Listen for the print window to close
      const checkPrintWindowClosed = setInterval(() => {
        if (printWindow.closed) {
          clearInterval(checkPrintWindowClosed);
          setIsPrinting(false);
          setPrintSuccess(true);
          setTimeout(() => {
            setPrintSuccess(false);
          }, 3000);
        }
      }, 500);
      
    } catch (error) {
      console.error("Error printing:", error);
      setIsPrinting(false);
      alert("There was an error printing. Please try again.");
    }
  };

  // Handle export to CSV
  const exportToCsv = () => {
    // Implementation for CSV export
    console.log("Exporting to CSV");
  };

  // Format date helper function
  const formatDate = (date) => {
    if (!date) return "";
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
    <div className="min-h-[calc(220vh-200px)] flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-md border border-gray-200">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Packed Orders</h2>
            <p className="text-sm text-gray-500">Manage your packed orders ready for manifesting</p>
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
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Order ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Customer Details</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Package Details</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Last Mile AWB</th>
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
                              {order.productItems?.length || 0}
                            </div>
                            <span className="text-sm text-gray-700">
                              {order.productItems?.length === 1 ? 'Package' : 'Packages'} | {order.weight} KG
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center w-fit">
                            <Package className="w-3 h-3 mr-1" />
                            Packed
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{order.lastMileAWB || "-"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center space-x-2">
                            <button 
                              onClick={() => handlePrintLabel(order)}
                              className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center"
                            >
                              <Printer className="w-3 h-3 mr-1" />
                              Print Label
                            </button>
                            <div className="relative action-dropdown">
                              <button
                                onClick={() => toggleActions(order._id)}
                                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
                              >
                                View
                                <ChevronDown className="w-3 h-3 ml-1" />
                              </button>
                              
                              {/* Dropdown Menu */}
                              {activeActionOrder === order._id && (
                                <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleCloneOrder(order)}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                                      </svg>
                                      Clone Order
                                    </button>
                                    <button
                                      onClick={() => handleCancelOrder(order)}
                                      className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                      </svg>
                                      Cancel Order
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-1">No packed orders found</h3>
                          <p className="text-sm text-gray-500 mb-4">You don't have any packed orders at the moment.</p>
                        </div>
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

       {/* Enhanced Barcode Modal with Serial Number and A7 Optimization */}
           <AnimatePresence>
             {showBarcodeModal && selectedOrder && (
               <motion.div 
                 className="fixed inset-0 z-50 flex items-center justify-center p-4"
                 style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.2 }}
               >
                 <motion.div 
                   className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden"
                   style={{ maxHeight: '98vh', overflowY: 'auto' }}
                   initial={{ scale: 0.9, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   exit={{ scale: 0.9, y: 20 }}
                   transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                 >
                   {/* Modal Header */}
                   <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex justify-between items-center">
                     <h3 className="text-lg font-semibold text-white flex items-center">
                       <Printer className="w-5 h-5 mr-2" />
                       A7 Shipping Label
                     </h3>
                     <button 
                       onClick={closeBarcodeModal}
                       className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                     >
                       <X className="w-4 h-4" />
                     </button>
                   </div>
                   
                   {/* Order Summary */}
                   <div className="px-6 pt-4 bg-gray-50">
                     <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                       <span className="font-medium text-gray-700">Order:</span> 
                       <span className="text-blue-600 font-semibold">{selectedOrder.invoiceNo}</span>
                       <span className="mx-1 text-gray-300">•</span>
                       {/* <span className="font-medium text-gray-700">Serial:</span>
                       <span className="text-red-600 font-bold">{selectedOrder.invoiceNo}</span> */}
                     </div>
                     
                     <div className="flex flex-wrap gap-2 mb-3">
                       <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center">
                         <Package className="w-3 h-3 mr-1" />
                         {selectedOrder.weight || "0.5"} KG
                       </div>
                       <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center">
                         <Truck className="w-3 h-3 mr-1" />
                         {selectedOrder.shipmentType || 'CSB IV'}
                       </div>
                     </div>
                   </div>
                   
                   {/* Barcode Print Area - Optimized for A7 */}
                   <div className="px-4 py-2">
                     <div id="barcode-print-area">
                       <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden text-xs">
                         {/* Header with Company and Serial */}
                         <thead>
                           <tr>
                             <th colSpan="2" className="text-center p-2 bg-blue-50 border-b border-gray-300" 
                                 style={{fontSize: '11px', fontWeight: 'bold', color: '#1e40af'}}>
                               THE TRACE EXPRESS
                             </th>
                           </tr>
                           <tr>
                             <th colSpan="2" className="border-b border-gray-300" 
                                 style={{fontSize: '12px', fontWeight: 'bold', color: '#dc2626', 
                                        textAlign: 'center', padding: '3px', backgroundColor: '#fef2f2'}}>
                               {selectedOrder.invoiceNo}
                             </th>
                           </tr>
                         </thead>
                         
                         <tbody>
                           {/* Delivery Address - Compact */}
                           <tr>
                             <td className="align-top p-2 border-r border-b border-gray-300" style={{ width: '70%' }}>
                               <div className="font-semibold text-xs mb-1">TO:</div>
                               <div className="text-xs leading-tight">
                                 <div className="font-medium">{selectedOrder.firstName} {selectedOrder.lastName}</div>
                                 <div>{selectedOrder.address1}</div>
                                 {selectedOrder.address2 && <div>{selectedOrder.address2}</div>}
                                 <div>{selectedOrder.city}, {selectedOrder.state}</div>
                                 <div>{selectedOrder.pincode}, {selectedOrder.country}</div>
                                 <div className="mt-1 font-medium">📞 {selectedOrder.mobile}</div>
                               </div>
                             </td>
                             <td className="align-top p-2 border-b border-gray-300" style={{ width: '30%' }}>
                               <div className="text-center">
                                 <div className="text-xs font-semibold mb-1 bg-yellow-100 py-1 rounded">
                                   {selectedOrder.shipmentType || 'CSB-IV'}
                                 </div>
                                 <div className="mt-1">
                                   <div className="text-xs text-gray-600">Weight:</div>
                                   <div className="font-medium text-xs">{selectedOrder.weight || '0.5'} KG</div>
                                 </div>
                                 <div className="mt-1">
                                   <div className="text-xs text-gray-600">Date:</div>
                                   <div className="font-medium text-xs">{new Date().toLocaleDateString('en-GB')}</div>
                                 </div>
                               </div>
                             </td>
                           </tr>
     
                           {/* Product Info - Compact */}
                           <tr>
                             <td colSpan="2" className="p-2 border-b border-gray-300 bg-gray-50">
                               <div className="text-xs">
                                 <span className="font-semibold">Item: </span>
                                 <span>{selectedOrder.productItems?.[0]?.productName || "Product"}</span>
                                 <span className="ml-2 font-medium">Qty: {selectedOrder.productItems?.[0]?.productQuantity || "1"}</span>
                               </div>
                             </td>
                           </tr>
     
                           {/* Barcode with Serial Number Below */}
                           <tr>
                             <td colSpan="2" className="p-3 border-b border-gray-300 text-center bg-white">
                               <div className="space-y-2">
                                 <svg 
                                   ref={barcodeRef} 
                                   className="mx-auto"
                                   style={{ maxWidth: '100%', height: 'auto' }}
                                 ></svg>
                                 <div className="text-center">
                                   <div className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block">
                                     {selectedOrder.invoiceNo}
                                   </div>
                                 </div>
                               </div>
                             </td>
                           </tr>
     
                           {/* Footer Info - Compact */}
                           <tr>
                             <td colSpan="2" className="p-2 text-xs bg-gray-50">
                               <div className="flex justify-between text-xs">
                                 <span>BW: {selectedOrder.weight || '0.5'}KG</span>
                                 <span>DIM: {selectedOrder.length || '10'}×{selectedOrder.width || '10'}×{selectedOrder.height || '10'}cm</span>
                               </div>
                               <div className="mt-1 text-center">
                                 <div className="text-xs text-gray-600">Return: Mumbai, MH 400059, India</div>
                               </div>
                             </td>
                           </tr>
                         </tbody>
                       </table>
                     </div>
                   </div>
                   
                   {/* Modal Footer */}
                   <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                     <div className="text-xs text-gray-500">
                       A7 Label (74×105mm)
                     </div>
                     
                     <div className="flex gap-2">
                       {printSuccess ? (
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.8 }}
                           animate={{ opacity: 1, scale: 1 }}
                           className="bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center text-sm font-medium"
                         >
                           <Check className="w-4 h-4 mr-1" />
                           Printed!
                         </motion.div>
                       ) : (
                         <button 
                           onClick={printBarcode} 
                           disabled={isPrinting}
                           className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                             isPrinting 
                               ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                               : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                           }`}
                         >
                           {isPrinting ? (
                             <>
                               <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                               <span>Printing...</span>
                             </>
                           ) : (
                             <>
                               <Printer className="w-4 h-4 mr-2" />
                               <span>Print A7 Label</span>
                             </>
                           )}
                         </button>
                       )}
                     </div>
                   </div>
                 </motion.div>
               </motion.div>
             )}
           </AnimatePresence>
    </div>
  );
};

export default Packed;