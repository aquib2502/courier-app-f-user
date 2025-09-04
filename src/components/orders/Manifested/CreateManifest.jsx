"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import {
  RefreshCw,
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
  Package,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const CreateManifest = ({ orders, selectedPickupData, onBack }) => {
  // State for manifest creation
  const [manifestId, setManifestId] = useState("");
  const [sameAddressOrders, setSameAddressOrders] = useState([]);
  const [manifestedOrders, setManifestedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to generate manifest ID
  const generateManifestId = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `MSG${timestamp}${random}`;
  };

  // Initialize manifest when component mounts
  useEffect(() => {
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
    const availableOrders = ordersToFilter.filter((order) => {
      // Only show orders with open manifest status and from the same pickup address
      return order.manifestStatus === "open" && order.orderStatus === "Packed";
    });

    // Set the same address orders with additional fields
    const formattedOrders = availableOrders.map((order) => ({
      ...order,
      selected: false,
    }));

    setSameAddressOrders(formattedOrders);
    setManifestedOrders([]); // Reset manifested orders
  }, [orders]);

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
    pickupPartner: "The Trace Express",
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


  // Add this function inside your component, before the return statement
const formatAddress = (address) => {
  if (!address) return "No address selected";
  
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.addressLine3,
    address.city,
    address.state,
    address.postalCode,
    address.country
  ];
  
  return parts.filter(part => part && part.trim() !== '').join(', ');
};

  // Handle save manifest
  const handleSaveManifest = () => {
    // Implementation for saving manifest
    console.log("Saving manifest with", manifestedOrders.length, "orders");
    toast.info(`Manifest saved with ${manifestedOrders.length} orders!`);
  };

  // Handle complete manifest - API Integration
  const handleCompleteManifest = async () => {
    if (manifestedOrders.length === 0) {
      toast.error("Please add at least one order to the manifest");
      return;
    }

    try {
      setIsLoading(true);
      
      // Get userId from token
      const token = localStorage.getItem('userToken');
      if (!token) {
        toast.error('User is not authenticated');
        return; 
      }

      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.userId;

  

      // Get order IDs from manifested orders
      const orderIds = manifestedOrders.map(order => order._id);

     // Update the manifestPayload in handleCompleteManifest function
const manifestPayload = {
  orderIds,
  pickupAddress: selectedPickupData, // Use the selected pickup data
  userId,
  courierPartner: 'The Trace Express'
};

      console.log("Creating manifest with payload:", manifestPayload);

      // Make API call to create manifest
      const response = await axios.post(
        'http://localhost:5000/api/manifests/create',
        manifestPayload
      );

      if (response.data.success) {
        toast.success(`Manifest ${response.data.data.manifestId} created successfully!`);
        
        // Wait a moment for the toast to show
        setTimeout(() => {
          // Navigate back to manifested orders page
          onBack();
        }, 1500);
      } else {
        toast.error(response.data.message || 'Failed to create manifest');
      }

    } catch (error) {
      console.error('Error creating manifest:', error);
      
      if (error.response) {
        // Server responded with error
        toast.error(error.response.data.message || 'Failed to create manifest');
      } else if (error.request) {
        // Request was made but no response
        toast.error('Server is not responding. Please try again.');
      } else {
        // Something else happened
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isLoading}
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
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  disabled={isLoading}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button 
                  onClick={handleSaveManifest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  disabled={isLoading}
                >
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
              {selectedPickupData?.addressLine1 || "No address selected"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {selectedPickupData?.addressLine2 || ""}
              {selectedPickupData?.addressLine2 && selectedPickupData?.addressLine3 && ", "}
              {selectedPickupData?.addressLine3 || ""}
            </p>
            <p className="text-sm text-gray-500">
              {selectedPickupData?.city || ""}, {selectedPickupData?.state || ""} {selectedPickupData?.postalCode || ""}
            </p>
            <p className="text-sm text-gray-500">
              {selectedPickupData?.country || ""}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Contact Person</p>
          <p className="text-sm font-medium text-gray-800">
            {selectedPickupData?.contactPerson || " "}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Contact Number</p>
          <p className="text-sm font-medium text-gray-800">
            {selectedPickupData?.contactNumber || " "}
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

        {/* Vertical Layout for Orders Management */}
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
                              disabled={isLoading}
                            >
                              Remove From Manifest
                            </button>
                            <button
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                              title="View Details"
                              disabled={isLoading}
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
                    !sameAddressOrders.some((order) => order.selected) || isLoading
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    sameAddressOrders.some((order) => order.selected) && !isLoading
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
                        disabled={isLoading}
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
                          disabled={isLoading}
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
                            disabled={isLoading}
                          >
                            Add To Manifest
                          </button>
                          <button
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                            title="View Details"
                            disabled={isLoading}
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
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveManifest}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                disabled={isLoading}
              >
                Save as Draft
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                <span className="font-medium">{manifestedOrders.length}</span>{" "}
                orders ready for manifest
              </div>
              <button
                onClick={handleCompleteManifest}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={manifestedOrders.length === 0 || isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Manifest...</span>
                  </>
                ) : (
                  <>
                    Complete Manifest
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateManifest;