# App Icons

This directory should contain all the required icon files for the PWA.

## Required Icon Sizes

Create PNG files at the following sizes from the base design:

- `icon-72x72.png` - 72x72 pixels
- `icon-96x96.png` - 96x96 pixels
- `icon-120x120.png` - 120x120 pixels (Apple Touch Icon)
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels
- `icon-152x152.png` - 152x152 pixels (Apple Touch Icon)
- `icon-180x180.png` - 180x180 pixels (Apple Touch Icon)
- `icon-192x192.png` - 192x192 pixels (Android)
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels (Android)
- `favicon-16x16.png` - 16x16 pixels
- `favicon-32x32.png` - 32x32 pixels

## Design Guidelines

The icon should:
- Use the brand color #FF8C42 (orange) as the primary color
- Feature a music note or Bible book symbol
- Be simple and recognizable at small sizes
- Work on both light and dark backgrounds
- Have a square aspect ratio with optional rounded corners

## Tools to Create Icons

You can use these tools to generate all required sizes:

1. **Online Tools:**
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator

2. **Command Line:**
   ```bash
   # Using ImageMagick
   convert icon-512x512.png -resize 72x72 icon-72x72.png
   convert icon-512x512.png -resize 96x96 icon-96x96.png
   # ... repeat for all sizes
   ```

3. **Design Software:**
   - Adobe Photoshop
   - Figma (with export presets)
   - Sketch
   - GIMP (free)

## Current Status

**TODO:** Replace placeholder icons with actual branded PNG files.

The `icon-template.svg` file in this directory shows the recommended design that should be exported to all PNG sizes.
