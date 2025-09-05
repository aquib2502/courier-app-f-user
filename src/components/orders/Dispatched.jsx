"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Filter, 
  Download, 
  Search, 
  RefreshCw, 
  Package, 
  Truck, 
  MapPin, 
  Calendar,
  Clock,
  Eye,
  CheckCircle,
  Phone,
  Mail,
  ExternalLink,
  Navigation,
  AlertCircle
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const Dispatched = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [processingOrder, setProcessingOrder] = useState(null);

  // Filter state variables
  const [orderDate, setOrderDate] = useState('');
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [courierPartner, setCourierPartner] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  const toggleFilters = () => {
    setFilterVisible(!filterVisible);
  };

  // Function to fetch dispatched orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('userToken');
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

      const response = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user/orders/${userId}`);
      
      // Filter for dispatched orders (Shipped status with dispatched manifest status)
      const dispatchedOrders = response.data.data.filter(order => 
        order.orderStatus === 'Shipped' && order.manifestStatus === 'dispatched'
      );
      
      setOrders(dispatchedOrders);
      setFilteredOrders(dispatchedOrders);
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

  // Get shipment status based on order's tracking status or database field
  const getShipmentStatus = (order) => {
    // Use the trackingStatus from database if available
    if (order.trackingStatus) {
      return order.trackingStatus;
    }
    
    // Fallback to default status if no tracking status is set
    return "In Transit";
  };

  // Calculate estimated delivery based on actual dispatch date and tracking status
  const getEstimatedDelivery = (order) => {
    const dispatchDate = order.dispatchedDate ? new Date(order.dispatchedDate) : new Date(order.updatedAt);
    let daysToAdd = 3; // Default 3 days
    
    // Adjust based on tracking status
    switch (order.trackingStatus) {
      case 'Pickup Scheduled':
        daysToAdd = 5;
        break;
      case 'Picked Up':
      case 'In Transit':
        daysToAdd = 3;
        break;
      case 'At Sorting Center':
        daysToAdd = 2;
        break;
      case 'Out for Delivery':
        daysToAdd = 1;
        break;
      default:
        daysToAdd = 3;
    }
    
    const estimated = new Date(dispatchDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    return estimated.toLocaleDateString("en-GB");
  };

  // Apply filters function
  const applyFilters = () => {
    let filtered = [...orders];

    if (orderDate) {
      filtered = filtered.filter((order) => {
        const dispatchDate = order.dispatchedDate ? new Date(order.dispatchedDate) : new Date(order.updatedAt);
        return dispatchDate.toLocaleDateString("en-GB") === new Date(orderDate).toLocaleDateString("en-GB");
      });
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

    if (courierPartner) {
      filtered = filtered.filter((order) =>
        order.courierPartner?.toLowerCase().includes(courierPartner.toLowerCase())
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
    setCourierPartner('');
    setFilteredOrders(orders);
    setCurrentPage(1);
  };

//  // Handle Mark as Received
// const handleMarkAsReceived = async (order) => {
//   if (processingOrder === order._id) return;

//   try {
//     setProcessingOrder(order._id);
    
//     const receivedTimestamp = new Date(); // Capture current date/time
    
//     const response = await axios.put(
//       `${NEXT_PUBLIC_API_URL}/api/orders/${order._id}/status`,
//       {
//         orderStatus: 'Delivered',
//         manifestStatus: 'received',
//         trackingStatus: 'Delivered',
//         receivedAt: receivedTimestamp, // Add received timestamp
//         deliveryConfirmation: {
//           type: 'In-Person',
//           confirmedBy: 'Customer',
//           timestamp: receivedTimestamp // Use same timestamp here if needed
//         }
//       }
//     );

//     if (response.status === 200) {
//       const updatedOrders = orders.filter(o => o._id !== order._id);
//       setOrders(updatedOrders);
//       setFilteredOrders(updatedOrders);
//       toast.success(`Order ${order.invoiceNo} marked as received at ${receivedTimestamp.toLocaleString()}`);
//     }
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     toast.error("Unable to update order status. Please try again.");
//   } finally {
//     setProcessingOrder(null);
//   }
// };

  // Handle Track Shipment
  const handleTrackShipment = (order) => {
    // In a real application, you would redirect to the courier's tracking page
    const trackingUrl = `https://track.courier.com/track/${order.lastMileAWB || order.invoiceNo}`;
    window.open(trackingUrl, '_blank');
    toast.info(`Opening tracking for ${order.invoiceNo}`);
  };

  // Handle Contact Support
  const handleContactSupport = (order) => {
    // In a real application, you might open a support ticket or chat
    toast.info("Support contact functionality will be implemented soon");
  };

  // Format date helper function with proper null checking
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const formattedDate = new Date(date);
      return isNaN(formattedDate.getTime()) ? "N/A" : formattedDate.toLocaleDateString("en-GB");
    } catch (error) {
      return "N/A";
    }
  };

  // Format time helper function with proper null checking
  const formatTime = (date) => {
    if (!date) return "N/A";
    try {
      const formattedDate = new Date(date);
      return isNaN(formattedDate.getTime()) 
        ? "N/A" 
        : formattedDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });
    } catch (error) {
      return "N/A";
    }
  };

  // Get the correct dispatch date from order data
  const getDispatchDate = (order) => {
    return order.dispatchedDate || order.updatedAt || order.createdAt;
  };

  // Handle export to CSV
  const exportToCsv = () => {
    // Implementation for CSV export would go here
    console.log("Exporting to CSV");
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
    <div className="min-h-[calc(220vh-200px)] flex flex-col">
      <ToastContainer />
      <div className="flex-1 bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-md border border-gray-200">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <Truck className="mr-3 text-blue-600" size={28} />
              Dispatched Orders
            </h2>
            <p className="text-sm text-gray-500">Track shipments that are currently in transit</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            <button 
              onClick={toggleFilters}
              className="flex items-center text-blue-700 hover:text-blue-800 bg-blue-50 py-2 px-4 rounded-lg transition-all duration-300 hover:bg-blue-100"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="font-medium">Filters</span>
            </button>
            
            <button 
              onClick={exportToCsv}
              className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-sm"
            >
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
              className="bg-white w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by order ID, customer name, or tracking number..."
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Last updated: {lastUpdated || 'Never'}</span>
            <button 
              onClick={fetchOrders} 
              className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {filterVisible && (
          <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Dispatched Orders</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="orderDate" className="block text-xs font-medium text-gray-600 mb-1">
                    Dispatch Date
                  </label>
                  <input
                    type="date"
                    id="orderDate"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Customer Name"
                  />
                </div>

                <div>
                  <label htmlFor="courierPartner" className="block text-xs font-medium text-gray-600 mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    id="courierPartner"
                    value={courierPartner}
                    onChange={(e) => setCourierPartner(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Courier Name"
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
                className="bg-blue-600 text-white py-1.5 px-4 rounded-md text-sm hover:bg-blue-700 transition-all duration-300"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dispatched orders...</p>
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
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Dispatch Info</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Order Details</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Customer Info</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Destination</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Shipment Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600">Tracking</th>
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
                              {formatDate(getDispatchDate(order))}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(getDispatchDate(order))}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-blue-600">{order.invoiceNo}</p>
                            <div className="flex items-center mt-1">
                              <Package className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="text-xs text-gray-600">{order.weight} KG</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {order.firstName} {order.lastName}
                            </p>
                            <div className="flex items-center mt-1">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="text-xs text-gray-600">{order.mobile}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="flex items-start">
                              <MapPin className="w-3 h-3 mr-1 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-600">{order.city}, {order.state}</p>
                                <p className="text-xs text-gray-500">{order.pincode}</p>
                                <p className="text-xs text-gray-500">{order.country}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full flex items-center w-fit">
                              <Truck className="w-3 h-3 mr-1" />
                              {getShipmentStatus(order)}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              Est. Delivery: {getEstimatedDelivery(order)}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-xs text-gray-600">AWB:</p>
                            <p className="text-sm font-medium text-gray-900">{order.lastMileAWB || "Pending"}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Partner: {order.courierPartner || "ShipGlobal Express"}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center space-x-2">
                            <button 
                              onClick={() => handleTrackShipment(order)}
                              className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 flex items-center"
                              title="Track Shipment"
                            >
                              <Navigation className="w-3 h-3 mr-1" />
                              Track
                            </button>
                            {/* <button 
                              onClick={() => handleMarkAsReceived(order)}
                              disabled={processingOrder === order._id}
                              className={`px-3 py-1 text-xs font-medium rounded-md flex items-center ${
                                processingOrder === order._id
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'text-green-700 bg-green-50 hover:bg-green-100'
                              }`}
                              title="Mark as Received"
                            >
                              {processingOrder === order._id ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin mr-1"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Received
                                </>
                              )}
                            </button> */}
                            <button 
                              onClick={() => handleContactSupport(order)}
                              className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
                              title="Contact Support"
                            >
                              <Mail className="w-3 h-3 mr-1" />
                              Support
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
                            <Truck className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 mb-1">No dispatched orders found</h3>
                          <p className="text-sm text-gray-500 mb-4">You don't have any orders currently in transit.</p>
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
                              ? 'bg-blue-600 text-white'
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
    </div>
  );
};

export default Dispatched;