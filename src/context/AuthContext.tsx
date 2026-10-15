import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  role: UserRole;
  isSandbox: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  user: {
    id: 'demo-user-101',
    user_id: 'demo-user-101',
    email: 'creator@flowai.studio',
    display_name: 'Owais (Creator)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    account_status: 'active',
    image_credits_remaining: 20,
    video_credits_remaining: 3,
    role: 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  admin: {
    id: 'demo-admin-202',
    user_id: 'demo-admin-202',
    email: 'admin@flowai.studio',
    display_name: 'Staff Moderator',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    account_status: 'active',
    image_credits_remaining: 50,
    video_credits_remaining: 15,
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  super_admin: {
    id: 'demo-superadmin-303',
    user_id: 'demo-superadmin-303',
    email: 'superadmin@flowai.studio',
    display_name: 'Owais (Platform Owner)',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    account_status: 'active',
    image_credits_remaining: 999,
    video_credits_remaining: 99,
    role: 'super_admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      setLoading(true);

      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile and role from Supabase
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();

            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();

            if (profile) {
              setUser({
                ...profile,
                role: roleData?.role || 'user'
              });
            }
          }
        } catch (e) {
          console.warn('Error loading Supabase auth session, using fallback sandbox');
        }
      } else {
        // Load stored sandbox profile or default to demo user
        const stored = localStorage.getItem('flow_ai_user_profile');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(DEMO_PROFILES.user);
          }
        } else {
          setUser(DEMO_PROFILES.user);
          localStorage.setItem('flow_ai_user_profile', JSON.stringify(DEMO_PROFILES.user));
        }
      }

      setLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (profile) {
            setUser({
              ...profile,
              role: roleData?.role || 'user'
            });
          }
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, password?: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (isSupabaseConfigured && password) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Sandbox Mock Login
    const lowerEmail = email.toLowerCase();
    let targetRole: UserRole = 'user';
    if (lowerEmail.includes('superadmin')) targetRole = 'super_admin';
    else if (lowerEmail.includes('admin')) targetRole = 'admin';

    const newProfile: UserProfile = {
      ...DEMO_PROFILES[targetRole],
      email,
      display_name: email.split('@')[0],
      updated_at: new Date().toISOString()
    };
    setUser(newProfile);
    localStorage.setItem('flow_ai_user_profile', JSON.stringify(newProfile));
    return { success: true };
  };

  const signUp = async (email: string, password?: string, fullName?: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password && password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    if (isSupabaseConfigured && password) {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Sandbox Profile Initialization
    const newProfile: UserProfile = {
      id: 'usr_' + Date.now(),
      user_id: 'usr_' + Date.now(),
      email,
      display_name: fullName || email.split('@')[0],
      account_status: 'active',
      image_credits_remaining: 20,
      video_credits_remaining: 3,
      role: 'user', // Never allow client to elevate role
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(newProfile);
    localStorage.setItem('flow_ai_user_profile', JSON.stringify(newProfile));
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('flow_ai_user_profile');
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const switched = DEMO_PROFILES[targetRole];
    setUser(switched);
    localStorage.setItem('flow_ai_user_profile', JSON.stringify(switched));
  };

  const refreshProfile = () => {
    const stored = localStorage.getItem('flow_ai_user_profile');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role: user?.role || 'user',
        isSandbox: !isSupabaseConfigured,
        login,
        signUp,
        logout,
        switchDemoRole,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
