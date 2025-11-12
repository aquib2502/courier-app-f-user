"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";
import { 
  Filter, 
  Download, 
  FilePlus, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Truck, 
  Package, 
  Printer, 
  X, 
  Check, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
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
  const [rowsPerPage, setRowsPerPage] = useState(50);

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
        JsBarcode(barcodeRef.current, selectedOrder.invoiceNo, {
          format: "CODE128",
          width: 3.5,
          height: 80,
          displayValue: true,
          fontSize: 20,
          textMargin: 10,
          margin: 40,
          background: "#ffffff",
          lineColor: "#000000"
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
    setCurrentPage(1);
  };

  // Clear filters function
  const clearFilters = () => {
    setOrderDate('');
    setOrderId('');
    setCustomerName('');
    setFilteredOrders(orders);
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, orderDate, orderId, customerName, rowsPerPage]);

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
    setActiveActionOrder(null);
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
    setActiveActionOrder(null);
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
    }, 300);
  };

  // Print the barcode label
  const printBarcode = () => {
    if (isPrinting) return;
    
    setIsPrinting(true);
    
    try {
      const printContents = document.getElementById('barcode-print-area').innerHTML;
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        alert("Please allow pop-ups to print the label");
        setIsPrinting(false);
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Shipping Label - ${serialNumber}</title>
            <style>
              @page { 
                size: 101.6mm 152.4mm;
                margin: 0;
              }

              body {
                width: 101.6mm;
                height: 152.4mm;
                margin: 0;
                padding: 6px;
                font-family: Arial, sans-serif;
                font-size: 11px;
                line-height: 1.3;
                background: #fff;
                box-sizing: border-box;
              }

              table {
                width: 96%;
                margin: 0 auto;
                border-collapse: collapse;
              }

              td, th {
                border: 1px solid #000;
                padding: 5px;
                vertical-align: top;
              }

              strong {
                font-size: 11px;
              }

              svg {
                margin-top: 4px;
              }
              
              .header { 
                font-weight: bold; 
                background-color: #f9f9f9; 
                font-size: 10px;
              }
              .barcode-container { 
                text-align: center; 
                padding: 5px 0; 
              }
              .company-logo {
                font-size: 11px;
                font-weight: bold;
                color: #1e40af;
              }
              .serial-number {
                font-size: 12px;
                font-weight: bold;
                color: #dc2626;
                text-align: center;
                padding: 3px;
                background-color: #fef2f2;
              }
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
    console.log("Exporting to CSV");
  };

  // Format date helper function
  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-GB");
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToPage = (page) => setCurrentPage(page);

  // Get page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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
              
              {/* Rows Per Page Selector */}
              <div className="flex items-center space-x-3 mb-4">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm font-medium"
                >
                  <option value={50}>50</option>
                  <option value={200}>200</option>
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length}
                </span>
              </div>
              
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
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {order.shipmentDetails?.trackingNumber || "-"}
                        </td>
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
          </div>
        )}

        {/* Pagination Controls */}
        {filteredOrders.length > 0 && !loading && !error && (
          <div className="bg-white rounded-xl shadow-lg p-4 mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Page Info */}
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center space-x-2">
                {/* First Page */}
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="First Page"
                >
                  <ChevronsLeft size={18} />
                </button>

                {/* Previous Page */}
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft size={18} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                {/* Next Page */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Next Page"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Last Page */}
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Last Page"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>

              {/* Jump to Page (Desktop only) */}
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Go to:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      goToPage(page);
                    }
                  }}
                  className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
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
                <div id="barcode-print-area" style={{ padding: "8px" }}>
                  <table
                    className="border-collapse border border-gray-300 text-xs"
                    style={{ width: "calc(100% - 8px)", margin: "0 auto" }}
                  >
                    {/* Header Branding */}
                    <thead>
                      <tr>
                        <th colSpan="2" className="text-center py-2 bg-gray-100">
                          <div style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "1px" }}>
                            THE TRACE EXPRESS
                          </div>
                          <div style={{ fontSize: "13px", marginTop: "3px", fontWeight: "600" }}>
                          </div>
                        </th>
                      </tr>
                    </thead>

                    {/* Barcode Section */}
                    <tbody>
                      <tr>
                        <td colSpan="2" className="text-center py-3">
                          <svg
                            ref={barcodeRef}
                            style={{
                              display: "block",
                              margin: "0 auto",
                              maxWidth: "90%",
                              height: "65px",
                            }}
                          ></svg>
                          <div
                            style={{
                              marginTop: "5px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              letterSpacing: "1px",
                            }}
                          >
                          </div>
                        </td>
                      </tr>

                      {/* FROM Section */}
                      <tr>
                        <td colSpan="2" className="border-t border-gray-300 p-3">
                          <strong>FROM:</strong>
                          <div>{selectedOrder.user.fullname}</div>
                          <div>{selectedOrder.pickupAddress}</div>
                          <div>Mobile: {selectedOrder.mobile}</div>
                        </td>
                      </tr>

                      {/* TO Section */}
                      <tr>
                        <td colSpan="2" className="border-t border-gray-300 p-3">
                          <strong>TO:</strong>
                          <div>{selectedOrder.firstName}{selectedOrder.lastName}</div>
                          <div>{selectedOrder.address1.split(",")[0]}</div>
                          <div>{selectedOrder.country}, {selectedOrder.state}</div>
                          <div>{selectedOrder.pincode}</div>
                          <div>Mobile: {selectedOrder.mobile}</div>
                        </td>
                      </tr>

                      {/* Invoice Info Section */}
                      <tr>
                        <td colSpan="2" className="border-t border-gray-300 p-3">
                          <div>Invoice Name: {selectedOrder.invoiceName}</div>
                          <div>HSN Code: {selectedOrder.HSNCode}</div>
                          <div>Shipment Type: {selectedOrder.shipmentType}</div>
                          <div>Invoice Date: {formatDate(selectedOrder.invoiceDate)}</div>
                        </td>
                      </tr>

                      {/* Weight, Dimensions & Payment */}
                      <tr>
                        <td colSpan="2" className="border-t border-gray-300 p-3">
                          <div className="flex justify-between text-xs">
                            <span>
                              Weight: {selectedOrder.weight} KG | 
                              Dim: {selectedOrder.length}×{selectedOrder.width}×{selectedOrder.height} cm
                            </span>
                            <span>{selectedOrder.paymentStatus}</span>
                          </div>
                        </td>
                      </tr>

                      {/* Products Section */}
                      <tr>
                        <td colSpan="2" className="border-t border-gray-300 p-3">
                          <strong>Products:</strong>
                          {selectedOrder.productItems.map((item, index) => (
                            <div key={index} className="flex justify-between text-xs mt-1">
                              <span>
                                {item.productName} (Qty: {item.productQuantity})
                              </span>
                              <span>
                                Rs {item.productPrice}  
                              </span>
                            </div>
                          ))}
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