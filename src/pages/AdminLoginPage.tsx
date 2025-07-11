import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = login(formData.name, formData.password);
      
      if (user && user.role === 'admin') {
        toast({
          title: "Welcome, Admin!",
          description: "Successfully logged in with administrator privileges.",
        });
        navigate('/admin');
      } else if (user && user.role === 'user') {
        toast({
          title: "Access denied",
          description: "You don't have administrator privileges.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Invalid credentials",
          description: "Please check your admin credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-red-50/20 to-orange-50/20 dark:via-red-950/20 dark:to-orange-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card className="border-0 shadow-xl bg-card/95 backdrop-blur">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Admin Access</CardTitle>
              <CardDescription className="text-muted-foreground">
                Administrator login for The Land
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Admin Username
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter admin username"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1 h-9 w-9 p-0"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-medium"
                disabled={isLoading || !formData.name || !formData.password}
              >
                {isLoading ? 'Signing in...' : 'Admin Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Need regular access?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  User login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            This area is restricted to administrators only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;