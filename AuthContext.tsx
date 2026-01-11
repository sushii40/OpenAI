import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Farmer } from '@/types/dairy';

interface AuthContextType {
  farmer: Farmer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (farmerData: Omit<Farmer, 'id' | 'registeredAt' | 'selectedDairy'>) => Promise<boolean>;
  logout: () => void;
  updateFarmer: (updates: Partial<Farmer>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated farmer database (localStorage for demo)
const FARMERS_KEY = 'dairy_farmers';
const CURRENT_FARMER_KEY = 'current_farmer';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmer] = useState<Farmer | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedFarmer = localStorage.getItem(CURRENT_FARMER_KEY);
    if (savedFarmer) {
      setFarmer(JSON.parse(savedFarmer));
    }
  }, []);

  const getFarmers = (): Record<string, { farmer: Farmer; password: string }> => {
    const data = localStorage.getItem(FARMERS_KEY);
    return data ? JSON.parse(data) : {};
  };

  const saveFarmers = (farmers: Record<string, { farmer: Farmer; password: string }>) => {
    localStorage.setItem(FARMERS_KEY, JSON.stringify(farmers));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const farmers = getFarmers();
    const farmerData = farmers[email.toLowerCase()];
    
    if (farmerData && farmerData.password === password) {
      setFarmer(farmerData.farmer);
      localStorage.setItem(CURRENT_FARMER_KEY, JSON.stringify(farmerData.farmer));
      return true;
    }
    return false;
  };

  const register = async (farmerData: Omit<Farmer, 'id' | 'registeredAt' | 'selectedDairy'>): Promise<boolean> => {
    const farmers = getFarmers();
    
    if (farmers[farmerData.email.toLowerCase()]) {
      return false; // Email already exists
    }

    const newFarmer: Farmer = {
      ...farmerData,
      id: `F${Date.now()}`,
      registeredAt: new Date(),
      selectedDairy: null,
    };

    farmers[farmerData.email.toLowerCase()] = {
      farmer: newFarmer,
      password: 'demo123', // In real app, this would be from the form
    };

    saveFarmers(farmers);
    setFarmer(newFarmer);
    localStorage.setItem(CURRENT_FARMER_KEY, JSON.stringify(newFarmer));
    return true;
  };

  const logout = () => {
    setFarmer(null);
    localStorage.removeItem(CURRENT_FARMER_KEY);
  };

  const updateFarmer = (updates: Partial<Farmer>) => {
    if (!farmer) return;
    
    const updatedFarmer = { ...farmer, ...updates };
    setFarmer(updatedFarmer);
    localStorage.setItem(CURRENT_FARMER_KEY, JSON.stringify(updatedFarmer));

    // Update in farmers database
    const farmers = getFarmers();
    if (farmers[farmer.email.toLowerCase()]) {
      farmers[farmer.email.toLowerCase()].farmer = updatedFarmer;
      saveFarmers(farmers);
    }
  };

  return (
    <AuthContext.Provider value={{ farmer, isAuthenticated: !!farmer, login, register, logout, updateFarmer }}>
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
