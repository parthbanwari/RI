import { useState, useEffect } from 'react';
import { getCurrentUser, saveUser, clearUser } from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email && password) {
      saveUser(email);
      setUser(email);
      return true;
    }
    return false;
  };

  const logout = () => {
    clearUser();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};