# TOM - Quick Start Guide

## 📍 Project Location

```
C:\Users\forda\projectsocial
```

## ⚡ Quick Commands

```bash
# Navigate to project
cd C:\Users\forda\projectsocial

# Start development server
npm run dev
# Runs on: http://localhost:3001

# Install new packages
npm install [package-name]
```

## 🔑 Current Credentials

### Firebase
- Project: `projectsocial-78d85`
- Configured in: `.env.local`

### Azure AD (Microsoft Teams)
- Client ID: `8bf25c98-99b9-4e49-886d-f5073428011c`
- Tenant ID: `204a7018-a216-4ae0-95cf-f30fc906e1c7`
- Configured in: `.env.local`

## 📁 Key Files to Edit

### Main Pages
- `/app/page.tsx` - Login page
- `/app/layout.tsx` - Root layout
- `/components/layout/MainLayout.tsx` - Main app container

### Features to Build
- `/features/roster/` - Staff roster management (CREATE THIS)
- `/features/inventory/` - Inventory tracking (CREATE THIS)
- `/features/theatres/` - Theatre schedule (CREATE THIS)

### Styling
- `/app/globals.css` - Global styles
- `tailwind.config.ts` - Tailwind configuration

### Database
- `/lib/firebase.ts` - Firebase config
- `/lib/initializeFirestore.ts` - Initialize default data

## 🎯 Current Status

✅ **Completed:**
- Next.js app setup
- Firebase authentication
- Azure AD integration
- Microsoft Teams SDK
- Basic chat functionality
- Dark mode
- Top navigation

🚧 **To Build:**
1. Rebrand to TOM
2. Theatre schedule dashboard
3. Staff roster management
4. Inventory tracking
5. Theatre readiness view
6. Notifications system

## 🚀 Next Steps

1. **Update branding** to "TOM - Theatre Operations Manager"
2. **Create database schema** in Firestore
3. **Build theatre schedule** view
4. **Build staff roster** system
5. **Build inventory** tracker
6. **Create readiness** dashboard

## 📝 Resume Development Prompt

When you come back, tell Claude:

```
I'm working on TOM (Theatre Operations Manager) at C:\Users\forda\projectsocial.
It's a production-grade NHS theatre operations platform combining roster and
inventory management. The basic app structure is ready with Firebase and Azure AD
integrated. Let's continue building [specific feature]. Make it commercial-grade!
```

## 🔗 Important Links

- Dev Server: http://localhost:3001
- Project Summary: `PROJECT_SUMMARY.md`
- Teams Setup Guide: `TEAMS_INTEGRATION_SETUP.md`
- Firebase Console: https://console.firebase.google.com/project/projectsocial-78d85
- Azure Portal: https://portal.azure.com

## 💾 Backup Reminder

**IMPORTANT:** Set up Git and push to GitHub!

```bash
git init
git add .
git commit -m "Initial commit: TOM Theatre Operations Manager"
git remote add origin [your-github-repo-url]
git push -u origin main
```

This ensures you never lose your work!

---

**Keep building. TOM is going to be incredible!** 🚀🏥
