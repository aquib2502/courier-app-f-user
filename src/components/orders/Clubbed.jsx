"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Filter,
  Download,
  Search,
  RefreshCw,
  Package,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Tag,
  Calendar,
  Weight,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Clubbed = () => {
  const router = useRouter();
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);

  // Filter states
  const [filterClubName, setFilterClubName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const fetchClubbedOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      if (!userId) {
        setError("Invalid token. User ID not found.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/orders/clubbings/${userId}`
      );

      const rawClubbings = res.data?.data || [];

      // Flatten: each order gets its club metadata attached
      const flat = rawClubbings.flatMap((club) =>
        (club.clubbedOrders || []).map((order) => ({
          ...order,
          clubName: club.clubName,
          clubbedAt: club.clubbedAt,
          clubUsernames: club.usernames,
        }))
      );

      setAllOrders(flat);
      setFilteredOrders(flat);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Error fetching clubbed orders:", err);
      if (err.response?.status === 404) {
        setAllOrders([]);
        setFilteredOrders([]);
      } else {
        setError("Unable to fetch clubbed orders. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubbedOrders();
  }, []);

  useEffect(() => {
    let result = [...allOrders];
    const q = searchQuery.toLowerCase();

    if (q) {
      result = result.filter(
        (o) =>
          o.clubName?.toLowerCase().includes(q) ||
          o.invoiceNo?.toLowerCase().includes(q) ||
          `${o.firstName || ""} ${o.lastName || ""}`.toLowerCase().includes(q)
      );
    }

    if (filterClubName) {
      result = result.filter((o) =>
        o.clubName?.toLowerCase().includes(filterClubName.toLowerCase())
      );
    }

    if (filterDate) {
      result = result.filter(
        (o) =>
          new Date(o.clubbedAt).toLocaleDateString("en-GB") ===
          new Date(filterDate).toLocaleDateString("en-GB")
      );
    }

    if (filterCustomer) {
      const fc = filterCustomer.toLowerCase();
      result = result.filter(
        (o) =>
          o.firstName?.toLowerCase().includes(fc) ||
          o.lastName?.toLowerCase().includes(fc)
      );
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [searchQuery, filterClubName, filterDate, filterCustomer, allOrders]);

  const clearFilters = () => {
    setFilterClubName("");
    setFilterDate("");
    setFilterCustomer("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const handleViewOrder = (order) => {
    router.push(`/home/order-details?orderId=${order._id}`);
  };

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const statusColor = (status) => {
    switch (status) {
      case "Ready":      return "bg-blue-100 text-blue-800";
      case "Packed":     return "bg-green-100 text-green-800";
      case "Manifested": return "bg-purple-100 text-purple-800";
      case "Shipped":    return "bg-indigo-100 text-indigo-800";
      case "Delivered":  return "bg-emerald-100 text-emerald-800";
      case "Drafts":     return "bg-amber-100 text-amber-800";
      default:           return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      <div className="flex-1 bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-md border border-gray-200">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              Clubbed Orders
            </h2>
            <p className="text-sm text-gray-500">
              All orders across clubs — club details shown inline on each row
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setFilterVisible(!filterVisible)}
              className="flex items-center text-emerald-700 hover:text-emerald-800 bg-emerald-50 py-2 px-4 rounded-lg transition-all hover:bg-emerald-100"
            >
              <Filter className="w-4 h-4 mr-2" />
              <span className="font-medium">Filters</span>
            </button>

            <button className="flex items-center bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              <span className="font-medium">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Search & Refresh */}
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
              placeholder="Search by club name, order ID or customer…"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated || "Never"}
            </span>
            <button
              onClick={fetchClubbedOrders}
              className="p-2 text-emerald-600 hover:text-emerald-800 rounded-full hover:bg-emerald-50"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {filterVisible && (
          <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter Orders</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Club Name</label>
                <input
                  type="text"
                  value={filterClubName}
                  onChange={(e) => setFilterClubName(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter club name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Clubbed Date</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={filterCustomer}
                  onChange={(e) => setFilterCustomer(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter customer name"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="bg-white text-gray-600 py-1.5 px-4 rounded-md text-sm border border-gray-300 hover:bg-gray-50"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto mb-4" />
            <p className="text-gray-600">Loading clubbed orders…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchClubbedOrders}
              className="bg-red-600 text-white py-2 px-4 rounded-md text-sm hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders table */}
        {!loading && !error && (
          <>
            {currentOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No clubbed orders found</h3>
                <p className="text-sm text-gray-500">
                  Club orders together from the admin panel to see them here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Summary bar */}
                <div className="px-6 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-6 text-sm text-emerald-800">
                  <span className="font-medium">{filteredOrders.length} orders</span>
                  <span className="flex items-center gap-1">
                    <Weight className="w-3.5 h-3.5" />
                    {filteredOrders
                      .reduce((sum, o) => sum + parseFloat(o.weight || 0), 0)
                      .toFixed(2)}{" "}
                    KG total
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    {filteredOrders.reduce((sum, o) => sum + (o.productItems?.length || 0), 0)}{" "}
                    items total
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 text-left">
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600">Order ID</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600">Customer</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600">Destination</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600">Weight</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600">Invoice Date</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600">Status</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600">Club</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 font-medium text-emerald-700 whitespace-nowrap">
                            {order.invoiceNo}
                          </td>
                          <td className="px-6 py-3 text-gray-800">
                            <div className="font-medium">
                              {order.firstName} {order.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{order.mobile}</div>
                          </td>
                          <td className="px-6 py-3 text-gray-700">
                            <div>{order.city}, {order.state}</div>
                            <div className="text-xs text-gray-500">{order.country}</div>
                          </td>
                          <td className="px-6 py-3 text-gray-700 whitespace-nowrap">
                            {order.weight} KG
                          </td>
                          <td className="px-6 py-3 text-gray-700 whitespace-nowrap">
                            {formatDate(order.invoiceDate)}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </td>

                          <td className="px-6 py-3 min-w-[180px]">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Tag className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                              <span className="text-xs font-semibold text-emerald-800 truncate max-w-[140px]">
                                {order.clubName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              {formatDate(order.clubbedAt)}
                            </div>
                            {order.clubUsernames && (
                              <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
                                <Users className="w-3 h-3 flex-shrink-0" />
                                {order.clubUsernames}
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > rowsPerPage && (
              <div className="bg-white rounded-xl shadow-lg p-4 mt-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages} · {filteredOrders.length} orders total
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronsLeft size={16} />
                    </button>
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronLeft size={16} />
                    </button>
                    {getPageNumbers().map((page, i) =>
                      page === "..." ? (
                        <span key={`e${i}`} className="px-2 text-gray-400">…</span>
                      ) : (
                        <button key={page} onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors ${
                            currentPage === page
                              ? "bg-emerald-600 text-white"
                              : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                          }`}>
                          {page}
                        </button>
                      )
                    )}
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronRight size={16} />
                    </button>
                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronsRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Clubbed;