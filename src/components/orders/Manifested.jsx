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
  ArrowLeft,
  Check,
  Building2,
  MapPin,
  FileText,
  Hash,
  DollarSign,
  Weight,
  Truck,
  Calendar,
  Clock,
  Users,
  Eye,
  Plus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  // New state for manifest creation flow
  const [showManifestCreation, setShowManifestCreation] = useState(false);
  const [selectedPickupData, setSelectedPickupData] = useState(null);
  const [manifestId, setManifestId] = useState("");
  const [sameAddressOrders, setSameAddressOrders] = useState([]);
  const [otherAddressOrders] = useState([]);
  const [manifestedOrders, setManifestedOrders] = useState([]);

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

  // Function to generate manifest ID
  const generateManifestId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `MSG${timestamp}${random}`;
  };

  // Handle New Manifest
  const handleNewManifest = () => {
    setShowNewManifestModal(true);
    setSelectedPickupAddress("");
  };

  // Handle Create Manifest
  const handleCreateManifest = async () => {
    if (!selectedPickupAddress) {
      alert("Please select a pickup address");
      return;
    }

    // Get the selected pickup address data
    const pickupData = pickupAddresses.find(
      (addr) => addr.id === Number(selectedPickupAddress)
    );
    setSelectedPickupData(pickupData);

    // Generate new manifest ID
    const newManifestId = generateManifestId();
    setManifestId(newManifestId);

    // For demo purposes, let's create some sample orders if we don't have any
    let ordersToFilter = orders;
    if (orders.length === 0) {
      // Create sample orders for demonstration
      ordersToFilter = Array.from({ length: 5 }, (_, i) => ({
        _id: `order_${i + 1}`,
        invoiceNo: `SG32505102934M${i + 1}`,
        firstName: `Customer ${i + 1}`,
        lastName: "Name",
        mobile: "+91 98765 43210",
        invoiceDate: new Date().toISOString(),
        weight: (Math.random() * 2 + 0.1).toFixed(2),
        productItems: [
          {
            productName: `Product ${i + 1}`,
            productQuantity: Math.floor(Math.random() * 5) + 1,
            productPrice: (Math.random() * 1000 + 100).toFixed(2),
          },
        ],
        manifestStatus: "open",
        orderStatus: "Packed",
        lastMileAWB: "US",
        selected: false,
      }));
    }

    // Get packed orders for the same address with 'open' manifest status
    const sameAddressOrders = ordersToFilter.filter((order) => {
      // Only show orders with open manifest status and from the same pickup address
      return order.manifestStatus === "open" && order.orderStatus === "Packed"; // Ensure they are packed status
    });

    // Set the same address orders with additional fields
    const formattedOrders = sameAddressOrders.map((order) => ({
      ...order,
      selected: false,
    }));

    setSameAddressOrders(formattedOrders);
    setManifestedOrders([]); // Reset manifested orders

    // Close modal and show manifest creation view
    setShowNewManifestModal(false);
    setShowManifestCreation(true);
  };

  // Handle back to listing
  const handleBackToListing = () => {
    setShowManifestCreation(false);
    setManifestedOrders([]);
    setSameAddressOrders([]);
    setSelectedPickupData(null);
    setManifestId("");
  };

  // Handle select/deselect order
  const handleSelectOrder = (orderId) => {
    setSameAddressOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, selected: !order.selected } : order
      )
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    const allSelected = sameAddressOrders.every((order) => order.selected);
    setSameAddressOrders((prev) =>
      prev.map((order) => ({ ...order, selected: !allSelected }))
    );
  };

  // Handle add to manifest
  const handleAddToManifest = (orderId = null) => {
    if (orderId) {
      // Add single order
      const orderToMove = sameAddressOrders.find(
        (order) => order._id === orderId
      );
      if (orderToMove) {
        // Add to manifested orders and remove from same address orders
        setManifestedOrders([
          ...manifestedOrders,
          { ...orderToMove, selected: false },
        ]);
        setSameAddressOrders((prev) =>
          prev.filter((order) => order._id !== orderId)
        );
      }
    } else {
      // Add selected orders (bulk)
      const selectedOrders = sameAddressOrders.filter(
        (order) => order.selected
      );
      if (selectedOrders.length > 0) {
        // Add selected orders to manifested and remove them from same address orders
        const ordersToAdd = selectedOrders.map((order) => ({
          ...order,
          selected: false,
        }));
        setManifestedOrders([...manifestedOrders, ...ordersToAdd]);
        setSameAddressOrders((prev) => prev.filter((order) => !order.selected));
      }
    }
  };

  // Handle remove from manifest
  const handleRemoveFromManifest = (orderId) => {
    const orderToMove = manifestedOrders.find((order) => order._id === orderId);
    if (orderToMove) {
      // Remove from manifested orders and add back to same address orders
      setManifestedOrders((prev) =>
        prev.filter((order) => order._id !== orderId)
      );
      setSameAddressOrders([
        ...sameAddressOrders,
        { ...orderToMove, selected: false },
      ]);
    }
  };

  // Calculate manifest details
  const manifestDetails = {
    totalValue: manifestedOrders
      .reduce((sum, order) => {
        const orderValue =
          order.productItems?.reduce(
            (orderSum, item) =>
              orderSum +
              Number(item.productQuantity || 0) *
                Number(item.productPrice || 0),
            0
          ) || 0;
        return sum + orderValue;
      }, 0)
      .toFixed(2),
    totalWeight: manifestedOrders
      .reduce((sum, order) => sum + Number(order.weight || 0), 0)
      .toFixed(2),
    totalCount: manifestedOrders.length,
    manifestOrderValue: manifestedOrders
      .reduce((sum, order) => {
        const orderValue =
          order.productItems?.reduce(
            (orderSum, item) =>
              orderSum +
              Number(item.productQuantity || 0) *
                Number(item.productPrice || 0),
            0
          ) || 0;
        return sum + orderValue;
      }, 0)
      .toFixed(2),
    estimatedPickup: "2025-05-11 10:00 AM",
    pickupService: "Standard Express",
    pickupPartner: "ShipGlobal Express",
    pickupAWB: "AWB" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  };

  // Format date helper function
  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-GB"); // Format as "DD/MM/YYYY"
  };

  // Format time helper function
  const formatTime = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    return formattedDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
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

  // Manifest Creation View with CORRECTED Layout (Manifested Orders First)
  if (showManifestCreation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToListing}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      Create New Manifest
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Organize orders for efficient shipping
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Clipboard className="w-4 h-4" />
                    Save Manifest
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Pickup Address Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Selected Pickup Location
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {selectedPickupData?.name || "SAGBAG HUB"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedPickupData?.address ||
                          "1818 18TH FLOOR SAGBAG MAROL ANDHERI EAST, Marol Naka"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Mumbai Suburban, 400059
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Contact Person</p>
                    <p className="text-sm font-medium text-gray-800">
                      HUSSAIN PATEL
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Contact Number</p>
                    <p className="text-sm font-medium text-gray-800">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Manifest Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Manifest Details
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    icon: Hash,
                    label: "Manifest ID",
                    value: manifestId,
                    color: "text-blue-600",
                  },
                  {
                    icon: DollarSign,
                    label: "Total Value",
                    value: `₹${manifestDetails.totalValue}`,
                    color: "text-green-600",
                  },
                  {
                    icon: Weight,
                    label: "Total Weight",
                    value: `${manifestDetails.totalWeight} KG`,
                    color: "text-orange-600",
                  },
                  {
                    icon: Package,
                    label: "Total Orders",
                    value: manifestDetails.totalCount,
                    color: "text-purple-600",
                  },
                  {
                    icon: Truck,
                    label: "Pickup Partner",
                    value: manifestDetails.pickupPartner,
                    color: "text-indigo-600",
                  },
                  {
                    icon: Hash,
                    label: "Service Type",
                    value: manifestDetails.pickupService,
                    color: "text-emerald-600",
                  },
                  {
                    icon: Calendar,
                    label: "Estimated Pickup",
                    value: manifestDetails.estimatedPickup,
                    color: "text-blue-600",
                  },
                  {
                    icon: Hash,
                    label: "AWB Number",
                    value: manifestDetails.pickupAWB,
                    color: "text-gray-600",
                  },
                ].map((detail, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <detail.icon className={`w-4 h-4 ${detail.color}`} />
                      <span className="text-xs text-gray-500">
                        {detail.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CORRECTED Vertical Layout for Orders Management */}
          <div className="space-y-6">
            {/* FIRST: Manifested Orders (Already added to manifest) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-green-50 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Manifested Orders
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {manifestedOrders.length} Orders
                    </span>
                  </div>
                  <div className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    ₹{manifestDetails.totalValue} |{" "}
                    {manifestDetails.totalWeight} KG
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Mile AWB
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {manifestedOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <Check className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">
                            No orders added to manifest yet
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Select orders from below to add them
                          </p>
                        </td>
                      </tr>
                    ) : (
                      manifestedOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-gray-900">
                                {formatDate(order.invoiceDate)}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Check className="w-3 h-3 text-green-500" />
                                In manifest
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-blue-600">
                                {order.invoiceNo}
                              </p>
                              <p className="text-xs text-blue-500">US</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {order.firstName} {order.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.mobile}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1 text-xs">
                                <Weight className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-600">
                                  WT: {order.weight}KG
                                </span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs">
                                <DollarSign className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-600">
                                  Value:{" "}
                                  {order.productItems
                                    ?.reduce(
                                      (sum, item) =>
                                        sum +
                                        Number(item.productQuantity || 0) *
                                          Number(item.productPrice || 0),
                                      0
                                    )
                                    .toFixed(2)}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {order.lastMileAWB || "US"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleRemoveFromManifest(order._id)
                                }
                                className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                              >
                                Remove From Manifest
                              </button>
                              <button
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                                title="View Details"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECOND: Same Address Orders (Available to add) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Available Orders
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {sameAddressOrders.length} Orders
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToManifest()}
                    disabled={
                      !sameAddressOrders.some((order) => order.selected)
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      sameAddressOrders.some((order) => order.selected)
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span>Bulk</span>
                    <span className="bg-blue-600 bg-opacity-20 px-2 py-1 rounded text-sm">
                      Add To Manifest
                    </span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            sameAddressOrders.length > 0 &&
                            sameAddressOrders.every((order) => order.selected)
                          }
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Mile AWB
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sameAddressOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={order.selected || false}
                            onChange={() => handleSelectOrder(order._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {formatDate(order.invoiceDate)}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(order.invoiceDate)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-blue-600">
                              {order.invoiceNo}
                            </p>
                            <p className="text-xs text-blue-500">US</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {order.firstName} {order.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.mobile}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 text-xs">
                              <Weight className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">
                                WT: {order.weight}KG
                              </span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs">
                              <DollarSign className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">
                                Value:{" "}
                                {order.productItems
                                  ?.reduce(
                                    (sum, item) =>
                                      sum +
                                      Number(item.productQuantity || 0) *
                                        Number(item.productPrice || 0),
                                    0
                                  )
                                  .toFixed(2)}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.lastMileAWB || "US"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleAddToManifest(order._id)}
                              className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                            >
                              Add To Manifest
                            </button>
                            <button
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                              title="View Details"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sameAddressOrders.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No orders available for this address
                    </p>
                  </div>
                )}
              </div>

              {sameAddressOrders.length > 0 && (
                <div className="px-6 py-3 border-t bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
                  <span>
                    Showing 1 to {sameAddressOrders.length} of{" "}
                    {sameAddressOrders.length} records
                  </span>
                  <div className="flex items-center gap-1">
                    <select className="px-2 py-1 text-sm border rounded">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                    <button
                      disabled
                      className="px-2 py-1 border rounded bg-gray-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded">
                      1
                    </button>
                    <button
                      disabled
                      className="px-2 py-1 border rounded bg-gray-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Action Bar */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToListing}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  Save as Draft
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <span className="font-medium">{manifestedOrders.length}</span>{" "}
                  orders ready for manifest
                </div>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={manifestedOrders.length === 0}
                >
                  Complete Manifest
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original manifested orders listing view with Enhanced UI
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
