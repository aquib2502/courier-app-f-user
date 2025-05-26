import React, { useState, useEffect } from 'react';

const RateCalculator = () => {
  const [weight, setWeight] = useState('0.1');
  const [errors, setErrors] = useState({});
  const [pickUpCountry, setPickUpCountry] = useState('India');
  const [destinationCountry, setDestinationCountry] = useState('United States (USA)');
  const [postcode, setPostcode] = useState('400059');
  const [calculated, setCalculated] = useState(false);
  const [rates, setRates] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);

  useEffect(() => {
    fetch('/rates.json')
      .then(res => res.json())
      .then(data => setRates(data))
      .catch(err => console.error('Error loading rates:', err));
  }, []);

  const handleWeightChange = (e) => setWeight(e.target.value);
  const handlePostcodeChange = (e) => setPostcode(e.target.value);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCalculate();
    }
  };

  const handleCalculate = () => {
    if (!weight || parseFloat(weight) <= 0) {
      setErrors({ weight: "Weight is required and must be greater than 0" });
      setCalculated(false);
      return;
    } else if (!postcode) {
      setErrors({ postcode: "PostalCode cannot be empty" });
      setCalculated(false);
      return;
    }
  
    setErrors({});
    setCalculated(true);
  
    const userWeight = parseFloat(weight);
  
    // Filter all rates for the selected destination country
    const destinationRates = rates.filter(
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
  
    setFilteredRates(bestRates);
  };
  

  return (
    <div className="min-h-[calc(220vh-200px)] flex flex-col">
    <div>
      <h1 className="text-2xl font-extrabold mb-2 text-gray-800">Rate Calulator</h1>
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 text-white p-8 rounded-lg shadow-lg">
        {/* Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Pick-up Country <span className="text-red-500">*</span>
            </label>
            <select
              value={pickUpCountry}
              onChange={(e) => setPickUpCountry(e.target.value)}
              className="w-full p-3 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="India">India</option>
              {/* Add more options here */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Country/Region <span className="text-red-500">*</span>
            </label>
            <select
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              className="w-full p-3 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="India">India</option>
              <option value="United States (USA)">United States (USA)</option>
              <option value="United States (Remote)">United States (Remote)</option>
              <option value="United Kingdom (UK)">United Kingdom (UK)</option>
              <option value="Europe">Europe</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Rest of World">Rest of World</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Weight <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={weight}
              onChange={handleWeightChange}
              onKeyDown={handleKeyDown}
              className="w-full p-3 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              min="0.1"
              step="0.1"
            />
            {errors.weight && (
              <p className="text-red-500 text-md mt-1">{errors.weight}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={postcode}
              onKeyDown={handleKeyDown}
              onChange={handlePostcodeChange}
              className="w-full p-3 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Postcode"
            />
            {errors.postcode && (
              <p className="text-red-500 text-md mt-1">{errors.postcode}</p>
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full w-1/2 md:w-1/3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Calculate
          </button>
        </div>

        {/* Results Section */}
        {calculated && filteredRates.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {filteredRates.map((rate, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg text-emerald-600 font-extrabold mt-2">
                  AS Enterprise {rate.package}
                </p>
                <p className="text-lg font-semibold text-emerald-600">Rs. {rate.rate}</p>
              </div>
              <p className="text-sm text-gray-600">Estimated Transit: 6 - 12 Days</p>
            </div>
          ))}
        </div>
        )}

      </div>
    </div>
    </div>
  );
};

export default RateCalculator;
