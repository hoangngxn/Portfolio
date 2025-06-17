"use client";

import React from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, alt }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-7xl mx-4">
        <div className="relative glass-card rounded-2xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 glass-card glass-hover rounded-full p-2 hover:scale-110 transition-transform"
          >
            <X className="w-6 h-6 text-foreground" />
          </button>

          {/* Image Container with Letterboxing */}
          <div className="relative w-full aspect-[16/9] bg-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={imageUrl}
                alt={alt}
                fill
                quality={100}
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal; 