// components/orders/AddOrder/OrderDetails.jsx
import React from "react";
import { FileText, ChevronRight } from "lucide-react";

const OrderDetails = ({
  formData,
  errors,
  handleInputChange,
  handleContinueItem,
  currencies,
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <FileText className="mr-3 text-emerald-600" size={28} />
        Order Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Invoice Name *
          </label>
          <input
            placeholder="Enter invoice name"
            value={formData.invoiceName}
            onChange={(e) => handleInputChange("invoiceName", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.invoiceName ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.invoiceNo && (
            <p className="text-red-500 text-sm mt-1">{errors.invoiceNo}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            HSN Code*
          </label>
          <input
            placeholder="Enter HSN Code"
            value={formData.HSNCode}
            onChange={(e) => handleInputChange("HSNCode", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.HSNCode ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.invoiceNo && (
            <p className="text-red-500 text-sm mt-1">{errors.invoiceNo}</p>
          )}
        </div>
        {/* Invoice Currency Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Invoice Currency *
          </label>
          <select
            value={formData.invoiceCurrency}
            onChange={(e) =>
              handleInputChange("invoiceCurrency", e.target.value)
            }
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.invoiceCurrency ? "border-red-300" : "border-gray-300"
            }`}
          >
            <option value="">Select Currency</option>
            {currencies.map((currency, index) => (
              <option key={index} value={currency.code}>
                {currency.code} - {currency.name}{" "}
                {currency.symbol ? `(${currency.symbol})` : ""}
              </option>
            ))}
          </select>

          {errors.invoiceCurrency && (
            <p className="text-red-500 text-sm mt-1">
              {errors.invoiceCurrency}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Invoice Date *
          </label>
          <input
            placeholder="Select date"
            type={formData.invoiceDate ? "date" : "text"}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => !e.target.value && (e.target.type = "text")}
            value={formData.invoiceDate}
            onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              errors.invoiceDate ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.invoiceDate && (
            <p className="text-red-500 text-sm mt-1">{errors.invoiceDate}</p>
          )}
        </div>
      </div>

      <button
        onClick={handleContinueItem}
        className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <span>Continue to Item Details</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default OrderDetails;
