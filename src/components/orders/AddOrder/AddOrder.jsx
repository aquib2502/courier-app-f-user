// components/orders/AddOrder/AddOrder.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import components
import BuyerDetails from "./BuyerDetails";
import ShipmentDetails from "./ShipmentDetails";
import OrderDetails from "./OrderDetails";
import ItemDetails from "./ItemDetails";
import ShippingSelection from "./ShippingSelection";

const AddOrder = ({ walletBalance = 0, onOrderPayment }) => {
  const [selectedShippingPartner, setSelectedShippingPartner] = useState(null);
  const [availableRates, setAvailableRates] = useState([]);
  const [allRates, setAllRates] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [pickupAddress, setPickupAddress] = useState([]);
  const [packageDiscounts, setPackageDiscounts] = useState({});
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const [productItems, setProductItems] = useState([
    { productName: "", productQuantity: "", productPrice: "" },
  ]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    pickupAddress: "",
    address1: "",
    address2: "",
    pincode: "",
    city: "",
    shipmentType: "CSB IV",
    country: "",
    countryCode: "",
    state: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    HSNCode: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    invoiceCurrency: "",
    invoiceName: "",
    product: "",
    productItems: productItems,
    shippingPartner: {},
  });

  // Fetch rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/rates`);
        setAllRates(response.data);
      } catch (error) {
        console.error("Error loading rates:", error.response?.data || error.message);
      }
    };
    fetchRates();
  }, []);

  // Fetch discount and package discounts
  const fetchDiscountPercent = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(window.atob(base64));
      const userId = decoded.userId;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/getuser/${userId}`
      );

      const user = response.data?.user;
      if (user) {
        setDiscountPercent(user.discountRate || 0);
        setPackageDiscounts(user.packageDiscounts || {});
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchDiscountPercent();
  }, []);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const headers = { "X-CSCAPI-KEY": "ZUVLUHhxTURNaHI4RU9WRmplUVhaaU9WeFVmbFNrVjltSUk5bFN0Mg==" };
        const countryRes = await axios.get("https://api.countrystatecity.in/v1/countries", { headers });
        const countriesArray = countryRes.data
          .map((c) => ({ name: c.name, code: c.iso2 }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countriesArray);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!formData.countryCode) return;

    const fetchStates = async () => {
      try {
        const headers = { "X-CSCAPI-KEY": "ZUVLUHhxTURNaHI4RU9WRmplUVhaaU9WeFVmbFNrVjltSUk5bFN0Mg==" };
        const res = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${formData.countryCode}/states`,
          { headers }
        );
        const stateList = res.data.map((s) => ({ name: s.name, code: s.iso2 }));
        setStates(stateList);
      } catch (err) {
        console.error("Failed to fetch states:", err);
      }
    };
    fetchStates();
  }, [formData.countryCode]);

  // Fetch currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,currencies"
        );
        if (Array.isArray(response.data)) {
          const currencySet = new Set();
          response.data.forEach((country) => {
            if (country.currencies) {
              Object.entries(country.currencies).forEach(([code, details]) => {
                currencySet.add(
                  JSON.stringify({
                    code,
                    name: details.name,
                    symbol: details.symbol || "",
                  })
                );
              });
            }
          });
          const currencyArray = Array.from(currencySet)
            .map((item) => JSON.parse(item))
            .sort((a, b) => a.code.localeCompare(b.code));
          setCurrencies(currencyArray);
        }
      } catch (err) {
        console.error("Error fetching currencies:", err);
      }
    };
    fetchCurrencies();
  }, []);

  // Get pickup addresses
  const getPickupAddress = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/getuser/${userId}`
      );

      if (response.data?.user?.pickupAddresses) {
        const addresses = response.data.user.pickupAddresses;
        setPickupAddress(addresses);
        if (addresses.length > 0) {
          setFormData((prev) => ({
            ...prev,
            pickupAddress: addresses[0].addressLine1,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getPickupAddress();
  }, []);

  // Auto-calculate shipping rates when weight/country changes
  useEffect(() => {
    if (formData.weight && formData.country) {
      calculateShippingRates();
    }
  }, [formData.weight, formData.country]);

  const destinationMap = {
    USA: "United States",
    "United States": "United States",
    "USA Remote": "USA Remote",
    Canada: "Canada",
    "United Kingdom": "United Kingdom",
    Australia: "Australia",
  };

  const getDeliveryTime = (pkg, country) => {
    const p = pkg.toLowerCase();
    const c = country.toLowerCase();
    if (p.includes("express")) return "5 - 6 business days";
    if (p.includes("self")) return "8 - 12 business days";
    if (c === "usa" || c === "united states" || c === "us") {
      if (p.includes("direct") || p.includes("service handling")) return "15 - 17 business days";
      if (p.includes("super save")) return "17 - 20 business days";
      if (p.includes("first class")) return "13 - 16 business days";
      return "15 - 17 business days";
    }
    if (c === "united kingdom" || c === "uk") return "8 - 12 business days";
    if (c === "australia" || c === "canada") return "15 - 18 business days";
    return "20 - 25 business days";
  };

  const calculateShippingRates = () => {
    if (!formData.weight || !formData.country) return;

    const userWeight = parseFloat(formData.weight);
    const rawCountry = formData.country.trim();
    const mappedCountry = destinationMap[rawCountry] || rawCountry;

    let countryRates = allRates.filter(
      (r) =>
        r.dest_country.toLowerCase() === mappedCountry.toLowerCase() &&
        parseFloat(r.weight) <= userWeight
    );

    if (countryRates.length === 0) {
      countryRates = allRates.filter(
        (r) =>
          r.dest_country.toLowerCase() === "rest of world" &&
          parseFloat(r.weight) <= userWeight
      );
    }

    if (countryRates.length === 0) {
      setAvailableRates([]);
      return;
    }

    const bestRates = [];
    addBestPackageRates(countryRates, bestRates);

    const formattedRates = bestRates.map((rate, index) => ({
      id: index + 1,
      name: `TTE ${rate.package}`,
      type: rate.package.toLowerCase().includes("premium self")
        ? "Recommended"
        : rate.package.toLowerCase().includes("premium")
        ? "Premium"
        : rate.package.toLowerCase().includes("express")
        ? "Express"
        : rate.package.toLowerCase().includes("firstclass")
        ? "Standard"
        : rate.package.toLowerCase().includes("worldwide")
        ? "Standard"
        : rate.package.toLowerCase().includes("direct")
        ? "Economy"
        : "Standard",
      price: parseFloat(rate.rate),
      deliveryTime: getDeliveryTime(rate.package, rawCountry),
      rating: 4.5,
      description: `Duty Paid service for ${rawCountry}`,
    }));

    setAvailableRates(formattedRates);
  };

  const addBestPackageRates = (rates, bestRates) => {
    const uniquePackages = [...new Set(rates.map((r) => r.package))];
    uniquePackages.forEach((pkg) => {
      const pkgRates = rates
        .filter((r) => r.package === pkg)
        .sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
      if (pkgRates.length > 0) bestRates.push(pkgRates[0]);
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
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
    setProductItems([
      ...productItems,
      { productName: "", productQuantity: "", productPrice: "" },
    ]);
  };

  const handleSelectShippingPartner = (partner) => {
    setSelectedShippingPartner(partner);
    setFormData({ ...formData, shippingPartner: partner });
    setErrors({ ...errors, shippingPartner: "" });
  };

  const calculateTotalAmount = () => {
    return selectedShippingPartner?.price || 0;
  };

  const validateForm = () => {
    const newErrors = {};

    // Buyer validation
    if (!formData.pickupAddress) newErrors.pickupAddress = "Pickup address is required";
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.address1.trim()) newErrors.address1 = "Address 1 is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";

    // Shipment validation
    if (!formData.weight) newErrors.weight = "Actual Weight is required";
    if (!formData.length) newErrors.length = "Length is required";
    if (!formData.width) newErrors.width = "Width is required";
    if (!formData.height) newErrors.height = "Height is required";

    // Order validation
    if (!formData.invoiceCurrency) newErrors.invoiceCurrency = "Invoice currency is required";
    if (!formData.invoiceDate) newErrors.invoiceDate = "Invoice date is required";

    // Product items validation
    productItems.forEach((item, index) => {
      if (!item.productName) newErrors[`productName_${index}`] = "Product name is required";
      if (!item.productQuantity) newErrors[`productQuantity_${index}`] = "Quantity is required";
      if (!item.productPrice) newErrors[`productPrice_${index}`] = "Price is required";
    });

    // Value validation
    const totalProductValue = productItems.reduce((total, item) => {
      return total + Number(item.productQuantity) * Number(item.productPrice);
    }, 0);

    if (Number(formData.weight) <= 0.1 && formData.invoiceCurrency === "INR" && totalProductValue > 1000) {
      newErrors.totalProductValue = "For weight ≤ 100g, total value cannot exceed ₹1000.";
    }

    if (formData.invoiceCurrency === "USD" && totalProductValue > 11.25) {
      newErrors.totalProductValueUSD = "Total invoice value cannot exceed $11.25 for USD.";
    }

    // Shipping partner validation
    if (!selectedShippingPartner) {
      newErrors.shippingPartner = "Please select a shipping partner";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (paymentStatus = "Payment Pending", orderStatus = "Drafts") => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("userToken");
      const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
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

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`,
        payload
      );

      if (paymentStatus === "Payment Received" && orderStatus === "Ready" && onOrderPayment) {
        await onOrderPayment(calculateTotalAmount());
      }

      toast.success("Order placed successfully!");
      router.push(`?tab=${orderStatus.toLowerCase()}`, undefined, { shallow: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        toast.error(data.errors[0]);
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Order</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <p>{message.text}</p>
          </div>
        )}

        <div className="space-y-8">
          <BuyerDetails
            formData={formData}
            pickupAddress={pickupAddress}
            errors={errors}
            handleInputChange={handleInputChange}
            countries={countries}
            states={states}
          />

          <ShipmentDetails
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          <OrderDetails
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            currencies={currencies}
          />

          <ItemDetails
            productItems={productItems}
            errors={errors}
            handleProductItemChange={handleProductItemChange}
            handleRemoveProductItem={handleRemoveProductItem}
            handleAddProductItem={handleAddProductItem}
            currency={formData.invoiceCurrency}
          />

          <ShippingSelection
            formData={formData}
            discountPercent={discountPercent}
            packageDiscounts={packageDiscounts}
            availableRates={availableRates}
            selectedShippingPartner={selectedShippingPartner}
            errors={errors}
            handleSelectShippingPartner={handleSelectShippingPartner}
          />

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={() => handlePlaceOrder("Payment Pending", "Drafts")}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handlePlaceOrder("Payment Received", "Ready")}
              disabled={isLoading}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {isLoading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;