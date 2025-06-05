// src/context/AppContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getProfile } from '../services/api';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const response = await getProfile();
          setUser(response.data);
        } catch (err) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{ user, isAuthenticated, login, logout, setUser }}>
      {children}
    </AppContext.Provider>
  );
};