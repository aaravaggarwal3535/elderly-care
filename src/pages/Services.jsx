import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    // Check if isAuthenticated is false or user is null
    if (!isAuthenticated || !user) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  // Don't render if not authenticated or no user
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Render based on user role
  if (user.role === 'caregiver') {
    return <CaregiverServices user={user} />;
  } else {
    return <PatientFamilyServices user={user} />;
  }
};

// Component for Patient/Senior and Family Member
const PatientFamilyServices = ({ user }) => {
  const [selectedService, setSelectedService] = useState('');
  const [requirements, setRequirements] = useState('');
  const [cost, setCost] = useState(''); // Added cost state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const services = [
    { id: 'medical', name: 'Medical Care', icon: '🏥', suggestedRate: '$25-40/hr' },
    { id: 'personal', name: 'Personal Care', icon: '🛁', suggestedRate: '$20-35/hr' },
    { id: 'household', name: 'Household Tasks', icon: '🏠', suggestedRate: '$15-25/hr' },
    { id: 'companionship', name: 'Companionship', icon: '👥', suggestedRate: '$15-30/hr' },
    { id: 'transportation', name: 'Transportation', icon: '🚗', suggestedRate: '$20-35/hr' },
    { id: 'medication', name: 'Medication Management', icon: '💊', suggestedRate: '$30-45/hr' },
  ];

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    if (!selectedService || !requirements.trim() || !cost) {
      setSubmitMessage('Please select a service, provide requirements, and specify your budget.');
      return;
    }

    // Validate cost is a positive number
    const costValue = parseFloat(cost);
    if (isNaN(costValue) || costValue <= 0) {
      setSubmitMessage('Please enter a valid cost amount.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      console.log('Submitting request with user:', user); // Debug log
      
      const response = await fetch('https://elderly-care-backend-to4y.onrender.com/service-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id || user.id,
          userName: user.name,
          userEmail: user.email,
          serviceType: selectedService,
          requirements: requirements,
          cost: costValue, // Added cost to request
          status: 'pending',
          createdAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage('Service request submitted successfully! A caregiver will review your request soon.');
        setSelectedService('');
        setRequirements('');
        setCost(''); // Reset cost field
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Debug log
        setSubmitMessage(errorData.detail || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitMessage('Failed to submit request. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900">Request Care Services</h1>
            <p className="text-gray-600 mt-2">
              Welcome {user.name}! Select a service and describe your needs to connect with professional caregivers.
            </p>
          </div>

          <div className="p-6">
            {/* Available Services */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedService === service.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Typical: {service.suggestedRate}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Form */}
            <form onSubmit={handleSubmitRequest} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Service
                </label>
                <input
                  type="text"
                  value={selectedService ? services.find(s => s.id === selectedService)?.name : ''}
                  placeholder="Please select a service above"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Budget (per hour) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="cost"
                    name="cost"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {selectedService && (
                  <p className="text-sm text-gray-500 mt-1">
                    Typical rate for {services.find(s => s.id === selectedService)?.name}: {services.find(s => s.id === selectedService)?.suggestedRate}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe Your Requirements *
                </label>
                <textarea
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Please provide details about your specific needs, preferred schedule, and any special requirements..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {submitMessage && (
                <div className={`p-3 rounded-md ${
                  submitMessage.includes('successfully') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !selectedService || !requirements.trim() || !cost}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? 'Submitting Request...' : 'Submit Service Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for Caregivers
const CaregiverServices = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState(null);

  // Fetch pending requests
  const fetchRequests = async () => {
    try {
      const response = await fetch('https://elderly-care-backend-to4y.onrender.com/service-requests/pending');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      } else {
        console.error('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle request approval/rejection
  const handleRequestAction = async (requestId, action) => {
    setProcessingRequest(requestId);
    
    try {
      const response = await fetch(`https://elderly-care-backend-to4y.onrender.com/service-request/${requestId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caregiverId: user._id || user.id,
          caregiverName: user.name,
          caregiverEmail: user.email
        }),
      });

      if (response.ok) {
        // Remove the processed request from the list
        setRequests(requests.filter(req => req.id !== requestId));
      } else {
        console.error('Failed to process request');
      }
    } catch (error) {
      console.error('Error processing request:', error);
    } finally {
      setProcessingRequest(null);
    }
  };

  // Fetch requests on component mount and set up polling
  useEffect(() => {
    fetchRequests();
    
    // Poll for new requests every 10 seconds
    const interval = setInterval(fetchRequests, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const serviceIcons = {
    medical: '🏥',
    personal: '🛁',
    household: '🏠',
    companionship: '👥',
    transportation: '🚗',
    medication: '💊'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
            <p className="text-gray-600 mt-2">
              Welcome {user.name}! Review and respond to service requests from patients and families.
            </p>
          </div>

          <div className="p-6">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No pending requests</h3>
                <p className="text-gray-600">New service requests will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="text-2xl mr-3">
                            {serviceIcons[request.serviceType] || '🔧'}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 capitalize">
                              {request.serviceType} Care Request
                            </h3>
                            <p className="text-sm text-gray-600">
                              From: {request.userName} ({request.userEmail})
                            </p>
                          </div>
                        </div>
                        
                        {/* Budget Display */}
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center">
                            <div className="text-green-600 mr-2">💰</div>
                            <div>
                              <h4 className="font-medium text-green-900">Budget Offered</h4>
                              <p className="text-green-700 text-lg font-bold">${request.cost}/hour</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                            {request.requirements}
                          </p>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          Requested: {new Date(request.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex space-x-3 ml-6">
                        <button
                          onClick={() => handleRequestAction(request.id, 'approve')}
                          disabled={processingRequest === request.id}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
                        >
                          {processingRequest === request.id ? '...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleRequestAction(request.id, 'reject')}
                          disabled={processingRequest === request.id}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors duration-200"
                        >
                          {processingRequest === request.id ? '...' : 'Decline'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
