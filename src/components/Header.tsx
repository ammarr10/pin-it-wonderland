import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Moon, Sun, User, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleMobileMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  darkMode,
  onToggleDarkMode,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            {onToggleMobileMenu && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMobileMenu}
                className="lg:hidden rounded-full"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:block">
                Pinterest
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Create
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search pins..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 search-input bg-secondary border-0"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="rounded-full"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Create Pin */}
            <Link to="/create">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>

            {/* Profile */}
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;