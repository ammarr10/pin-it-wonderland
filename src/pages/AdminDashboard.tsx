import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Eye, Trash2, Users, FileText, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getCurrentUser,
  getPendingPosts,
  getApprovedPosts,
  approvePost,
  rejectPost,
  deletePost,
  getUsers,
  logout,
  type Post,
  type User
} from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [approvedPosts, setApprovedPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin-login');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = () => {
    setLoading(true);
    try {
      setPendingPosts(getPendingPosts());
      setApprovedPosts(getApprovedPosts());
      setUsers(getUsers());
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = (postId: string) => {
    approvePost(postId);
    loadData();
    toast({
      title: "Post approved",
      description: "The post has been approved and is now visible to users.",
    });
  };

  const handleRejectPost = (postId: string) => {
    rejectPost(postId);
    loadData();
    toast({
      title: "Post rejected",
      description: "The post has been rejected.",
    });
  };

  const handleDeletePost = (postId: string) => {
    deletePost(postId);
    loadData();
    toast({
      title: "Post deleted",
      description: "The post has been permanently deleted.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const PostCard: React.FC<{ post: Post; showActions?: boolean }> = ({ post, showActions = true }) => (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm leading-tight">{post.title}</h3>
          <Badge variant={post.status === 'approved' ? 'default' : 'secondary'} className="ml-2 text-xs">
            {post.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{post.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>by {post.createdBy}</span>
          <span>{post.category}</span>
        </div>
        
        {showActions && post.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleApprovePost(post.id)}
              className="flex-1 h-8 bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-3 w-3 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRejectPost(post.id)}
              className="flex-1 h-8 border-red-200 text-red-600 hover:bg-red-50"
            >
              <X className="h-3 w-3 mr-1" />
              Reject
            </Button>
          </div>
        )}
        
        {showActions && post.status === 'approved' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeletePost(post.id)}
            className="w-full h-8 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">The Land Community Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/create">
                <Button variant="outline" size="sm">
                  Create Post
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Pending Posts</p>
                  <p className="text-2xl font-bold">{pendingPosts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Approved Posts</p>
                  <p className="text-2xl font-bold">{approvedPosts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Total Posts</p>
                  <p className="text-2xl font-bold">{pendingPosts.length + approvedPosts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending Posts ({pendingPosts.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved Posts ({approvedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="users">
              Users ({users.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            {pendingPosts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending posts</h3>
                  <p className="text-muted-foreground">All posts have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pendingPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="approved" className="mt-6">
            {approvedPosts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No approved posts</h3>
                  <p className="text-muted-foreground">No posts have been approved yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {approvedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user.createdPosts?.length || 0} posts created
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;