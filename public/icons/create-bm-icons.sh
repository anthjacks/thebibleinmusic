#!/bin/bash

# Create placeholder icons with "BM" text on orange circle background
# These are temporary until custom branded icons are provided

# Function to create an SVG icon at specific size
create_icon() {
    size=$1
    file=$2
    
    # Calculate font size (roughly 40% of icon size)
    font_size=$((size * 40 / 100))
    
    # Create SVG
    cat > "${file%.png}.svg" << SVGEND
<svg width="$size" height="$size" viewBox="0 0 $size $size" xmlns="http://www.w3.org/2000/svg">
  <!-- Orange circle background -->
  <circle cx="$((size/2))" cy="$((size/2))" r="$((size/2))" fill="#FF8C42"/>
  
  <!-- White "BM" text -->
  <text 
    x="50%" 
    y="50%" 
    font-family="Arial, Helvetica, sans-serif" 
    font-size="${font_size}px" 
    font-weight="bold" 
    fill="white" 
    text-anchor="middle" 
    dominant-baseline="central">BM</text>
</svg>
SVGEND

    echo "Created ${file%.png}.svg"
}

# Create all required icon sizes
create_icon 16 "favicon-16x16.png"
create_icon 32 "favicon-32x32.png"
create_icon 72 "icon-72x72.png"
create_icon 96 "icon-96x96.png"
create_icon 120 "icon-120x120.png"
create_icon 128 "icon-128x128.png"
create_icon 144 "icon-144x144.png"
create_icon 152 "icon-152x152.png"
create_icon 180 "icon-180x180.png"
create_icon 192 "icon-192x192.png"
create_icon 384 "icon-384x384.png"
create_icon 512 "icon-512x512.png"

echo ""
echo "✅ Created SVG placeholder icons with 'BM' branding"
echo ""
echo "To convert to PNG using ImageMagick (if available):"
echo "  for file in *.svg; do convert \"\$file\" \"\${file%.svg}.png\"; done"
echo ""
echo "Or use an online converter: https://svgtopng.com/"
echo ""
echo "These are placeholder icons. Replace with custom branded icons before launch."
