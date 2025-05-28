import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Edit, Plus, Image, Save, X, Trash2, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FileUpload } from '../components/ui/FileUpload';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image_url: ''
  });
  const [profile, setProfile] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    bio: 'Creative professional passionate about digital design and technology.',
    website: 'https://example.com',
    location: 'Abu Dhabi, UAE',
    avatar_url: user?.avatar_url || null
  });
  
  useEffect(() => {
    if (user?.id) {
      fetchUserPosts();
    }
  }, [user?.id]);

  const fetchUserPosts = async () => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again later.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      setIsDeleting(postId);
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again later.');
    } finally {
      setIsDeleting(null);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isCreatingPost) {
      setNewPost(prev => ({ ...prev, [name]: value }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!user?.id) {
        throw new Error('Please sign in to create a post');
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData) {
        throw new Error('User profile not found. Please try logging in again.');
      }

      const { error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            title: newPost.title,
            content: newPost.content,
            image_url: newPost.image_url || null
          }
        ]);

      if (error) throw error;

      setNewPost({ title: '', content: '', image_url: '' });
      setIsCreatingPost(false);
      fetchUserPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setError((error as Error).message);
    }
  };
  
  const handleSave = async () => {
    try {
      if (!user?.id) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          avatar_url: profile.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;

      updateProfile({
        ...user,
        full_name: profile.fullName,
        avatar_url: profile.avatar_url
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again later.');
    }
  };

  const handleAvatarUpload = (url: string) => {
    setProfile(prev => ({ ...prev, avatar_url: url }));
  };

  const handlePostImageUpload = (url: string) => {
    setNewPost(prev => ({ ...prev, image_url: url }));
  };
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative" />
        
        {/* Profile Info */}
        <div className="relative px-6 sm:px-8 -mt-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-end">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.fullName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                    <User size={48} className="text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <FileUpload
                    bucket="avatars"
                    onUploadComplete={handleAvatarUpload}
                    acceptedFileTypes={['image/jpeg', 'image/png']}
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                </div>
              )}
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow text-center sm:text-left">
              {isEditing ? (
                <Input
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleInputChange}
                  label="Full Name"
                  className="text-2xl font-bold"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.fullName || "Your Name"}
                </h1>
              )}
              <div className="flex items-center justify-center sm:justify-start text-gray-600 dark:text-gray-400 mt-1">
                <Mail size={16} className="mr-1" />
                <span>{profile.email}</span>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0">
              {isEditing ? (
                <Button
                  onClick={handleSave}
                  leftIcon={<Save size={16} />}
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  leftIcon={<Edit size={16} />}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Bio and Details */}
        <div className="px-6 sm:px-8 py-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h2>
            {isEditing ? (
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={3}
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-300">{profile.bio}</p>
            )}
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                {isEditing ? (
                  <Input
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.location}</p>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</h3>
                {isEditing ? (
                  <Input
                    name="website"
                    value={profile.website}
                    onChange={handleInputChange}
                  />
                ) : (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {profile.website}
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* User Content */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Content</h2>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus size={16} />}
                onClick={() => setIsCreatingPost(true)}
              >
                Add New
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            {isCreatingPost ? (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create New Post</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreatingPost(false)}
                  >
                    <X size={20} />
                  </Button>
                </div>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <Input
                    name="title"
                    label="Title"
                    value={newPost.title}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content
                    </label>
                    <textarea
                      name="content"
                      value={newPost.content}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Image
                    </label>
                    <FileUpload
                      bucket="posts"
                      onUploadComplete={handlePostImageUpload}
                      acceptedFileTypes={['image/jpeg', 'image/png', 'image/gif']}
                      maxSize={10 * 1024 * 1024} // 10MB
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreatingPost(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Post
                    </Button>
                  </div>
                </form>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDeletePost(post.id)}
                        isLoading={isDeleting === post.id}
                        leftIcon={<Trash2 size={16} />}
                      >
                        Delete
                      </Button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {post.content}
                    </p>
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Posted on {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                <Plus size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                  Start sharing your creative work, tutorials, or ideas with the community.
                </p>
                <Button
                  leftIcon={<Plus size={16} />}
                  onClick={() => setIsCreatingPost(true)}
                >
                  Create Your First Post
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;