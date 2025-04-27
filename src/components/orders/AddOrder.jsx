"use client";
import React, { useState } from "react";
import { Check, X } from "lucide-react"; // Use Lucide icon
import axios from "axios";
import { useRouter } from "next/navigation";

const AddOrder = () => {
  const [showShipment, setShowShipment] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showItem, setShowItem] = useState(false);

  const [productItems, setProductItems] = useState([
    { productName: "", productQuantity: "", productPrice: "" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  

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
    productItems: productItems
  });

  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" }); // Clear error on input
  };

  const router = useRouter();

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

  const handleSubmitOrder = async () => {
    const newErrors = {};

    // if (!formData.productName) newErrors.productName = "Product name is required";
    // if (!formData.productQuantity) newErrors.productQuantity = "Product Quantity is required";
    // if (!formData.productPrice) newErrors.productPrice = "Product Price is required";

    productItems.forEach((item, index) => {
      if (!item.productName) newErrors[`productName_${index}`] = "Product name is required";
      if (!item.productQuantity) newErrors[`productQuantity_${index}`] = "Product Quantity is required";
      if (!item.productPrice) newErrors[`productPrice_${index}`] = "Product Price is required";
    });
    

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try
      {
         // Get userId from localStorage token
      const token = localStorage.getItem('token');
      const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null; // Decoding JWT token
      const user = decodedToken ? decodedToken.userId : null;

      if (!user) {
        throw new Error("User ID not found. Please log in again.");
      }

        const payload = { ...formData, productItems, user };
        const response = await axios.post('http://localhost:5000/api/orders/create', payload);
        alert("Order submitted successfully!");
        router.push('/home')
        console.log(response);
      }
      catch (err) {
        console.error('Submission error:', err); // Log the entire error for debugging
        setErrors(err.response?.data?.message || 'Something went wrong');
        setMessage(''); // Clear success message if error
      }
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-emerald-700">Add Order</h2>

      {/* First Section: Buyer Shipping Details */}
      <div className="space-y-6">
        <div>
          <label className="block text-emerald-600 mb-2">Select Pickup Address *</label>
          <select 
            className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={formData.pickupAddress}
            onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
          >
            <option>Select Pickup Address</option>
            <option>Warehouse 1</option>
            <option>Warehouse 2</option>
          </select>
          {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
        </div>

        <h3 className="text-2xl font-semibold text-emerald-600">Buyer Shipping Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <input 
              placeholder="First Name *" 
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <input
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <input
              placeholder="Mobile No. *"
              value={formData.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
          </div>

          <input placeholder="Alternate Mobile No." className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <input placeholder="Email *" className="p-3 border border-emerald-300 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <div>
            <select 
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="w-full p-3 border border-emerald-300 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Select Country</option>
              <option>USA</option>
              <option>Canada</option>
            </select>
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
          </div>

          <div>
            <input
              placeholder="Address 1 *"
              value={formData.address1}
              onChange={(e) => handleInputChange("address1", e.target.value)}
              className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            />
            {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
          </div>

          <input placeholder="Landmark" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          <div>
            <input 
              placeholder="Address 2 *"
              value={formData.address2}
              onChange={(e) => handleInputChange("address2", e.target.value)}
              className="p-3 border border-emerald-300 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.address2 && <p className="text-red-500 text-sm mt-1">{errors.address2}</p>}
          </div>

          <div>
            <input
              placeholder="Pincode *"
              value={formData.pincode}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
              className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            />
            {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
          </div>

          <div>
            <input
              placeholder="City *"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <select
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option>Select State</option>
              <option>California</option>
              <option>New York</option>
            </select>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <input type="checkbox" id="same-address" className="w-5 h-5 text-emerald-600" />
          <label htmlFor="same-address" className="text-emerald-600">Shipping & Billing Address are same.</label>
        </div>

        <button
          onClick={handleContinueShipment}
          className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>Continue</span>
        </button>
      </div>

      {/* Shipment Section (displayed after clicking Continue) */}
      {showShipment && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-emerald-600 mb-4">Shipment Type</h3>
          <div className="space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="shipmentType"
                value="CSB IV"
                className="form-radio text-emerald-600"
                onChange={(e) => {
                  handleInputChange("shipmentType", e.target.value);
                }}
                defaultChecked />
              <span className="ml-2">CSB IV</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="shipmentType"
                value="CSB V"
                className="form-radio text-emerald-600" 
                onChange={(e) => {
                  handleInputChange("shipmentType", e.target.value);
                }}
                />
              <span className="ml-2">CSB V</span>
            </label>
          </div>

          <div className="mt-6">
            <h4 className="text-xl font-semibold text-emerald-600">Shipment Details</h4>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div>
                <input
                  placeholder="Actual Weight *"
                  value={formData.weight}
                  onChange={(e) => {
                    handleInputChange("weight", e.target.value);
                  }}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
              </div>
              <div>
                <input 
                  placeholder="Length *"
                  value={formData.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.length && <p className="text-red-500 text-sm mt-1">{errors.length}</p>}
              </div>
              <div>
                <input
                  placeholder="Width *"
                  value={formData.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
              </div>
              <div>
                <input
                  placeholder="Height *"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
              </div>
            </div>
          </div>

          <button
            onClick={handleContinueOrder}
            className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>Continue</span>
          </button>
        </div>
      )}

      {/* Order Details Section (displayed after clicking Continue in Shipment Section) */}
      {showOrder && (
        <div className="mt-8">
          <h4 className="text-xl font-semibold text-emerald-600">Order Details</h4>
          <div className="grid grid-cols-2 gap-6 mt-2">
            <div>
              <input
                placeholder="Invoice No.*"
                value={formData.invoiceNo}
                onChange={(e) => handleInputChange("invoiceNo", e.target.value)}
                className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.invoiceNo && <p className="text-red-500 text-sm mt-1">{errors.invoiceNo}</p>}
            </div>
            <div>
              <input
                placeholder="Invoice Currency*"
                value={formData.invoiceCurrency}
                onChange={(e) => handleInputChange("invoiceCurrency", e.target.value)}
                className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.invoiceCurrency && <p className="text-red-500 text-sm mt-1">{errors.invoiceCurrency}</p>}
            </div>
            <div>
              <input
                placeholder="Invoice Date*" 
                type={formData.invoiceDate ? "date" : "text"}
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                value={formData.invoiceDate}
                onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
                className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.invoiceDate && <p className="text-red-500 text-sm mt-1">{errors.invoiceDate}</p>}
            </div>
            {/* <input placeholder="ETN Number" className="p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" /> */}
          </div>

          <button
            onClick={handleContinueItem}
            className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>Continue</span>
          </button>
        </div>
      )}

      {/* Item Details Section (displayed after clicking Continue in Order Details Section) */}
      {showItem && (
        <div className="mt-8">
          <h4 className="text-xl font-semibold text-emerald-600">Item Details</h4>
          <div className="flex flex-col space-y-4 mt-4">
          {productItems.map((item, index) => (
            <div className="relative grid grid-cols-3 gap-6 mb-4" key={index}>
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveProductItem(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div>
                <input
                  placeholder="Product Name *"
                  value={item.productName}
                  onChange={(e) => handleProductItemChange(index, "productName", e.target.value)}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors[`productName_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`productName_${index}`]}</p>}
              </div>
              <div>
                <input
                  placeholder="Product Quantity *"
                  value={item.productQuantity}
                  onChange={(e) => handleProductItemChange(index, "productQuantity", e.target.value)}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors[`productQuantity_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`productQuantity_${index}`]}</p>}
              </div>
              <div>
                <input
                  placeholder="Product Price *"
                  value={item.productPrice}
                  onChange={(e) => handleProductItemChange(index, "productPrice", e.target.value)}
                  className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors[`productPrice_${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`productPrice_${index}`]}</p>}
              </div>
            </div>
          ))}
            {/* <div>
              <input
                placeholder="Product Name*"
                className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
            </div>
            <div>
              <input
                placeholder="Quantity*"
                className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.productQuantity && <p className="text-red-500 text-sm mt-1">{errors.productQuantity}</p>}
            </div>
            <div>
              <input
                placeholder="Price*"
                className="w-full p-3 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.productPrice && <p className="text-red-500 text-sm mt-1">{errors.productPrice}</p>}
            </div> */}
          </div>

          <button
            onClick={handleAddProductItem}
            className="bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 self-start">
            + Add
          </button>

          <button 
          onClick={handleSubmitOrder}
          className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2"
          disabled={isLoading}  // Disable the button while the order is being submitted
        >
          {isLoading ? (
            // Show a spinner (or any loading indicator) while submitting
            <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Submit Order</span>
            </>
          )}
        </button>
        </div>
      )}
    </div>
  );
};

export default AddOrder;
