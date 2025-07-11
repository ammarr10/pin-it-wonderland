import React from 'react';
import { CATEGORIES } from '@/utils/localStorage';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <aside className="w-64 bg-background border-r border-border p-6 hidden lg:block">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Categories</h2>
        
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 category-pill ${
                selectedCategory === category ? 'active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;