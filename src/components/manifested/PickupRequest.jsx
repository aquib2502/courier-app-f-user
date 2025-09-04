"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Filter,
  Download,
  Search,
  RefreshCw,
  Truck,
  Calendar,
  Clock,
  Edit2,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Hash,
  Package,
  Phone,
  User,
  FileText,
  DollarSign,
  Weight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PickupRequest = () => {
  const [pickupRequests, setPickupRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  
  // Filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCourier, setFilterCourier] = useState("");
  
  // Modal states
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [newPickupDate, setNewPickupDate] = useState("");
  const [newPickupTime, setNewPickupTime] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch pickup requests (manifests with pickup_requested or closed status)
  const fetchPickupRequests = async () => {
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
        `http://localhost:5000/api/manifests/user/${userId}`
      );

      // Filter manifests that have pickup requested or closed status
      const pickupManifests = response.data.data.filter(
        manifest => manifest.status === 'pickup_requested' || manifest.status === 'closed'
      );

      setPickupRequests(pickupManifests);
      setFilteredRequests(pickupManifests);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching pickup requests:", error);
      setError("Unable to fetch pickup requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickupRequests();
  }, []);

  // Search and filter
  useEffect(() => {
    let filtered = [...pickupRequests];

    if (searchQuery) {
      filtered = filtered.filter(
        (request) =>
          request.manifestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.courierPartner.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter(
        (request) =>
          new Date(request.estimatedPickup).toLocaleDateString("en-GB") ===
          new Date(filterDate).toLocaleDateString("en-GB")
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (request) => request.status === filterStatus
      );
    }

    if (filterCourier) {
      filtered = filtered.filter((request) =>
        request.courierPartner.toLowerCase().includes(filterCourier.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterDate, filterStatus, filterCourier, pickupRequests]);

  // Handle reschedule
  const handleReschedule = (pickup) => {
    setSelectedPickup(pickup);
    setNewPickupDate("");
    setNewPickupTime("");
    setShowRescheduleModal(true);
  };

  // Reschedule pickup
  const reschedulePickup = async () => {
    if (!newPickupDate || !newPickupTime) {
      toast.error("Please select both date and time for pickup");
      return;
    }

    try {
      setIsRescheduling(true);

      // Update the manifest's estimated pickup time
      const pickupDateTime = new Date(`${newPickupDate}T${newPickupTime}`);
      
      // Here you would make an API call to update the pickup schedule
      // For now, we'll just show success
      toast.success("Pickup rescheduled successfully!");
      setShowRescheduleModal(false);
      fetchPickupRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rescheduling pickup:", error);
      toast.error("Failed to reschedule pickup. Please try again.");
    } finally {
      setIsRescheduling(false);
    }
  };

  // Handle cancel pickup
  const handleCancelPickup = async (manifestId) => {
    if (!window.confirm("Are you sure you want to cancel this pickup request?")) {
      return;
    }

    try {
      // Update manifest status back to open
      const response = await axios.put(
        `http://localhost:5000/api/manifests/${manifestId}/status`,
        { status: 'open' }
      );

      if (response.data.success) {
        toast.success("Pickup request cancelled successfully!");
        fetchPickupRequests();
      }
    } catch (error) {
      console.error("Error cancelling pickup:", error);
      toast.error("Failed to cancel pickup request. Please try again.");
    }
  };

  // Handle complete pickup
  const handleCompletePickup = async (manifestId) => {
    try {
      // Update manifest status to closed
      const response = await axios.put(
        `http://localhost:5000/api/manifests/${manifestId}/status`,
        { status: 'closed' }
      );

      if (response.data.success) {
        toast.success("Pickup completed successfully!");
        fetchPickupRequests();
      }
    } catch (error) {
      console.error("Error completing pickup:", error);
      toast.error("Failed to complete pickup. Please try again.");
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pickup_requested':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full flex items-center w-fit">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full flex items-center w-fit">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  // Format date from pickupDate
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

// Format time from pickupTime
const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString("en-GB", {
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

  // Get pickup time slot display from pickupTime
const getTimeSlotDisplay = (time) => {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 9 && hour < 12) return "09:00 AM - 12:00 PM";
  if (hour >= 12 && hour < 15) return "12:00 PM - 03:00 PM";
  if (hour >= 15 && hour < 18) return "03:00 PM - 06:00 PM";
  if (hour >= 18 && hour < 21) return "06:00 PM - 09:00 PM";
  return time;
};

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  // Apply filters
  const applyFilters = () => {
    toast.success("Filters applied");
  };

  // Clear filters
  const clearFilters = () => {
    setFilterDate("");
    setFilterStatus("");
    setFilterCourier("");
    toast.info("Filters cleared");
  };

  return (
    <div className="min-h-[calc(220vh-200px)] flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Truck className="w-6 h-6 text-indigo-600" />
              Pickup Requests
            </h2>
            <p className="text-sm text-gray-500">
              Manage scheduled pickup requests for manifests
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setFilterVisible(!filterVisible)}
              className="flex items-center text-indigo-700 hover:text-indigo-800 bg-indigo-50 py-2 px-4 rounded-lg transition-all duration-300 hover:bg-indigo-100"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="font-medium">Filters</span>
            </button>

            <button
              onClick={fetchPickupRequests}
              className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span className="font-medium">Refresh</span>
            </button>

            <button className="flex items-center bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-sm">
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
              className="bg-white w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Search by manifest ID or courier partner..."
            />
          </div>

          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated || "Never"}
          </div>
        </div>

        {/* Filters */}
        {filterVisible && (
          <div className="mb-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Filter Pickup Requests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Pickup Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  <option value="pickup_requested">Scheduled</option>
                  <option value="closed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Courier Partner
                </label>
                <input
                  type="text"
                  value={filterCourier}
                  onChange={(e) => setFilterCourier(e.target.value)}
                  placeholder="Enter courier name"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
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
                className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pickup requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPickupRequests}
              className="bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Pickup Requests List */}
        {!loading && !error && (
          <div className="space-y-4">
            {currentRequests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No pickup requests found
                </h3>
                <p className="text-sm text-gray-500">
                  Schedule pickups from the manifests section
                </p>
              </div>
            ) : (
              currentRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Pickup for {request.manifestId}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>

                        {/* Pickup Details Grid */}
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                            <Calendar className="w-4 h-4" />
                            <p className="text-xs">Pickup Date</p>
                            </div>
                            <p className="text-sm font-medium">
                            {formatDate(request.pickupDate)}
                            </p>
                        </div>


                           <div>
    <div className="flex items-center gap-2 text-gray-500 mb-1">
      <Clock className="w-4 h-4" />
      <p className="text-xs">Time Slot</p>
    </div>
    <p className="text-sm font-medium">
      {getTimeSlotDisplay(request.pickupTime)}
    </p>
  </div>

                          <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                              <Truck className="w-4 h-4" />
                              <p className="text-xs">Courier Partner</p>
                            </div>
                            <p className="text-sm font-medium">
                              {request.courierPartner}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                              <Hash className="w-4 h-4" />
                              <p className="text-xs">Pickup AWB</p>
                            </div>
                            <p className="text-sm font-medium">
                              {request.pickupAWB}
                            </p>
                          </div>
                        </div>

                        {/* Manifest Info */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Total Orders</p>
                              <p className="font-medium">{request.totalOrders}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total Weight</p>
                              <p className="font-medium">{request.totalWeight} KG</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total Value</p>
                              <p className="font-medium">₹{request.totalValue}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Pickup Location</p>
                              <p className="font-medium">{request.pickupAddress?.name}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="ml-4 flex flex-col gap-2">
                        {request.status === 'pickup_requested' && (
                          <>
                            <button
                              onClick={() => handleReschedule(request)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCompletePickup(request._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Complete
                            </button>
                            <button
                              onClick={() => handleCancelPickup(request._id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </button>
                          </>
                        )}
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>

                    {/* Pickup Address Details */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-gray-700">Pickup Address</p>
                          <p className="text-gray-600">{request.pickupAddress?.address}</p>
                          <div className="flex items-center gap-4 mt-2 text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {request.pickupAddress?.contactPerson}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {request.pickupAddress?.contactNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredRequests.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {indexOfFirstItem + 1} to{" "}
              {indexOfLastItem > filteredRequests.length
                ? filteredRequests.length
                : indexOfLastItem}{" "}
              of {filteredRequests.length} pickup requests
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
                      ? "bg-indigo-600 text-white"
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

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showRescheduleModal && selectedPickup && (
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
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Reschedule Pickup
                  </h3>
                  <button
                    onClick={() => setShowRescheduleModal(false)}
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
                    Current Schedule
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manifest ID:</span>
                      <span className="font-medium">{selectedPickup.manifestId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Date:</span>
                      <span className="font-medium">{formatDate(selectedPickup.estimatedPickup)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Time:</span>
                      <span className="font-medium">{getTimeSlotDisplay(formatTime(selectedPickup.estimatedPickup))}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Pickup Date
                    </label>
                    <input
                      type="date"
                      value={newPickupDate}
                      onChange={(e) => setNewPickupDate(e.target.value)}
                      min={getTomorrowDate()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Time Slot
                    </label>
                    <select
                      value={newPickupTime}
                      onChange={(e) => setNewPickupTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select time slot</option>
                      <option value="09:00">09:00 AM - 12:00 PM</option>
                      <option value="12:00">12:00 PM - 03:00 PM</option>
                      <option value="15:00">03:00 PM - 06:00 PM</option>
                      <option value="18:00">06:00 PM - 09:00 PM</option>
                    </select>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Rescheduling will notify the courier partner of the new pickup time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isRescheduling}
                >
                  Cancel
                </button>
                <button
                  onClick={reschedulePickup}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={!newPickupDate || !newPickupTime || isRescheduling}
                >
                  {isRescheduling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Rescheduling...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Reschedule
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

export default PickupRequest;