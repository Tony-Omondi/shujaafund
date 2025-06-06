import { createContext, useState, useEffect } from 'react';
import { getProfile } from '../services/api';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const response = await getProfile();
          setUser(response.data);
        } catch (err) {
          console.error('Profile fetch error:', err.response?.status, err.response?.data);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{ user, isAuthenticated, login, logout, setUser }}>
      {children}
    </AppContext.Provider>
  );
};