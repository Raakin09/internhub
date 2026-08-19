'use client';
import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const savedUser = localStorage.getItem('internhub_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('internhub_user');
      }
    }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, ...data };
      }
      if (data.requiresOTP) {
        return { success: false, requiresOTP: true, ...data };
      }
      setUser(data.user);
      localStorage.setItem('internhub_user', JSON.stringify(data.user));
      return { success: true, ...data };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };
  const loginWithOTP = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otpVerified: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, ...data };
      }
      setUser(data.user);
      localStorage.setItem('internhub_user', JSON.stringify(data.user));
      return { success: true, ...data };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };
  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, ...data };
      }
      setUser(data.user);
      localStorage.setItem('internhub_user', JSON.stringify(data.user));
      return { success: true, ...data };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('internhub_user');
  };
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('internhub_user', JSON.stringify(updatedUser));
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithOTP,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
