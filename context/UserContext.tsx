import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define types for user profile
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
}

// Define the context type
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

// Create context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// Context provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a default mock user
  const createMockUser = async () => {
    // Mock user data for demonstration
    const mockUser: User = {
      id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "TimeLink enthusiast and event organizer",
      location: "New York, NY",
      joinDate: "2023-01-15",
    };

    setUser(mockUser);
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));
    return mockUser;
  };

  useEffect(() => {
    // Check if user is logged in (AsyncStorage)
    const checkLoggedIn = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          setUser(JSON.parse(userString));
        } else {
          // Auto-create a mock user for demo/development
          await createMockUser();
        }
      } catch (error) {
        console.error("Failed to get user from storage", error);
        // If there's an error, create a mock user anyway
        await createMockUser();
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // This would normally validate with an API
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data (in a real app, this would come from the API)
      const mockUser: User = {
        id: "user1",
        name: "John Doe",
        email: email,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        bio: "TimeLink enthusiast and event organizer",
        location: "New York, NY",
        joinDate: "2023-01-15",
      };

      setUser(mockUser);
      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // This would normally register with an API
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new user (in a real app, this would be created via API)
      const newUser: User = {
        id: Date.now().toString(), // Would come from backend
        name,
        email,
        joinDate: new Date().toISOString().split("T")[0],
      };

      setUser(newUser);
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    // Clear user data
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  const updateUser = async (data: Partial<User>): Promise<void> => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
