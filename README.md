# ProjectSocial - Microsoft Teams Clone

A modern, real-time collaboration platform built with Next.js, Firebase, and TypeScript. Features include team channels, real-time chat, file sharing, and video calls.

## Features

- **Authentication**: Email/Password and Google Sign-In
- **Teams & Channels**: Organize conversations into teams and channels
- **Real-time Chat**: Instant messaging with Firebase Firestore
- **File Sharing**: Upload and share files using Firebase Storage
- **Video Calls**: WebRTC-powered video conferencing
- **Modern UI**: Microsoft Teams-inspired interface

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Real-time**: Firebase Firestore
- **Video**: WebRTC (simple-peer)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase project (create one at [firebase.google.com](https://firebase.google.com))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore Database (test mode)
   - Enable Storage
   - Get your Firebase config from Project Settings

3. **Configure environment variables**

   Edit `.env.local` and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Current Status

The app includes:
- ✅ Authentication with Firebase
- ✅ Microsoft Teams-inspired UI
- ✅ Teams and channels structure
- ✅ Chat interface
- 🚧 Real-time messaging (ready for Firebase integration)
- 🚧 File sharing
- 🚧 Video calls

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## License

MIT License
