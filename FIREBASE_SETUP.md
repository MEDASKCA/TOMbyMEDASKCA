# Firebase Setup Guide for ProjectSocial

## Quick Setup Checklist

Follow these steps to get your app fully functional:

### ✅ Step 1: Enable Firebase Authentication

1. Go to your [Firebase Console - Authentication](https://console.firebase.google.com/project/projectsocial-78d85/authentication)
2. Click **"Get started"**
3. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle to "Enabled"
   - Click "Save"
4. Enable **Google Sign-in**:
   - Click "Google"
   - Toggle to "Enabled"
   - Enter your support email
   - Click "Save"

### ✅ Step 2: Set Up Firestore Database

1. Go to [Firestore Database](https://console.firebase.google.com/project/projectsocial-78d85/firestore)
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose your region (closest to you)
5. Click **"Enable"**

### ✅ Step 3: Update Firestore Security Rules

1. In Firestore, click the **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Teams collection
    match /teams/{teamId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;

      // Channels subcollection
      match /channels/{channelId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;

        // Messages subcollection
        match /messages/{messageId} {
          allow read: if request.auth != null;
          allow create: if request.auth != null &&
                          request.resource.data.userId == request.auth.uid;
          allow update, delete: if request.auth != null &&
                                   resource.data.userId == request.auth.uid;
        }
      }
    }

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### ✅ Step 4: Enable Firebase Storage (Optional - for file uploads)

1. Go to [Storage](https://console.firebase.google.com/project/projectsocial-78d85/storage)
2. Click **"Get started"**
3. Accept default security rules
4. Click **"Done"**

## Testing Your App

1. Refresh your browser at http://localhost:3001
2. The yellow warning should disappear
3. Sign up with a new account or sign in with Google
4. You should see the Teams interface
5. Click on a channel (e.g., "General")
6. Try sending a message - it should appear in real-time!

## Features Now Available

✅ **Authentication**
- Email/password sign up and sign in
- Google authentication
- User sessions and logout

✅ **Real-time Chat**
- Send and receive messages instantly
- Messages persist in Firestore
- Auto-scrolling message list
- User avatars and timestamps

✅ **Teams & Channels**
- Default teams: Engineering Team, Marketing
- Multiple channels per team
- Easy navigation

## Troubleshooting

### "Firebase Authentication not configured" Error
- Make sure you enabled Email/Password AND Google in Authentication
- Refresh the page after enabling

### "Permission denied" Error in Console
- Check that Firestore rules are published correctly
- Make sure you're signed in
- Verify the rules match the example above

### Messages Not Appearing
- Check browser console for errors
- Verify Firestore is created and rules are published
- Make sure you're in "test mode" for development

## Production Security (Important!)

Before deploying to production:

1. **Update Firestore Rules**: Change from test mode to production-ready rules
2. **Enable App Check**: Protect against abuse
3. **Set up proper role-based access**: Limit who can create teams/channels
4. **Review Storage Rules**: If using file uploads

## Next Steps

- Add file upload functionality
- Implement video calling
- Add user profiles
- Create team management features
- Add notifications

---

Need help? Check the Firebase documentation:
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
