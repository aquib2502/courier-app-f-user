"use client";
import React, { useEffect, useState } from "react";
import { 
  FileText, Download, Calendar, RefreshCw, CheckCircle, 
  XCircle, DollarSign, Package, TrendingUp, AlertCircle,
  Eye, Clock, ChevronDown, ChevronUp
} from "lucide-react";
import axiosClient from "@/utils/axiosClient";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

const MonthlyInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingMonth, setDownloadingMonth] = useState(null);
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visibleInvoices = showAll ? invoices : invoices.slice(0, 5);

  useEffect(() => {
    fetchMonthlyInvoices();
  }, []);

  const fetchMonthlyInvoices = async () => {
    try {
      setLoading(true);
      // Generate only months starting from October 2024 up to current month
      const months = [];
      const startMonth = moment('2024-10', 'YYYY-MM'); // Your first order month
      const currentMonth = moment();
      
      let iterMonth = currentMonth.clone();
      
      while (iterMonth.isSameOrAfter(startMonth, 'month')) {
        months.push({
          month: iterMonth.format('MMMM YYYY'),
          monthKey: iterMonth.format('YYYY-MM'),
          startDate: iterMonth.clone().startOf('month').format('MMM DD, YYYY'),
          endDate: iterMonth.clone().endOf('month').format('MMM DD, YYYY'),
          year: iterMonth.format('YYYY'),
          monthNum: iterMonth.format('MM'),
        });
        iterMonth.subtract(1, 'month');
      }
      
      setInvoices(months);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load invoice data");
      setLoading(false);
    }
  };

  const downloadInvoicePDF = async (monthKey, monthName) => {
    try {
      setDownloadingMonth(monthKey);
      
      // Extract year and month from monthKey (format: YYYY-MM)
      const [year, month] = monthKey.split('-');
      
      const response = await axiosClient.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/finalBill`,
        {
          params: { year, month },
          responseType: 'blob'
        }
      );

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${monthKey}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Download error:', err);
      if (err.response?.status === 404) {
        toast.info('No orders for `${month}');
      } else {
        toast.error('Failed to download invoice. Please try again.');
      }
    } finally {
      setDownloadingMonth(null);
    }
  };

  const viewInvoicePDF = async (monthKey, monthName) => {
    try {
      setDownloadingMonth(monthKey);
      
      const [year, month] = monthKey.split('-');
      
      const response = await axiosClient.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/finalBill`,
        {
          params: { year, month },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open in new tab
      window.open(url, '_blank');
      
      // Cleanup after a delay
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
    } catch (err) {
      console.error('View error:', err);
      if (err.response?.status === 404) {
        toast.info('No orders for this month');
      } else {
        toast.error('Failed to view invoice. Please try again.');
      }
    } finally {
      setDownloadingMonth(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading invoices...</p>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Invoices</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchMonthlyInvoices}
              className="mt-4 flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
        <ToastContainer />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Monthly Invoices
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Download your monthly billing reports and invoices
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">About Monthly Invoices</h3>
              <p className="text-emerald-50 text-sm leading-relaxed">
                Your monthly invoices are automatically generated at the end of each month. 
                Each invoice includes all orders placed during that period with detailed breakdown 
                of charges, GST calculations, and total amount due.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Invoices</p>
                <p className="text-2xl font-bold text-gray-800">{invoices.length}</p>
              </div>
              <Package className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Month</p>
                <p className="text-2xl font-bold text-emerald-600">{moment().format('MMM YYYY')}</p>
              </div>
              <Calendar className="w-10 h-10 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Invoice Format</p>
                <p className="text-2xl font-bold text-purple-600">PDF</p>
              </div>
              <FileText className="w-10 h-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 p-6">
            <h2 className="text-xl font-bold text-gray-800">Invoice History</h2>
            <p className="text-sm text-gray-600 mt-1">Click to view or download your monthly invoices</p>
          </div>

          <div className="divide-y divide-gray-100">
  {visibleInvoices.map((invoice) => (
              <div key={invoice.monthKey} className="hover:bg-gray-50 transition-colors">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Invoice Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-emerald-100 rounded-xl">
                        <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                          {invoice.month}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{invoice.startDate} - {invoice.endDate}</span>
                        </div>
                        {invoice.monthKey === moment().format('YYYY-MM') && (
                          <span className="inline-flex items-center space-x-1 mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>Current Month</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => viewInvoicePDF(invoice.monthKey, invoice.month)}
                        disabled={downloadingMonth === invoice.monthKey}
                        className="flex items-center space-x-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloadingMonth === invoice.monthKey ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
                            <span className="hidden sm:inline">Loading...</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => downloadInvoicePDF(invoice.monthKey, invoice.month)}
                        disabled={downloadingMonth === invoice.monthKey}
                        className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloadingMonth === invoice.monthKey ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span className="hidden sm:inline">Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
            ))}
              {invoices.length > 5 && (
    <div className="text-center py-4">
      <button
        onClick={() => setShowAll(!showAll)}
        className="inline-flex items-center space-x-2 text-emerald-700 hover:text-emerald-900 font-medium transition-colors"
      >
        {showAll ? (
          <>
            <ChevronUp className="w-4 h-4" />
            <span>Show Less</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            <span>Show More</span>
          </>
        )}
      </button>
    </div>
  )}

          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-emerald-600" />
            <span>Need Help?</span>
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Invoices are generated automatically at the end of each month</p>
            <p>• Each invoice includes GST calculations and detailed order breakdown</p>
            <p>• If you don't see an invoice for a particular month, it means no orders were placed</p>
            <p>• For any billing inquiries, please contact our support team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyInvoice;