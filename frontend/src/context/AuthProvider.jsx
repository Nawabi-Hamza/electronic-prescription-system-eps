import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { fetchMyProfile } from '../api/me';
import { toast } from 'react-toastify';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // to handle loading state

  const login = (userData) => setUser(userData);
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await fetchMyProfile();
          setUser(userData);
        } catch (err) {
          // console.error('Failed to fetch user profile', err?.response?.data?.message);
          toast.error(err?.response?.data?.message)
          // logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner while loading user data
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
