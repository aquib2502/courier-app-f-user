"use client";
import React, { useEffect, useState } from "react";
import { 
  Activity, Download, Filter, Calendar, Search, RefreshCw,
  CheckCircle, Clock, XCircle, CreditCard, Smartphone,
  TrendingUp, TrendingDown, DollarSign, FileText,
  ChevronDown, Eye, MoreVertical
} from "lucide-react";
import axiosClient from "@/utils/axiosClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // table or cards

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/transactions`);
        if (response.data.success) {
          setTransactions(response.data.data);
          setFilteredTransactions(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch transactions");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions whenever filters change
  useEffect(() => {
    let filtered = [...transactions];

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(tx => new Date(tx.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(tx => new Date(tx.createdAt) <= new Date(endDate));
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.merchantOrderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.amount?.toString().includes(searchTerm)
      );
    }

    setFilteredTransactions(filtered);
  }, [statusFilter, startDate, endDate, searchTerm, transactions]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Transaction History", 14, 22);

    const tableColumn = ["Order ID", "Amount", "Status", "Payment Method", "Date"];
    const tableRows = filteredTransactions.map(tx => [
      tx.merchantOrderId,
      `₹${tx.amount}`,
      tx.status,
      tx.paymentMethod,
      new Date(tx.createdAt).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
    });

    doc.save("transaction_history.pdf");
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'FAILED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentMethodIcon = (method) => {
    if (method?.toLowerCase().includes('upi') || method?.toLowerCase().includes('phone')) {
      return <Smartphone className="w-4 h-4 text-blue-500" />;
    }
    return <CreditCard className="w-4 h-4 text-purple-500" />;
  };

  const calculateStats = () => {
    const completed = filteredTransactions.filter(tx => tx.status === 'COMPLETED');
    const totalAmount = completed.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const avgAmount = completed.length > 0 ? totalAmount / completed.length : 0;
    
    return {
      totalTransactions: filteredTransactions.length,
      completedTransactions: completed.length,
      totalAmount,
      avgAmount
    };
  };

  const stats = calculateStats();

  const resetFilters = () => {
    setStatusFilter("ALL");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Transactions</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Transaction History
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Track all your payment transactions and wallet activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-800">{stats.totalTransactions}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold text-green-600">{stats.completedTransactions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-emerald-600">₹{stats.totalAmount.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average</p>
                <p className="text-xl font-bold text-purple-600">₹{Math.round(stats.avgAmount).toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'table' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === 'cards' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Cards
                </button>
              </div>

              {/* Export Button */}
              {filteredTransactions.length > 0 && (
                <button
                  onClick={exportToPDF}
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Display */}
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Transactions Found</h3>
              <p className="text-gray-500">Try adjusting your filters or make your first transaction.</p>
            </div>
          ) : (
            <>
              {/* Table View */}
              {viewMode === 'table' && (
                <div className="overflow-x-auto">
                  {/* Desktop Table */}
                  <div className="hidden sm:block">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">Order ID</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">Amount</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">Payment Method</th>
                          <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((tx, index) => (
                          <tr key={tx._id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            <td className="py-4 px-4">
                              <div className="font-mono text-sm text-gray-800">{tx.merchantOrderId}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-emerald-600">₹{tx.amount?.toLocaleString()}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(tx.status)}
                                <span className={getStatusBadge(tx.status)}>{tx.status}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                {getPaymentMethodIcon(tx.paymentMethod)}
                                <span className="text-gray-700">{tx.paymentMethod}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-gray-600 text-sm">
                                {new Date(tx.createdAt).toLocaleString()}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Table - Compact Layout */}
                  <div className="sm:hidden space-y-3">
                    {filteredTransactions.map((tx) => (
                      <div key={tx._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-mono text-sm text-gray-600">{tx.merchantOrderId}</div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(tx.status)}
                            <span className={getStatusBadge(tx.status)}>{tx.status}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-bold text-emerald-600">₹{tx.amount?.toLocaleString()}</span>
                          <div className="flex items-center space-x-2">
                            {getPaymentMethodIcon(tx.paymentMethod)}
                            <span className="text-sm text-gray-700">{tx.paymentMethod}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(tx.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cards View */}
              {viewMode === 'cards' && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTransactions.map((tx) => (
                    <div key={tx._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(tx.status)}
                          <span className={getStatusBadge(tx.status)}>{tx.status}</span>
                        </div>
                        <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Order ID</p>
                          <p className="font-mono text-sm text-gray-800">{tx.merchantOrderId}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Amount</p>
                            <p className="text-lg font-bold text-emerald-600">₹{tx.amount?.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Method</p>
                            <div className="flex items-center space-x-2">
                              {getPaymentMethodIcon(tx.paymentMethod)}
                              <span className="text-sm text-gray-700">{tx.paymentMethod}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                            <span>{new Date(tx.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;