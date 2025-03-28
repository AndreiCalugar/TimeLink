import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, Event, Photo, Friend, Interest } from "../types/profile";

type ProfileContextType = {
  profile: Profile | null;
  events: Event[];
  photos: Photo[];
  friends: Friend[];
  interests: Interest[];
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  uploadPhoto: (photo: Photo) => Promise<void>;
  // Additional methods as needed
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);

  // Load initial data
  useEffect(() => {
    // Mock profile data
    setProfile({
      id: "1",
      name: "John Doe",
      bio: "Enthusiastic event-goer and photographer. Love meeting new people and exploring new places!",
      profilePicture: "https://picsum.photos/200",
    });

    // Mock events data
    setEvents([
      {
        id: "1",
        title: "Summer Beach Party",
        date: "2024-07-15",
        image: "https://picsum.photos/300/200",
      },
      {
        id: "2",
        title: "Tech Conference 2024",
        date: "2024-08-20",
        image: "https://picsum.photos/301/200",
      },
      {
        id: "3",
        title: "Music Festival",
        date: "2024-09-10",
        image: "https://picsum.photos/302/200",
      },
    ]);

    // Mock photos data
    setPhotos([
      { id: "1", uri: "https://picsum.photos/400" },
      { id: "2", uri: "https://picsum.photos/401" },
      { id: "3", uri: "https://picsum.photos/402" },
      { id: "4", uri: "https://picsum.photos/403" },
      { id: "5", uri: "https://picsum.photos/404" },
      { id: "6", uri: "https://picsum.photos/405" },
    ]);

    // Mock friends data
    setFriends([
      {
        id: "1",
        name: "Jane Smith",
        profilePicture: "https://picsum.photos/201",
      },
      {
        id: "2",
        name: "Mike Johnson",
        profilePicture: "https://picsum.photos/202",
      },
      {
        id: "3",
        name: "Sarah Williams",
        profilePicture: "https://picsum.photos/203",
      },
      {
        id: "4",
        name: "Tom Brown",
        profilePicture: "https://picsum.photos/204",
      },
      {
        id: "5",
        name: "Emily Davis",
        profilePicture: "https://picsum.photos/205",
      },
      {
        id: "6",
        name: "Chris Wilson",
        profilePicture: "https://picsum.photos/206",
      },
    ]);

    // Mock interests data
    setInterests([
      { id: "1", name: "Photography" },
      { id: "2", name: "Travel" },
      { id: "3", name: "Music" },
      { id: "4", name: "Technology" },
      { id: "5", name: "Food" },
      { id: "6", name: "Sports" },
    ]);
  }, []);

  const updateProfile = async (data: Partial<Profile>) => {
    // In a real app, send to API
    setProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  const uploadPhoto = async (photo: Photo) => {
    // In a real app, upload to server
    setPhotos((prev) => [...prev, photo]);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        events,
        photos,
        friends,
        interests,
        updateProfile,
        uploadPhoto,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};
