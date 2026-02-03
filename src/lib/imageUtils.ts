export const IMAGE_SIZES = {
  THUMBNAIL: 64,
  MEDIUM: 200,
  LARGE: 400,
} as const;

export interface ImageProps {
  src: string;
  alt: string;
  size?: keyof typeof IMAGE_SIZES;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const getImageUrl = (
  baseUrl: string,
  size: keyof typeof IMAGE_SIZES = 'MEDIUM',
  format: 'webp' | 'jpg' = 'webp'
): string => {
  const sizeValue = IMAGE_SIZES[size];
  return `${baseUrl}?w=${sizeValue}&h=${sizeValue}&fm=${format}&fit=cover`;
};

export const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget;
  img.classList.add('loaded');
};

export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackUrl?: string
) => {
  const img = event.currentTarget;
  if (fallbackUrl && img.src !== fallbackUrl) {
    img.src = fallbackUrl;
  } else {
    img.src = '/icons/icon-192x192.png';
  }
};
