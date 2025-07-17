import { useState, useEffect, useCallback } from 'react';
import { sellerService, SellerProgress } from '../services/seller';

interface UseSellerProgressOptions {
  stepId?: number; // 当前页面对应的step ID
  autoMarkVisited?: boolean; // 是否自动标记页面访问
}

export const useSellerProgress = (options: UseSellerProgressOptions = {}) => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProgress = useCallback(async () => {
    try {
      setError(null);
      const progressRes = await sellerService.getProgress();
      setProgress(progressRes.progress);
      return progressRes.progress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch progress';
      setError(errorMessage);
      console.error('Failed to fetch progress:', err);
      throw err;
    }
  }, []);

  const markPageVisited = useCallback(async (stepId: number) => {
    try {
      const result = await sellerService.markPageVisited(stepId);
      if (result.stepCompleted) {
        // If step was auto-completed, refresh progress
        await refreshProgress();
      }
      return result;
    } catch (err) {
      console.error('Failed to mark page visited:', err);
      throw err;
    }
  }, [refreshProgress]);

  const updateStep = useCallback(async (stepId: number) => {
    try {
      await sellerService.updateStep(stepId);
      await refreshProgress();
    } catch (err) {
      console.error('Failed to update step:', err);
      throw err;
    }
  }, [refreshProgress]);

  useEffect(() => {
    const initializeProgress = async () => {
      try {
        setLoading(true);
        await refreshProgress();
        
        // Auto-mark page visited if specified
        if (options.stepId !== undefined && options.autoMarkVisited) {
          await markPageVisited(options.stepId);
        }
      } catch (err) {
        // Error already handled in refreshProgress
      } finally {
        setLoading(false);
      }
    };

    initializeProgress();
  }, [options.stepId, options.autoMarkVisited, refreshProgress, markPageVisited]);

  return {
    progress,
    loading,
    error,
    refreshProgress,
    markPageVisited,
    updateStep
  };
}; 