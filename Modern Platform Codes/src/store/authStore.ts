import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // First try to get the existing profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();
          
        if (profileError) throw profileError;
        
        // If profile doesn't exist, create it
        let profile = profileData;
        if (!profile) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ 
              id: authData.user.id,
              email: authData.user.email,
              full_name: '',
            }])
            .select()
            .single();
            
          if (createError) throw createError;
          profile = newProfile;
        }

        set({ 
          user: {
            id: authData.user.id,
            email: authData.user.email || '',
            full_name: profile.full_name || '',
            avatar_url: profile.avatar_url || null,
            created_at: authData.user.created_at,
          },
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false, user: null });
    }
  },
  
  signUp: async (email, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id,
              full_name: fullName,
              email: email,
            }
          ])
          .select()
          .single();
          
        if (profileError) throw profileError;
        
        if (!profileData) {
          throw new Error('Failed to create profile');
        }

        set({ 
          user: {
            id: authData.user.id,
            email: email,
            full_name: fullName,
            avatar_url: null,
            created_at: authData.user.created_at,
          },
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false, user: null });
    }
  },
  
  signOut: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isLoading: false, error: null });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  updateProfile: (user) => {
    set({ user });
  },
  
  clearError: () => set({ error: null }),
}));

// Initialize auth state from session
export const initializeAuth = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    
    if (session?.user) {
      // First try to get the existing profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (profileError) throw profileError;
      
      // If profile doesn't exist, create it
      let profile = profileData;
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: session.user.id,
            email: session.user.email,
            full_name: '',
          }])
          .select()
          .single();
          
        if (createError) throw createError;
        profile = newProfile;
      }

      useAuthStore.setState({ 
        user: {
          id: session.user.id,
          email: session.user.email || '',
          full_name: profile.full_name || '',
          avatar_url: profile.avatar_url || null,
          created_at: session.user.created_at,
        },
        isLoading: false,
        error: null
      });
    } else {
      useAuthStore.setState({ isLoading: false, user: null, error: null });
    }
  } catch (error) {
    useAuthStore.setState({ 
      isLoading: false, 
      user: null, 
      error: (error as Error).message 
    });
  }
};