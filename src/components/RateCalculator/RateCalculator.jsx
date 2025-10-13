import React, { useState, useEffect } from "react";
import { Calculator, MapPin, Package, Clock, ArrowRight } from "lucide-react";
import axios from "axios";
import axiosClient from "@/utils/axiosClient";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/rates`;

const RateCalculator = () => {
  const [weight, setWeight] = useState("0.1");
  const [errors, setErrors] = useState({});
  const [destinationCountry, setDestinationCountry] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [rates, setRates] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /** Fetch all rates */
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axiosClient.get(API_URL);
        setRates(response.data);
      } catch (error) {
        console.error("Error loading rates:", error.response?.data || error.message);
      }
    };
    fetchRates();
  }, []);

  /** Fetch countries dynamically */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${API_URL}/countries`);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error.response?.data || error.message);
      }
    };
    fetchCountries();
  }, []);

  /** Handle input */
  const handleWeightChange = (e) => setWeight(e.target.value);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleCalculate();
  };

  /** Core calculation logic */
const handleCalculate = () => {
  if (!weight || parseFloat(weight) <= 0) {
    setErrors({ weight: "Weight is required and must be greater than 0" });
    setCalculated(false);
    return;
  }
  if (!destinationCountry) {
    setErrors({ destinationCountry: "Please select a destination country" });
    setCalculated(false);
    return;
  }

  setErrors({});
  setIsLoading(true);

  const userWeight = parseFloat(weight);
  const destinationName = destinationCountry.trim().toLowerCase();

  console.log("Selected Country:", destinationCountry);
  console.log("User Entered Weight:", userWeight);

  /** Filter rates by destination name (case-insensitive) */
  let destinationRates = rates.filter(
    (r) => r.dest_country?.trim().toLowerCase() === destinationName
  );

  /** If no rates for the selected country, fallback to Rest of the World */
  if (destinationRates.length === 0) {
    console.warn(`No rates found for ${destinationCountry}, using Rest of the World`);
    destinationRates = rates.filter(
      (r) => r.dest_country?.trim().toLowerCase() === "rest of world"
    );
  }

  console.log("Filtered Destination Rates:", destinationRates);

  if (destinationRates.length === 0) {
    setFilteredRates([]);
    setCalculated(true);
    setIsLoading(false);
    return;
  }

  /** Get unique package types */
  const uniquePackages = [...new Set(destinationRates.map((r) => r.package))];

  const bestRates = [];

  uniquePackages.forEach((pkg) => {
    /** For each package, find the lowest weight >= user weight */
    const packageRates = destinationRates
      .filter((r) => parseFloat(r.weight) >= userWeight && r.package === pkg)
      .sort((a, b) => parseFloat(a.weight) - parseFloat(b.weight));

    if (packageRates.length > 0) {
      bestRates.push(packageRates[0]);
    }
  });

  console.log("Final Best Rates:", bestRates);
  setFilteredRates(bestRates);
  setCalculated(true);
  setIsLoading(false);
};


  const getPackageIcon = (packageType) => {
    switch (packageType?.toLowerCase()) {
      case "premium self":
        return "⚡";
      case "premium dpd":
        return "📦";
      case "economy":
        return "🚚";
      default:
        return "📫";
    }
  };

  const getPackageColor = (packageType) => {
    switch (packageType?.toLowerCase()) {
      case "express":
        return "from-purple-500/10 to-pink-500/10 border-purple-200/30";
      case "standard":
        return "from-blue-500/10 to-cyan-500/10 border-blue-200/30";
      case "economy":
        return "from-green-500/10 to-emerald-500/10 border-green-200/30";
      default:
        return "from-gray-500/10 to-slate-500/10 border-gray-200/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Rate Calculator
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Calculate shipping rates instantly with our advanced pricing engine. 
            Get accurate quotes for all your shipping needs.
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Form Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Destination Country */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Destination Country
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 appearance-none"
                  >
                    <option value="">Select destination country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name.toLowerCase()}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.destinationCountry && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-4 h-4">⚠️</span>
                    {errors.destinationCountry}
                  </p>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Package className="w-4 h-4 text-blue-500" />
                  Weight (kg)
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weight}
                    onChange={handleWeightChange}
                    onKeyDown={handleKeyDown}
                    className="w-full p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
                    min="0.001"
                    step="0.001"
                    placeholder="Enter package weight"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm font-medium">
                    KG
                  </div>
                </div>
                {errors.weight && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="w-4 h-4">⚠️</span>
                    {errors.weight}
                  </p>
                )}
              </div>
            </div>

            {/* Calculate Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={handleCalculate}
                disabled={isLoading}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    Calculate Rates
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            {calculated && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-slate-800">Available Rates</h3>
                </div>

                {filteredRates.length > 0 ? (
                  <div className="grid gap-4">
                    {filteredRates.map((rate, index) => (
                      <div
                        key={index}
                        className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-r ${getPackageColor(rate.package)} p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{getPackageIcon(rate.package)}</div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-800 mb-1">
                                TTE {rate.package}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Clock className="w-4 h-4" />
                                Estimated Transit: 6 - 12 Days
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-slate-800">
                              ₹{rate.rate}
                            </div>
                            <div className="text-sm text-slate-600">
                              for {weight}kg
                            </div>
                          </div>
                        </div>
                        
                        {/* Subtle hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 group-hover:translate-x-full"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-slate-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-600 mb-2">
                      No rates available
                    </h4>
                    <p className="text-slate-500 max-w-md mx-auto">
                      We couldn't find shipping rates for the selected country and weight. 
                      Please try different parameters or contact support.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Rates are calculated in real-time and may vary based on current market conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RateCalculator;
