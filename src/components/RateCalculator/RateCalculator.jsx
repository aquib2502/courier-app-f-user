import React, { useState } from 'react';

const RateCalculator = () => {
  const [weight, setWeight] = useState('0.1'); // Initial weight
  const [pickUpCountry, setPickUpCountry] = useState('India');
  const [destinationCountry, setDestinationCountry] = useState('United States (USA)');
  const [postcode, setPostcode] = useState('');
  const [calculated, setCalculated] = useState(false);

  // Handle change in input fields
  const handleWeightChange = (e) => setWeight(e.target.value);
  const handlePostcodeChange = (e) => setPostcode(e.target.value);

  // Handle calculation
  const handleCalculate = () => setCalculated(true);

  return (
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
            <option value="United States (USA)">United States (USA)</option>
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
            <option value="United States (USA)">United States (USA)</option>
            {/* Add more options here */}
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
            className="w-full p-3 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            min="0.1"
            step="0.1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Postcode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={postcode}
            onChange={handlePostcodeChange}
            className="w-full p-3 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Postcode"
          />
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
      {calculated && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">Dead Weight</p>
              <p className="text-xl font-semibold text-emerald-600">{weight} KG</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">Volumetric Weight</p>
              <p className="text-xl font-semibold text-emerald-600">0.00 KG</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">Billed Weight</p>
              <p className="text-xl font-semibold text-emerald-600">{weight} KG</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-lg text-emerald-600 font-extrabold mt-3.5">ShipGlobal Super Saver</p>
              <p className="text-lg font-semibold text-emerald-600">Rs. 379</p>
            </div>
            <p className="text-sm text-gray-600">Estimated Transit: 8 - 12 Days</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-lg text-emerald-600 font-extrabold">ShipGlobal Direct</p>
              <p className="text-lg font-semibold text-emerald-600">Rs. 447</p>
            </div>
            <p className="text-sm text-gray-600">Estimated Transit: 7 - 10 Days</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateCalculator;
