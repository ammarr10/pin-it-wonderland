import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import PinGrid from '@/components/PinGrid';
import PinModal from '@/components/PinModal';
import { getPins, savePins, getUser, saveUser, type Pin } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import ScrollToTop from '@/components/ScrollToTop';
import MobileSidebar from '@/components/MobileSidebar';

const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pins, setPins] = useState<Pin[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const storedPins = getPins();
        setPins(storedPins);
        
        // Check for dark mode preference
        const darkModePreference = localStorage.getItem('darkMode');
        if (darkModePreference) {
          setDarkMode(JSON.parse(darkModePreference));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load pins. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Update URL params when search or category changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchTerm, selectedCategory, setSearchParams]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Filter pins based on search and category
  const filteredPins = useMemo(() => {
    return pins.filter(pin => {
      const matchesSearch = !searchTerm || 
        pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pin.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || pin.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [pins, searchTerm, selectedCategory]);

  const handleSavePin = (pin: Pin) => {
    const updatedPins = pins.map(p => 
      p.id === pin.id ? { ...p, saved: !p.saved } : p
    );
    setPins(updatedPins);
    savePins(updatedPins);

    // Update user's saved pins
    const user = getUser();
    if (pin.saved) {
      user.savedPins = user.savedPins.filter(id => id !== pin.id);
      toast({
        title: "Pin removed",
        description: "Pin removed from your saved collection.",
      });
    } else {
      user.savedPins.push(pin.id);
      toast({
        title: "Pin saved",
        description: "Pin added to your saved collection.",
      });
    }
    saveUser(user);
  };

  const handleViewPin = (pin: Pin) => {
    setSelectedPin(pin);
  };

  const handleCloseModal = () => {
    setSelectedPin(null);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleToggleMobileMenu = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onToggleMobileMenu={handleToggleMobileMenu}
      />

      <div className="flex">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <main className="flex-1">
          {/* Mobile Category Filter */}
          <div className="lg:hidden p-4 border-b border-border">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {['All', 'Art', 'Nature', 'Design', 'Food', 'Travel', 'Fashion', 'Technology'].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 category-pill ${
                    selectedCategory === category ? 'active' : ''
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <PinGrid
            pins={filteredPins}
            onSave={handleSavePin}
            onView={handleViewPin}
            loading={loading}
          />
        </main>
      </div>

      <PinModal
        pin={selectedPin}
        isOpen={!!selectedPin}
        onClose={handleCloseModal}
        onSave={handleSavePin}
      />

      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <ScrollToTop />
    </div>
  );
};

export default HomePage;