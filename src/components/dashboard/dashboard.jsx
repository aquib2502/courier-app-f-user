"use client";
import React, { useState, useEffect } from "react";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  Home, 
  XCircle, 
  RefreshCw, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Calendar,
  Filter
} from "lucide-react";

const Dashboard = () => {
  const [orderCounts, setOrderCounts] = useState({
    Drafts: 0,
    Ready: 0,
    Packed: 0,
    Manifested: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
    Refunded: 0,
    disputed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('7'); // Default to last 7 days

  // Date filter options
  const dateFilterOptions = [
    { value: '1', label: 'Last 24 hours' },
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: 'all', label: 'All time' }
  ];

  // Status configurations with icons and colors - more subtle
  const statusConfig = {
    Drafts: { 
      icon: Clock, 
      color: "bg-slate-50 border-slate-200", 
      iconColor: "text-slate-600",
      textColor: "text-slate-800",
      hoverColor: "hover:bg-slate-100"
    },
    Ready: { 
      icon: CheckCircle, 
      color: "bg-blue-50 border-blue-200", 
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
      hoverColor: "hover:bg-blue-100"
    },
    Packed: { 
      icon: Package, 
      color: "bg-emerald-50 border-emerald-200", 
      iconColor: "text-emerald-600",
      textColor: "text-emerald-800",
      hoverColor: "hover:bg-emerald-100"
    },
    Manifested: { 
      icon: Activity, 
      color: "bg-indigo-50 border-indigo-200", 
      iconColor: "text-indigo-600",
      textColor: "text-indigo-800",
      hoverColor: "hover:bg-indigo-100"
    },
    Shipped: { 
      icon: Truck, 
      color: "bg-orange-50 border-orange-200", 
      iconColor: "text-orange-600",
      textColor: "text-orange-800",
      hoverColor: "hover:bg-orange-100"
    },
    Delivered: { 
      icon: Home, 
      color: "bg-green-50 border-green-200", 
      iconColor: "text-green-600",
      textColor: "text-green-800",
      hoverColor: "hover:bg-green-100"
    },
    Cancelled: { 
      icon: XCircle, 
      color: "bg-red-50 border-red-200", 
      iconColor: "text-red-600",
      textColor: "text-red-800",
      hoverColor: "hover:bg-red-100"
    },
    Refunded: { 
      icon: RefreshCw, 
      color: "bg-yellow-50 border-yellow-200", 
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800",
      hoverColor: "hover:bg-yellow-100"
    },
    disputed: { 
      icon: AlertTriangle, 
      color: "bg-rose-50 border-rose-200", 
      iconColor: "text-rose-600",
      textColor: "text-rose-800",
      hoverColor: "hover:bg-rose-100"
    }
  };

  useEffect(() => {
    fetchOrderCounts();
  }, [dateFilter]);

  const fetchOrderCounts = async () => {
    try {
      setLoading(true);
      const userToken = localStorage.getItem('userToken') || 'your-token-here';
      
      // Add date filter to the API call
      const url = dateFilter === 'all' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/user/orderCount`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/user/orderCount?days=${dateFilter}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order counts');
      }

      const result = await response.json();
      
      if (result.success) {
        setOrderCounts(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch order counts');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching order counts:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = Object.values(orderCounts).reduce((sum, count) => sum + count, 0);
  const selectedFilterLabel = dateFilterOptions.find(option => option.value === dateFilter)?.label;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-4 border">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchOrderCounts}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header with Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Track and manage your orders efficiently
              </p>
            </div>
            
            {/* Date Filter */}
            <div className="mt-4 sm:mt-0">
              <div className="relative">
                <select 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  {dateFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{totalOrders.toLocaleString()}</h2>
                <p className="text-gray-600 font-medium">Total Orders</p>
                <p className="text-sm text-gray-500 mt-1">{selectedFilterLabel}</p>
              </div>
              <div className="bg-emerald-100 rounded-full p-3">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {Object.entries(orderCounts).map(([status, count]) => {
            const config = statusConfig[status];
            const IconComponent = config.icon;
            const percentage = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : '0';
            
            return (
              <div 
                key={status} 
                className={`${config.color} ${config.hoverColor} rounded-xl p-6 border transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${config.iconColor} p-2 rounded-lg bg-white/50`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${config.textColor}`}>
                      {count.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className={`font-semibold ${config.textColor} text-sm uppercase tracking-wide mb-3`}>
                    {status === 'disputed' ? 'Disputed' : status}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className={config.textColor}>Progress</span>
                      <span className={config.textColor}>{percentage}%</span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-1.5">
                      <div 
                        className={`${config.iconColor.replace('text-', 'bg-')} h-1.5 rounded-full transition-all duration-500`}
                        style={{ 
                          width: `${percentage}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={fetchOrderCounts}
            disabled={loading}
            className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-300 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 inline-block mr-2 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;