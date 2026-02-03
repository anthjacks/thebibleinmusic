import React from 'react';
import { ImageProps, IMAGE_SIZES, handleImageLoad, handleImageError } from '../lib/imageUtils';

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  size = 'MEDIUM',
  className = '',
  loading = 'lazy',
}) => {
  const sizeValue = IMAGE_SIZES[size];

  return (
    <img
      src={src}
      alt={alt}
      width={sizeValue}
      height={sizeValue}
      loading={loading}
      className={`${className} ${loading === 'lazy' ? 'lazy-load' : ''}`}
      onLoad={handleImageLoad}
      onError={handleImageError}
      style={{
        aspectRatio: '1 / 1',
        objectFit: 'cover',
      }}
    />
  );
};

interface CoverArtProps {
  src: string;
  title: string;
  size?: keyof typeof IMAGE_SIZES;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const CoverArt: React.FC<CoverArtProps> = ({
  src,
  title,
  size = 'MEDIUM',
  className = '',
  loading = 'lazy',
}) => {
  return (
    <Image
      src={src}
      alt={`${title} cover art`}
      size={size}
      className={`rounded-lg ${className}`}
      loading={loading}
    />
  );
};
