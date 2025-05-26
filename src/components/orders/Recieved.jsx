"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Filter, 
  Download, 
  Search, 
  RefreshCw, 
  Package, 
  CheckCircle, 
  MapPin, 
  Calendar,
  Clock,
  Eye,
  Star,
  Phone,
  Mail,
  FileText,
  RotateCcw,
  AlertCircle,
  Award,
  User
} from "lucide-react";
import { toast } from "react-toastify";

const Received = () => {
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
  const [deliveryDate, setDeliveryDate] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const toggleFilters = () => {
    setFilterVisible(!filterVisible);
  };

  // Function to fetch received orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

      if (!userId) {
        setError('Invalid token. User ID not found.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/user/orders/${userId}`);
      
      // Filter for received orders (Delivered status with received manifest status)
      const receivedOrders = response.data.data.filter(order => 
        order.orderStatus === 'Delivered' && order.manifestStatus === 'dispatched'
      );
      
      setOrders(receivedOrders);
      setFilteredOrders(receivedOrders);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response && error.response.status === 404) {
        setOrders([]);
        setFilteredOrders([]);
      } else {
        setError("Unable to fetch orders. Please try again later.");
      }
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
        `${order.firstName || ''} ${order.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.lastMileAWB?.toLowerCase().includes(searchQuery.toLowerCase())
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

    if (deliveryDate) {
      filtered = filtered.filter((order) =>
        new Date(order.updatedAt).toLocaleDateString("en-GB") === new Date(deliveryDate).toLocaleDateString("en-GB")
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
    setDeliveryDate('');
    setFilteredOrders(orders);
    setCurrentPage(1);
  };

  // Handle View Invoice
  const handleViewInvoice = (order) => {
    toast.info(`Viewing invoice for order ${order.invoiceNo}`);
    // In a real application, you would open/download the invoice
  };

  // Handle Download Proof of Delivery
  const handleDownloadPOD = (order) => {
    toast.info(`Downloading proof of delivery for ${order.invoiceNo}`);
    // In a real application, you would download the POD document
  };

  // Handle Initiate Return
  const handleInitiateReturn = (order) => {
    toast.info("Return process will be implemented soon");
    // In a real application, you would open return form/process
  };

  // Handle Rate Delivery
  const handleRateDelivery = (order) => {
    setSelectedOrder(order);
    setShowFeedbackModal(true);
    setRating(0);
    setFeedback('');
  };

  // Handle Submit Feedback with API call
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${selectedOrder._id}/feedback`,
        {
          rating,
          feedback
        }
      );

      if (response.status === 200) {
        toast.success(`Thank you for your feedback! Rating: ${rating} stars`);
        setShowFeedbackModal(false);
        setSelectedOrder(null);
        setRating(0);
        setFeedback('');
        // Refresh orders to show updated feedback
        fetchOrders();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  // Get delivery confirmation from order data
  const getDeliveryConfirmation = (order) => {
    if (order.deliveryConfirmation && order.deliveryConfirmation.type) {
      return order.deliveryConfirmation.type;
    }
    return "Delivered"; // Default if no confirmation method specified
  };

  // Calculate delivery time using actual dates from database
  const calculateDeliveryTime = (order) => {
    const orderDate = new Date(order.invoiceDate || order.createdAt);
    const deliveryDate = new Date(order.deliveredDate || order.updatedAt);
    
    if (isNaN(orderDate.getTime()) || isNaN(deliveryDate.getTime())) {
      return "N/A";
    }
    
    const diffTime = Math.abs(deliveryDate - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  // Format date helper function with proper error handling
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const formattedDate = new Date(date);
      return isNaN(formattedDate.getTime()) ? "N/A" : formattedDate.toLocaleDateString("en-GB");
    } catch (error) {
      return "N/A";
    }
  };

  // Format datetime helper function with proper error handling
  const formatDateTime = (date) => {
    if (!date) return "N/A";
    try {
      const formattedDate = new Date(date);
      return isNaN(formattedDate.getTime()) ? "N/A" : formattedDate.toLocaleString("en-GB");
    } catch (error) {
      return "N/A";
    }
  };

  // Get delivery date - prioritize deliveredDate over updatedAt
  const getDeliveryDate = (order) => {
    return order.deliveredDate || order.updatedAt || order.createdAt;
  };

  // Render customer rating stars
  const renderRatingStars = (rating) => {
    if (!rating) {
      return (
        <div className="flex items-center">
          <span className="text-xs text-gray-500">No rating yet</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3 h-3 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating}/5)</span>
      </div>
    );
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
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-md border border-gray-200">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <CheckCircle className="mr-3 text-green-600" size={28} />
              Received Orders
            </h2>
            <p className="text-sm text-gray-500">Successfully delivered shipments and customer feedback</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            <button 
              onClick={toggleFilters}
              className="flex items-center text-green-700 hover:text-green-800 bg-green-50 py-2 px-4 rounded-lg transition-all duration-300 hover:bg-green-100"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="font-medium">Filters</span>
            </button>
            
            <button className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              <span className="font-medium">Export</span>
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
              className="bg-white w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Search by order ID, customer name, or tracking number..."
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Last updated: {lastUpdated || 'Never'}</span>
            <button 
              onClick={fetchOrders} 
              className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {filterVisible && (
          <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Received Orders</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="orderDate" className="block text-xs font-medium text-gray-600 mb-1">
                    Order Date
                  </label>
                  <input
                    type="date"
                    id="orderDate"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="deliveryDate" className="block text-xs font-medium text-gray-600 mb-1">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    id="deliveryDate"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter Order ID"
                  />
                </div>
                
                <div>
                  <label htmlFor="customerName" className="block text-xs font-medium text-gray-600 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="bg-green-600 text-white py-1.5 px-4 rounded-md text-sm hover:bg-green-700 transition-all duration-300"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading received orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchOrders}
              className="bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Delivery Info</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Order Details</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Customer Info</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Delivery Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Delivery Time</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Confirmation</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                              {formatDate(getDeliveryDate(order))}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(getDeliveryDate(order)).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-green-600">{order.invoiceNo}</p>
                            <div className="flex items-center mt-1">
                              <Package className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="text-xs text-gray-600">{order.weight} KG</span>
                            </div>
                            <p className="text-xs text-gray-500">AWB: {order.lastMileAWB || "Pending"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 flex items-center">
                              <User className="w-3 h-3 mr-1 text-gray-400" />
                              {order.firstName} {order.lastName}
                            </p>
                            <div className="flex items-center mt-1">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="text-xs text-gray-600">{order.mobile}</span>
                            </div>
                            <div className="flex items-start mt-1">
                              <MapPin className="w-3 h-3 mr-1 text-gray-400 mt-0.5" />
                              <span className="text-xs text-gray-500">{order.city}, {order.state}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center w-fit">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Delivered
                            </span>
                            <div className="flex items-center mt-2">
                              <Award className="w-3 h-3 mr-1 text-yellow-500" />
                              {renderRatingStars(order.customerRating)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {calculateDeliveryTime(order)}
                            </p>
                            <p className="text-xs text-gray-500">delivery time</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {getDeliveryConfirmation(order)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col items-center space-y-1">
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => handleViewInvoice(order)}
                                className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center"
                                title="View Invoice"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                Invoice
                              </button>
                              <button 
                                onClick={() => handleDownloadPOD(order)}
                                className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 flex items-center"
                                title="Download Proof of Delivery"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                POD
                              </button>
                            </div>
                            <div className="flex space-x-1">
                              <button 
                                onClick={() => handleRateDelivery(order)}
                                className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-50 rounded-md hover:bg-yellow-100 flex items-center"
                                title="Rate Delivery"
                              >
                                <Star className="w-3 h-3 mr-1" />
                                Rate
                              </button>
                              <button 
                                onClick={() => handleInitiateReturn(order)}
                                className="px-2 py-1 text-xs font-medium text-orange-700 bg-orange-50 rounded-md hover:bg-orange-100 flex items-center"
                                title="Initiate Return"
                              >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                Return
                              </button>
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
                            <CheckCircle className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-1">No delivered orders found</h3>
                          <p className="text-sm text-gray-500 mb-4">You don't have any completed deliveries yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
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
                      
                      {[...Array(totalPages).keys()].map(number => (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === number + 1
                              ? 'bg-green-600 text-white'
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

      {/* Feedback Modal */}
      {showFeedbackModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Rate Your Experience
                </h3>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-white hover:bg-white/10 rounded-full p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Order: <span className="font-medium">{selectedOrder.invoiceNo}</span></p>
                <p className="text-sm text-gray-600">Customer: <span className="font-medium">{selectedOrder.firstName} {selectedOrder.lastName}</span></p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How was your delivery experience?
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Share your feedback about the delivery service..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-md text-sm font-medium hover:bg-yellow-600 transition-all duration-200"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Received;