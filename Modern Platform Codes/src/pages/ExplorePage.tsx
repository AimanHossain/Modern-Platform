import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
  } | null;
}

interface FilterState {
  category: string;
  date: string;
  sort: string;
}

const PostCard: React.FC<Post> = ({ title, content, image_url, created_at, profiles }) => {
  const displayName = profiles?.full_name || profiles?.email?.split('@')[0] || 'Anonymous';
  
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {image_url && (
        <img 
          src={image_url} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{content}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            {profiles?.avatar_url ? (
              <img 
                src={profiles.avatar_url} 
                alt={displayName} 
                className="w-6 h-6 rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                <User size={14} className="text-gray-500 dark:text-gray-400" />
              </div>
            )}
            <span>{displayName}</span>
          </div>
          <span>{new Date(created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    date: '',
    sort: 'recent'
  });
  
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, allPosts]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllPosts(data as Post[]);
      setFilteredPosts(data as Post[]);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allPosts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filter
    if (filters.date) {
      const now = new Date();
      const postDate = new Date();
      
      switch (filters.date) {
        case 'today':
          filtered = filtered.filter(post => {
            const postDate = new Date(post.created_at);
            return postDate.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          filtered = filtered.filter(post => new Date(post.created_at) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          filtered = filtered.filter(post => new Date(post.created_at) >= monthAgo);
          break;
        case 'year':
          const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          filtered = filtered.filter(post => new Date(post.created_at) >= yearAgo);
          break;
      }
    }

    // Apply sorting
    switch (filters.sort) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
    }

    setFilteredPosts(filtered);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      date: '',
      sort: 'recent'
    });
  };
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Explore Content</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover amazing content created by our community
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} />}
            fullWidth
          />
          <Button type="submit">Search</Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={toggleFilter}
            rightIcon={<ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />}
          >
            <Filter size={18} className="mr-1" /> 
            Filters
          </Button>
        </form>
        
        {isFilterOpen && (
          <motion.div 
            className="bg-white dark:bg-gray-800 p-4 mt-2 rounded-md shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <select
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Any time</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="year">This year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort by
                </label>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="recent">Most recent</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2"
                onClick={resetFilters}
              >
                Reset
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">No posts found. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;