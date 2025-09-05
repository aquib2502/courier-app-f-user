import React, { useState, useEffect } from 'react';
import { User, MapPin, Plus, MoreVertical, Edit3, Trash2 } from 'lucide-react';
import axios from 'axios';

const PickupAddress = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState(null);
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    contactPerson: '',
    contactNumber: ''
  });
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const response = await axios.get(`${NEXT_PUBLIC_API_URL}/api/user/getuser/${userId}`);
      const data = response.data.user; // Access the nested user object
      setUserDetails(data);
      
      // Check if user has pickup addresses in the data
      if (data.pickupAddresses && data.pickupAddresses.length > 0) {
        setAddresses(data.pickupAddresses);
      } else {
        // Empty array for no addresses
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      await axios.put(`${NEXT_PUBLIC_API_URL}/api/user/updateuser/${userId}`, {
        pickupAddresses: [...addresses, newAddress]
      });
      
      await fetchUserDetails();
      setShowAddForm(false);
      setNewAddress({
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
      });
    } catch (error) {
      console.error('Error adding address:', error);
      setError('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressIndex) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      const updatedAddresses = addresses.filter((_, index) => index !== addressIndex);
      await axios.put(`${NEXT_PUBLIC_API_URL}/api/user/updateuser/${userId}`, {
        pickupAddresses: updatedAddresses
      });
      
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-600 text-center">
          <p className="text-lg font-medium">Error</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchUserDetails}
            className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Pickup Address</h1>
            <nav className="text-sm text-gray-500 mt-1">
              Settings &gt; Pickup Address
            </nav>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Pickup Address
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64 bg-gray-50 rounded-lg p-4">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-medium text-gray-900">{userDetails?.fullname}</h3>
            </div>

            {/* <nav className="space-y-2">
              <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 cursor-pointer">
                <User className="w-4 h-4" />
                My Profile
              </div>
              <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pickup Address
              </div>
            </nav> */}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {addresses.length === 0 && !showAddForm ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pickup Addresses</h3>
                <p className="text-gray-500 mb-4">Add your first pickup address to get started</p>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Pickup Address
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600">
                    <div>Address</div>
                    <div>City & State</div>
                    <div>Postal Code</div>
                    <div>Actions</div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {addresses.map((address, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="grid grid-cols-4 gap-4 items-start">
                        <div>
                          <div className="text-sm text-gray-900 font-medium mb-1">
                            {address.addressLine1}
                          </div>
                          {address.addressLine2 && (
                            <div className="text-sm text-gray-600 mb-1">
                              {address.addressLine2}
                            </div>
                          )}
                          {address.addressLine3 && (
                            <div className="text-sm text-gray-600">
                              {address.addressLine3}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-gray-900 font-medium mb-1">
                            {address.city}
                          </div>
                          <div className="text-sm text-gray-600">
                            {address.state}, {address.country}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 font-medium">{address.postalCode}</p>
                        </div>
                        <div className="relative">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          {activeDropdown === index && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteAddress(index)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Address Form */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Pickup Address</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Street address, building number"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Apartment, suite, unit (optional)"
                    />
                  </div>

                  {/* <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 3</label>
                    <input
                      type="text"
                      value={newAddress.addressLine3}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine3: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Additional address info (optional)"
                    />
                  </div> */}

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                      <input
                        type="text"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Postal Code"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                      <input
                        type="text"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                     <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={newAddress.contactPerson}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Add a person to contact if you are not available (optional)"
                    />
                  </div>
                     <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="text"
                      value={newAddress.contactNumber}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, contactNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Persons Contact Number  (optional)"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAddress}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupAddress;