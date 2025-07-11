import React from 'react';
import PinCard from './PinCard';
import type { Pin } from '@/utils/localStorage';

interface PinGridProps {
  pins: Pin[];
  onSave: (pin: Pin) => void;
  onView: (pin: Pin) => void;
  loading?: boolean;
}

const PinGrid: React.FC<PinGridProps> = ({ pins, onSave, onView, loading }) => {
  if (loading) {
    return (
      <div className="masonry-grid p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="masonry-item">
            <div className="pin-card bg-card rounded-xl overflow-hidden">
              <div className="skeleton w-full h-64" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📌</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No pins found
        </h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your search or browse different categories to discover amazing pins.
        </p>
      </div>
    );
  }

  return (
    <div className="masonry-grid p-4 fade-in">
      {pins.map((pin) => (
        <PinCard
          key={pin.id}
          pin={pin}
          onSave={onSave}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default PinGrid;