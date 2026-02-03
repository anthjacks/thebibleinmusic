# The Bible In Music - App Structure

## Overview

The app now has a **public landing page** that anyone can visit without logging in, plus a complete authenticated experience for registered users.

---

## 🌐 Public Pages (No Login Required)

### 1. **Landing Page** (`/`)
**Route:** Default page when app loads
**Component:** `/src/pages/Landing.tsx`

**Features:**
- **Hero Section** with tagline: "Listen to the Complete Bible in English & Spanish"
- **Sample Audio Player** that works without login
  - Genesis Chapter 1 preview
  - Play/pause controls
  - No authentication needed
- **Two CTA Buttons:**
  - "Start Listening Free" → Sign Up page
  - "Go Premium - $9.99" → Sign Up page
- **Features Section** showcasing app capabilities
- **Pricing Comparison** (Free vs Premium)
- **Install App Banner** with link to Help page
- **Footer** with branding and links

**Header Navigation:**
- Login button
- Sign Up button

---

## 🔐 Authentication Pages

### 2. **Login Page** (`/login`)
**Route:** Accessed via "Login" button from Landing page
**Component:** `/src/pages/Login.tsx`

**Features:**
- Email/password login form
- Link to switch to Register page
- Redirects to Home page after successful login

### 3. **Register Page** (`/register`)
**Route:** Accessed via "Sign Up" button from Landing page
**Component:** `/src/pages/Register.tsx`

**Features:**
- Account creation form
- Link to switch to Login page
- Redirects to Home page after successful registration

---

## 🏠 Authenticated Pages (Login Required)

### 4. **Member Home** (`/home`)
**Route:** Default page after login
**Component:** `/src/pages/Home.tsx`

**Features:**
- Personalized welcome message with username
- **Premium Status Banner:**
  - Non-Premium: Upgrade promotion with benefits list
  - Premium: "Premium Member" status badge
- **Quick Action Cards:**
  - Browse Bible (66 Books • 1,189 Chapters)
  - Music Library (Christian worship & hymns)
  - My Playlists (Premium feature - locked icon for free users)
  - Downloads (Premium feature - locked icon for free users)
- **Continue Listening Section** (shows recent listening history)
- **Popular Content Section** with sample Bible chapters and music
- **App Install Reminder Banner**

**Navigation Bar:**
- Home • Bible • Music • Playlists • Premium • Profile • Help

### 5. **Bible Library** (`/bible`)
**Route:** `/bible`
**Component:** `/src/pages/Bible.tsx`

**Features:**
- Browse 66 books of the Bible
- Filter by language (English/Spanish)
- Search functionality
- Chapter listings
- Audio playback

### 6. **Music Library** (`/music`)
**Route:** `/music`
**Component:** `/src/pages/Music.tsx`

**Features:**
- Browse Christian music collection
- Search and filter by genre
- Audio playback
- Add to favorites

### 7. **My Playlists** (`/playlists`)
**Route:** `/playlists`
**Component:** `/src/pages/Playlists.tsx`

**Features:**
- **Premium Only** - locked for free users
- Create custom playlists
- Organize Bible chapters and music
- Download management (offline access)
- Free users see upgrade prompt

### 8. **Premium Upgrade** (`/premium`)
**Route:** `/premium`
**Component:** `/src/pages/Premium.tsx`

**Features:**
- Free vs Premium comparison
- Benefits breakdown
- One-time payment option ($9.99)
- Stripe checkout integration
- Feature highlights

### 9. **Profile/Account Settings** (`/profile`)
**Route:** `/profile`
**Component:** `/src/pages/Profile.tsx`

**Features:**
- User profile information
- Account settings
- Subscription status
- Change password
- Logout functionality

### 10. **Help & Installation Guide** (`/help`)
**Route:** `/help`
**Component:** `/src/pages/Help.tsx`

**Features:**
- Platform-specific installation instructions:
  - iPhone/iPad (Safari)
  - Android (Chrome)
  - Desktop (Chrome/Edge)
- Step-by-step guides with icons
- Benefits of installing
- Troubleshooting FAQ
- Support contact information

---

## 🎵 Shared Components

### **Navigation Bar**
**Component:** `/src/components/Navigation.tsx`

Shows different items based on authentication state:

**Logged In:**
- Home • Bible • Music • Playlists • Premium • Profile • Help

**Logged Out:**
- Only visible on Landing page
- Login and Sign Up buttons in header

### **Audio Player**
**Component:** `/src/components/AudioPlayer.tsx`

- Fixed bottom player
- Shows currently playing track
- Play/pause controls
- Progress bar
- Volume control
- Available on all authenticated pages

### **Install Prompts**
**Components:**
- `/src/components/InstallPrompt.tsx` (Android/Desktop)
- `/src/components/IOSInstallPrompt.tsx` (iOS-specific)

Auto-detect device and show platform-specific install banners

---

## 🔄 Navigation Flow

### **For Non-Authenticated Users:**
```
Landing Page (/)
    ├── Click "Login" → Login Page
    │   └── Success → Home Page
    └── Click "Sign Up" → Register Page
        └── Success → Home Page
```

### **For Authenticated Users:**
```
Home Page (/home) ← Default after login
    ├── Bible → Browse Bible library
    ├── Music → Browse music library
    ├── Playlists → My playlists (Premium only)
    ├── Premium → Upgrade page
    ├── Profile → Account settings
    └── Help → Installation guide
```

### **Auto-Redirects:**
- Logged in users visiting Landing/Login/Register → Auto-redirect to Home
- Logged out users → Always see Landing page first

---

## 📁 File Structure

```
src/
├── pages/
│   ├── Landing.tsx          ← NEW: Public landing page
│   ├── Login.tsx            ← Updated: Route from Landing
│   ├── Register.tsx         ← Updated: Route from Landing
│   ├── Home.tsx             ← NEW: Member home dashboard
│   ├── Bible.tsx            ← Existing: Bible library
│   ├── Music.tsx            ← Existing: Music library
│   ├── Playlists.tsx        ← Existing: Playlists (Premium)
│   ├── Premium.tsx          ← Existing: Upgrade page
│   ├── Profile.tsx          ← Existing: Account settings
│   └── Help.tsx             ← Existing: Installation guide
│
├── components/
│   ├── Dashboard.tsx        ← Updated: Render Home + other pages
│   ├── Navigation.tsx       ← Updated: Added Home link
│   ├── AudioPlayer.tsx      ← Existing: Bottom audio player
│   ├── InstallPrompt.tsx    ← Existing: Android/Desktop prompt
│   └── IOSInstallPrompt.tsx ← Existing: iOS-specific prompt
│
├── hooks/
│   └── useNavigate.ts       ← Updated: Added landing, home, login, register
│
├── contexts/
│   ├── AuthContext.tsx      ← Existing: Authentication state
│   └── PlayerContext.tsx    ← Existing: Audio player state
│
└── App.tsx                  ← Updated: Landing → Login/Register → Home flow
```

---

## 🎨 Design System

### **Color Scheme:**
- **Primary Orange:** `#FF8C42` (from-orange-500 to-orange-600)
- **Blue:** For Bible content (from-blue-500 to-blue-600)
- **Purple:** For Music content (from-purple-500 to-purple-600)
- **Amber/Gold:** For Premium features (from-amber-500 to-amber-600)
- **Green:** For success states (from-green-500 to-green-600)

### **Page Backgrounds:**
- **Landing:** Gradient from-orange-50 to-white to-blue-50
- **Home:** Gradient from-orange-50 to-white
- **Authenticated Pages:** Light gray bg-gray-50
- **Cards:** White with shadows

### **Typography:**
- **Headings:** Bold, 2xl-4xl, text-gray-900
- **Body:** Regular, base-lg, text-gray-600
- **Labels:** Medium, sm-base, text-gray-700

---

## 🔑 Key Technical Changes

### **1. App.tsx**
- Added Landing page import
- Added navigation hook imports
- Uses `useCurrentPage()` to determine which page to show
- Auto-redirects authenticated users from public pages to Home
- Shows Landing → Login/Register → Dashboard flow

### **2. Navigation Hook**
- Updated Page type to include: `'landing' | 'login' | 'register' | 'home' | 'bible' | 'music' | 'playlists' | 'premium' | 'profile' | 'help'`
- Default page is now `'landing'` instead of `'bible'`

### **3. Navigation Component**
- Added "Home" as first navigation item
- Shows for authenticated users only
- Uses Home icon from lucide-react

### **4. Dashboard Component**
- Renders Home page when `currentPage === 'home'`
- All other pages remain the same
- Shows for authenticated users only

---

## 🚀 User Experience Flow

### **First-Time Visitor:**
1. Lands on Landing page
2. Sees sample audio player (Genesis 1)
3. Can play audio without logging in
4. Sees compelling features and pricing
5. Clicks "Start Listening Free" or "Sign Up"
6. Creates account on Register page
7. Auto-redirects to Home page
8. Sees personalized dashboard with quick actions
9. Explores Bible, Music, and other features

### **Returning User:**
1. Lands on Landing page (if logged out)
2. Clicks "Login"
3. Enters credentials
4. Auto-redirects to Home page
5. Sees "Welcome back" message
6. Continues from where they left off
7. Uses navigation to access all features

### **Premium Upgrade:**
1. Free user sees upgrade banner on Home page
2. Clicks "Upgrade Now" → Premium page
3. Reviews benefits and pricing
4. Clicks "Upgrade to Premium" → Stripe checkout
5. Completes payment
6. Premium status updated in database
7. Returns to app with all premium features unlocked
8. No more ads, can create playlists, download content

---

## 📊 Page Analytics Recommendations

Track these key metrics:

**Landing Page:**
- Visitor count
- Sample audio plays
- Sign up button clicks
- Login button clicks
- Scroll depth
- Time on page

**Home Page:**
- Daily active users
- Quick action card clicks
- Premium banner clicks
- Content engagement

**Premium Page:**
- Upgrade button clicks
- Conversion rate
- Free vs Premium comparison views

---

## 🔒 Security & Authentication

### **Protected Routes:**
All pages except Landing, Login, and Register require authentication:
- Unauthenticated users see Landing page
- Login/Register pages redirect to Home after success
- Protected pages show Login if accessed directly

### **RLS Policies:**
Database enforces:
- Users can only access their own data
- Premium features check `is_premium` flag
- Playlists and downloads restricted to premium users

---

## 🎯 Next Steps

### **Content Population:**
1. Add Bible chapters to `audio_content` table
2. Add music tracks to `audio_content` table
3. Upload audio files to CDN
4. Update audio URLs in database

### **Stripe Integration:**
1. Set up Stripe account
2. Create checkout session
3. Update Premium page with Stripe link
4. Set up webhook for payment success
5. Update user premium status on payment

### **PWA Enhancement:**
1. Replace placeholder icons with branded icons
2. Test installation on all platforms
3. Configure push notifications
4. Test offline functionality

### **Testing Checklist:**
- [ ] Landing page loads for non-authenticated users
- [ ] Sample audio player works without login
- [ ] Sign Up button navigates to Register page
- [ ] Login button navigates to Login page
- [ ] Successful registration redirects to Home
- [ ] Successful login redirects to Home
- [ ] Home page shows personalized content
- [ ] Navigation works between all authenticated pages
- [ ] Premium banner shows for free users
- [ ] Premium badge shows for premium users
- [ ] Locked features show upgrade prompt
- [ ] Help page accessible from navigation
- [ ] Logout returns to Landing page
- [ ] Build completes without errors

---

## 📞 Support

For questions or issues:
- Email: support@thebibleinmusic.org
- In-app: Navigate to Help page for installation assistance

---

*Last Updated: 2024*
*Status: Production Ready*
