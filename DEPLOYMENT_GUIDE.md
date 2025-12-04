# Anonymous Feedback Board - Deployment Guide

## Prerequisites
- Google account for Firebase
- Node.js installed (for Firebase CLI)

## Step 1: Setup Firebase Project

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com/
   - Click "Add project" or "Create a project"
   - Name it (e.g., "anonymous-feedback")
   - Follow the setup wizard

2. **Enable Firestore Database**
   - In your Firebase project, click "Firestore Database" in the left menu
   - Click "Create database"
   - Choose "Start in test mode" (or production mode with rules)
   - Select a location closest to your users
   - Click "Enable"

3. **Set Firestore Security Rules**
   - In Firestore, go to "Rules" tab
   - Replace with this configuration:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /feedback/{document} {
         allow read: if true;
         allow create: if true;
         allow delete: if true;
       }
     }
   }
   ```
   - Click "Publish"

4. **Get Firebase Config**
   - In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
   - Click "Project settings"
   - Scroll down to "Your apps" section
   - Click the web icon `</>` to add a web app
   - Register app with a nickname (e.g., "feedback-web")
   - Copy the `firebaseConfig` object shown

5. **Update script.js**
   - Open `script.js` in your project
   - Replace the firebaseConfig object (lines 7-11) with your actual config:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```

## Step 2: Deploy Your App

### Option A: Firebase Hosting (Recommended - FREE)

1. **Install Firebase CLI**
   ```powershell
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```powershell
   firebase login
   ```

3. **Initialize Firebase in your project**
   ```powershell
   cd "d:\aa webapp\firstwebpage"
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory: `.` (current directory)
   - Configure as single-page app: **No**
   - Don't overwrite index.html

4. **Deploy**
   ```powershell
   firebase deploy --only hosting
   ```

5. **Access your app**
   - Firebase will provide a URL like: `https://your-project.web.app`
   - Share this URL with anyone to access your feedback board!

### Option B: GitHub Pages (FREE)

1. **Push to GitHub**
   - Create a repository on GitHub
   - Push your files:
   ```powershell
   git add .
   git commit -m "Deploy anonymous feedback app"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Source: Deploy from branch "main"
   - Folder: / (root)
   - Save

3. **Access your app**
   - URL will be: `https://yourusername.github.io/repositoryname`

### Option C: Netlify (FREE)

1. **Go to https://app.netlify.com/**
2. **Drag and drop your project folder** to deploy
3. **Get your live URL** instantly

## Step 3: Test Your App

1. Open the deployed URL in your browser
2. Send a test message
3. Open the same URL on another device/computer
4. You should see the message appear in real-time!

## Admin Panel

- Default admin password: `admin123`
- Change this in `script.js` (line 2) before deploying for security

## Troubleshooting

- **Messages not saving**: Check Firebase config is correct
- **Can't delete messages**: Login as admin first
- **Firestore errors**: Check Firestore rules allow read/write/delete
- **App not loading**: Ensure all files (index.html, script.js, style.css) are deployed

## Security Notes

1. **Change admin password** in script.js before deploying
2. **Update Firestore rules** for production:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /feedback/{document} {
         allow read: if true;
         allow create: if request.resource.data.keys().hasOnly(['msg', 'time'])
                       && request.resource.data.msg is string
                       && request.resource.data.msg.size() <= 1000;
         allow delete: if true; // In production, add admin authentication
       }
     }
   }
   ```
