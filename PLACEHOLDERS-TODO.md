# PLACEHOLDERS TO UPDATE BEFORE LAUNCH

This is a quick checklist of all placeholders that need your configuration.

---

## 1. STRIPE CHECKOUT LINK (REQUIRED)

**Location:** `src/pages/Premium.tsx` - Line 9

**Current:**
```typescript
const STRIPE_CHECKOUT_URL = 'PLACEHOLDER_STRIPE_CHECKOUT_LINK';
```

**Replace with:**
```typescript
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/YOUR_CHECKOUT_LINK';
```

**How to get it:**
1. Create Stripe account
2. Create product: "Premium Lifetime Access" - $9.99
3. Create Payment Link
4. Set success URL: `https://www.thebibleinmusic.org/success?session_id={CHECKOUT_SESSION_ID}`
5. Copy the payment link URL

---

## 2. ENVIRONMENT VARIABLES (REQUIRED)

**Add to Netlify/Vercel Dashboard:**

```bash
# Already configured locally - add to production
VITE_SUPABASE_URL=https://dedgcxettritiqdodrij.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Add after Stripe setup
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY

# Add after Backblaze B2 setup
VITE_BACKBLAZE_BUCKET_URL=https://YOUR_BUCKET.backblazeb2.com
```

---

## 3. AUDIO FILE URLs (REQUIRED)

**What:** Upload audio files to Backblaze B2 and update database

**Current:** Sample data with placeholder URLs in database

**To fix:**
1. Create Backblaze B2 bucket (public)
2. Upload your audio files:
   - Bible chapters: `bible/english/genesis-1.mp3`, etc.
   - Music tracks: `music/track-1.mp3`, etc.
3. Update database `audio_content` table with real URLs
4. See DEPLOYMENT-GUIDE.md Step 5 for SQL examples

---

## 4. AD AUDIO FILES (OPTIONAL)

**Location:** `src/hooks/useAudioPlayer.ts` - Lines 26-30

**Current:**
```typescript
const SAMPLE_ADS: AdConfig[] = [
  { url: 'https://example.com/ad1.mp3', duration: 15 },
  { url: 'https://example.com/ad2.mp3', duration: 20 },
  { url: 'https://example.com/ad3.mp3', duration: 15 },
];
```

**Replace with:** Your actual ad audio file URLs

**Note:** Ads currently play every 20 minutes for free users. Replace URLs when ready.

---

## 5. PWA ICONS (RECOMMENDED)

**Location:** `/public/icons/` directory

**Current:** Placeholder icon files

**To fix:**
1. Create your logo (512x512 PNG)
2. Generate all icon sizes using:
   - https://realfavicongenerator.net
   - https://www.pwabuilder.com/imageGenerator
3. Replace all files in `/public/icons/`

**Required sizes:**
- 16x16, 32x32 (favicons)
- 72, 96, 120, 128, 144, 152, 180 (mobile)
- 192, 384, 512 (PWA)

---

## 6. APP NAME & BRANDING (OPTIONAL)

**Locations:**
- `/public/manifest.json` - Update `name`, `short_name`, `description`
- `/index.html` - Update `<title>`, `<meta>` tags
- `/public/robots.txt` - Update sitemap URL
- `/public/sitemap.xml` - Update domain to `www.thebibleinmusic.org`

---

## Quick Launch Checklist

- [ ] Update Stripe checkout link in `Premium.tsx`
- [ ] Add environment variables to hosting platform
- [ ] Upload audio files to Backblaze B2
- [ ] Populate database with content metadata
- [ ] Replace PWA icons with your logo
- [ ] Update app name in manifest.json
- [ ] Test on mobile devices
- [ ] Test premium purchase flow
- [ ] Launch!

---

## After Launch

- Monitor Stripe dashboard for payments
- Add more Bible chapters and music regularly
- Update ad audio URLs when ready
- Gather user feedback and iterate

---

**Everything else is ready to go!**

The application is fully functional. Just configure these placeholders and you're live.
