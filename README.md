# The Bible In Music

A freemium Christian audio streaming Progressive Web App (PWA) by Excellent Music.

**Domain:** www.thebibleinmusic.org

## Features

### Free Tier (Requires Account)
- Complete Bible audio access (English + Spanish)
- Full music library access
- Unlimited listening hours
- Stream on any device
- 3 audio ads per hour of listening

### Premium Tier ($9.99 One-Time Payment)
- Everything in Free tier
- Zero ads - completely ad-free
- Download tracks for offline listening
- Create unlimited custom playlists
- High quality audio (320kbps)
- Early access to new releases
- Support Christian ministry

## Technology Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Icons:** Lucide React
- **PWA:** Service Worker + Web App Manifest

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Database Schema

The application uses the following tables:

- `user_profiles` - User account information and premium status
- `audio_content` - Bible chapters and music tracks
- `playlists` - User-created playlists (Premium only)
- `playlist_items` - Tracks within playlists
- `listening_sessions` - Track listening for ad injection timing
- `downloads` - Downloaded tracks (Premium only)

## Adding Content

### Adding Bible Chapters

```sql
INSERT INTO audio_content (
  content_type,
  language,
  title,
  book_name,
  chapter_number,
  duration_seconds,
  audio_url,
  quality_standard,
  quality_premium,
  order_index
) VALUES (
  'bible',
  'english',
  'Genesis Chapter 1',
  'Genesis',
  1,
  240,
  'https://your-cdn.com/genesis-1-128k.mp3',
  'https://your-cdn.com/genesis-1-128k.mp3',
  'https://your-cdn.com/genesis-1-320k.mp3',
  1
);
```

### Adding Music Tracks

```sql
INSERT INTO audio_content (
  content_type,
  language,
  title,
  artist,
  album,
  duration_seconds,
  audio_url,
  quality_standard,
  quality_premium,
  cover_image_url,
  order_index
) VALUES (
  'music',
  'english',
  'Amazing Grace',
  'Excellent Music',
  'Classic Hymns Vol. 1',
  240,
  'https://your-cdn.com/amazing-grace.mp3',
  'https://your-cdn.com/amazing-grace-128k.mp3',
  'https://your-cdn.com/amazing-grace-320k.mp3',
  'https://your-cdn.com/covers/amazing-grace.jpg',
  1
);
```

## PWA Installation

This app is a full Progressive Web App (PWA) that can be installed on any device!

### Quick Install:

**iOS (iPhone/iPad)**: Safari → Share → "Add to Home Screen"
**Android**: Chrome → Menu → "Install app"
**Desktop**: Click install icon in address bar

📖 **In-App Help**: Click "Help" in the navigation menu for step-by-step installation instructions with visual guides
📖 **[Complete PWA Installation Guide](./PWA-INSTALLATION-GUIDE.md)** - Detailed instructions for all platforms, troubleshooting, and testing

### PWA Features:
- ✅ Installable on iOS, Android, and Desktop
- ✅ Auto-install prompts (Android/iOS specific banners)
- ✅ Works offline with Service Worker
- ✅ Beautiful offline fallback page (`/offline.html`)
- ✅ Standalone mode (no browser UI)
- ✅ Branded theme color (#FF8C42)
- ✅ Complete icon set (placeholder "BM" icons ready)
- ✅ Add to home screen capability

### Icon Setup:
The app includes **placeholder "BM" icons** (orange circle with white text). These work perfectly for testing!

**Replace with custom icons before launch:**
1. See `/public/icons/ICON-STATUS.md` for current status
2. All 12 required PNG sizes are already generated
3. Simply replace PNG files with your branded versions
4. Keep same filenames and dimensions

## Stripe Integration

To enable Premium payments:

1. Get your Stripe account and create a checkout session
2. Update the `handleUpgrade` function in `src/pages/Premium.tsx`:

```typescript
const handleUpgrade = () => {
  window.location.href = 'YOUR_STRIPE_CHECKOUT_LINK';
};
```

3. Set up a webhook to update user premium status after successful payment

## Ad Configuration

Ads are injected every 20 minutes (1200 seconds) for free users. To configure:

1. Replace sample ads in `src/hooks/useAudioPlayer.ts`:

```typescript
const SAMPLE_ADS: AdConfig[] = [
  { url: 'https://your-cdn.com/ad1.mp3', duration: 15 },
  { url: 'https://your-cdn.com/ad2.mp3', duration: 20 },
  { url: 'https://your-cdn.com/ad3.mp3', duration: 15 },
];
```

2. Adjust ad frequency by changing `AD_INTERVAL_SECONDS`

## Content Hosting

For production, you'll need to host your audio files on a CDN:

- Amazon S3 + CloudFront
- Google Cloud Storage + CDN
- Azure Blob Storage + CDN
- Cloudflare R2

Update the `audio_url`, `quality_standard`, and `quality_premium` fields with your CDN URLs.

## License

Copyright (c) 2024 Excellent Music. All rights reserved.

## Support

For questions or support, contact: support@excellentmusic.com
