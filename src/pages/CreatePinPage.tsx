import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPins, savePins, getUser, saveUser, generateId, CATEGORIES } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const CreatePinPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update image preview if it's the image URL field
    if (field === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const handleImageLoad = () => {
    // Image loaded successfully
  };

  const handleImageError = () => {
    setImagePreview('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a title for your pin.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.imageUrl.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an image URL.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category.",
        variant: "destructive",
      });
      return false;
    }

    // Simple URL validation
    try {
      new URL(formData.imageUrl);
    } catch {
      toast({
        title: "Validation Error",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const user = getUser();
      const newPin = {
        id: generateId(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.imageUrl.trim(),
        category: formData.category,
        createdBy: user.name,
        saved: false,
        createdAt: new Date().toISOString(),
      };

      // Add to pins
      const pins = getPins();
      const updatedPins = [newPin, ...pins];
      savePins(updatedPins);

      // Add to user's created pins
      user.createdPins.push(newPin.id);
      saveUser(user);

      toast({
        title: "Pin created!",
        description: "Your pin has been successfully created.",
      });

      // Navigate back to home
      navigate('/');
    } catch (error) {
      console.error('Error creating pin:', error);
      toast({
        title: "Error",
        description: "Failed to create pin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Create Pin</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Preview */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Pin preview"
                    className="w-full h-auto object-cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="aspect-[3/4] flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Image preview will appear here</p>
                    </div>
                  </div>
                )}
                
                {/* Pin Card Preview */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    {formData.title || 'Pin Title'}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {formData.description || 'Pin description will appear here...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
                      <span className="text-xs text-muted-foreground">You</span>
                    </div>
                    {formData.category && (
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                        {formData.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Add a title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={100}
                className="text-base"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Tell everyone what your Pin is about"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={500}
                rows={4}
                className="text-base resize-none"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-foreground mb-2">
                Image URL *
              </label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter a direct link to an image (JPG, PNG, GIF)
              </p>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter(cat => cat !== 'All').map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Create Pin
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePinPage;