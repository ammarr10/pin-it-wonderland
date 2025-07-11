import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PinGrid from '@/components/PinGrid';
import PinModal from '@/components/PinModal';
import { getPins, savePins, getUser, type Pin } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [activeTab, setActiveTab] = useState<'saved' | 'created'>('saved');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const user = getUser();

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

  const savedPins = pins.filter(pin => user.savedPins.includes(pin.id));
  const createdPins = pins.filter(pin => user.createdPins.includes(pin.id));

  const displayPins = activeTab === 'saved' ? savedPins : createdPins;

  const handleSavePin = (pin: Pin) => {
    const updatedPins = pins.map(p => 
      p.id === pin.id ? { ...p, saved: !p.saved } : p
    );
    setPins(updatedPins);
    savePins(updatedPins);

    toast({
      title: pin.saved ? "Pin removed" : "Pin saved",
      description: pin.saved 
        ? "Pin removed from your saved collection."
        : "Pin added to your saved collection.",
    });
  };

  const handleViewPin = (pin: Pin) => {
    setSelectedPin(pin);
  };

  const handleCloseModal = () => {
    setSelectedPin(null);
  };

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
              <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link to="/create">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Pin
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* User Info */}
          <h2 className="text-2xl font-bold text-foreground mb-2">{user.name}</h2>
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <span>{savedPins.length} saved</span>
            <span>{createdPins.length} created</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mt-8 mb-6">
          <div className="bg-secondary rounded-full p-1">
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'saved'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Saved ({savedPins.length})
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === 'created'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Created ({createdPins.length})
            </button>
          </div>
        </div>

        {/* Pins Grid */}
        {displayPins.length === 0 && !loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">
                {activeTab === 'saved' ? '❤️' : '📌'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {activeTab === 'saved' ? 'No saved pins yet' : 'No created pins yet'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              {activeTab === 'saved' 
                ? 'Start exploring and save pins that inspire you!'
                : 'Share your creativity by creating your first pin!'
              }
            </p>
            {activeTab === 'created' && (
              <Link to="/create">
                <Button variant="gradient" className="rounded-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first Pin
                </Button>
              </Link>
            )}
            {activeTab === 'saved' && (
              <Link to="/">
                <Button variant="gradient" className="rounded-full">
                  Discover Pins
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <PinGrid
            pins={displayPins}
            onSave={handleSavePin}
            onView={handleViewPin}
            loading={loading}
          />
        )}
      </div>

      <PinModal
        pin={selectedPin}
        isOpen={!!selectedPin}
        onClose={handleCloseModal}
        onSave={handleSavePin}
      />
    </div>
  );
};

export default ProfilePage;