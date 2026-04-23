import React, { createContext, useContext, useState, useEffect } from 'react';
import eventService from '../services/eventService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync state on load
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      // FIX: The user object is stored directly, no need for .data
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const result = await eventService.login(email, password);
    if (result.success) {
      setToken(result.data.token);
      setUser(result.data);
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  };

  const register = async (userData) => {
    const result = await eventService.register(userData);
    return result;
  };

  const logout = () => {
    eventService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
