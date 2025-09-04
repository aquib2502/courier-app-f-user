"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Filter,
  Download,
  Search,
  RefreshCw,
  Package,
  CheckCircle,
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Eye,
  MapPin,
  Hash,
  DollarSign,
  Weight,
  Star,
  User,
  Phone,
  FileText,
  Truck,
  X,
  AlertTriangle,
  ThumbsUp,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Received = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterOrderId, setFilterOrderId] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState("");
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 0, comment: "" });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch delivered/received orders
  const fetchReceivedOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const response = await axios.get(
        `http://localhost:5000/api/user/orders/${userId}`
      );

      // Filter for only delivered orders
      const deliveredOrders = response.data.data.filter(
        order => order.orderStatus === 'Delivered'
      );

      setOrders(deliveredOrders);
      setFilteredOrders(deliveredOrders);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
      setError("Unable to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedOrders();
  }, []);

  // Search and filter
  useEffect(() => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${order.firstName} ${order.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.lastMileAWB?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.deliveredAt || order.updatedAt).toLocaleDateString("en-GB") ===
          new Date(filterDate).toLocaleDateString("en-GB")
      );
    }

    if (filterOrderId) {
      filtered = filtered.filter((order) =>
        order.invoiceNo?.toLowerCase().includes(filterOrderId.toLowerCase())
      );
    }

    if (filterCustomer) {
      filtered = filtered.filter(
        (order) =>
          order.firstName?.toLowerCase().includes(filterCustomer.toLowerCase()) ||
          order.lastName?.toLowerCase().includes(filterCustomer.toLowerCase())
      );
    }

    if (filterDeliveryStatus) {
      filtered = filtered.filter(
        (order) => order.deliveryStatus === filterDeliveryStatus
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterDate, filterOrderId, filterCustomer, filterDeliveryStatus, orders]);

  // Handle order details modal
  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Handle feedback modal
  const handleShowFeedback = (order) => {
    setSelectedOrder(order);
    setFeedback({ rating: order.customerRating || 0, comment: order.customerFeedback || "" });
    setShowFeedbackModal(true);
  };

  // Submit feedback
  const submitFeedback = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/orders/${selectedOrder._id}/feedback`,
        {
          rating: feedback.rating,
          comment: feedback.comment
        }
      );

      if (response.data.success) {
        toast.success("Feedback submitted successfully!");
        setShowFeedbackModal(false);
        fetchReceivedOrders();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  // Get delivery status badge
  const getDeliveryStatusBadge = (status) => {
    const statusConfig = {
      "Delivered": { color: "bg-green-100 text-green-800", icon: CheckCircle },
      "Delivered - Signed": { color: "bg-blue-100 text-blue-800", icon: FileText },
      "Delivered - Left at Door": { color: "bg-yellow-100 text-yellow-800", icon: Package },
      "Partial Delivery": { color: "bg-orange-100 text-orange-800", icon: AlertTriangle }
    };

    const config = statusConfig[status] || statusConfig["Delivered"];
    const IconComponent = config.icon;

    return (
      <span className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1 ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        {status || "Delivered"}
      </span>
    );
  };

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  // Interactive star rating for feedback
  const renderInteractiveStars = (rating, onChange) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        onClick={() => onChange(index + 1)}
        className="focus:outline-none"
      >
        <Star
          className={`w-6 h-6 transition-colors ${
            index < rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-300"
          }`}
        />
      </button>
    ));
  };

  // Calculate delivery time
  const getDeliveryTime = (orderDate, deliveredDate) => {
    const order = new Date(orderDate);
    const delivered = new Date(deliveredDate || Date.now());
    const diffTime = Math.abs(delivered - order);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Apply filters
  const applyFilters = () => {
    toast.success("Filters applied");
  };

  // Clear filters
  const clearFilters = () => {
    setFilterDate("");
    setFilterOrderId("");
    setFilterCustomer("");
    setFilterDeliveryStatus("");
    toast.info("Filters cleared");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
                Delivered Orders
              </h1>
              <p className="text-gray-600 text-lg">
                View completed deliveries and customer feedback
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setFilterVisible(!filterVisible)}
                className="flex items-center text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 py-3 px-5 rounded-lg transition-all duration-300 font-medium"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>

              <button
                onClick={fetchReceivedOrders}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-lg transition-all duration-300 shadow-sm font-medium"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </button>

              <button className="flex items-center bg-teal-600 hover:bg-teal-700 text-white py-3 px-5 rounded-lg transition-all duration-300 shadow-sm font-medium">
                <Download className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div className="relative w-full lg:w-1/2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 w-full pl-12 pr-4 py-3 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-colors"
                placeholder="Search by order ID, customer name, or AWB number..."
              />
            </div>

            <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              Last updated: {lastUpdated || "Never"}
            </div>
          </div>

          {/* Advanced Filters */}
          {filterVisible && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Advanced Filters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={filterOrderId}
                    onChange={(e) => setFilterOrderId(e.target.value)}
                    placeholder="Enter Order ID"
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={filterCustomer}
                    onChange={(e) => setFilterCustomer(e.target.value)}
                    placeholder="Enter Customer Name"
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Status
                  </label>
                  <select
                    value={filterDeliveryStatus}
                    onChange={(e) => setFilterDeliveryStatus(e.target.value)}
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">All Status</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Delivered - Signed">Delivered - Signed</option>
                    <option value="Delivered - Left at Door">Delivered - Left at Door</option>
                    <option value="Partial Delivery">Partial Delivery</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Loading State */}
          {loading && (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Loading delivered orders...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
              <p className="text-red-600 mb-6 text-lg">{error}</p>
              <button
                onClick={fetchReceivedOrders}
                className="bg-red-600 text-white py-3 px-6 rounded-lg text-sm hover:bg-red-700 font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Orders Table */}
          {!loading && !error && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Delivery Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Order Details
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Delivery Info
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Rating
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <CheckCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-3">
                              No delivered orders found
                            </h3>
                            <p className="text-gray-500">
                              Completed deliveries will appear here
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Delivery Date */}
                          <td className="px-4 py-6">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">
                                {order.receivedAt ? formatDate(order.receivedAt) : formatDate(order.deliveredAt || order.updatedAt)}
                              </p>
                              <p className="text-s text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {order.receivedAt ? formatTime(order.receivedAt) : formatTime(order.deliveredAt || order.updatedAt)}
                              </p>
                              {/* <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                {getDeliveryTime(order.createdAt, order.deliveredAt)} days
                              </span> */}
                            </div>
                          </td>

                          {/* Order Details */}
                          <td className="px-6 py-6">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-blue-600">
                                {order.invoiceNo}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Weight className="w-3 h-3" />
                                  {order.weight || "0.5"} KG
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Package className="w-3 h-3" />
                                  {order.productItems?.length || 1} item
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                AWB: {order.lastMileAWB || "US" + order.invoiceNo?.slice(-6)}
                              </p>
                            </div>
                          </td>
                          
                          {/* Customer */}
                          <td className="px-6 py-6">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-900">
                                {order.firstName} {order.lastName}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {order.mobile}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {order.city}, {order.country}
                              </p>
                            </div>
                          </td>
                          
                          {/* Delivery Info */}
                          <td className="px-6 py-6">
                            <div className="space-y-2">
                              <p className="text-sm text-gray-900 font-medium">
                                {order.deliveryLocation || order.address1}
                              </p>
                              <p className="text-xs text-gray-500">
                                Delivered by: {order.deliveryAgent || "Courier"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Signature: {order.signatureRequired ? "Required" : "Not Required"}
                              </p>
                            </div>
                          </td>
                          
                          {/* Status */}
                          <td className="px-6 py-6">
                            {getDeliveryStatusBadge(order.deliveryStatus)}
                          </td>
                          
                          {/* Rating */}
                          <td className="px-6 py-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {renderStars(order.customerRating || 0)}
                                </div>
                                {order.customerRating && (
                                  <span className="text-xs text-gray-500">
                                    ({order.customerRating})
                                  </span>
                                )}
                              </div>
                              {order.customerFeedback && (
                                <p className="text-xs text-gray-500 italic truncate max-w-32">
                                  "{order.customerFeedback}"
                                </p>
                              )}
                            </div>
                          </td>
                          
                          {/* Actions */}
                          <td className="px-6 py-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleShowDetails(order)}
                                className="px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-1 transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                Details
                              </button>
                              {!order.customerRating && (
                                <button
                                  onClick={() => handleShowFeedback(order)}
                                  className="px-3 py-2 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 flex items-center gap-1 transition-colors"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  Feedback
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredOrders.length > itemsPerPage && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {indexOfLastItem > filteredOrders.length
                      ? filteredOrders.length
                      : indexOfLastItem}{" "}
                    of {filteredOrders.length} orders
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === index + 1
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedOrder && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" />
                    Delivery Details
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">Order Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">{selectedOrder.invoiceNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Date:</span>
                        <span className="font-medium">{formatDate(selectedOrder.deliveredAt || selectedOrder.updatedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Time:</span>
                        <span className="font-medium text-green-600">
                          {getDeliveryTime(selectedOrder.createdAt, selectedOrder.deliveredAt)} days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">Delivery Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        {getDeliveryStatusBadge(selectedOrder.deliveryStatus)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AWB Number:</span>
                        <span className="font-medium">{selectedOrder.lastMileAWB || "US" + selectedOrder.invoiceNo?.slice(-6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivered By:</span>
                        <span className="font-medium">{selectedOrder.deliveryAgent || "Courier"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Signature:</span>
                        <span className="font-medium">{selectedOrder.signatureRequired ? "Required" : "Not Required"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg">Customer & Delivery Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-medium text-gray-800 text-lg mb-2">
                        {selectedOrder.firstName} {selectedOrder.lastName}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {selectedOrder.mobile}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600">{selectedOrder.address1}</p>
                      {selectedOrder.address2 && <p className="text-gray-600">{selectedOrder.address2}</p>}
                      <p className="text-gray-600">
                        {selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}
                      </p>
                      <p className="text-gray-600">{selectedOrder.country}</p>
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg">Package Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center bg-white p-4 rounded-lg">
                      <p className="text-gray-600 mb-1">Weight</p>
                      <p className="font-medium text-xl">{selectedOrder.weight || "0.5"} KG</p>
                    </div>
                    <div className="text-center bg-white p-4 rounded-lg">
                      <p className="text-gray-600 mb-1">Dimensions</p>
                      <p className="font-medium text-xl">
                        {selectedOrder.length || "10"} × {selectedOrder.width || "10"} × {selectedOrder.height || "10"} cm
                      </p>
                    </div>
                    <div className="text-center bg-white p-4 rounded-lg">
                      <p className="text-gray-600 mb-1">Items</p>
                      <p className="font-medium text-xl">{selectedOrder.productItems?.length || 1} items</p>
                    </div>
                  </div>
                </div>

                {/* Product Items */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg">Items Delivered</h4>
                  <div className="space-y-3">
                    {selectedOrder.productItems?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg border">
                        <div>
                          <p className="font-medium text-gray-800">{item.productName}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.productQuantity}</p>
                        </div>
                        <p className="font-medium text-gray-800">₹{item.productPrice}</p>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">No items information available</p>
                    )}
                  </div>
                </div>

                {/* Customer Feedback */}
                {selectedOrder.customerRating && (
                  <div className="bg-yellow-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">Customer Feedback</h4>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex">
                        {renderStars(selectedOrder.customerRating)}
                      </div>
                      <span className="text-sm text-gray-600">({selectedOrder.customerRating}/5)</span>
                    </div>
                    {selectedOrder.customerFeedback && (
                      <p className="text-gray-700 italic bg-white p-3 rounded-lg">
                        "{selectedOrder.customerFeedback}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && selectedOrder && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Rate Delivery
                  </h3>
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                <div className="text-center">
                  <p className="text-gray-700 mb-2 text-lg">How was your delivery experience?</p>
                  <p className="text-sm text-gray-500">Order: {selectedOrder.invoiceNo}</p>
                </div>

                {/* Rating Stars */}
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-4">Rating</p>
                  <div className="flex justify-center gap-2">
                    {renderInteractiveStars(feedback.rating, (rating) => 
                      setFeedback({...feedback, rating})
                    )}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Comments (Optional)
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Share your delivery experience..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedback}
                  disabled={feedback.rating === 0}
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Submit Feedback
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Received;