# Enhanced User Profiles

This document describes the enhanced user profiles feature of TimeLink.

## Overview

The enhanced profiles feature provides users with a comprehensive profile page that includes:

- Profile Header with user details
- Interest management
- Photo gallery
- Friends section
- Event overview

## Directory Structure

```
app/
  (tabs)/profile/           - Main profile screens (tabbed view)
    index.tsx               - Profile screen (view mode)
    edit.tsx                - Profile editing
    interests.tsx           - Interests management
    add-friend.tsx          - Friend management
    upload-photo.tsx        - Photo upload
  profile/
    index.tsx               - Redirect to tabbed profile

components/profile/
  ProfileHeader.tsx         - Header with user info and cover image
  InterestsSection.tsx      - Interests display and management
  FriendsSection.tsx        - Friends list and management
  PhotoGallery.tsx          - Photo grid display
  EventCard.tsx             - Event card component

context/
  ProfileContext.tsx        - Profile data management
  UserContext.tsx           - User authentication and info
```

## Key Components

### ProfileHeader

Displays the user's name, profile picture, cover photo, location, and join date. Provides an "Edit Profile" button.

### InterestsSection

Shows the user's interests with color-coded interest levels:

- Casual (blue)
- Enthusiast (green)
- Expert (orange)

Each interest has an associated icon and can be managed through the interests screen.

### FriendsSection

Displays the user's friends with their profile pictures. Provides options to add new friends and manage friend requests.

### PhotoGallery

Displays the user's photos in a grid format. Provides an "Add Photo" button for uploading new images.

## Routes and Navigation

- `/(tabs)/profile`: Main profile view with tabs for different sections
- `/(tabs)/profile/edit`: Edit user profile details
- `/(tabs)/profile/interests`: Manage user interests
- `/(tabs)/profile/add-friend`: Add and manage friends
- `/(tabs)/profile/upload-photo`: Upload photos to the profile

## Context Providers

### ProfileContext

Provides profile data including:

- User profile information
- Friends list
- Photo gallery
- Interests
- Events

### UserContext

Handles user authentication and basic user information.

## Testing

Tests for the profile feature are located in:

```
__tests__/
  components/profile/       - Tests for profile components
  context/                  - Tests for context providers
  screens/                  - Tests for profile screens
```

## Design Choices

1. **Tab-based Navigation**: Organizes profile content into tabs for better mobile experience.
2. **Component Modularization**: Each profile section is a reusable component.
3. **Context API**: Uses React Context for state management across the profile feature.
4. **Custom Theme**: Applied consistent theming across all profile components.
5. **Optimized Loading**: Added proper loading states and error handling.

## Future Enhancements

1. Profile privacy settings
2. Social media integrations
3. Profile analytics
4. Enhanced photo editing
5. Expanded interest categories with recommendations
