"use client";
import React, { useState, useEffect, useRef } from "react";
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
  XCircle,
  Printer
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

  // Modal state variables for barcode printing
const [showBarcodeModal, setShowBarcodeModal] = useState(false);
const [selectedManifestForBarcode, setSelectedManifestForBarcode] = useState(null);
const [isPrinting, setIsPrinting] = useState(false);
const [printSuccess, setPrintSuccess] = useState(false);
const barcodeRef = useRef(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Expanded manifest details
  const [expandedManifests, setExpandedManifests] = useState([]);

  // Fetch manifests
  const fetchManifests = async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/manifests/user/${userId}`
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

  // Handle Print Label - Show modal with the barcode
const handlePrintLabel = (manifest) => {
  setSelectedManifestForBarcode(manifest);
  setShowBarcodeModal(true);
  setPrintSuccess(false);
  setIsPrinting(false);
};

// Print the barcode label for manifest
const printManifestBarcode = () => {
  if (isPrinting) return;

  setIsPrinting(true);

  try {
    const printContents = document.getElementById("manifest-barcode-print-area").innerHTML;
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow pop-ups to print the label");
      setIsPrinting(false);
      return;
    }

    // A7 paper size is 74mm x 105mm
    printWindow.document.write(`
      <html>
        <head>
          <title>Manifest Label - ${selectedManifestForBarcode.manifestId}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              font-size: 10px;
            }
            @page { 
              size: 74mm 105mm; 
              margin: 2mm; 
            }
            .print-container { 
              width: 100%; 
              height: 100%; 
              font-size: 10px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 9px;
            }
            td, th { 
              padding: 2px; 
              border: 1px solid #ddd; 
              font-size: 9px;
              line-height: 1.2;
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
            .manifest-id {
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

// Generate barcode when modal opens
useEffect(() => {
  if (showBarcodeModal && selectedManifestForBarcode && barcodeRef.current) {
    try {
      JsBarcode(barcodeRef.current, selectedManifestForBarcode.manifestId, {
        format: "CODE128",
        width: 1.5,
        height: 40,
        displayValue: false,
        font: "Arial",
        fontSize: 10,
        margin: 5,
        background: "#ffffff",
      });
    } catch (error) {
      console.error("Error generating barcode:", error);
    }
  }
}, [showBarcodeModal, selectedManifestForBarcode]);

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
    // Set default pickup date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // setPickupDate(tomorrow.toISOString().split('T')[0]);
    // setPickupTime("09:00");
    setShowPickupModal(true);
  };

  // Schedule pickup with dynamic date/time
  const schedulePickup = async () => {
    if (!pickupDate || !pickupTime) {
      toast.error("Please select both date and time for pickup");
      return;
    }

    try {
      setIsScheduling(true);
console.log("payload", status, pickupDate, pickupTime, schedulePickup);
      // Combine date and time to create full pickup datetime
      const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
      
      // Update manifest with pickup information
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/manifests/${selectedManifest._id}/status`,
        { 
          status: 'pickup_requested',
          scheduledPickup: pickupDateTime,
          pickupDate: pickupDate,
          pickupTime: pickupTime
        }   
      );

      if (response.data.success) {
        toast.success(`Pickup scheduled for ${formatPickupDateTime(pickupDateTime)}`);
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

  // Format pickup date and time for display
  const formatPickupDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-GB", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get dynamic pickup time slots based on current time
  const getAvailableTimeSlots = () => {
    const now = new Date();
    const selectedDate = new Date(pickupDate);
    const isToday = selectedDate.toDateString() === now.toDateString();
    const currentHour = now.getHours();

    const timeSlots = [
      { value: "09:00", label: "09:00 AM - 12:00 PM", minHour: 9 },
      { value: "12:00", label: "12:00 PM - 03:00 PM", minHour: 12 },
      { value: "15:00", label: "03:00 PM - 06:00 PM", minHour: 15 },
      { value: "18:00", label: "06:00 PM - 09:00 PM", minHour: 18 }
    ];

    if (isToday) {
      // Filter out past time slots for today
      return timeSlots.filter(slot => slot.minHour > currentHour + 2); // 2 hour buffer
    }

    return timeSlots;
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

  // Get maximum pickup date (30 days from now)
  const getMaxPickupDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // Get estimated pickup display text
  const getEstimatedPickupText = (manifest) => {
    if (manifest.scheduledPickup) {
      return formatPickupDateTime(manifest.scheduledPickup);
    } else if (manifest.estimatedPickup) {
      return formatPickupDateTime(manifest.estimatedPickup);
    } else {
      return "Not scheduled";
    }
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

                        {/* Dynamic Pickup Information */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Pickup Schedule
                            </span>
                          </div>
                          <p className="text-sm text-blue-700">
                            {getEstimatedPickupText(manifest)}
                          </p>
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
                        
<button
  onClick={() => handlePrintLabel(manifest)}
  className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center"
>
  <Printer className="w-3 h-3 mr-1" />
  Print Label
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
                          AWB: {manifest.pickupAWB || 'Not assigned'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {manifest.pickupAddress?.name || 'Pickup location'}
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


{/* Manifest Barcode Modal */}
<AnimatePresence>
  {showBarcodeModal && selectedManifestForBarcode && (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden"
        style={{ maxHeight: "98vh", overflowY: "auto" }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Printer className="w-5 h-5 mr-2" />
            Manifest Label
          </h3>
          <button
            onClick={() => setShowBarcodeModal(false)}
            className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Manifest Summary */}
        <div className="px-6 pt-4 bg-gray-50">
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
            <span className="font-medium text-gray-700">Manifest ID:</span>
            <span className="text-blue-600 font-semibold">
              {selectedManifestForBarcode.manifestId}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center">
              <Package className="w-3 h-3 mr-1" />
              {selectedManifestForBarcode.totalOrders} Orders
            </div>
            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center">
              <Weight className="w-3 h-3 mr-1" />
              {selectedManifestForBarcode.totalWeight} KG
            </div>
            <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
              <span className="mr-1">Rs. </span>
              {selectedManifestForBarcode.totalValue} Value
            </div>
          </div>

          {/* User Info */}
          {/* <div className="mb-3 text-sm">
            <div className="font-semibold text-gray-700">Customer:</div>
            <div className="text-gray-800">
              {selectedManifestForBarcode.user.fullname} ({selectedManifestForBarcode.user.email})
            </div>
          </div> */}

          {/* Pickup Info */}
          <div className="mb-3 text-sm">
            <div className="font-semibold text-gray-700">Pickup Info:</div>
            <div className="text-gray-800">
              AWB: {selectedManifestForBarcode.pickupAWB} <br />
              Pickup Date: {formatDate(selectedManifestForBarcode.pickupDate)} <br />
              Pickup Time: {selectedManifestForBarcode.pickupTime}
            </div>
          </div>
        </div>

        {/* Barcode Print Area */}
        <div className="px-4 py-2">
          <div id="manifest-barcode-print-area">
            <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden text-xs">
              <thead>
                <tr>
                  <th colSpan="2" className="text-center p-2 bg-blue-50 border-b border-gray-300 company-logo">
                    THE TRACE EXPRESS
                  </th>
                </tr>
                <tr>
                  <th colSpan="2" className="border-b border-gray-300 manifest-id">
                    {selectedManifestForBarcode.manifestId}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2" className="p-2 border-b border-gray-300">
                    <div className="font-semibold text-xs mb-1">Courier Partner:</div>
                    <div className="text-xs">{selectedManifestForBarcode.courierPartner}</div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-b border-gray-300">
                    <div className="font-semibold text-xs mb-1">Total Orders:</div>
                    <div className="text-xs">{selectedManifestForBarcode.totalOrders}</div>
                  </td>
                  <td className="p-2 border-b border-gray-300">
                    <div className="font-semibold text-xs mb-1">Total Weight:</div>
                    <div className="text-xs">{selectedManifestForBarcode.totalWeight} KG</div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="p-2 border-b border-gray-300">
                    <div className="font-semibold text-xs mb-1">Total Value:</div>
                    <div className="text-xs">{selectedManifestForBarcode.totalValue}</div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="p-3 border-b border-gray-300 text-center bg-white">
                    <svg
                      ref={barcodeRef}
                      className="mx-auto"
                      style={{ maxWidth: "100%", height: "auto" }}
                    ></svg>
                    <div className="text-center mt-2">
                      <div className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block">
                        {selectedManifestForBarcode.manifestId}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="p-2 text-xs bg-gray-50">
                    <div className="text-center">
                      Created: {formatDate(selectedManifestForBarcode.createdAt)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-xs text-gray-500">A7 Label (74×105mm)</div>
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
                onClick={printManifestBarcode}
                disabled={isPrinting}
                className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isPrinting
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
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
                    <span>Print Manifest Label</span>
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


      {/* Enhanced Pickup Request Modal with Dynamic Time Slots */}
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
                      max={getMaxPickupDate()}
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
                      {getAvailableTimeSlots().map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic Pickup Info */}
                  {pickupDate && pickupTime && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Pickup Scheduled
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        {formatPickupDateTime(new Date(`${pickupDate}T${pickupTime}:00`))}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Once scheduled, the pickup request will be sent to the courier partner. 
                      You can reschedule up to 2 hours before the pickup time.
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