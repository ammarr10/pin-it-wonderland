import React, { useState } from 'react';
import { Heart, Download, Share, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Pin } from '@/utils/localStorage';

interface PinCardProps {
  pin: Pin;
  onSave: (pin: Pin) => void;
  onView: (pin: Pin) => void;
}

const PinCard: React.FC<PinCardProps> = ({ pin, onSave, onView }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(pin);
  };

  const handleView = () => {
    onView(pin);
  };

  return (
    <div 
      className="masonry-item pin-card bg-card rounded-xl overflow-hidden cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-64 skeleton" />
        )}
        
        <img
          src={pin.image}
          alt={pin.title}
          className={`w-full h-auto object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          onLoad={handleImageLoad}
          loading="lazy"
        />

        {/* Overlay Actions */}
        <div className={`absolute inset-0 bg-black/20 flex items-end justify-between p-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white text-black rounded-full shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality
            }}
          >
            <Share className="h-4 w-4" />
          </Button>

          <Button
            variant={pin.saved ? "default" : "outline"}
            size="sm"
            onClick={handleSave}
            className={`rounded-full shadow-lg transition-all duration-200 ${
              pin.saved 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-white/90 hover:bg-white text-black border-0'
            }`}
          >
            <Heart className={`h-4 w-4 mr-1 ${pin.saved ? 'fill-current' : ''}`} />
            {pin.saved ? 'Saved' : 'Save'}
          </Button>
        </div>

        {/* Quick View Button */}
        <div className={`absolute top-4 right-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white text-black rounded-full shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onView(pin);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2">
          {pin.title}
        </h3>
        
        {pin.description && (
          <p className="text-muted-foreground text-xs line-clamp-2 mb-3">
            {pin.description}
          </p>
        )}

        {/* Creator Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {pin.createdBy.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {pin.createdBy}
            </span>
          </div>
          
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            {pin.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PinCard;