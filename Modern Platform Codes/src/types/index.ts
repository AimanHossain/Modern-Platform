export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (user: User) => void;
  clearError: () => void;
};