import React, { useState, useEffect } from 'react';
import { User, Download, FileText, CheckCircle } from 'lucide-react';
import axios from 'axios';

const KYCDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (documentPath, documentType) => {
    if (documentPath) {
      // Create download link
      const link = document.createElement('a');
      link.href = `/${documentPath}`;
      link.download = `${documentType}_${userDetails.fullname}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
           <div className="mb-3">
  <div className="flex items-center gap-3 mb-2">
    <h1 className="text-2xl font-semibold text-gray-900">KYC</h1>

    {userDetails?.kycStatus === "approved" && (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
        Approved
      </span>
    )}

    {userDetails?.kycStatus === "rejected" && (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 border border-red-200">
        Rejected
      </span>
    )}

    {userDetails?.kycStatus === "pending" && (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 border border-yellow-200">
        Pending
      </span>
    )}
  </div>

  {/* Show rejection reason if rejected */}
  {userDetails?.kycStatus === "rejected" && userDetails?.kycRejectReason && (
    <p className="text-sm text-red-600 ml-1">
      Reason: {userDetails.kycRejectReason}
    </p>
  )}
</div>

            <nav className="text-sm text-gray-500"> 
              Settings &gt; KYC
            </nav>
          </div>
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
                <FileText className="w-4 h-4" />
                KYC Details
              </div>
            </nav> */}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Business KYC <span className="text-gray-500 text-sm font-normal">(CSB-IV)</span>
              </h2>

              {/* Aadhar Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="grid grid-cols-4 gap-6 items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Aadhar</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Aadhar Number</p>
                    <p className="font-medium text-gray-900">{userDetails?.aadharNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Aadhar Front</p>
                    <button 
                      onClick={() => handleDownload(userDetails?.aadharProof, 'aadhar')}
                      className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm font-medium"
                      disabled={!userDetails?.aadharProof}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Aadhar Back</p>
                    <button 
                      onClick={() => handleDownload(userDetails?.aadharProof, 'aadhar_back')}
                      className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm font-medium"
                      disabled={!userDetails?.aadharProof}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* GST Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="grid grid-cols-4 gap-6 items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">GST</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">GST Number</p>
                    <p className="font-medium text-gray-900">{userDetails?.gstNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">GST</p>
                    <button 
                      onClick={() => handleDownload(userDetails?.gstProof, 'gst')}
                      className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm font-medium"
                      disabled={!userDetails?.gstProof}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* PAN Section */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <div className="grid grid-cols-4 gap-6 items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">PAN</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">PAN Number</p>
                    <p className="font-medium text-gray-900">{userDetails?.panNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">PAN</p>
                    <button 
                      onClick={() => handleDownload(userDetails?.panProof, 'pan')}
                      className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm font-medium"
                      disabled={!userDetails?.panProof}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* IEC Section */}
              {userDetails?.iecNumber && (
                <div className="pb-6 mb-6">
                  <div className="grid grid-cols-4 gap-6 items-center">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">IEC</h3>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">IEC Number</p>
                      <p className="font-medium text-gray-900">{userDetails?.iecNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">IEC</p>
                      <button 
                        onClick={() => handleDownload(userDetails?.iecProof, 'iec')}
                        className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm font-medium"
                        disabled={!userDetails?.iecProof}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                    <div></div>
                  </div>
                </div>
              )}

              {/* Signature Section */}
              <div>
                <div className="grid grid-cols-4 gap-6 items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Signature</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Signature</p>
                    <button className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCDetails;