"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Package,
  User,
  Calendar,
  FileText,
  AlertCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosClient from "@/utils/axiosClient";

const Dispute = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [rejectReasons, setRejectReasons] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch disputes
  const fetchDisputes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get("/api/orders/getdispute");

      if (response.data.success) {
        setDisputes(response.data.disputes || []);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        setError("Failed to fetch disputes");
      }
    } catch (err) {
      console.error("Error fetching disputes:", err);
      setError("Unable to fetch disputes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  // Generic function to update dispute
  const handleUpdateDispute = async (id, action, reason = "") => {
    try {
      toast.info(`${action === "approve" ? "Approving" : "Rejecting"} dispute...`);

      await axiosClient.put(`/api/orders/updatedispute/${id}`, { action, reason });

      toast.success(`Dispute ${action}d successfully!`);
      fetchDisputes();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${action} dispute.`);
    }
  };

  const handleApprove = (id) => handleUpdateDispute(id, "approve");

  const handleReject = (id) => {
    const reason = rejectReasons[id];
    if (!reason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    handleUpdateDispute(id, "reject", reason);
  };

  const handleReasonChange = (id, value) => {
    setRejectReasons((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentDisputes = disputes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(disputes.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Dispute Management
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Review and manage customer order disputes
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Updated: {lastUpdated || "Never"}</span>
              </div>
              <button
                onClick={fetchDisputes}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Disputes</p>
                <p className="text-2xl font-bold text-gray-900">{disputes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Disputes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {disputes.filter(d => d.status === 'open').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {disputes.filter(d => d.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading disputes...</p>
              <p className="text-sm text-gray-500">Please wait while we fetch the latest data</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Disputes</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
              <button
                onClick={fetchDisputes}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {/* Table Content */}
          {!loading && !error && (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden">
                {currentDisputes.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {currentDisputes.map((dispute) => (
                      <div key={dispute._id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {dispute.orderIds?.[0]?.invoiceNo || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <User className="w-4 h-4" />
                              {dispute.orderIds?.[0]
                                ? `${dispute.orderIds[0].firstName} ${dispute.orderIds[0].lastName}`
                                : "N/A"}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(dispute.status)}`}>
                            {dispute.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</span>
                            <p className="text-sm text-gray-900 capitalize">{dispute.type.replace("_", " ")}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</span>
                            <p className="text-sm text-gray-900">{dispute.description}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Created</span>
                            <p className="text-sm text-gray-900">{new Date(dispute.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        {dispute.status === 'open' && (
                          <div className="pt-4 border-t border-gray-100">
                            <div className="flex flex-col space-y-3">
                              <button
                                onClick={() => handleApprove(dispute._id)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve Dispute
                              </button>
                              
                              <div className="space-y-2">
                                <textarea
                                  placeholder="Enter reason for rejection..."
                                  value={rejectReasons[dispute._id] || ""}
                                  onChange={(e) => handleReasonChange(dispute._id, e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                  rows={3}
                                />
                                <button
                                  onClick={() => handleReject(dispute._id)}
                                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject Dispute
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Disputes Found</h3>
                    <p className="text-gray-600 text-center">There are no disputes to display at the moment.</p>
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                {currentDisputes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Invoice Details
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentDisputes.map((dispute) => (
                          <tr key={dispute._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {dispute.orderIds?.[0]?.invoiceNo || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                  <User className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="text-sm text-gray-900">
                                  {dispute.orderIds?.[0]
                                    ? `${dispute.orderIds[0].firstName} ${dispute.orderIds[0].lastName}`
                                    : "N/A"}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 capitalize">
                                {dispute.type.replace("_", " ")}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">
                                {dispute.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(dispute.status)}`}>
                                {dispute.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(dispute.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {dispute.status === 'open' ? (
                                <div className="flex flex-col gap-2 items-center">
                                  <button
                                    onClick={() => handleApprove(dispute._id)}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve
                                  </button>
                                  <div className="flex flex-col gap-1 min-w-[140px]">
                                    <input
                                      type="text"
                                      placeholder="Rejection reason"
                                      value={rejectReasons[dispute._id] || ""}
                                      onChange={(e) => handleReasonChange(dispute._id, e.target.value)}
                                      className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                    />
                                    <button
                                      onClick={() => handleReject(dispute._id)}
                                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">No actions</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Disputes Found</h3>
                    <p className="text-gray-600 text-center">There are no disputes to display at the moment.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {disputes.length > itemsPerPage && (
                <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirst + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLast, disputes.length)}
                      </span>{" "}
                      of <span className="font-medium">{disputes.length}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      
                      <div className="flex gap-1">
                        {[...Array(totalPages).keys()].slice(
                          Math.max(0, currentPage - 3),
                          Math.min(totalPages, currentPage + 2)
                        ).map((num) => (
                          <button
                            key={num + 1}
                            onClick={() => setCurrentPage(num + 1)}
                            className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === num + 1
                                ? "bg-emerald-600 text-white"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {num + 1}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dispute;