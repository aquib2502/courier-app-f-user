import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, CheckCircle, X } from 'lucide-react';
import axios from 'axios';

const MyProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [editForm, setEditForm] = useState({
  fullname: '',
  email: '',
  mobile: ''   // ✅ added mobile here
});

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

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/getuser/${userId}`);
      setUserDetails(response.data.user);
      console.log('Fetched user details:', response.data);
    setEditForm({
  fullname: response.data.user.fullname || '',
  email: response.data.user.email || '',
  mobile: response.data.user.mobile || ''   // ✅ set mobile
});
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/updateuser/${userId}`, editForm);
      await fetchUserDetails();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user details:', error);
      setError('Failed to update user details');
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
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          <nav className="text-sm text-gray-500 mt-1">
            Settings &gt; My Profile
          </nav>
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
              <div className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <User className="w-4 h-4" />
                My Profile
              </div>
            </nav> */}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Basic Details</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
  <div>
    <label className="block text-sm text-gray-500 mb-1">First Name</label>
    {isEditing ? (
      <input
        type="text"
        value={editForm.fullname.split(' ')[0] || ''}  // First name part of fullname
        onChange={(e) => {
          const lastName = editForm.fullname.split(' ').slice(1).join(' ');
          setEditForm(prev => ({
            ...prev,
            fullname: `${e.target.value} ${lastName}`.trim()
          }));
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      />
    ) : (
      <p className="text-gray-900 font-medium">{userDetails?.fullname.split(' ')[0] || 'John'}</p>
    )}
  </div>

  <div>
    <label className="block text-sm text-gray-500 mb-1">Last Name</label>
    {isEditing ? (
      <input
        type="text"
        value={editForm.fullname.split(' ').slice(1).join(' ') || ''}  // Last name part of fullname
        onChange={(e) => {
          const firstName = editForm.fullname.split(' ')[0] || '';
          setEditForm(prev => ({
            ...prev,
            fullname: `${firstName} ${e.target.value}`.trim()
          }));
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      />
    ) : (
      <p className="text-gray-900 font-medium">{userDetails?.fullname.split(' ').slice(1).join(' ') || 'Doe'}</p>
    )}
  </div>
</div>

<div>
  <label className="block text-sm text-gray-500 mb-1">Email</label>
  {isEditing ? (
    <input
      type="email"
      value={editForm.email}
      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
    />
  ) : (
    <p className="text-gray-900">{userDetails?.email}</p>
  )}
</div>



              <div className=" pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
  <label className="block text-sm mt-3 text-gray-500 mb-1">Phone Number</label>
  {isEditing ? (
    <input
      type="text"
      value={editForm.mobile}
      onChange={(e) => setEditForm(prev => ({ ...prev, mobile: e.target.value }))}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
    />
  ) : (
    <p className="text-gray-900">{userDetails?.mobile || 'Not Provided'}</p>
  )}
                  </div>
                <div>
  <label className="block text-lg text-gray-500 mb-1">Status</label>
  {userDetails?.isActive ? (
    <span className="inline-flex items-center px-3 py-2 rounded-full text-xl bg-green-100 text-green-800 border border-green-200">
      <CheckCircle className="w-3 h-3 mr-1" />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 border border-red-200">
      <X className="w-3 h-3 mr-1" />
      Not Verified
    </span>
  )}
</div>

                </div>
                <div className="mt-4">
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  ) : (
                    <p className="text-gray-900">{userDetails?.email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;