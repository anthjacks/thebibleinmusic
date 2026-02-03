# Deployment Checklist
## The Bible In Music - Production Launch

Use this checklist before deploying to production at www.thebibleinmusic.com

---

## 🎨 Branding & Assets

### Icons (CRITICAL)
- [ ] Create branded app icons from `/public/icons/icon-template.svg`
- [ ] Generate all required PNG sizes (see `/public/icons/README.md`):
  - [ ] 16x16, 32x32 (favicons)
  - [ ] 72x72, 96x96, 120x120, 128x128, 144x144, 152x152
  - [ ] 180x180 (Apple devices)
  - [ ] 192x192, 384x384, 512x512 (Android/PWA)
- [ ] Replace placeholder files in `/public/icons/`
- [ ] Verify icons load without errors in browser console

### Theme Colors
- [ ] Confirm theme color #FF8C42 matches brand identity
- [ ] Update if needed in:
  - [ ] `/public/manifest.json` (theme_color)
  - [ ] `/index.html` (meta theme-color)
  - [ ] `/index.html` (msapplication-TileColor)

---

## 🗄️ Database Setup

### Content Population
- [ ] Upload Bible audio files to CDN
- [ ] Upload music files to CDN
- [ ] Insert all Bible chapters into `audio_content` table:
  - [ ] English Bible (66 books, ~1,189 chapters)
  - [ ] Spanish Bible (66 books, ~1,189 chapters)
- [ ] Insert all music tracks into `audio_content` table:
  - [ ] English worship songs
  - [ ] Spanish worship songs
- [ ] Add cover images for music albums
- [ ] Verify all audio URLs are accessible

### Database Verification
- [ ] Test Row Level Security policies
- [ ] Verify premium users can create playlists
- [ ] Verify free users cannot create playlists
- [ ] Test listening session tracking
- [ ] Test download tracking for premium users

---

## 💳 Payment Integration

### Stripe Setup
- [ ] Create Stripe account
- [ ] Set up product: "Premium Lifetime Access" at $9.99
- [ ] Create Stripe Checkout session
- [ ] Update `handleUpgrade()` in `/src/pages/Premium.tsx`:
  ```typescript
  const handleUpgrade = () => {
    window.location.href = 'YOUR_STRIPE_CHECKOUT_LINK_HERE';
  };
  ```
- [ ] Set up Stripe webhook for payment success
- [ ] Create webhook handler to update `user_profiles.is_premium = true`
- [ ] Test payment flow end-to-end
- [ ] Verify premium features unlock after purchase

---

## 📢 Advertisement Setup

### Ad Configuration
- [ ] Record or obtain 3-5 audio advertisements
- [ ] Upload ad audio files to CDN
- [ ] Update ad URLs in `/src/hooks/useAudioPlayer.ts`:
  ```typescript
  const SAMPLE_ADS: AdConfig[] = [
    { url: 'https://cdn.example.com/ad1.mp3', duration: 15 },
    { url: 'https://cdn.example.com/ad2.mp3', duration: 20 },
    { url: 'https://cdn.example.com/ad3.mp3', duration: 15 },
  ];
  ```
- [ ] Test ad injection timing (should play every 20 minutes)
- [ ] Verify ads don't play for premium users
- [ ] Test ad skip protection

### Ad Frequency (Optional)
- [ ] Adjust `AD_INTERVAL_SECONDS` if needed (default: 1200 = 20 min)
- [ ] Consider A/B testing different frequencies

---

## ☁️ CDN & Hosting

### Audio File Hosting
- [ ] Choose CDN provider (AWS S3, Cloudflare R2, Google Cloud, Azure)
- [ ] Upload all audio files
- [ ] Enable CORS on CDN buckets
- [ ] Set up CloudFront or equivalent CDN distribution
- [ ] Configure cache headers for audio files
- [ ] Test audio streaming from CDN
- [ ] Verify CDN performance in different regions

### Web Hosting
- [ ] Choose hosting platform (Vercel, Netlify, AWS Amplify, etc.)
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Output directory: `dist`
- [ ] Set up custom domain: www.thebibleinmusic.com
- [ ] Enable HTTPS (required for PWA)
- [ ] Configure redirects (non-www to www, etc.)

---

## 🔒 Security & Environment

### Environment Variables
- [ ] Verify Supabase credentials in production
- [ ] Add environment variables to hosting platform:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Never commit secrets to Git
- [ ] Enable environment-specific configs

### Security Headers
- [ ] Add security headers to hosting config:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
- [ ] Enable HSTS (HTTP Strict Transport Security)
- [ ] Test security with https://securityheaders.com/

---

## 📱 PWA Testing

### Pre-Deployment Testing
- [ ] Test service worker registration locally
- [ ] Verify manifest.json loads correctly
- [ ] Check all icon paths resolve
- [ ] Test offline functionality
- [ ] Verify cache strategy works

### Post-Deployment Testing
- [ ] Install on iOS device (Safari)
  - [ ] Check icon displays correctly
  - [ ] Verify standalone mode works
  - [ ] Test theme color on status bar
- [ ] Install on Android device (Chrome)
  - [ ] Check install prompt appears
  - [ ] Verify app drawer icon
  - [ ] Test splash screen
- [ ] Install on desktop (Chrome/Edge)
  - [ ] Verify app window opens
  - [ ] Check taskbar icon

### Lighthouse Audit
- [ ] Run Lighthouse PWA audit
- [ ] Aim for score of 90+ in all categories:
  - [ ] Performance: 90+
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+
  - [ ] PWA: Pass all checks
- [ ] Fix any failing audits

---

## 🧪 Functionality Testing

### Authentication
- [ ] Test user registration
- [ ] Test user login
- [ ] Test logout
- [ ] Verify username uniqueness
- [ ] Test password requirements
- [ ] Check session persistence

### Free User Experience
- [ ] Verify Bible access (both languages)
- [ ] Verify music library access (both languages)
- [ ] Test language switcher
- [ ] Confirm ads play every 20 minutes
- [ ] Verify playlist creation is blocked
- [ ] Verify downloads are blocked
- [ ] Test 128kbps quality streaming

### Premium User Experience
- [ ] Purchase premium (test mode)
- [ ] Verify ad-free experience
- [ ] Test playlist creation
- [ ] Test playlist management
- [ ] Test audio downloads
- [ ] Verify 320kbps quality option
- [ ] Check premium badge displays

### Audio Player
- [ ] Test play/pause
- [ ] Test seek/scrubbing
- [ ] Test volume control
- [ ] Test track switching
- [ ] Verify playback persists during navigation
- [ ] Test background audio (mobile)

### Navigation
- [ ] Test all navigation menu items
- [ ] Verify mobile menu works
- [ ] Test responsive breakpoints
- [ ] Check deep linking works

---

## 📊 Analytics & Monitoring

### Analytics Setup
- [ ] Add Google Analytics or alternative
- [ ] Track key events:
  - User registration
  - Content plays
  - Ad plays
  - Premium purchases
  - PWA installs
  - Downloads (premium)
- [ ] Set up conversion tracking for premium upgrades
- [ ] Create custom dashboard for key metrics

### Error Monitoring
- [ ] Set up Sentry or similar error tracking
- [ ] Monitor:
  - JavaScript errors
  - Failed API requests
  - Failed audio loads
  - Service worker errors
- [ ] Set up alerts for critical errors

### Performance Monitoring
- [ ] Enable Web Vitals tracking
- [ ] Monitor Core Web Vitals:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
- [ ] Set up alerts for performance degradation

---

## 🔍 SEO & Metadata

### Meta Tags
- [ ] Verify all meta tags in `index.html`
- [ ] Add Open Graph images
- [ ] Add Twitter Card images
- [ ] Test social media sharing preview

### Sitemap & Robots
- [ ] Generate sitemap.xml
- [ ] Create robots.txt
- [ ] Submit sitemap to Google Search Console
- [ ] Verify indexing

### Performance
- [ ] Optimize images
- [ ] Enable gzip compression
- [ ] Minimize JavaScript bundles
- [ ] Enable browser caching
- [ ] Optimize font loading

---

## 📧 Email & Notifications

### Transactional Emails (Optional)
- [ ] Set up email service (SendGrid, Mailgun, etc.)
- [ ] Create email templates:
  - Welcome email after registration
  - Premium purchase confirmation
  - Password reset (if implemented)
- [ ] Test email delivery

### Push Notifications (Future Enhancement)
- [ ] Plan push notification strategy
- [ ] Set up Firebase Cloud Messaging or alternative
- [ ] Implement notification permission request
- [ ] Create notification templates

---

## 🎯 Marketing & Launch

### Pre-Launch
- [ ] Create landing page copy
- [ ] Prepare marketing materials
- [ ] Set up social media accounts
- [ ] Create promotional graphics
- [ ] Plan launch announcement

### Launch Day
- [ ] Deploy to production
- [ ] Verify everything works
- [ ] Announce on social media
- [ ] Send email to mailing list
- [ ] Monitor for issues

### Post-Launch
- [ ] Gather user feedback
- [ ] Monitor analytics
- [ ] Track premium conversion rate
- [ ] Respond to support requests
- [ ] Plan feature updates

---

## 📱 App Store Submission (Future)

### iOS App Store (Optional)
- [ ] Wrap PWA with Capacitor or similar
- [ ] Create App Store listing
- [ ] Prepare screenshots
- [ ] Write app description
- [ ] Submit for review

### Google Play Store (Optional)
- [ ] Generate TWA (Trusted Web Activity) or wrap with Capacitor
- [ ] Create Play Store listing
- [ ] Prepare screenshots
- [ ] Write app description
- [ ] Submit for review

---

## 🔄 Ongoing Maintenance

### Content Updates
- [ ] Plan regular content additions
- [ ] Schedule new music releases
- [ ] Add new Bible translations (future)
- [ ] Update seasonal content

### Technical Maintenance
- [ ] Monitor dependency updates
- [ ] Update security patches
- [ ] Test on new browser versions
- [ ] Optimize database queries
- [ ] Review and update cache strategies

### User Support
- [ ] Set up support email: support@excellentmusic.com
- [ ] Create FAQ page
- [ ] Monitor user feedback
- [ ] Address bug reports
- [ ] Implement feature requests

---

## ✅ Final Pre-Launch Checklist

**Last checks before going live:**

- [ ] All placeholder icons replaced with branded icons
- [ ] Database populated with complete content
- [ ] Stripe payment integration tested and working
- [ ] Ad audio files uploaded and configured
- [ ] CDN hosting configured and tested
- [ ] Domain name configured with SSL
- [ ] PWA tested on iOS, Android, and desktop
- [ ] All functionality tested as free user
- [ ] All functionality tested as premium user
- [ ] Analytics and error tracking enabled
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Security headers configured
- [ ] Backup plan in place
- [ ] Support channels ready
- [ ] Marketing materials prepared

---

## 🚀 Deployment Commands

```bash
# Final build
npm run build

# Test build locally
npm run preview

# Deploy (varies by platform)
# Vercel:
vercel --prod

# Netlify:
netlify deploy --prod

# Manual:
# Upload /dist folder to hosting provider
```

---

## 📞 Support Contacts

- **Technical Issues**: [Your Dev Email]
- **Content Issues**: [Content Team Email]
- **Payment Issues**: [Billing Team Email]
- **General Support**: support@excellentmusic.com

---

**Launch Date Target**: _______________

**Responsible Team Member**: _______________

**Launch Status**: ⬜ Not Ready | ⬜ Ready for Testing | ⬜ Ready for Launch | ✅ Launched

---

*Last Updated: 2024*
