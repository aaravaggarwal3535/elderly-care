import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = () => {
    try {
      // Check localStorage first (remember me)
      let userData = localStorage.getItem('eldercare_user');
      
      // If not in localStorage, check sessionStorage
      if (!userData) {
        userData = sessionStorage.getItem('eldercare_user');
      }

      if (userData) {
        const parsedData = JSON.parse(userData);
        
        // Check if data has user information
        if (parsedData.user && parsedData.user.id) {
          setUser(parsedData.user);
        }
      }
    } catch (error) {
      console.error('Error checking user session:', error);
      // Clear corrupted data
      localStorage.removeItem('eldercare_user');
      sessionStorage.removeItem('eldercare_user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData, rememberMe = false) => {
    setUser(userData.user);
    
    // Store in appropriate storage
    if (rememberMe) {
      localStorage.setItem('eldercare_user', JSON.stringify(userData));
      sessionStorage.removeItem('eldercare_user'); // Remove from session if exists
    } else {
      sessionStorage.setItem('eldercare_user', JSON.stringify(userData));
      localStorage.removeItem('eldercare_user'); // Remove from local if exists
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eldercare_user');
    sessionStorage.removeItem('eldercare_user');
  };

  const isAuthenticated = () => {
    return user !== null && user.id;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    checkUserSession
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};