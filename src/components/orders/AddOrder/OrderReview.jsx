// components/orders/AddOrder/OrderReview.jsx
import React from 'react';
import { ShoppingCart, MapPin, Box, FileText, Package, Truck, DollarSign, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const OrderReview = ({ 
  formData, 
  productItems, 
  selectedShippingPartner, 
  calculateTotalAmount, 
  handlePlaceOrder, 
  isLoading,
}) => {
  const totalAmount = selectedShippingPartner?.finalPrice || selectedShippingPartner?.price


  const handlePayAndOrder = async () => {
    try {
      // Process payment and complete order
      await handlePlaceOrder('Payment Received', 'Ready');
    } catch (error) {
      console.error('Pay and Order error:', error);
    }
  };

  const handlePayLater = async () => {
    try {
      await handlePlaceOrder('Payment Pending', 'Drafts');
      toast.info("Order saved to drafts. You can pay later.");
    } catch (error) {
      console.error('Pay Later error:', error);
      toast.error("Failed to save order. Please try again.");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <ShoppingCart className="mr-3 text-emerald-600" size={28} />
        Review & Place Order
      </h3>
      <div className="bg-gray-50 p-8 rounded-xl space-y-8">
        {/* Buyer Details Summary */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="mr-2 text-emerald-600" size={20} />
            Shipping Address
          </h4>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
            <p className="text-gray-600">{formData.mobile}</p>
            <p className="text-gray-600">{formData.address1}, {formData.address2}</p>
            <p className="text-gray-600">{formData.city}, {formData.state}, {formData.pincode}</p>
            <p className="text-gray-600">{formData.country}</p>
          </div>
        </div>

        {/* Shipment Details Summary */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Box className="mr-2 text-emerald-600" size={20} />
            Package Details
          </h4>
          <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Type</p>
              <p className="font-semibold">{formData.shipmentType}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Product</p>
              <p className="font-semibold">{formData.product}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Weight</p>
              <p className="font-semibold">{formData.weight} kg</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Dimensions</p>
              <p className="font-semibold">{formData.length} × {formData.width} × {formData.height} cm</p>
            </div>
          </div>
        </div>

        {/* Order Details Summary */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="mr-2 text-emerald-600" size={20} />
            Invoice Information
          </h4>
          <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500 text-sm">HSN Code</p>
              <p className="font-semibold">{formData.HSNCode}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Invoice Name</p>
              <p className="font-semibold">{formData.invoiceName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Date</p>
              <p className="font-semibold">{formData.invoiceDate}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Currency</p>
              <p className="font-semibold">{formData.invoiceCurrency}</p>
            </div>
          </div>
        </div>

        {/* Product Items Summary */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Package className="mr-2 text-emerald-600" size={20} />
            Order Items
          </h4>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{item.productQuantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">₹{item.productPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ₹{Number(item.productQuantity) * Number(item.productPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Summary */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Truck className="mr-2 text-emerald-600" size={20} />
            Shipping Method
          </h4>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                
                <p className="font-semibold">{selectedShippingPartner?.name}</p>
                <p className="text-sm text-gray-600">{selectedShippingPartner?.deliveryTime}</p>
              </div>
              ₹{selectedShippingPartner?.finalPrice || selectedShippingPartner?.price}

            </div>
          </div>
        </div>

        {/* Total Amount and Wallet Balance */}
        <div className="space-y-4">
          <div className="bg-emerald-50 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total Amount</span>
              <span className="text-3xl font-bold text-emerald-600">₹{totalAmount}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">*Including all taxes and shipping charges</p>
          </div>

          {/* Wallet Balance Display */}
          {/* <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-800">Wallet Balance</span>
              <span className={`text-xl font-bold ${walletBalance >= totalAmount ? 'text-green-600' : 'text-red-600'}`}>
                ₹{walletBalance}
              </span>
            </div>
            {walletBalance < totalAmount && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ Insufficient balance (Need ₹{totalAmount - walletBalance} more)
              </p>
            )}
          </div> */}
        </div>
      </div>

      {/* Payment Buttons */}
      <div className="mt-8 space-y-4">
        {/* Pay and Order Button */}
        <button 
          onClick={handlePayAndOrder}
          className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg bg-emerald-600 text-white hover:bg-emerald-700`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <DollarSign className="w-6 h-6" />
              <span className="text-lg font-semibold">
                'Pay and Order'
              </span>
            </>
          )}
        </button>

        {/* Pay Later Button */}
        <button 
          onClick={handlePayLater}
          className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-gray-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-3 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Clock className="w-6 h-6" />
              <span className="text-lg font-semibold">Pay Later</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderReview;