"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Filter,
  Download,
  FilePlus,
  Search,
  RefreshCw,
  Package,
  PlusCircle,
  ChevronDown,
  X,
  Printer,
  Clipboard,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CreateManifest from "./CreateManifest"; // Import the new component

const Manifested = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  // Filter state variables
  const [orderDate, setOrderDate] = useState("");
  const [orderId, setOrderId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [manifestStatus, setManifestStatus] = useState("");

  // Modal state variables
  const [showNewManifestModal, setShowNewManifestModal] = useState(false);
  const [selectedPickupAddress, setSelectedPickupAddress] = useState("");
  const [pickupAddresses, setPickupAddresses] = useState([
    {
      id: 1,
      name: "Warehouse Mumbai",
      address: "A-101, Industrial Area, Andheri East, Mumbai - 400059",
    },
    {
      id: 2,
      name: "Office Delhi",
      address: "42 Commercial Complex, Connaught Place, New Delhi - 110001",
    },
    {
      id: 3,
      name: "Distribution Center Bangalore",
      address: "Tech Park, Whitefield, Bangalore - 560066",
    },
  ]);

  // Navigation state
  const [showCreateManifest, setShowCreateManifest] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const toggleFilters = () => {
    setFilterVisible(!filterVisible);
  };

  // Function to fetch orders from packed status
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get userId from the JWT token stored in localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }

      // Decode the token
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      if (!userId) {
        setError("Invalid token. User ID not found.");
        setLoading(false);
        return;
      }

      // Make the API request to fetch orders
      const response = await axios.get(
        `http://localhost:5000/api/user/orders/${userId}`
      );

      // Filter for only packed orders and add manifestStatus field
      const packedOrders = response.data.data
        .filter((order) => order.orderStatus === "Packed")
        .map((order) => ({
          ...order,
          manifestStatus: order.manifestStatus || "open", // Default to 'open' if not already manifested
        }));

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

  // Search functionality
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

  // Handle New Manifest
  const handleNewManifest = () => {
    setShowNewManifestModal(true);
    setSelectedPickupAddress("");
  };

  // Handle Create Manifest - Navigate to CreateManifest component
  const handleCreateManifest = async () => {
    if (!selectedPickupAddress) {
      alert("Please select a pickup address");
      return;
    }

    // Get the selected pickup address data
    const pickupData = pickupAddresses.find(
      (addr) => addr.id === Number(selectedPickupAddress)
    );

    // Close modal and show create manifest component
    setShowNewManifestModal(false);
    setShowCreateManifest(true);
  };

  // Handle back from create manifest
  const handleBackFromCreateManifest = () => {
    setShowCreateManifest(false);
    // Refresh orders when coming back
    fetchOrders();
  };

  // Apply filters function
  const applyFilters = () => {
    let filtered = [...orders];

    if (orderDate) {
      filtered = filtered.filter(
        (order) =>
          new Date(order.invoiceDate).toLocaleDateString("en-GB") ===
          new Date(orderDate).toLocaleDateString("en-GB")
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

    if (manifestStatus) {
      filtered = filtered.filter(
        (order) => order.manifestStatus === manifestStatus
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  // Clear filters function
  const clearFilters = () => {
    setOrderDate("");
    setOrderId("");
    setCustomerName("");
    setManifestStatus("");
    setFilteredOrders(orders);
    setCurrentPage(1);
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
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Show CreateManifest component if needed
  if (showCreateManifest) {
    return (
      <CreateManifest 
        orders={orders}
        selectedPickupData={pickupAddresses.find(addr => addr.id === Number(selectedPickupAddress))}
        onBack={handleBackFromCreateManifest}
      />
    );
  }

  // Main manifested orders listing view
  return (
    <div className="min-h-[calc(220vh-200px)] flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-md border border-gray-200">
        {/* Enhanced Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Clipboard className="w-6 h-6 text-emerald-600" />
              Manifested Orders
            </h2>
            <p className="text-sm text-gray-500">
              Manage packed orders and create manifests
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={handleNewManifest}
              className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">New Manifest</span>
            </button>

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
              <span className="font-medium">CSV</span>
            </button>
          </div>
        </div>

        {/* Enhanced Search & Refresh Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Search by order ID, customer name..."
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated || "Never"}
            </span>
            <button
              onClick={fetchOrders}
              className="p-2 text-emerald-600 hover:text-emerald-800 rounded-full hover:bg-emerald-50"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Enhanced Filters Section */}
        {filterVisible && (
          <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Filter Orders
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="orderDate"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
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
                  <label
                    htmlFor="orderId"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
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
                  <label
                    htmlFor="customerDetails"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
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

                <div>
                  <label
                    htmlFor="manifestStatus"
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Manifest Status
                  </label>
                  <select
                    id="manifestStatus"
                    value={manifestStatus}
                    onChange={(e) => setManifestStatus(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
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

        {/* Enhanced Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        )}

        {/* Enhanced Error State */}
        {error && !loading && (
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Enhanced Orders Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      Customer Details
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      Package Details
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      Packed Status
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">
                      Manifest Status
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatDate(order.invoiceDate)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-emerald-700">
                          {order.invoiceNo}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-800 font-medium">
                            {order.firstName} {order.lastName}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center mr-2 text-xs font-semibold text-emerald-800">
                              {order.productItems?.length || 0}
                            </div>
                            <span className="text-sm text-gray-700">
                              {order.productItems?.length === 1
                                ? "Package"
                                : "Packages"}{" "}
                              | {order.weight} KG
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center w-fit">
                            <Package className="w-3 h-3 mr-1" />
                            Packed
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${
                              order.manifestStatus === "open"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <Clipboard className="w-3 h-3 mr-1" />
                            {order.manifestStatus || "open"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center space-x-2">
                            <button className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center">
                              <Printer className="w-3 h-3 mr-1" />
                              Reprint Label
                            </button>
                            <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                              View
                            </button>
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
                          <h3 className="text-lg font-semibold text-gray-700 mb-1">
                            No packed orders found
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            You don't have any packed orders ready for
                            manifesting.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination */}
            {filteredOrders.length > 0 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstOrder + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {indexOfLastOrder > filteredOrders.length
                          ? filteredOrders.length
                          : indexOfLastOrder}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredOrders.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          currentPage > 1 && paginate(currentPage - 1)
                        }
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                          currentPage === 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-400 hover:bg-gray-50 cursor-pointer"
                        } ring-1 ring-inset ring-gray-300`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Generate page numbers */}
                      {[...Array(totalPages).keys()].map((number) => (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === number + 1
                              ? "bg-emerald-600 text-white"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {number + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          currentPage < totalPages && paginate(currentPage + 1)
                        }
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                          currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-400 hover:bg-gray-50 cursor-pointer"
                        } ring-1 ring-inset ring-gray-300`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced New Manifest Modal */}
      <AnimatePresence>
        {showNewManifestModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-1"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Select Address
                  </h3>
                  <button
                    onClick={() => setShowNewManifestModal(false)}
                    className="text-white hover:bg-white/10 rounded-full p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="relative">
                  <select
                    value={selectedPickupAddress}
                    onChange={(e) =>
                      setSelectedPickupAddress(Number(e.target.value))
                    }
                    className="appearance-none w-full p-3 pr-10 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select Pickup Address</option>
                    {pickupAddresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.name} - {address.address}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowNewManifestModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateManifest}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all duration-200"
                >
                  Add New Manifest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Manifested;