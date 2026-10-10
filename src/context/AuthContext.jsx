import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.data && res.data.data) {
            const userData = res.data.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const authData = res.data.data;
    const tokenVal = authData.token;
    const userData = {
      id: authData.id,
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role,
      phone: authData.phone,
      address: authData.address,
    };

    localStorage.setItem('token', tokenVal);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenVal);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    const authData = res.data.data;
    const tokenVal = authData.token;
    const userObj = {
      id: authData.id,
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role,
      phone: authData.phone,
      address: authData.address,
    };

    localStorage.setItem('token', tokenVal);
    localStorage.setItem('user', JSON.stringify(userObj));
    setToken(tokenVal);
    setUser(userObj);
    return userObj;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.data && res.data.data) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';
  const isCitizen = user?.role === 'ROLE_CITIZEN' || user?.role === 'CITIZEN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isCitizen,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
