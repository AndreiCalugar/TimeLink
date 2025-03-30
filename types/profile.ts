export interface Profile {
  id: string;
  name: string;
  bio?: string;
  profilePicture?: string;
  location?: string;
  joinDate?: string;
  coverPhoto?: string;
  socialLinks?: SocialLink[];
  privacySettings?: PrivacySettings;
}

export interface SocialLink {
  id: string;
  platform: "instagram" | "twitter" | "facebook" | "linkedin" | "other";
  url: string;
  displayName?: string;
}

export interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private";
  photoVisibility: "public" | "friends" | "private";
  locationVisibility: "public" | "friends" | "private";
  friendsVisibility: "public" | "friends" | "private";
}

export interface Event {
  id: string;
  title: string;
  date: string;
  image?: string;
  description?: string;
  location?: string;
  visibility: "public" | "friends" | "private";
  attendees?: string[]; // User IDs
}

export interface Photo {
  id: string;
  uri: string;
  caption?: string;
  date?: string;
  location?: string;
  visibility: "public" | "friends" | "private";
  likes?: number;
  eventId?: string; // Associated event, if any
}

export interface Friend {
  id: string;
  name: string;
  profilePicture?: string;
  status: "pending" | "accepted" | "blocked";
  since?: string;
}

export interface Interest {
  id: string;
  name: string;
  category?: string;
  icon?: string;
}

export interface UserInterest {
  interestId: string;
  level?: "casual" | "enthusiast" | "expert";
  private?: boolean;
}
