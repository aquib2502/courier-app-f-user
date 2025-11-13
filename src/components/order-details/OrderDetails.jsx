"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Truck,
  CreditCard,
  Building,
  ShoppingBag,
  Weight,
  Ruler,
  Hash,
  Globe,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Box,
  Layers,
  TrendingUp,
  Tag,
  Home
} from "lucide-react";

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // Get orderId from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        
        if (!orderId) {
          setError("Order ID not provided");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/getOrderDetails/${orderId}`
        );

        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError("Failed to fetch order details");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Unable to fetch order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  const goBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={goBack}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <p className="text-gray-600">No order found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                    Order #{order.invoiceNo}
                  </h1>
                  <span className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                    {order.shipmentType}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Placed on {formatDate(order.invoiceDate)}
                </p>
              </div>
              
              <div className="mt-2 md:mt-0">
                <div className="text-left md:text-right">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="text-2xl md:text-3xl font-bold text-emerald-600">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
                Customer Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Customer Name</label>
                  <p className="text-sm sm:text-base text-gray-800 font-semibold mt-1">
                    {order.firstName} {order.lastName}
                  </p>
                </div>
                
                <div>
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">Invoice Name</label>
                  <p className="text-sm sm:text-base text-gray-800 font-semibold mt-1">{order.invoiceName}</p>
                </div>
              </div>
            </div>

            {/* Shipping Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Pickup Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  Pickup Address
                </h2>
                
                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <p className="font-medium text-gray-800">{order.pickupAddress}</p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
                  Delivery Address
                </h2>
                
                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <p className="font-medium text-gray-800">
                    {order.firstName} {order.lastName}
                  </p>
                  <p>{order.address1}</p>
                  {order.address2 && <p>{order.address2}</p>}
                  <p>{order.state}, {order.pincode}</p>
                  <p className="flex items-center text-gray-600 font-medium">
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    {order.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
                Order Items
              </h2>
              
              <div className="space-y-3">
                {order.productItems && order.productItems.length > 0 ? (
                  order.productItems.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors gap-3"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm sm:text-base text-gray-800">{item.productName}</p>
                          <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.productQuantity}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-base md:text-lg font-bold text-gray-800">
                          {formatCurrency(item.productPrice)}
                        </p>
                        <p className="text-xs text-gray-500">per unit</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No items in this order</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Details & Shipping */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Shipping Partner */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Shipping Partner
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Partner</span>
                  <span className="text-sm sm:text-base font-bold text-gray-800">
                    {order.shippingPartner?.name || "N/A"}
                  </span>
                </div>
                
                {order.shippingPartner?.type && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Type</span>
                    <span className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
                      {order.shippingPartner.type}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Package Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Box className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
                Package Details
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                    <Weight className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Weight
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-800">{order.weight} KG</span>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                    <Ruler className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Dimensions
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-800">
                    {order.length} × {order.width} × {order.height} cm
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                    <Layers className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Shipment Type
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-semibold">
                    {order.shipmentType}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
                Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Order ID</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">{order.invoiceNo}</span>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Order Date</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800">
                    {formatDate(order.invoiceDate)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-600">Currency</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">{order.invoiceCurrency}</span>
                </div>
                
                <div className="flex items-center justify-between pt-3">
                  <span className="text-sm sm:text-base font-semibold text-gray-800">Total Amount</span>
                  <span className="text-lg md:text-xl font-bold text-emerald-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;