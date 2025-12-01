  // components/orders/AddOrder/AddOrder.jsx
  "use client";
  import React, { useState, useEffect, use } from "react";
  import { Check, X, ChevronLeft, ChevronRight, Menu } from "lucide-react";
  import axios from "axios";
  import { useRouter } from "next/navigation";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { motion, AnimatePresence } from "framer-motion";

  // Import all the separated components from the same folder
  import Sidebar from "./Sidebar";
  import BuyerDetails from "./BuyerDetails";
  import ShipmentDetails from "./ShipmentDetails";
  import OrderDetails from "./OrderDetails";
  import ItemDetails from "./ItemDetails";
  import ShippingSelection from "./ShippingSelection";
  import OrderReview from "./OrderReview";

  const AddOrder = ({ walletBalance = 0, onOrderPayment }) => {
    // Step management - simplified to use a single currentStep state
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedShippingPartner, setSelectedShippingPartner] = useState(null);
    const [availableRates, setAvailableRates] = useState([]);
    const [allRates, setAllRates] = useState([]);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [pickupAddress , setPickupAddress] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [packageDiscounts, setPackageDiscounts] = useState({});


    const [productItems, setProductItems] = useState([
      { productName: "", productQuantity: "", productPrice: "" },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      mobile: "",
      email:"",
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
      HSNCode: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      invoiceCurrency: " ",
      invoiceName: "",
      product:"",
      //
      productItems: productItems,
      shippingPartner: {},
    });

    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});

    const [countries, setCountries] = useState([]);
    const [countryStateMap, setCountryStateMap] = useState({}); 

    const [currencies, setCurrencies] = useState([]);

    // Toggle sidebar for mobile
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Fetch rates from backend
    useEffect(() => {
      const fetchRates = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/rates`);
          setAllRates(response.data); // API returns array of rates
        } catch (error) {
          console.error(
            "Error loading rates:",
            error.response?.data || error.message
          );
        }
      };

      fetchRates();
    }, []);

  const fetchDiscountPercent = async () => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    console.log("No token found, redirecting to login");
    router.push("/login");
    return;
  }

  let decoded;
  try {
    // Decode JWT payload
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    decoded = JSON.parse(window.atob(base64));
  } catch (error) {
    console.error("Error decoding token:", error);
    return;
  }

  const userId = decoded.userId;
  if (!userId) {
    console.error("No userId found in token");
    return;
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/getuser/${userId}`
    );

    const user = response.data?.user;
    if (!user) {
      console.warn("No user data found in response");
      return;
    }

    // ✅ Set default percentage-based discount (if present)
    if (user.discountRate !== undefined) {
      setDiscountPercent(user.discountRate);
      console.log("Fetched default discount rate:", user.discountRate);
    } else {
      setDiscountPercent(0);
      console.log("No default discount rate found, set to 0");
    }

    // ✅ Set package-based discounts (flat rupee)
    if (user.packageDiscounts && Object.keys(user.packageDiscounts).length > 0) {
      setPackageDiscounts(user.packageDiscounts);
      console.log("Fetched package discounts:", user.packageDiscounts);
    } else {
      setPackageDiscounts({});
      console.log("No package-specific discounts found for user");
    }

  } catch (error) {
    console.error(
      "Error fetching user data:",
      error.response?.data || error.message
    );
  }
};


    useEffect(() => {
      fetchDiscountPercent();
    }, []);

    // Reset shipping selection when weight changes
    useEffect(() => {
      setSelectedShippingPartner(null);
      setAvailableRates([]);
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

  // EXPRESS always 5–6 business days regardless of country
  if (p.includes("express")) return "5 - 6 business days";
   if(p.includes("self")) return "8 - 12 buisness days"

  // USA logic
  if (c === "usa" || c === "united states" || c === "us") {
    if (p.includes("direct") || p.includes("service handling"))
      return "15 - 17 business days";
    if (p.includes("super save")) return "17 - 20 business days";
    if (p.includes("first class")) return "13 - 16 business days";
   
    return "15 - 17 business days"; // fallback for USA
  }

  // UK
  if (c === "united kingdom" || c === "uk") return "8 - 12 business days";

  // Australia + Canada
  if (c === "australia" || c === "canada") return "15 - 18 business days";

  // Other countries
  return "20 - 25 business days";
};


    const calculateShippingRates = () => {
  if (!formData.weight || !formData.country) return;

  const userWeight = parseFloat(formData.weight);
  const rawCountry = formData.country.trim();
  const mappedCountry =
    destinationMap[rawCountry] || rawCountry; // <– no default to "Rest of World"

  // 1️⃣ Try country-specific rates first
  let countryRates = allRates.filter(
    (r) =>
      r.dest_country.toLowerCase() === mappedCountry.toLowerCase() &&
      parseFloat(r.weight) <= userWeight
  );

  // 2️⃣ If none, fall back to "Rest of World"
  if (countryRates.length === 0) {
    countryRates = allRates.filter(
      (r) =>
        r.dest_country.toLowerCase() === "rest of world" &&
        parseFloat(r.weight) <= userWeight
    );
  }

  // 3️⃣ If still nothing, no rates
  if (countryRates.length === 0) {
    setAvailableRates([]);
    return;
  }

  // 4️⃣ One best row per package (using your existing helper)
  const bestRates = [];
  addBestPackageRates(countryRates, bestRates);

  // 5️⃣ Map to UI format for ShippingSelection
  const formattedRates = bestRates.map((rate, index) => ({
    id: index + 1,
    name: `TTE ${rate.package}`,
   type:
  rate.package.toLowerCase().includes("premium self") ? "Recommended" :
  rate.package.toLowerCase().includes("premium") ? "Premium" :
  rate.package.toLowerCase().includes("express") ? "Express" :
  rate.package.toLowerCase().includes("firstclass") ? "Standard" :
  rate.package.toLowerCase().includes("worldwide") ? "Standard" :
  rate.package.toLowerCase().includes("direct") ? "Economy" :
  "Standard",

    price: parseFloat(rate.rate),
    // you can keep this simple; ShippingSelection has its own transit-time logic
    deliveryTime: getDeliveryTime(rate.package, rawCountry),


    rating: 4.5,
    description: `Duty Paid service for ${rawCountry}`,
  }));

  setAvailableRates(formattedRates);
};

  // Helper
  const addBestPackageRates = (rates, bestRates) => {
    const uniquePackages = [...new Set(rates.map((r) => r.package))];
    uniquePackages.forEach((pkg) => {
      const pkgRates = rates
        .filter((r) => r.package === pkg)
        .sort((a, b) => parseFloat(b.weight) - parseFloat(a.weight));
      if (pkgRates.length > 0) bestRates.push(pkgRates[0]);
    });
  };

    
  //Fetch countries and States
 useEffect(() => {
  const fetchCountriesAndStates = async () => {
    try {
      const headers = { "X-CSCAPI-KEY":"ZUVLUHhxTURNaHI4RU9WRmplUVhaaU9WeFVmbFNrVjltSUk5bFN0Mg==" };

      // Fetch countries
      const countryRes = await axios.get(
        "https://api.countrystatecity.in/v1/countries",
        { headers }
      );

      const countryList = countryRes.data;

      // Build dropdown array
      const countriesArray = countryList.map(c => ({
        name: c.name,
        code: c.iso2
      }));

      countriesArray.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(countriesArray);

      // Fetch states for each country
      const stateRequests = countryList.map(c =>
        axios.get(
          `https://api.countrystatecity.in/v1/countries/${c.iso2}/states`,
          { headers }
        )
      );

      const stateResponses = await Promise.all(stateRequests);

      const stateMap = {};

      stateResponses.forEach((res, index) => {
        const country = countryList[index];
        const states = res.data;

        stateMap[country.name] = states.map(s => ({
          name: s.name,   // "Ghazni"
          code: s.iso2    // "GHA"
        }));
      });

      setCountryStateMap(stateMap);
    } catch (error) {
      console.error(error);
    }
  };

  fetchCountriesAndStates();
}, []);


  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,currencies"
        );

        if (Array.isArray(response.data)) {
          const currencySet = new Set();

          // Extract unique currency codes with names
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

          // Convert Set back to array and sort alphabetically
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


  const getPickupAddress = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        console.error("User is not authenticated");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/getuser/${userId}`
      );

      if (response.data && response.data.user) {
        const addresses = response.data.user.pickupAddresses;

        if (addresses && addresses.length > 0) {
          setPickupAddress(addresses);

          // ✅ Auto-select first address if not already set
          setFormData((prev) => ({
            ...prev,
            pickupAddress: addresses[0].addressLine1,
          }));
        } else {
          toast.info("No pickup address found for user, please add one in the profile section");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (pickupAddress.length > 0 && !formData.pickupAddress) {
      setFormData((prev) => ({
        ...prev,
        pickupAddress: pickupAddress[0].addressLine1,
      }));
    }
  }, [pickupAddress]);


      useEffect(() => {
        getPickupAddress();
      }, []);
    // Navigation function for sidebar clicks
    const navigateToStep = (step) => {
      // Only allow navigation to completed steps or next step
      if (step <= currentStep || isStepAccessible(step)) {
        setCurrentStep(step);
        // Close sidebar on mobile after step selection
        if (window.innerWidth < 1024) {
          setIsSidebarOpen(false);
        }
      }
    };

    // Check if a step is accessible based on form completion
    const isStepAccessible = (step) => {
      switch (step) {
        case 1:
          return true;
        case 2:
          return (
            formData.firstName &&
            formData.lastName &&
            formData.mobile &&
            formData.address1
          );
        case 3:
          return (
            isStepAccessible(2) &&
            formData.weight &&
            formData.length &&
            formData.width &&
            formData.height
          );
        case 4:
          return (
            isStepAccessible(3) &&
            productItems.every(
              (item) =>
                item.productName && item.productQuantity && item.productPrice
            )
          );
        case 5:
          return isStepAccessible(4) && selectedShippingPartner;
        case 6:
          return isStepAccessible(5);
        default:
          return false;
      }
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

    // Step 1: Buyer Details validation and navigation
    const handleContinueFromBuyer = () => {
      const newErrors = {};

      if (!formData.pickupAddress)
        newErrors.pickupAddress = "Pickup address is required";
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
      if (!formData.address1.trim()) newErrors.address1 = "Address 1 is required";
      if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.state) newErrors.state = "State is required";

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setCurrentStep(2);
      }
    };

    // Step 2: Shipment Details validation and navigation
    const handleContinueFromShipment = () => {
      const newErrors = {};

      if (!formData.weight) newErrors.weight = "Actual Weight is required";
      if (!formData.length) newErrors.length = "Length is required";
      if (!formData.width) newErrors.width = "Width is required";
      if (!formData.height) newErrors.height = "Height is required";

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setCurrentStep(3);
        // Clear shipping selection if weight changes
        setSelectedShippingPartner(null);
        setAvailableRates([]);
      }
    };

    // Step 3: Order Details validation and navigation
    const handleContinueFromOrder = () => {
      const newErrors = {};

      if (!formData.invoiceCurrency)
        newErrors.invoiceCurrency = "Invoice currency is required";
      if (!formData.invoiceDate)
        newErrors.invoiceDate = "Invoice date is required";

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        setCurrentStep(4);
      }
    };

    // Step 4: Item Details validation and navigation
    const handleContinueFromItems = () => {
      const newErrors = {};

      productItems.forEach((item, index) => {
        if (!item.productName)
          newErrors[`productName_${index}`] = "Product name is required";
        if (!item.productQuantity)
          newErrors[`productQuantity_${index}`] = "Product Quantity is required";
        if (!item.productPrice)
          newErrors[`productPrice_${index}`] = "Product Price is required";
      });

      // ✅ Additional Constraint: If weight <= 100g, total product value cannot exceed 1000
    const totalProductValue = productItems.reduce((total, item) => {
      return total + Number(item.productQuantity) * Number(item.productPrice);
    }, 0);

    if (Number(formData.weight) <= 0.1 && totalProductValue > 1000) {
      newErrors.totalProductValue =
        "For shipments with weight ≤ 100g, the total product value cannot exceed ₹1000.";
    }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        calculateShippingRates(); // Calculate rates when moving to shipping selection
        setCurrentStep(5);
      }
    };

    // Step 5: Shipping Selection validation and navigation
    const handleContinueFromShipping = () => {
      if (!selectedShippingPartner) {
        setErrors({ shippingPartner: "Please select a shipping partner" });
        return;
      }
      setCurrentStep(6);
    };

    const handleSelectShippingPartner = (partner) => {
      setSelectedShippingPartner(partner);
      setFormData({ ...formData, shippingPartner: partner });
      setErrors({ ...errors, shippingPartner: "" });
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

    const calculateTotalAmount = () => {
      const productTotal = productItems.reduce((total, item) => {
        return total + Number(item.productQuantity) * Number(item.productPrice);
      }, 0);

      const shippingCost = selectedShippingPartner?.price || 0;
      return shippingCost;
    };

    const handlePlaceOrder = async (
      paymentStatus = "Payment Pending",
      orderStatus = "Drafts"
    ) => {
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

        // If payment was successful and order is ready, deduct from wallet
        if (
          paymentStatus === "Payment Received" &&
          orderStatus === "Ready" &&
          onOrderPayment
        ) {
          await onOrderPayment(calculateTotalAmount());
        }
        toast.success("Order placed successfully!");

        // Redirect to appropriate tab
        router.push(`?tab=${orderStatus.toLowerCase()}`, undefined, {
          shallow: true,
        });
      } 
      catch (err) {
    const data = err.response?.data;

    // Show first error in toast
    if (data?.errors?.length) {
      toast.error(data.errors[0]);
    } else {
      toast.error(data?.message || "Something went wrong");
    }
      } finally {
        setIsLoading(false);
      }
    };

    // Go to previous step
    const handlePrevious = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };

    // Get step titles
    const getStepTitle = () => {
      switch (currentStep) {
        case 1:
          return "Buyer Details";
        case 2:
          return "Shipment Details";
        case 3:
          return "Order Details";
        case 4:
          return "Item Details";
        case 5:
          return "Shipping Selection";
        case 6:
          return "Order Review";
        default:
          return "Order Form";
      }
    };

    // Sidebar animation variants
    const sidebarVariants = {
      hidden: { x: "-100%" },
      visible: { x: 0 },
    };

    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar currentStep={currentStep} navigateToStep={navigateToStep} />
        </div>


        <ToastContainer position="top-right" autoClose={3000} />

        {/* Main Content */}
        <div className="flex-1 p-3 sm:p-4 lg:p-6">
          <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                  {getStepTitle()}
                </h2>
                <div className="px-3 sm:px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium self-start sm:self-auto">
                  Step {currentStep} of 6
                </div>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                ></div>
              </div>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : message.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                {message.type === "success" && <Check className="w-5 h-5" />}
                {message.type === "error" && <X className="w-5 h-5" />}
                <p className="text-sm sm:text-base">{message.text}</p>
              </div>
            )}

            {/* Step Content */}
            <div className="min-h-80 sm:min-h-96">
              {/* Step 1: Buyer Details */}
              {currentStep === 1 && (
                <BuyerDetails
                  formData={formData}
                  pickupAddress={pickupAddress}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  handleContinueShipment={handleContinueFromBuyer}
                  countries={countries}
                  countryStateMap={countryStateMap}
                />
              )}

              {/* Step 2: Shipment Details */}
              {currentStep === 2 && (
                <ShipmentDetails
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  handleContinueOrder={handleContinueFromShipment}
                />
              )}

              {/* Step 3: Order Details */}
              {currentStep === 3 && (
                <OrderDetails
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  handleContinueItem={handleContinueFromOrder}
                  currencies={currencies}
                />
              )}

              {/* Step 4: Item Details */}
              {currentStep === 4 && (
                <ItemDetails
                  productItems={productItems}
                  errors={errors}
                  handleProductItemChange={handleProductItemChange}
                  handleRemoveProductItem={handleRemoveProductItem}
                  handleAddProductItem={handleAddProductItem}
                  handleContinueToShipping={handleContinueFromItems}
                />
              )}

              {/* Step 5: Shipping Selection */}
              {currentStep === 5 && (
                console.log("Discount Percent before passing to ShippingSelection:", discountPercent),

                <ShippingSelection
                  formData={formData}
                  discountPercent={discountPercent}
                    packageDiscounts={packageDiscounts}
                  availableRates={availableRates}
                  selectedShippingPartner={selectedShippingPartner}
                  errors={errors}
                  handleSelectShippingPartner={handleSelectShippingPartner}
                  handleContinueToPlaceOrder={handleContinueFromShipping}
                />
              )}

              {/* Step 6: Order Review */}
              {currentStep === 6 && (
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

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 lg:mt-8 pt-4 lg:pt-6 border-t space-y-4 sm:space-y-0">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg transition-all duration-200 w-full sm:w-auto ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <div className="flex justify-center space-x-2 order-first sm:order-none">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <button
                    key={step}
                    onClick={() => navigateToStep(step)}
                    disabled={!isStepAccessible(step) && step > currentStep}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      step === currentStep
                        ? "bg-emerald-600"
                        : step < currentStep
                        ? "bg-emerald-400 hover:bg-emerald-500"
                        : isStepAccessible(step)
                        ? "bg-gray-300 hover:bg-gray-400"
                        : "bg-gray-200 cursor-not-allowed"
                    }`}
                  />
                ))}
              </div>
              
              {/* Spacer for desktop, hidden on mobile */}
              <div className="hidden sm:block sm:w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default AddOrder;
