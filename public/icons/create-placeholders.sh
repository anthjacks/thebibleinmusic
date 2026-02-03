#!/bin/bash
# Create placeholder PNG files (1x1 transparent pixel)
# This prevents 404 errors until real icons are added

PLACEHOLDER="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

echo "$PLACEHOLDER" | base64 -d > icon-72x72.png
echo "$PLACEHOLDER" | base64 -d > icon-96x96.png
echo "$PLACEHOLDER" | base64 -d > icon-120x120.png
echo "$PLACEHOLDER" | base64 -d > icon-128x128.png
echo "$PLACEHOLDER" | base64 -d > icon-144x144.png
echo "$PLACEHOLDER" | base64 -d > icon-152x152.png
echo "$PLACEHOLDER" | base64 -d > icon-180x180.png
echo "$PLACEHOLDER" | base64 -d > icon-192x192.png
echo "$PLACEHOLDER" | base64 -d > icon-384x384.png
echo "$PLACEHOLDER" | base64 -d > icon-512x512.png
echo "$PLACEHOLDER" | base64 -d > favicon-16x16.png
echo "$PLACEHOLDER" | base64 -d > favicon-32x32.png

echo "Created placeholder icon files"
