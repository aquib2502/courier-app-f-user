// components/orders/AddOrder/ItemDetails.jsx
import React from 'react';
import { Package, X, ChevronRight } from 'lucide-react';

const ItemDetails = ({ 
  productItems, 
  errors, 
  handleProductItemChange, 
  handleRemoveProductItem, 
  handleAddProductItem, 
  handleContinueToShipping 
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Package className="mr-3 text-emerald-600" size={28} />
        Product Items
      </h3>
      <div className="space-y-6">
        {productItems.map((item, index) => (
          <div className="relative bg-gray-50 p-6 rounded-xl border border-gray-200" key={index}>
            {index !== 0 && (
              <button
                type="button"
                onClick={() => handleRemoveProductItem(index)}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Product Name *</label>
                <input
                  placeholder="Enter product name"
                  value={item.productName}
                  onChange={(e) => handleProductItemChange(index, "productName", e.target.value)}
                  className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors[`productName_${index}`] ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors[`productName_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`productName_${index}`]}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Quantity *</label>
                <input
                  placeholder="Enter quantity"
                  value={item.productQuantity}
                  onChange={(e) => handleProductItemChange(index, "productQuantity", e.target.value)}
                  className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors[`productQuantity_${index}`] ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors[`productQuantity_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`productQuantity_${index}`]}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Price (₹) *</label>
                <input
                  placeholder="Enter price"
                  value={item.productPrice}
                  onChange={(e) => handleProductItemChange(index, "productPrice", e.target.value)}
                  className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors[`productPrice_${index}`] ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors[`productPrice_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`productPrice_${index}`]}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddProductItem}
        className="mt-6 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center space-x-2 transition-all border border-gray-300">
        <Package size={20} />
        <span>Add Another Product</span>
      </button>

      <button 
        onClick={handleContinueToShipping}
        className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <span>Continue to Shipping Selection</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default ItemDetails;