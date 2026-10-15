import { isSupabaseConfigured, supabase } from './supabase';
import { mockStorage } from './mockStorage';
import { UsageTransaction } from '../types';

export interface CreditCheckResult {
  hasSufficient: boolean;
  currentBalance: number;
  cost: number;
}

export const creditManager = {
  /**
   * Deducts credits atomically.
   */
  async deductCredits(
    userId: string,
    creditType: 'image' | 'video',
    amount: number,
    reason: string
  ): Promise<{ success: boolean; error?: string; remaining?: number }> {
    const idempotencyKey = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('deduct_user_credits', {
          p_user_id: userId,
          p_credit_type: creditType,
          p_amount: amount,
          p_reason: reason,
          p_idempotency_key: idempotencyKey
        });

        if (error) {
          return { success: false, error: error.message };
        }
        return data as { success: boolean; error?: string; remaining?: number };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Local Sandbox Storage Fallback
    const storedProfile = localStorage.getItem('flow_ai_user_profile');
    if (!storedProfile) {
      return { success: false, error: 'User profile not found.' };
    }

    const profile = JSON.parse(storedProfile);
    const balanceKey = creditType === 'image' ? 'image_credits_remaining' : 'video_credits_remaining';
    const current = profile[balanceKey] || 0;

    if (current < amount) {
      return {
        success: false,
        error: `Insufficient ${creditType} credits. You have ${current} remaining, but ${amount} is required.`
      };
    }

    profile[balanceKey] = current - amount;
    localStorage.setItem('flow_ai_user_profile', JSON.stringify(profile));

    // Save transaction
    const tx: UsageTransaction = {
      id: 'tx-' + Date.now(),
      owner_id: userId,
      operation_ref: creditType,
      transaction_type: 'deduction',
      credit_amount: amount,
      idempotency_key: idempotencyKey,
      reason,
      created_at: new Date().toISOString()
    };
    const rawTx = localStorage.getItem('flow_ai_transactions');
    const transactions = rawTx ? JSON.parse(rawTx) : [];
    transactions.unshift(tx);
    localStorage.setItem('flow_ai_transactions', JSON.stringify(transactions));

    return { success: true, remaining: profile[balanceKey] };
  },

  /**
   * Refunds credits in case of provider error.
   */
  async refundCredits(
    userId: string,
    creditType: 'image' | 'video',
    amount: number,
    reason: string
  ): Promise<void> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('flow_ai_user_profile');
      if (stored) {
        const profile = JSON.parse(stored);
        const balanceKey = creditType === 'image' ? 'image_credits_remaining' : 'video_credits_remaining';
        profile[balanceKey] = (profile[balanceKey] || 0) + amount;
        localStorage.setItem('flow_ai_user_profile', JSON.stringify(profile));
      }
    }
  }
};
