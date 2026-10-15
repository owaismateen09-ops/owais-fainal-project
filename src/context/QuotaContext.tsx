import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { creditManager } from '../lib/creditManager';

interface QuotaContextType {
  imageCredits: number;
  videoCredits: number;
  useImageCredit: (amount?: number, reason?: string) => Promise<{ success: boolean; error?: string }>;
  useVideoCredit: (amount?: number, reason?: string) => Promise<{ success: boolean; error?: string }>;
  refreshCredits: () => void;
}

const QuotaContext = createContext<QuotaContextType | undefined>(undefined);

export const QuotaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, refreshProfile } = useAuth();
  const [imageCredits, setImageCredits] = useState<number>(user?.image_credits_remaining ?? 20);
  const [videoCredits, setVideoCredits] = useState<number>(user?.video_credits_remaining ?? 3);

  useEffect(() => {
    if (user) {
      setImageCredits(user.image_credits_remaining);
      setVideoCredits(user.video_credits_remaining);
    }
  }, [user]);

  const useImageCredit = async (amount = 1, reason = 'AI Image Generation') => {
    if (!user) return { success: false, error: 'User must be authenticated.' };

    const result = await creditManager.deductCredits(user.user_id, 'image', amount, reason);
    if (result.success && result.remaining !== undefined) {
      setImageCredits(result.remaining);
      refreshProfile();
    }
    return result;
  };

  const useVideoCredit = async (amount = 1, reason = 'AI Video Generation') => {
    if (!user) return { success: false, error: 'User must be authenticated.' };

    const result = await creditManager.deductCredits(user.user_id, 'video', amount, reason);
    if (result.success && result.remaining !== undefined) {
      setVideoCredits(result.remaining);
      refreshProfile();
    }
    return result;
  };

  const refreshCredits = () => {
    refreshProfile();
  };

  return (
    <QuotaContext.Provider
      value={{
        imageCredits,
        videoCredits,
        useImageCredit,
        useVideoCredit,
        refreshCredits
      }}
    >
      {children}
    </QuotaContext.Provider>
  );
};

export const useQuota = () => {
  const context = useContext(QuotaContext);
  if (!context) {
    throw new Error('useQuota must be used within a QuotaProvider');
  }
  return context;
};
