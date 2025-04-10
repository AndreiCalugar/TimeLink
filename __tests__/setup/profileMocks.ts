import { Interest, UserInterest } from "../../types/profile";

/**
 * Mock data for interests and user interests tests
 */
export const mockInterests: Interest[] = [
  { id: "int1", name: "Hiking", category: "Outdoors", icon: "mountain" },
  { id: "int2", name: "Reading", category: "Hobbies", icon: "book" },
  { id: "int3", name: "Photography", category: "Arts", icon: "camera" },
  { id: "int4", name: "Cooking", category: "Food", icon: "food" },
  { id: "int5", name: "Travel", category: "Lifestyle", icon: "airplane" },
  { id: "int6", name: "Coding", category: "Technology", icon: "laptop-code" },
  { id: "int-travel", name: "Travel", category: "Lifestyle", icon: "airplane" },
  { id: "int-cooking", name: "Cooking", category: "Food", icon: "food" },
  { id: "int-music", name: "Music", category: "Arts", icon: "music" },
];

export const mockUserInterests: UserInterest[] = [
  { interestId: "int1", level: "enthusiast" },
  { interestId: "int2", level: "expert" },
  { interestId: "int5", level: "casual" },
];

/**
 * Mock implementation for the useProfile hook
 */
export const mockUseProfile = () => {
  const addInterest = jest.fn();
  const removeInterest = jest.fn();

  return {
    mockImplementation: (overrides = {}) => ({
      interests: mockInterests,
      userInterests: mockUserInterests,
      addInterest,
      removeInterest,
      ...overrides,
    }),
    addInterest,
    removeInterest,
  };
};

/**
 * Mock for the expo-router useRouter hook
 */
export const mockUseRouter = () => {
  const push = jest.fn();
  const back = jest.fn();

  return {
    mockImplementation: () => ({
      push,
      back,
    }),
    push,
    back,
  };
};
