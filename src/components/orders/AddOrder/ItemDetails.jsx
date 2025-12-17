// components/orders/AddOrder/ItemDetails.jsx
import React from 'react';
import { Package, X } from 'lucide-react';

const ItemDetails = ({
  productItems,
  errors,
  handleProductItemChange,
  handleRemoveProductItem,
  handleAddProductItem,
  currency,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-3">
        <Package className="mr-3 text-emerald-600" size={24} />
        Product Items
      </h3>

      <div className="space-y-4">
        {productItems.map((item, index) => (
          <div className="relative bg-gray-50 p-5 rounded-xl border border-gray-200" key={index}>
            {index !== 0 && (
              <button
                type="button"
                onClick={() => handleRemoveProductItem(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transition-all z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Product Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Product Name *</label>
                <input
                  name="productName"
                  placeholder="Enter product name"
                  value={item.productName}
                  onChange={(e) => handleProductItemChange(index, "productName", e.target.value)}
                  autoComplete="on"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
    ${errors[`productName_${index}`] ? 'border-red-300' : 'border-gray-300'}`}
                />

                {errors[`productName_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`productName_${index}`]}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Quantity *</label>
                <input
                  name="productQuantity"
                  placeholder="Enter quantity"
                  value={item.productQuantity}
                  onChange={(e) => handleProductItemChange(index, "productQuantity", e.target.value)}
                  autoComplete="on"
                  className="w-full p-3 border rounded-lg"
                />

                {errors[`productQuantity_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`productQuantity_${index}`]}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Price ({currency || 'Currency'}) *
                </label>
                <input
                  name="productPrice"
                  placeholder="Enter price"
                  value={item.productPrice}
                  onChange={(e) => handleProductItemChange(index, "productPrice", e.target.value)}
                  autoComplete="on"
                  className="w-full p-3 border rounded-lg"
                />

                {errors[`productPrice_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`productPrice_${index}`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddProductItem}
        className="mt-4 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2 transition-all border border-gray-300"
      >
        <Package size={18} />
        <span>Add Another Product</span>
      </button>

      {/* Global Errors */}
      {errors.totalProductValue && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {errors.totalProductValue}
        </div>
      )}

      {errors.totalProductValueUSD && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {errors.totalProductValueUSD}
        </div>
      )}
    </div>
  );
};

export default ItemDetails;