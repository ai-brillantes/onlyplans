# OnlyPlans - Codebase Overview

## What It Is
Social planning app for spontaneous meetups. Create invites, share with friends, chat in real-time.

## Repos
- `tfti-sponti` - iOS app (SwiftUI, Firebase, Core Data)
- `tfti_firebase_func` - Cloud Functions (TypeScript)
- `onlyplans_ui` - Website/webapp (React, Vite, Tailwind)

## iOS App Structure (`tfti-sponti`)
```
/ViewModels     - MVVM pattern, business logic
/Views          - SwiftUI views
/Models         - Data models
/Managers       - Service managers (Image, Invite, Haptic, etc.)
/Services       - External service integrations
/Extensions     - Swift extensions
/Features       - Feature-specific modules
```

### Key ViewModels
- `InviteViewModel` - Core invite logic
- `CreateInviteViewModel` - Invite creation flow
- `UserViewModel` - User state management
- `AuthManager` - Authentication
- `FriendListViewModel` - Friend management
- `FriendRequestsViewModel` - Friend request handling

### Tech Stack
- iOS 14.0+, Swift 5.5+, SwiftUI
- Firebase (Firestore, Auth, Cloud Functions, FCM)
- Core Data for offline caching
- MapKit for location

### Design System
- Font: Satoshi
- Colors: Dark Green (#0b1512), White (#faf9f8), Bright Mint (#99c9cb), Dark Mint (#5d96a3)

## Firebase Functions (`tfti_firebase_func`)
```
/src
  /notifications  - Push notification triggers
  /sms            - Twilio SMS integration
  /rateLimiting   - API rate limiting (Dinder)
  vibeCheck.ts    - Vibe expiration
  inviteArchiver.ts - Invite cleanup
  downForArchiver.ts - "Down for" feature cleanup
```

### Exported Functions
- Notification triggers (messages, friend requests, invites, Dinder)
- Maintenance (cleanup old notifications, retry queue, invalid tokens)
- Dinder-specific (matches, swipes, expiring matches)
- Rate limiting for Dinder API

## Webapp (`onlyplans_ui`)
React + Vite + Tailwind

### Pages
- `LandingPage.tsx` - Marketing page
- `InvitePage.tsx` - View/respond to invites
- `Analytics.tsx` - Analytics dashboard
- `SpontiPage.tsx` - ?
- `PopupsPage.tsx` - ?
- Legal: PrivacyPolicy, TermsOfService

## Current Todos (from Todo.txt)
1. SMS compliance (like Partiful)
   - Sending invites via SMS
   - Batch sending app invites
   - Show invite preview before sending
   - Don't allow sending to same contact twice
   - Remove/mark users already in app
2. Error handling for invite creation failures

## Feature: Dinder
Appears to be a "Tinder for plans" matching feature:
- Swipe-based matching
- Match expiration
- Match-specific chat
- Rate limiting

## Questions for Ian
- What's the current user base / DAU?
- What's the App Store ranking situation?
- What's the biggest user complaint or drop-off point?
- Is Dinder live or in development?
- What's the priority between SMS compliance vs new features?
