export interface Profile {
  id: string;
  name: string;
  bio?: string;
  profilePicture?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  image?: string;
}

export interface Photo {
  id: string;
  uri: string;
}

export interface Friend {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface Interest {
  id: string;
  name: string;
}
