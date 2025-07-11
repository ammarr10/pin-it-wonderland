import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/utils/localStorage';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
}) => {
  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-50 lg:hidden animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Categories</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 category-pill ${
                  selectedCategory === category ? 'active' : ''
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;