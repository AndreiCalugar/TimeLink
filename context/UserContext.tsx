import React, { createContext, useContext, useState, ReactNode } from "react";

// Define types for user profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  location?: string;
  joinDate?: string;
}

// Define the context type
interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  updateUserField: (field: keyof UserProfile, value: string) => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  userProfile: null,
  setUserProfile: () => {},
  updateUserField: () => {},
  isLoggedIn: false,
  login: async () => false,
  logout: () => {},
});

// Context provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Mock user data - in a real app, this would come from authentication and API
  const mockUser: UserProfile = {
    id: "user123",
    name: "Jamie Smith",
    email: "jamie.smith@example.com",
    bio: "Exploring the intersection of technology and creativity. Love traveling and good coffee!",
    avatar: "https://i.pravatar.cc/300?u=jamie",
    location: "San Francisco, CA",
    joinDate: "2022-05-15",
  };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(mockUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Set to true for demo purposes

  // Update a specific field in the user profile
  const updateUserField = (field: keyof UserProfile, value: string) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        [field]: value,
      });
    }
  };

  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would make an API call here to authenticate
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, any login succeeds
      setUserProfile(mockUser);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUserProfile(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        setUserProfile,
        updateUserField,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUserContext = () => useContext(UserContext);
