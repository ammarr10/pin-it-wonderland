import React, { useState } from 'react';
import { Heart, Download, Share, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import type { Pin } from '@/utils/localStorage';

interface PinModalProps {
  pin: Pin | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (pin: Pin) => void;
}

const PinModal: React.FC<PinModalProps> = ({ pin, isOpen, onClose, onSave }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!pin) return null;

  const handleSave = () => {
    onSave(pin);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pin.title,
          text: pin.description,
          url: pin.image,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(pin.image);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pin.image;
    link.download = `${pin.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image Side */}
          <div className="relative flex items-center justify-center bg-black/5">
            {!imageLoaded && (
              <div className="w-full h-96 skeleton" />
            )}
            
            <img
              src={pin.image}
              alt={pin.title}
              className={`max-w-full max-h-[80vh] object-contain transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Content Side */}
          <div className="p-6 flex flex-col">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="rounded-full"
                >
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="rounded-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <Button
                variant={pin.saved ? "default" : "outline"}
                onClick={handleSave}
                className={`rounded-full ${
                  pin.saved 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'border-red-600 text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${pin.saved ? 'fill-current' : ''}`} />
                {pin.saved ? 'Saved' : 'Save'}
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-3">
                {pin.title}
              </h1>
              
              {pin.description && (
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {pin.description}
                </p>
              )}

              {/* Category Badge */}
              <div className="mb-6">
                <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {pin.category}
                </span>
              </div>

              {/* Creator Info */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {pin.createdBy.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {pin.createdBy}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(pin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* View Original Link */}
              <div className="mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(pin.image, '_blank')}
                  className="w-full rounded-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Original
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinModal;