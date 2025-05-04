"use client";
import React, { useState, useEffect } from "react";
import { Check, X, Package, Truck, FileText, ShoppingCart, ChevronRight, MapPin, Box, DollarSign, Clock } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // const router = useRouter();

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

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const user = decodedToken ? decodedToken.userId : null;

      if (!user) {
        throw new Error("User ID not found. Please log in again.");
      }

      const payload = { ...formData, productItems, user };
      const response = await axios.post('http://localhost:5000/api/orders/create', payload);
      toast.success("Order placed successfully!");

      router.push("?tab=drafts", undefined, { shallow: true });

      console.log(response);
    } catch (err) {
      console.error('Submission error:', err);
      toast.error("Something went wrong");
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Sidebar */}
      <div className="w-72 bg-white shadow-xl rounded-2xl p-8 m-6 h-fit sticky top-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Order</h1>
          <p className="text-sm text-gray-500">Complete all steps to place your order</p>
        </div>
        
        <ul className="space-y-3">
          <li 
            onClick={() => navigateToStep(1)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              currentStep === 1 ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200'
            }`}>
              <MapPin size={16} />
            </div>
            <div>
              <p className="font-semibold">Buyer Details</p>
              <p className="text-xs opacity-75">Shipping information</p>
            </div>
            {currentStep > 1 && <Check className="ml-auto text-emerald-600" size={16} />}
          </li>

          <li 
            onClick={() => navigateToStep(2)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              currentStep === 2 ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 
              currentStep > 2 ? 'text-gray-600 hover:bg-gray-50' : 
              'text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 2 ? 'bg-emerald-600 text-white' : 
              currentStep > 2 ? 'bg-gray-200' : 'bg-gray-100'
            }`}>
              <Box size={16} />
            </div>
            <div>
              <p className="font-semibold">Order Details</p>
              <p className="text-xs opacity-75">Products & invoice</p>
            </div>
            {currentStep > 2 && <Check className="ml-auto text-emerald-600" size={16} />}
          </li>

          <li 
            onClick={() => navigateToStep(3)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              currentStep === 3 ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 
              currentStep > 3 ? 'text-gray-600 hover:bg-gray-50' : 
              'text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 3 ? 'bg-emerald-600 text-white' : 
              currentStep > 3 ? 'bg-gray-200' : 'bg-gray-100'
            }`}>
              <Truck size={16} />
            </div>
            <div>
              <p className="font-semibold">Shipment Package</p>
              <p className="text-xs opacity-75">Choose delivery</p>
            </div>
            {currentStep > 3 && <Check className="ml-auto text-emerald-600" size={16} />}
          </li>

          <li 
            onClick={() => navigateToStep(4)}
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              currentStep === 4 ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 
              'text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 4 ? 'bg-emerald-600 text-white' : 'bg-gray-100'
            }`}>
              <DollarSign size={16} />
            </div>
            <div>
              <p className="font-semibold">Place Order</p>
              <p className="text-xs opacity-75">Review & pay</p>
            </div>
          </li>
        </ul>

        <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
          <p className="text-sm font-medium text-emerald-700">Need Help?</p>
          <p className="text-xs text-emerald-600 mt-1">Contact support for assistance</p>
        </div>
      </div>

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
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <MapPin className="mr-3 text-emerald-600" size={28} />
                  Buyer Shipping Details
                </h3>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Select Pickup Address *</label>
                  <select 
                    className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={formData.pickupAddress}
                    onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
                  >
                    <option value="">Select Pickup Address</option>
                    <option value="warehouse1">Warehouse 1</option>
                    <option value="warehouse2">Warehouse 2</option>
                  </select>
                  {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">First Name *</label>
                    <input 
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Last Name *</label>
                    <input
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Mobile Number *</label>
                    <input
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.mobile ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Alternate Mobile Number</label>
                    <input 
                      placeholder="Enter alternate mobile number"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Email *</label>
                    <input 
                      placeholder="Enter email address"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Country *</label>
                    <select 
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.country ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Country</option>
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                    </select>
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select State</option>
                      <option value="California">California</option>
                      <option value="New York">New York</option>
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Address Line 1 *</label>
                    <input
                      placeholder="Enter street address"
                      value={formData.address1}
                      onChange={(e) => handleInputChange("address1", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.address1 ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Address Line 2 *</label>
                    <input 
                      placeholder="Apartment, suite, unit, etc."
                      value={formData.address2}
                      onChange={(e) => handleInputChange("address2", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.address2 ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.address2 && <p className="text-red-500 text-sm mt-1">{errors.address2}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Landmark</label>
                    <input 
                      placeholder="Nearby landmark"
                      className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Pincode *</label>
                    <input
                      placeholder="Enter pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.pincode ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">City *</label>
                    <input
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-6">
                  <input 
                    type="checkbox" 
                    id="same-address" 
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="same-address" className="text-gray-700">
                    Shipping & Billing Address are same
                  </label>
                </div>

                <button
                  onClick={handleContinueShipment}
                  className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Continue to Shipment Details</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Shipment Section */}
          {showShipment && !showShippingPackage && !showPlaceOrder && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Box className="mr-3 text-emerald-600" size={28} />
                Shipment Information
              </h3>
              
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Shipment Type</h4>
                <div className="flex space-x-6">
                  {['CSB IV', 'CSB V'].map((type) => (
                    <label key={type} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="shipmentType"
                        value={type}
                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                        onChange={(e) => handleInputChange("shipmentType", e.target.value)}
                        checked={formData.shipmentType === type}
                      />
                      <span className="text-gray-700 font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Package Dimensions</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Actual Weight (kg) *</label>
                    <input
                      placeholder="Enter weight"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.weight ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Length (cm) *</label>
                    <input 
                      placeholder="Enter length"
                      value={formData.length}
                      onChange={(e) => handleInputChange("length", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.length ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Width (cm) *</label>
                    <input
                      placeholder="Enter width"
                      value={formData.width}
                      onChange={(e) => handleInputChange("width", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.width ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Height (cm) *</label>
                    <input
                      placeholder="Enter height"
                      value={formData.height}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.height ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinueOrder}
                className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Continue to Order Details</span>
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Order Details Section */}
          {showOrder && !showShippingPackage && !showPlaceOrder && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-3 text-emerald-600" size={28} />
                Order Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Invoice Number *</label>
                  <input
                    placeholder="Enter invoice number"
                    value={formData.invoiceNo}
                    onChange={(e) => handleInputChange("invoiceNo", e.target.value)}
                    className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      errors.invoiceNo ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.invoiceNo && <p className="text-red-500 text-sm mt-1">{errors.invoiceNo}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Invoice Currency *</label>
                  <input
                    placeholder="Select currency"
                    value={formData.invoiceCurrency}
                    onChange={(e) => handleInputChange("invoiceCurrency", e.target.value)}
                    className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      errors.invoiceCurrency ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.invoiceCurrency && <p className="text-red-500 text-sm mt-1">{errors.invoiceCurrency}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Invoice Date *</label>
                  <input
                    placeholder="Select date" 
                    type={formData.invoiceDate ? "date" : "text"}
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                    value={formData.invoiceDate}
                    onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
                    className={`w-full p-3.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      errors.invoiceDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.invoiceDate && <p className="text-red-500 text-sm mt-1">{errors.invoiceDate}</p>}
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
          )}

          {/* Item Details Section */}
          {showItem && !showShippingPackage && !showPlaceOrder && (
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
          )}

          {/* Shipping Package Selection Section */}
          {showShippingPackage && !showPlaceOrder && (
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
                          <p className="text-3xl font-bold text-emerald-600">₹{partner.price}</p>
                          <p className="text-sm text-gray-500">+taxes</p>
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
          )}

          {/* Place Order Section */}
          {showPlaceOrder && (
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
                      <p className="text-gray-500 text-sm">Invoice No</p>
                      <p className="font-semibold">{formData.invoiceNo}</p>
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
                      <p className="text-lg font-bold text-emerald-600">₹{selectedShippingPartner?.price}</p>
                    </div>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="bg-emerald-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total Amount</span>
                    <span className="text-3xl font-bold text-emerald-600">₹{calculateTotalAmount()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">*Including all taxes and shipping charges</p>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <DollarSign className="w-6 h-6" />
                    <span className="text-lg font-semibold">Pay and Place Order</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddOrder;
                