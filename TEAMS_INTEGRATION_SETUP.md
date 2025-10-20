# Microsoft Teams Integration Setup Guide

This guide will walk you through setting up proper Microsoft Teams integration for ProjectSocial using Azure AD and the Teams JavaScript SDK.

## Overview

Proper Teams integration requires:
1. Azure AD App Registration
2. Microsoft Teams App Registration
3. Teams JavaScript SDK implementation
4. Proper authentication flow

## Prerequisites

- Microsoft 365 account (work/school account)
- Azure subscription (free tier works)
- Administrator access to Azure AD (or approval from your admin)
- Your ProjectSocial app running on a public URL (for callbacks)

---

## Part 1: Azure AD App Registration (15 minutes)

### Step 1: Access Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your Microsoft 365 account
3. Search for "Azure Active Directory" in the search bar
4. Click on **Azure Active Directory**

### Step 2: Register a New Application

1. In the left sidebar, click **App registrations**
2. Click **+ New registration** at the top
3. Fill in the details:
   - **Name**: `ProjectSocial Teams Integration`
   - **Supported account types**: Select one of:
     - "Accounts in this organizational directory only" (Single tenant - for your organization only)
     - "Accounts in any organizational directory" (Multi-tenant - if you want others to use it)
   - **Redirect URI**:
     - Platform: **Single-page application (SPA)**
     - URI: `http://localhost:3001/auth/callback` (for development)
     - Add: `https://yourdomain.com/auth/callback` (for production)
4. Click **Register**

### Step 3: Note Your Application IDs

After registration, you'll see the **Overview** page. Copy these values:

```
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Directory (tenant) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Save these!** You'll need them for your `.env.local` file.

### Step 4: Configure API Permissions

1. In the left sidebar, click **API permissions**
2. Click **+ Add a permission**
3. Select **Microsoft Graph**
4. Choose **Delegated permissions**
5. Add these permissions:
   - `User.Read` (should already be there)
   - `Chat.ReadWrite`
   - `Channel.ReadBasic.All`
   - `ChannelMessage.Read.All`
   - `Team.ReadBasic.All`
   - `TeamMember.Read.All`
6. Click **Add permissions**
7. Click **Grant admin consent for [Your Organization]** (requires admin)
   - If you're not an admin, request approval from your IT admin

### Step 5: Configure Authentication

1. In the left sidebar, click **Authentication**
2. Under **Implicit grant and hybrid flows**, check:
   - ✅ **Access tokens**
   - ✅ **ID tokens**
3. Under **Advanced settings**:
   - **Allow public client flows**: No
4. Click **Save**

### Step 6: Add Client Secret (Optional - for server-side operations)

1. In the left sidebar, click **Certificates & secrets**
2. Click **+ New client secret**
3. Description: `ProjectSocial Secret`
4. Expires: Choose your preference (6 months, 12 months, or 24 months)
5. Click **Add**
6. **IMPORTANT**: Copy the **Value** immediately (it won't be shown again!)

---

## Part 2: Microsoft Teams App Registration (20 minutes)

### Step 1: Access Teams Developer Portal

1. Go to [Teams Developer Portal](https://dev.teams.microsoft.com)
2. Sign in with the same Microsoft 365 account
3. Click **Apps** in the left sidebar
4. Click **+ New app**

### Step 2: Create Teams App

1. **Basic Information**:
   - App name: `ProjectSocial`
   - Short description: `Team collaboration platform`
   - Full description: `A comprehensive collaboration platform integrating chat, files, and team management`
   - Developer/Company name: Your name/organization
   - Website: `http://localhost:3001` (or your domain)
   - Privacy policy: `http://localhost:3001/privacy` (create this page later)
   - Terms of use: `http://localhost:3001/terms` (create this page later)
   - Application (client) ID: **Paste the Client ID from Azure AD**

2. **App icons**:
   - Color icon: 192x192 PNG (create a simple logo)
   - Outline icon: 32x32 PNG (transparent, white outline)

3. **Branding**:
   - Accent color: `#0d9488` (your teal color)
   - Click **Save**

### Step 3: Configure Capabilities

1. Click **App features** in the left sidebar
2. Add **Personal app**:
   - Click **Personal app**
   - Click **Create your first personal app tab**
   - Name: `Home`
   - Entity ID: `home`
   - Content URL: `http://localhost:3001/teams/tab` (we'll create this)
   - Website URL: `http://localhost:3001`
   - Click **Save**

### Step 4: Configure Domains

1. Click **Domains** in the left sidebar
2. Add: `localhost:3001` (for development)
3. Add your production domain when ready
4. Click **Save**

### Step 5: Download App Package

1. Click **Publish** in the left sidebar
2. Click **Download the app package**
3. Save the `.zip` file

---

## Part 3: Configure Your ProjectSocial App (30 minutes)

### Step 1: Update Environment Variables

Edit your `.env.local` file:

```env
# Existing Firebase config...
NEXT_PUBLIC_FIREBASE_API_KEY=...
# (keep all existing Firebase variables)

# Microsoft Teams / Azure AD Configuration
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id-from-azure
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id-from-azure
NEXT_PUBLIC_TEAMS_APP_ID=your-teams-app-id

# Optional: For server-side operations
AZURE_CLIENT_SECRET=your-client-secret-if-created
```

### Step 2: Install Teams SDK

Run in your project directory:

```bash
npm install @microsoft/teams-js @azure/msal-browser
```

### Step 3: Restart Your Dev Server

After installing packages:
1. Stop the current dev server (Ctrl+C)
2. Run `npm run dev` again

---

## Part 4: Test Your Integration

### Option 1: Test in Teams Web

1. Go to [Microsoft Teams](https://teams.microsoft.com)
2. Click **Apps** in the left sidebar
3. Click **Manage your apps** at the bottom
4. Click **Upload an app**
5. Choose **Upload a custom app**
6. Select your downloaded `.zip` file
7. Click **Add** to install the app

### Option 2: Test in Teams Desktop

1. Open Microsoft Teams desktop app
2. Click **Apps** in the left sidebar
3. Click **Manage your apps**
4. Click **Upload a custom app**
5. Select your `.zip` file
6. Click **Add**

---

## Troubleshooting

### "App not found" error
- Verify your Azure AD app is in the same tenant as Teams
- Check that the Client ID matches in both Azure and Teams Developer Portal

### "Permission denied" error
- Ensure admin consent was granted in Azure AD
- Wait 5-10 minutes after granting consent

### "Cannot load tab" error
- Verify your app is running on the configured URL
- Check that the Content URL in Teams Developer Portal is correct
- Ensure the URL is HTTPS in production (required by Teams)

---

## Production Deployment

Before going live:

1. **Use HTTPS**: Teams requires HTTPS for all production apps
2. **Update Redirect URIs**: Add your production domain to Azure AD
3. **Update Teams App**: Update all URLs in Teams Developer Portal
4. **Create Privacy & Terms pages**: Required for Teams app store submission
5. **Test thoroughly**: Test all features in both Teams web and desktop
6. **Submit to App Store**: Optional - submit to Teams app store for wider distribution

---

## Next Steps

Once you have the Azure AD app registered:

1. I'll create the authentication components
2. I'll implement the Teams SDK integration
3. I'll create the Teams tab page
4. We'll test the integration

**Ready to proceed?** Make sure you have:
- ✅ Azure AD app registered
- ✅ Application (client) ID
- ✅ Directory (tenant) ID
- ✅ Admin consent granted (or requested)

Let me know when you've completed the Azure AD registration and I'll help you implement the code!

---

## Useful Links

- [Azure Portal](https://portal.azure.com)
- [Teams Developer Portal](https://dev.teams.microsoft.com)
- [Teams SDK Documentation](https://learn.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/using-teams-client-sdk)
- [Azure AD App Registration](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [MSAL.js Documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
