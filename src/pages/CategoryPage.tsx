import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PinGrid from '@/components/PinGrid';
import PinModal from '@/components/PinModal';
import { getPins, savePins, getUser, saveUser, CATEGORIES, type Pin } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Validate category
  const isValidCategory = category && CATEGORIES.includes(category);
  const displayCategory = isValidCategory ? category : 'All';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const allPins = getPins();
        setPins(allPins);
      } catch (error) {
        console.error('Error loading pins:', error);
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

  // Filter pins by category
  const filteredPins = pins.filter(pin => 
    displayCategory === 'All' || pin.category === displayCategory
  );

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

  if (!isValidCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-xl text-muted-foreground mb-4">
            The category "{category}" doesn't exist.
          </p>
          <Link to="/">
            <Button variant="gradient" className="rounded-full">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{displayCategory}</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredPins.length} pins
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Description */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-lg font-medium text-foreground mb-2">
            Discover {displayCategory} pins
          </h2>
          <p className="text-muted-foreground">
            Explore a curated collection of {displayCategory.toLowerCase()} pins from our community.
          </p>
        </div>
      </div>

      {/* Pins Grid */}
      <main>
        <PinGrid
          pins={filteredPins}
          onSave={handleSavePin}
          onView={handleViewPin}
          loading={loading}
        />
      </main>

      <PinModal
        pin={selectedPin}
        isOpen={!!selectedPin}
        onClose={handleCloseModal}
        onSave={handleSavePin}
      />
    </div>
  );
};

export default CategoryPage;