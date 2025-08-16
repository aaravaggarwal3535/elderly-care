import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  
  // Use React Router's navigate hook
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      dob: '',
      role: 'patient'
    }
  });

  // Watch password field to compare with confirm password
  const password = watch('password');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

  // Custom age validation function
  const validateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 18) {
      return 'You must be at least 18 years old';
    }
    if (age > 120) {
      return 'Please enter a valid date of birth';
    }
    return true;
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError('');
    setEmailExists(false);

    try {
      const response = await fetch('https://elderly-care-backend-to4y.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          dob: data.dob,
          role: data.role
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('User created:', result);
        setIsSuccess(true);
        reset(); // Reset form using react-hook-form
        
        // Navigate to login page after 2 seconds without page refresh
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } else {
        const errorData = await response.json();
        
        // Handle email already exists (409 Conflict)
        if (response.status === 409) {
          setEmailExists(true);
          setSubmitError(errorData.detail || 'Email already registered.');
        } else {
          // Handle other error formats
          let errorMessage = 'Registration failed. Please try again.';
          
          if (errorData.detail) {
            if (typeof errorData.detail === 'string') {
              errorMessage = errorData.detail;
            } else if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map(err => err.msg).join(', ');
            }
          }
          
          setSubmitError(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
          
          {/* Optional: Manual navigation button */}
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm underline"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-600">Join ElderCare community today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                validate: (value) => value.trim().length >= 2 || 'Name must be at least 2 characters'
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: emailRegex,
                  message: 'Please enter a valid email address'
                }
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.email || emailExists ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: passwordRegex,
                  message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
                }
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Create a strong password"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match'
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          {/* Date of Birth Field */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              {...register('dob', {
                required: 'Date of birth is required',
                validate: validateAge
              })}
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.dob ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              I am a...
            </label>
            <select
              id="role"
              {...register('role', {
                required: 'Please select a role'
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="patient">Patient / Senior</option>
              <option value="family">Family Member</option>
              <option value="caregiver">Professional Caregiver</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
          </div>

          {/* Submit Error - Special handling for email exists */}
          {submitError && (
            <div className={`border rounded-md p-3 ${
              emailExists 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                {emailExists ? (
                  <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <div>
                  <p className={`text-sm ${emailExists ? 'text-orange-700' : 'text-red-600'}`}>
                    {submitError}
                  </p>
                  {emailExists && (
                    <p className="text-xs text-orange-600 mt-1">
                      If this is your account, please{' '}
                      <Link to="/login" className="font-medium underline hover:text-orange-800">
                        login here
                      </Link>
                      .
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-0.5 hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
