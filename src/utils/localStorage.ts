// LocalStorage utilities for The Land - React Developer Community
export interface Post {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  createdBy: string;
  createdById: string;
  saved: boolean;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface User {
  id: string;
  name: string;
  password: string;
  avatar: string;
  role: 'admin' | 'user';
  savedPosts: string[];
  createdPosts: string[];
  createdAt: string;
  // Legacy properties for backward compatibility
  savedPins?: string[];
  createdPins?: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

const POSTS_KEY = 'theland_posts';
const USERS_KEY = 'theland_users';
const AUTH_KEY = 'theland_auth';

// Sample categories for React Developer Community
export const CATEGORIES = [
  'All',
  'React News',
  'Tech Tips',
  'Code Snippets',
  'UI/UX Design',
  'JavaScript',
  'TypeScript',
  'Memes'
];

// Authentication functions
export const login = (name: string, password: string): AuthUser | null => {
  try {
    const users = getUsers();
    const user = users.find(u => u.name === name && u.password === password);
    
    if (user) {
      const authUser: AuthUser = {
        id: user.id,
        name: user.name,
        role: user.role
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      return authUser;
    }
    return null;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = (): AuthUser | null => {
  try {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

// User management functions
export const getUsers = (): User[] => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : getDefaultUsers();
  } catch (error) {
    console.error('Error getting users:', error);
    return getDefaultUsers();
  }
};

export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

export const getUserById = (id: string): User | null => {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
};

export const registerUser = (name: string, password: string): boolean => {
  try {
    const users = getUsers();
    
    // Check if user already exists
    if (users.find(u => u.name === name)) {
      return false;
    }
    
    const newUser: User = {
      id: generateId(),
      name,
      password,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      role: 'user',
      savedPosts: [],
      createdPosts: [],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    return true;
  } catch (error) {
    console.error('Error registering user:', error);
    return false;
  }
};

export const updateUser = (user: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    saveUsers(users);
  }
};

// Post management functions
export const getPosts = (): Post[] => {
  try {
    const posts = localStorage.getItem(POSTS_KEY);
    return posts ? JSON.parse(posts) : getSamplePosts();
  } catch (error) {
    console.error('Error getting posts:', error);
    return getSamplePosts();
  }
};

export const savePosts = (posts: Post[]): void => {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving posts:', error);
  }
};

export const getApprovedPosts = (): Post[] => {
  return getPosts().filter(post => post.status === 'approved');
};

export const getPendingPosts = (): Post[] => {
  return getPosts().filter(post => post.status === 'pending');
};

export const approvePost = (postId: string): void => {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.status = 'approved';
    savePosts(posts);
  }
};

export const rejectPost = (postId: string): void => {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.status = 'rejected';
    savePosts(posts);
  }
};

export const deletePost = (postId: string): void => {
  const posts = getPosts();
  const filteredPosts = posts.filter(p => p.id !== postId);
  savePosts(filteredPosts);
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Default admin user and sample users
const getDefaultUsers = (): User[] => [
  {
    id: 'admin-1',
    name: 'Ammarr',
    password: 'A20%.theland',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    role: 'admin',
    savedPosts: [],
    createdPosts: [],
    createdAt: new Date().toISOString()
  }
];

// Sample posts for initial load
const getSamplePosts = (): Post[] => [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=600&fit=crop',
    title: 'React 18 New Features Overview',
    description: 'A comprehensive guide to React 18\'s concurrent features, automatic batching, and Suspense improvements for React developers.',
    category: 'React News',
    createdBy: 'Ammarr',
    createdById: 'admin-1',
    saved: false,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=500&fit=crop',
    title: 'TypeScript Tips for React Developers',
    description: 'Essential TypeScript patterns and best practices that every React developer should know in 2024.',
    category: 'TypeScript',
    createdBy: 'Ammarr',
    createdById: 'admin-1',
    saved: false,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=700&fit=crop',
    title: 'Custom Hooks Pattern',
    description: 'How to create powerful custom hooks for state management and side effects in React applications.',
    category: 'Code Snippets',
    createdBy: 'Ammarr',
    createdById: 'admin-1',
    saved: false,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=650&fit=crop',
    title: 'Modern React Component Architecture',
    description: 'Best practices for organizing and structuring React components in large-scale applications.',
    category: 'Tech Tips',
    createdBy: 'Ammarr',
    createdById: 'admin-1',
    saved: false,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=550&fit=crop',
    title: 'React Performance Optimization',
    description: 'Advanced techniques for optimizing React app performance: memoization, lazy loading, and bundle splitting.',
    category: 'Tech Tips',
    createdBy: 'Ammarr',
    createdById: 'admin-1',
    saved: false,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=600&fit=crop',
    title: 'Beautiful React Component Library',
    description: 'Showcase of modern UI components built with React and styled-components for inspiring designs.',
    category: 'UI/UX Design',
    createdBy: 'Ammarr',
    createdById: 'admin-1',
    saved: false,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=400&fit=crop',
    title: 'When useEffect Becomes a Meme',
    description: 'That moment when you realize you\'ve been using useEffect wrong for the entire project 😅',
    category: 'Memes',
    createdBy: 'Ammarr',
    createdById: 'admin-1',
    saved: false,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?w=400&h=750&fit=crop',
    title: 'JavaScript ES2024 Features',
    description: 'New JavaScript features in ES2024 that will improve your React development workflow.',
    category: 'JavaScript',
    createdBy: 'Ammarr',
    createdById: 'admin-1',
    saved: false,
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];

// Legacy exports for backward compatibility (will be updated throughout the app)
export type Pin = Post;
export const getPins = getPosts;
export const savePins = savePosts;

// Legacy user functions
export const getUser = (): User => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return {
      id: 'guest',
      name: 'Guest',
      password: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      role: 'user',
      savedPosts: [],
      createdPosts: [],
      createdAt: new Date().toISOString(),
      savedPins: [],
      createdPins: []
    };
  }
  
  const fullUser = getUserById(currentUser.id);
  if (!fullUser) {
    return {
      id: currentUser.id,
      name: currentUser.name,
      password: '',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      role: currentUser.role,
      savedPosts: [],
      createdPosts: [],
      createdAt: new Date().toISOString(),
      savedPins: [],
      createdPins: []
    };
  }
  
  // Map new properties to legacy properties for backward compatibility
  const userWithLegacy = {
    ...fullUser,
    savedPins: fullUser.savedPosts,
    createdPins: fullUser.createdPosts
  };
  
  return userWithLegacy;
};

export const saveUser = (user: User): void => {
  // Map legacy properties back to new properties
  const updatedUser = {
    ...user,
    savedPosts: user.savedPins || user.savedPosts || [],
    createdPosts: user.createdPins || user.createdPosts || []
  };
  updateUser(updatedUser);
};