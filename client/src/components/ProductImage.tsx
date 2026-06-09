import { useState } from "react";
import React from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  style?: React.CSSProperties;
}

export default function ProductImage({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  style,
}: ProductImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 border border-gray-300 ${fallbackClassName || className}`}
        style={style}
      >
        <span className="text-gray-400 text-sm font-medium text-center px-4 leading-snug">
          Imagem em breve
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setError(true)}
    />
  );
}
