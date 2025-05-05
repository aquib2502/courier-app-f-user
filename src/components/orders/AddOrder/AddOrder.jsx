// components/orders/AddOrder/AddOrder.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all the separated components from the same folder
import Sidebar from './Sidebar';
import BuyerDetails from './BuyerDetails';
import ShipmentDetails from './ShipmentDetails';
import OrderDetails from './OrderDetails';
import ItemDetails from './ItemDetails';
import ShippingSelection from './ShippingSelection';
import OrderReview from './OrderReview';

const AddOrder = ({ walletBalance = 0, onOrderPayment }) => {
  const [showShipment, setShowShipment] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const [showShippingPackage, setShowShippingPackage] = useState(false);
  const [showPlaceOrder, setShowPlaceOrder] = useState(false);
  const [selectedShippingPartner, setSelectedShippingPartner] = useState(null);
  const [availableRates, setAvailableRates] = useState([]);
  const [allRates, setAllRates] = useState([]);

  const [productItems, setProductItems] = useState([
    { productName: "", productQuantity: "", productPrice: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    pickupAddress: "",
    address1: "",
    address2: "",
    pincode: "",
    city: "",
    shipmentType: "CSB IV",
    country: "",
    state: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    invoiceNo: "",
    invoiceDate: "",
    invoiceCurrency: "",
    productItems: productItems,
    shippingPartner: {}
  });

  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  // Load rates from JSON on component mount
  useEffect(() => {
    fetch('/rates.json')
      .then(res => res.json())
      .then(data => setAllRates(data))
      .catch(err => console.error('Error loading rates:', err));
  }, []);

  // Reset shipping selection when weight changes
  useEffect(() => {
    setSelectedShippingPartner(null);
    setAvailableRates([]);
  }, [formData.weight, formData.country]);

  // Function to calculate rates based on weight and destination
  const calculateShippingRates = () => {
    if (!formData.weight || !formData.country) return;
    
    const userWeight = parseFloat(formData.weight);
    
    // Map country selection to rate calculator format
    const destinationMap = {
      'USA': 'United States (USA)',
      'Canada': 'Canada',
      'United Kingdom': 'United Kingdom (UK)',
      'Australia': 'Australia',
      // Add more mappings as needed
    };
    
    const destinationCountry = destinationMap[formData.country] || 'Rest of World';
    
    // Filter all rates for the selected destination country
    const destinationRates = allRates.filter(
      (r) => r.dest_country === destinationCountry
    );
    
    // Group by package and select the closest lower or equal weight for each package
    const bestRates = [];
    
    const uniquePackages = [...new Set(destinationRates.map(r => r.package))];
    
    uniquePackages.forEach(pkg => {
      const packageRates = destinationRates
        .filter(r => r.package === pkg && parseFloat(r.weight) <= userWeight)
        .sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
    
      if (packageRates.length > 0) {
        bestRates.push(packageRates[0]);
      }
    });
    
    // Format rates for display
    const formattedRates = bestRates.map((rate, index) => ({
      id: index + 1,
      name: `AS Enterprise ${rate.package}`,
      type: rate.package.includes('Express') ? 'Express' : rate.package.includes('Standard') ? 'Standard' : 'Economy',
      price: parseFloat(rate.rate),
      deliveryTime: "6 - 12 Days",
      rating: 4.5,
      description: `${rate.package} service for ${formData.country}`
    }));
    
    setAvailableRates(formattedRates);
  };

  // Determine current step for sidebar
  const getCurrentStep = () => {
    if (showPlaceOrder) return 4;
    if (showShippingPackage) return 3;
    if (showItem || showOrder || showShipment) return 2;
    return 1;
  };

  const currentStep = getCurrentStep();

  // Navigation function for sidebar clicks
  const navigateToStep = (step) => {
    switch(step) {
      case 1:
        setShowShipment(false);
        setShowOrder(false);
        setShowItem(false);
        setShowShippingPackage(false);
        setShowPlaceOrder(false);
        break;
      case 2:
        if (formData.firstName && formData.lastName && formData.mobile && formData.address1) {
          setShowShipment(true);
          setShowOrder(false);
          setShowItem(false);
          setShowShippingPackage(false);
          setShowPlaceOrder(false);
        }
        break;
      case 3:
        if (showItem) {
          setShowShippingPackage(true);
          setShowPlaceOrder(false);
        }
        break;
      case 4:
        if (selectedShippingPartner) {
          setShowPlaceOrder(true);
        }
        break;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleContinueShipment = () => {
    const newErrors = {};

    if (!formData.pickupAddress) newErrors.pickupAddress = "Pickup address is required";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.address1.trim()) newErrors.address1 = "Address 1 is required";
    if (!formData.address2.trim()) newErrors.address2 = "Address 2 is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowShipment(true);
    }
  };

  const handleContinueOrder = () => {
    const newErrors = {};

    if (!formData.weight) newErrors.weight = "Actual Weight is required";
    if (!formData.length) newErrors.length = "Length is required";
    if (!formData.width) newErrors.width = "Width is required";
    if (!formData.height) newErrors.height = "Height is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowOrder(true);
      // Clear shipping selection if weight changes
      setSelectedShippingPartner(null);
      setAvailableRates([]);
    }
  };

  const handleContinueItem = () => {
    const newErrors = {};

    if (!formData.invoiceNo) newErrors.invoiceNo = "Invoice number is required";
    if (!formData.invoiceCurrency) newErrors.invoiceCurrency = "Invoice currency is required";
    if (!formData.invoiceDate) newErrors.invoiceDate = "Invoice date is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowItem(true);
    }
  };

  const handleContinueToShipping = () => {
    const newErrors = {};

    productItems.forEach((item, index) => {
      if (!item.productName) newErrors[`productName_${index}`] = "Product name is required";
      if (!item.productQuantity) newErrors[`productQuantity_${index}`] = "Product Quantity is required";
      if (!item.productPrice) newErrors[`productPrice_${index}`] = "Product Price is required";
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      calculateShippingRates(); // Calculate rates when moving to shipping selection
      setShowShippingPackage(true);
    }
  };

  const handleSelectShippingPartner = (partner) => {
    setSelectedShippingPartner(partner);
    setFormData({ ...formData, shippingPartner: partner });
  };

  const handleContinueToPlaceOrder = () => {
    if (!selectedShippingPartner) {
      setErrors({ shippingPartner: "Please select a shipping partner" });
      return;
    }
    setShowPlaceOrder(true);
  };

  const handleProductItemChange = (index, field, value) => {
    const updatedItems = [...productItems];
    updatedItems[index][field] = value;
    setProductItems(updatedItems);
  };

  const handleRemoveProductItem = (index) => {
    const updatedItems = [...productItems];
    updatedItems.splice(index, 1);
    setProductItems(updatedItems);
  };

  const handleAddProductItem = () => {
    setProductItems([...productItems, { productName: "", productQuantity: "", productPrice: "" }]);
  };

  const calculateTotalAmount = () => {
    const productTotal = productItems.reduce((total, item) => {
      return total + (Number(item.productQuantity) * Number(item.productPrice));
    }, 0);
    
    const shippingCost = selectedShippingPartner?.price || 0;
    return productTotal + shippingCost;
  };

  const handlePlaceOrder = async (paymentStatus = 'Payment Pending', orderStatus = 'Drafts') => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const user = decodedToken ? decodedToken.userId : null;

      if (!user) {
        throw new Error("User ID not found. Please log in again.");
      }

      const payload = { 
        ...formData, 
        productItems, 
        user,
        paymentStatus,
        orderStatus,
        totalAmount: calculateTotalAmount(),
        walletBalance,
      };

      const response = await axios.post('http://localhost:5000/api/orders/create', payload);
      
      // If payment was successful and order is ready, deduct from wallet
      if (paymentStatus === 'Payment Received' && orderStatus === 'Ready' && onOrderPayment) {
        await onOrderPayment(calculateTotalAmount());
      }

      // Redirect to appropriate tab
      router.push(`?tab=${orderStatus.toLowerCase()}`, undefined, { shallow: true });

    } catch (err) {
      console.error('Submission error:', err);
      toast.error("Something went wrong");
      throw err; // Re-throw to be handled by the calling function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Sidebar */}
      <Sidebar currentStep={currentStep} navigateToStep={navigateToStep} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800">New Order</h2>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                Step {currentStep} of 4
              </div>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {message.type === 'success' && <Check className="w-5 h-5" />}
              {message.type === 'error' && <X className="w-5 h-5" />}
              <p>{message.text}</p>
            </div>
          )}

          {/* First Section: Buyer Shipping Details */}
          {!showShippingPackage && !showPlaceOrder && (
            <div className="space-y-8">
              <BuyerDetails 
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleContinueShipment={handleContinueShipment}
              />
              
            </div>
          )}

          {/* Shipment Section */}
          {showShipment && !showShippingPackage && !showPlaceOrder && (
            <ShipmentDetails 
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              handleContinueOrder={handleContinueOrder}
            />
          )}

          {/* Order Details Section */}
          {showOrder && !showShippingPackage && !showPlaceOrder && (
            <OrderDetails 
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              handleContinueItem={handleContinueItem}
            />
          )}

          {/* Item Details Section */}
          {showItem && !showShippingPackage && !showPlaceOrder && (
            <ItemDetails 
              productItems={productItems}
              errors={errors}
              handleProductItemChange={handleProductItemChange}
              handleRemoveProductItem={handleRemoveProductItem}
              handleAddProductItem={handleAddProductItem}
              handleContinueToShipping={handleContinueToShipping}
            />
          )}

          {/* Shipping Package Selection Section */}
          {showShippingPackage && !showPlaceOrder && (
            <ShippingSelection 
              formData={formData}
              availableRates={availableRates}
              selectedShippingPartner={selectedShippingPartner}
              errors={errors}
              handleSelectShippingPartner={handleSelectShippingPartner}
              handleContinueToPlaceOrder={handleContinueToPlaceOrder}
            />
          )}

          {/* Place Order Section */}
          {showPlaceOrder && (
            <OrderReview 
              formData={formData}
              productItems={productItems}
              selectedShippingPartner={selectedShippingPartner}
              calculateTotalAmount={calculateTotalAmount}
              handlePlaceOrder={handlePlaceOrder}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddOrder;