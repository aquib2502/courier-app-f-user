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
  Clipboard,
  Calendar,
  Clock,
  Truck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Eye,
  Edit,
  X,
  FileText,
  MapPin,
  Hash,
  Users,
  DollarSign,
  Weight,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ManifestListing = () => {
  const [manifests, setManifests] = useState([]);
  const [filteredManifests, setFilteredManifests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterManifestId, setFilterManifestId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  // Modal states
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Expanded manifest details
  const [expandedManifests, setExpandedManifests] = useState([]);

  // Fetch manifests
  const fetchManifests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const response = await axios.get(
        `http://localhost:5000/api/manifests/user/${userId}`
      );

      setManifests(response.data.data);
      setFilteredManifests(response.data.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching manifests:", error);
      setError("Unable to fetch manifests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManifests();
  }, []);

  // Search and filter
  useEffect(() => {
    let filtered = [...manifests];

    if (searchQuery) {
      filtered = filtered.filter(
        (manifest) =>
          manifest.manifestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          manifest.courierPartner.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter(
        (manifest) =>
          new Date(manifest.createdAt).toLocaleDateString("en-GB") ===
          new Date(filterDate).toLocaleDateString("en-GB")
      );
    }

    if (filterManifestId) {
      filtered = filtered.filter((manifest) =>
        manifest.manifestId.toLowerCase().includes(filterManifestId.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (manifest) => manifest.status === filterStatus
      );
    }

    setFilteredManifests(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterDate, filterManifestId, filterStatus, manifests]);

  // Toggle manifest expansion
  const toggleManifestExpansion = (manifestId) => {
    setExpandedManifests((prev) =>
      prev.includes(manifestId)
        ? prev.filter((id) => id !== manifestId)
        : [...prev, manifestId]
    );
  };

  // Handle pickup request
  const handlePickupRequest = (manifest) => {
    setSelectedManifest(manifest);
    setPickupDate("");
    setPickupTime("");
    setShowPickupModal(true);
  };

  // Schedule pickup
  const schedulePickup = async () => {
    if (!pickupDate || !pickupTime) {
      toast.error("Please select both date and time for pickup");
      return;
    }

    try {
      setIsScheduling(true);

      // Combine date and time
      const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
      
      // Update manifest status to pickup_requested
      const response = await axios.put(
        `http://localhost:5000/api/manifests/${selectedManifest._id}/status`,
        { status: 'pickup_requested' }
      );

      if (response.data.success) {
        toast.success("Pickup scheduled successfully!");
        setShowPickupModal(false);
        fetchManifests(); // Refresh the list
      }
    } catch (error) {
      console.error("Error scheduling pickup:", error);
      toast.error("Failed to schedule pickup. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center w-fit">
            <CheckCircle className="w-3 h-3 mr-1" />
            Open
          </span>
        );
      case 'pickup_requested':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center w-fit">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pickup Requested
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full flex items-center w-fit">
            <XCircle className="w-3 h-3 mr-1" />
            Closed
          </span>
        );
      default:
        return null;
    }
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

  // Get tomorrow's date for minimum pickup date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentManifests = filteredManifests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredManifests.length / itemsPerPage);

  // Apply filters
  const applyFilters = () => {
    // Filters are applied automatically through useEffect
    toast.success("Filters applied");
  };

  // Clear filters
  const clearFilters = () => {
    setFilterDate("");
    setFilterManifestId("");
    setFilterStatus("");
    toast.info("Filters cleared");
  };

  return (
     <div className="min-h-[calc(220vh-500px)] flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Clipboard className="w-6 h-6 text-emerald-600" />
              Manifests
            </h2>
            <p className="text-sm text-gray-500">
              View and manage all created manifests
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setFilterVisible(!filterVisible)}
              className="flex items-center text-emerald-700 hover:text-emerald-800 bg-emerald-50 py-2 px-4 rounded-lg transition-all duration-300 hover:bg-emerald-100"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="font-medium">Filters</span>
            </button>

            <button
              onClick={fetchManifests}
              className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span className="font-medium">Refresh</span>
            </button>

            <button className="flex items-center bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all duration-300 shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              <span className="font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
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
              placeholder="Search by manifest ID or courier partner..."
            />
          </div>

          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated || "Never"}
          </div>
        </div>

        {/* Filters */}
        {filterVisible && (
          <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Filter Manifests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Created Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Manifest ID
                </label>
                <input
                  type="text"
                  value={filterManifestId}
                  onChange={(e) => setFilterManifestId(e.target.value)}
                  placeholder="Enter Manifest ID"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="pickup_requested">Pickup Requested</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-1.5 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
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
            <p className="text-gray-600">Loading manifests...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchManifests}
              className="bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Manifests List */}
        {!loading && !error && (
          <div className="space-y-4">
            {currentManifests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No manifests found
                </h3>
                <p className="text-sm text-gray-500">
                  Create a manifest from the packed orders
                </p>
              </div>
            ) : (
              currentManifests.map((manifest) => (
                <div
                  key={manifest._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Manifest Header */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {manifest.manifestId}
                          </h3>
                          {getStatusBadge(manifest.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Created</p>
                              <p className="text-sm font-medium">
                                {formatDate(manifest.createdAt)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Orders</p>
                              <p className="text-sm font-medium">
                                {manifest.totalOrders}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Weight className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Weight</p>
                              <p className="text-sm font-medium">
                                {manifest.totalWeight} KG
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Value</p>
                              <p className="text-sm font-medium">
                                ₹{manifest.totalValue}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleManifestExpansion(manifest._id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedManifests.includes(manifest._id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                        
                        {manifest.status === 'open' && (
                          <button
                            onClick={() => handlePickupRequest(manifest)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <Truck className="w-4 h-4" />
                            Schedule Pickup
                          </button>
                        )}
                        
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Courier & Pickup Info */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {manifest.courierPartner}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          AWB: {manifest.pickupAWB}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {manifest.pickupAddress?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Orders List */}
                  {expandedManifests.includes(manifest._id) && (
                    <div className="border-t border-gray-200">
                      <div className="p-4 bg-gray-50">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Orders in Manifest
                        </h4>
                        <div className="space-y-2">
                          {manifest.orders?.map((order) => (
                            <div
                              key={order._id}
                              className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-blue-600">
                                  {order.invoiceNo}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {order.firstName} {order.lastName}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {order.weight} KG
                                </span>
                              </div>
                              <button className="text-sm text-gray-500 hover:text-gray-700">
                                View Details
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredManifests.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to{" "}
              {indexOfLastItem > filteredManifests.length
                ? filteredManifests.length
                : indexOfLastItem}{" "}
              of {filteredManifests.length} manifests
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
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
                  className={`px-3 py-1 rounded ${
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
                className={`px-3 py-1 rounded ${
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
      </div>

      {/* Pickup Request Modal */}
      <AnimatePresence>
        {showPickupModal && selectedManifest && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Schedule Pickup
                  </h3>
                  <button
                    onClick={() => setShowPickupModal(false)}
                    className="text-white hover:bg-white/10 rounded-full p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Manifest Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manifest ID:</span>
                      <span className="font-medium">{selectedManifest.manifestId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Orders:</span>
                      <span className="font-medium">{selectedManifest.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Weight:</span>
                      <span className="font-medium">{selectedManifest.totalWeight} KG</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courier Partner:</span>
                      <span className="font-medium">{selectedManifest.courierPartner}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={getTomorrowDate()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Time Slot
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select time slot</option>
                      <option value="09:00">09:00 AM - 12:00 PM</option>
                      <option value="12:00">12:00 PM - 03:00 PM</option>
                      <option value="15:00">03:00 PM - 06:00 PM</option>
                      <option value="18:00">06:00 PM - 09:00 PM</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Once scheduled, the pickup request will be sent to the courier partner.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                <button
                  onClick={() => setShowPickupModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isScheduling}
                >
                  Cancel
                </button>
                <button
                  onClick={schedulePickup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={!pickupDate || !pickupTime || isScheduling}
                >
                  {isScheduling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Schedule Pickup
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManifestListing;