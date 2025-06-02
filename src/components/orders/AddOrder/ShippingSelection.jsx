// components/orders/AddOrder/ShippingSelection.jsx
import React from 'react';
import { Truck, Check, ChevronRight } from 'lucide-react';

const ShippingSelection = ({ 
  formData, 
  availableRates, 
  selectedShippingPartner, 
  errors, 
  handleSelectShippingPartner, 
  handleContinueToPlaceOrder 
}) => {
  // Function to calculate price with 18% GST
  const calculatePriceWithGST = (basePrice) => {
    const gstAmount = basePrice * 0.18;
    return (basePrice + gstAmount).toFixed(2);
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Truck className="mr-3 text-emerald-600" size={28} />
        Select Shipping Partner
      </h3>
      
      {/* Shipping information summary */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Weight</p>
            <p className="font-semibold text-gray-800">{formData.weight} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Destination</p>
            <p className="font-semibold text-gray-800">{formData.country}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Postcode</p>
            <p className="font-semibold text-gray-800">{formData.pincode}</p>
          </div>
        </div>
      </div>

      {availableRates.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <Truck className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600">No shipping rates available for the selected destination and weight.</p>
          <p className="text-sm text-gray-500 mt-2">Please check your weight and destination details.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableRates.map((partner) => (
            <div
              key={partner.id}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedShippingPartner?.id === partner.id
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                  : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
              }`}
              onClick={() => handleSelectShippingPartner(partner)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-bold text-xl text-gray-800">{partner.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      partner.type === 'Express' ? 'bg-blue-100 text-blue-700' :
                      partner.type === 'Standard' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {partner.type}
                    </span>
                  </div>
                  <p className="text-gray-600">{partner.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      <Truck size={16} className="inline mr-1" />
                      Estimated Transit: {partner.deliveryTime}
                    </span>
                    <span className="text-sm text-gray-600">
                      ⭐ {partner.rating}/5
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600">₹{calculatePriceWithGST(partner.price)}</p>
                  <p className="text-sm text-gray-500">Inclusive of 18% GST</p>
                </div>
              </div>
              {selectedShippingPartner?.id === partner.id && (
                <div className="mt-4 pt-4 border-t border-emerald-200">
                  <div className="flex items-center text-emerald-600">
                    <Check className="w-5 h-5 mr-2" />
                    <span className="font-medium">Selected Shipping Partner</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {errors.shippingPartner && <p className="text-red-500 text-sm mt-1">{errors.shippingPartner}</p>}
      
      <button 
        onClick={handleContinueToPlaceOrder}
        className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <span>Review Order</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default ShippingSelection;