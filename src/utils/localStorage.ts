// LocalStorage utilities for Pinterest app
export interface Pin {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  createdBy: string;
  saved: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  savedPins: string[];
  createdPins: string[];
}

const PINS_KEY = 'pinterest_pins';
const USER_KEY = 'pinterest_user';

// Sample categories
export const CATEGORIES = [
  'All',
  'Art',
  'Nature',
  'Design',
  'Food',
  'Travel',
  'Fashion',
  'Technology'
];

// Get all pins from localStorage
export const getPins = (): Pin[] => {
  try {
    const pins = localStorage.getItem(PINS_KEY);
    return pins ? JSON.parse(pins) : getSamplePins();
  } catch (error) {
    console.error('Error getting pins:', error);
    return getSamplePins();
  }
};

// Save pins to localStorage
export const savePins = (pins: Pin[]): void => {
  try {
    localStorage.setItem(PINS_KEY, JSON.stringify(pins));
  } catch (error) {
    console.error('Error saving pins:', error);
  }
};

// Get current user from localStorage
export const getUser = (): User => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : getDefaultUser();
  } catch (error) {
    console.error('Error getting user:', error);
    return getDefaultUser();
  }
};

// Save user to localStorage
export const saveUser = (user: User): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Default user
const getDefaultUser = (): User => ({
  id: 'user-1',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  savedPins: [],
  createdPins: []
});

// Sample pins for initial load
const getSamplePins = (): Pin[] => [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    title: 'Mountain Landscape',
    description: 'Breathtaking mountain view during golden hour',
    category: 'Nature',
    createdBy: 'Nature Lover',
    saved: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=400&h=500&fit=crop',
    title: 'Abstract Art',
    description: 'Colorful geometric abstract painting',
    category: 'Art',
    createdBy: 'Artist Studio',
    saved: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=700&fit=crop',
    title: 'Delicious Pizza',
    description: 'Homemade pizza with fresh ingredients',
    category: 'Food',
    createdBy: 'Chef Italiano',
    saved: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=650&fit=crop',
    title: 'Modern Architecture',
    description: 'Contemporary building design with glass facade',
    category: 'Design',
    createdBy: 'Architect',
    saved: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=400&h=550&fit=crop',
    title: 'Tropical Paradise',
    description: 'Crystal clear waters and white sand beaches',
    category: 'Travel',
    createdBy: 'Wanderlust',
    saved: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=600&fit=crop',
    title: 'Fashion Portrait',
    description: 'Elegant fashion photography in natural light',
    category: 'Fashion',
    createdBy: 'Style Photographer',
    saved: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    title: 'Tech Circuit',
    description: 'Macro photography of circuit board',
    category: 'Technology',
    createdBy: 'Tech Enthusiast',
    saved: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=750&fit=crop',
    title: 'Wildflower Field',
    description: 'Colorful wildflowers in spring meadow',
    category: 'Nature',
    createdBy: 'Nature Lover',
    saved: false,
    createdAt: new Date().toISOString()
  }
];