import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Profile,
  Event,
  Photo,
  Friend,
  Interest,
  UserInterest,
} from "../types/profile";
import { EventVisibility } from "./CalendarContext";
import { useUser } from "./UserContext";

interface ProfileContextType {
  profile: Profile | null;
  events: Event[];
  photos: Photo[];
  friends: Friend[];
  interests: Interest[];
  userInterests: UserInterest[];
  isLoading: boolean;
  updateProfile: (updatedProfile: Partial<Profile>) => void;
  uploadPhoto: (photo: Omit<Photo, "id">) => void;
  deletePhoto: (photoId: string) => void;
  updatePhotoVisibility: (
    photoId: string,
    visibility: "public" | "friends" | "private"
  ) => void;
  addFriend: (
    friendId: string,
    friendName: string,
    profilePicture?: string
  ) => void;
  removeFriend: (friendId: string) => void;
  acceptFriendRequest: (friendId: string) => void;
  blockFriend: (friendId: string) => void;
  addInterest: (
    interestId: string,
    level?: "casual" | "enthusiast" | "expert",
    isPrivate?: boolean
  ) => void;
  removeInterest: (interestId: string) => void;
  getVisibleEvents: (viewerId?: string) => Event[];
  getVisiblePhotos: (viewerId?: string) => Photo[];
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This would normally be a fetch from an API
    if (user) {
      const mockProfile: Profile = {
        id: user.id,
        name: user.name || "User",
        bio: "TimeLink enthusiast and event organizer",
        profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
        location: "New York, NY",
        joinDate: "2023-01-15",
        coverPhoto:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        privacySettings: {
          profileVisibility: "public",
          photoVisibility: "friends",
          locationVisibility: "friends",
          friendsVisibility: "public",
        },
      };

      const mockEvents: Event[] = [
        {
          id: "1",
          title: "Weekend Hiking",
          date: "2023-06-10",
          image: "https://images.unsplash.com/photo-1551632811-561732d1e306",
          description: "A fun weekend hike in the mountains",
          location: "Blue Mountain Trails",
          visibility: "public",
          attendees: ["user2", "user3"],
        },
        {
          id: "2",
          title: "Book Club Meeting",
          date: "2023-06-15",
          image: "https://images.unsplash.com/photo-1513001900722-370f803f498d",
          description: 'Discussing "The Midnight Library"',
          location: "Virtual",
          visibility: "friends",
          attendees: ["user4", "user5"],
        },
        {
          id: "3",
          title: "Doctor Appointment",
          date: "2023-06-18",
          description: "Annual checkup",
          location: "City Medical Center",
          visibility: "private",
        },
      ];

      const mockPhotos: Photo[] = [
        {
          id: "1",
          uri: "https://images.unsplash.com/photo-1527525443983-6e60c75fff46",
          caption: "Summer vacation",
          date: "2023-05-20",
          location: "Miami Beach",
          visibility: "public",
          likes: 24,
        },
        {
          id: "2",
          uri: "https://images.unsplash.com/photo-1543269865-cbf427effbad",
          caption: "Team lunch",
          date: "2023-05-10",
          location: "Downtown Cafe",
          visibility: "friends",
          likes: 12,
        },
        {
          id: "3",
          uri: "https://images.unsplash.com/photo-1501238295340-c810d3c156d2",
          caption: "Birthday celebration",
          date: "2023-04-15",
          location: "Home",
          visibility: "private",
          likes: 5,
        },
      ];

      const mockFriends: Friend[] = [
        {
          id: "user2",
          name: "Jane Smith",
          profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
          status: "accepted",
          since: "2023-02-10",
        },
        {
          id: "user3",
          name: "Mike Johnson",
          profilePicture: "https://randomuser.me/api/portraits/men/45.jpg",
          status: "accepted",
          since: "2023-03-05",
        },
        {
          id: "user4",
          name: "Sarah Davis",
          profilePicture: "https://randomuser.me/api/portraits/women/22.jpg",
          status: "pending",
          since: "2023-05-30",
        },
      ];

      const mockInterests: Interest[] = [
        { id: "int1", name: "Hiking", category: "Outdoors", icon: "mountain" },
        { id: "int2", name: "Reading", category: "Hobbies", icon: "book" },
        { id: "int3", name: "Photography", category: "Arts", icon: "camera" },
        { id: "int4", name: "Cooking", category: "Food", icon: "utensils" },
        { id: "int5", name: "Traveling", category: "Lifestyle", icon: "plane" },
        {
          id: "int6",
          name: "Coding",
          category: "Technology",
          icon: "laptop-code",
        },
      ];

      const mockUserInterests: UserInterest[] = [
        { interestId: "int1", level: "enthusiast" },
        { interestId: "int2", level: "expert" },
        { interestId: "int5", level: "casual" },
      ];

      setProfile(mockProfile);
      setEvents(mockEvents);
      setPhotos(mockPhotos);
      setFriends(mockFriends);
      setInterests(mockInterests);
      setUserInterests(mockUserInterests);

      // Simulate API loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  const updateProfile = (updatedProfile: Partial<Profile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : null));
  };

  const uploadPhoto = (photo: Omit<Photo, "id">) => {
    const newPhoto: Photo = {
      ...photo,
      id: Date.now().toString(),
    };
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const deletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const updatePhotoVisibility = (
    photoId: string,
    visibility: "public" | "friends" | "private"
  ) => {
    setPhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId ? { ...photo, visibility } : photo
      )
    );
  };

  const addFriend = (
    friendId: string,
    friendName: string,
    profilePicture?: string
  ) => {
    const existingFriend = friends.find((f) => f.id === friendId);
    if (existingFriend) return;

    const newFriend: Friend = {
      id: friendId,
      name: friendName,
      profilePicture,
      status: "pending",
      since: new Date().toISOString().split("T")[0],
    };
    setFriends((prev) => [...prev, newFriend]);
  };

  const removeFriend = (friendId: string) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
  };

  const acceptFriendRequest = (friendId: string) => {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === friendId ? { ...friend, status: "accepted" } : friend
      )
    );
  };

  const blockFriend = (friendId: string) => {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === friendId ? { ...friend, status: "blocked" } : friend
      )
    );
  };

  const addInterest = (
    interestId: string,
    level: "casual" | "enthusiast" | "expert" = "casual",
    isPrivate: boolean = false
  ) => {
    const existingInterest = userInterests.find(
      (i) => i.interestId === interestId
    );
    if (existingInterest) return;

    const newUserInterest: UserInterest = {
      interestId,
      level,
      private: isPrivate,
    };
    setUserInterests((prev) => [...prev, newUserInterest]);
  };

  const removeInterest = (interestId: string) => {
    setUserInterests((prev) =>
      prev.filter((interest) => interest.interestId !== interestId)
    );
  };

  // Function to get events based on viewer's relationship to the profile owner
  const getVisibleEvents = (viewerId?: string): Event[] => {
    // If it's the profile owner viewing
    if (user && viewerId === user.id) {
      return events;
    }

    // If it's a friend viewing
    const isFriend =
      viewerId &&
      friends.some((f) => f.id === viewerId && f.status === "accepted");

    return events.filter((event) => {
      if (event.visibility === "public") return true;
      if (event.visibility === "friends" && isFriend) return true;
      return false;
    });
  };

  // Function to get photos based on viewer's relationship to the profile owner
  const getVisiblePhotos = (viewerId?: string): Photo[] => {
    // If it's the profile owner viewing
    if (user && viewerId === user.id) {
      return photos;
    }

    // If it's a friend viewing
    const isFriend =
      viewerId &&
      friends.some((f) => f.id === viewerId && f.status === "accepted");

    return photos.filter((photo) => {
      if (photo.visibility === "public") return true;
      if (photo.visibility === "friends" && isFriend) return true;
      return false;
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        events,
        photos,
        friends,
        interests,
        userInterests,
        isLoading,
        updateProfile,
        uploadPhoto,
        deletePhoto,
        updatePhotoVisibility,
        addFriend,
        removeFriend,
        acceptFriendRequest,
        blockFriend,
        addInterest,
        removeInterest,
        getVisibleEvents,
        getVisiblePhotos,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
