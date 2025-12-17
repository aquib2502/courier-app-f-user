// components/orders/AddOrder/OrderDetails.jsx
import React from "react";
import { FileText } from "lucide-react";

const OrderDetails = ({
  formData,
  errors,
  handleInputChange,
  currencies,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-3">
        <FileText className="mr-3 text-emerald-600" size={24} />
        Order Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Invoice Name *
          </label>
          <input
            name="invoiceName"
            placeholder="Enter invoice name"
            value={formData.invoiceName}
            onChange={(e) => handleInputChange("invoiceName", e.target.value)}
            autoComplete="organization"
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500
              ${errors.invoiceName ? "border-red-300" : "border-gray-300"}`}
          />
          {errors.invoiceNo && (
            <p className="text-red-500 text-sm mt-1">{errors.invoiceNo}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            HSN Code *
          </label>
          <input
            name="HSNCode"
            placeholder="Enter HSN Code"
            value={formData.HSNCode}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,8}$/.test(value)) {
                handleInputChange("HSNCode", value);
              }
            }}
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={8}
            className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500
              ${errors.HSNCode ? "border-red-300" : "border-gray-300"}`}
          />
          {errors.HSNCode && (
            <p className="text-red-500 text-sm mt-1">{errors.HSNCode}</p>
          )}
        </div>

        {/* Invoice Currency Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Invoice Currency *
          </label>
          <select
            name="invoiceCurrency"
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
            name="invoiceDate"
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
    </div>
  );
};

export default OrderDetails;