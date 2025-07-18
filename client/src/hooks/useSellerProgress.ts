import { useState, useEffect, useCallback, useRef } from 'react';
import { sellerService, SellerProgress } from '../services/seller';

interface UseSellerProgressOptions {
  stepId?: number; // 当前页面对应的step ID
  autoMarkVisited?: boolean; // 是否自动标记页面访问
  autoRefreshOnStepChange?: boolean; // 是否在步骤变化时自动刷新
}

// 全局progress事件监听器
const progressEventListeners = new Set<() => void>();

// 触发全局progress更新
export const triggerGlobalProgressUpdate = () => {
  progressEventListeners.forEach(listener => listener());
};

export const useSellerProgress = (options: UseSellerProgressOptions = {}) => {
  const [progress, setProgress] = useState<SellerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastCurrentStepRef = useRef<number | null>(null);

  const refreshProgress = useCallback(async () => {
    try {
      setError(null);
      const progressRes = await sellerService.getProgress();
      
      // 检查currentStep是否发生变化
      const newCurrentStep = progressRes.progress.currentStep;
      const hasStepChanged = lastCurrentStepRef.current !== null && 
                           lastCurrentStepRef.current !== newCurrentStep;
      
      setProgress(progressRes.progress);
      lastCurrentStepRef.current = newCurrentStep;
      
      // 如果步骤发生变化，触发全局更新
      if (hasStepChanged && options.autoRefreshOnStepChange !== false) {
        setTimeout(() => triggerGlobalProgressUpdate(), 100);
      }
      
      return progressRes.progress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch progress';
      setError(errorMessage);
      throw err;
    }
  }, [options.autoRefreshOnStepChange]);

  const markPageVisited = useCallback(async (stepId: number) => {
    try {
      await sellerService.markPageVisited(stepId);
      // 页面访问后刷新progress
      await refreshProgress();
    } catch (err) {
      console.error('Failed to mark page visited:', err);
    }
  }, [refreshProgress]);

  // 全局进度更新监听器
  useEffect(() => {
    const listener = () => {
      refreshProgress();
    };
    
    progressEventListeners.add(listener);
    
    return () => {
      progressEventListeners.delete(listener);
    };
  }, [refreshProgress]);

  // 初始化和自动标记页面访问
  useEffect(() => {
    const initializeProgress = async () => {
      try {
        setLoading(true);
        await refreshProgress();
        
        // 自动标记页面访问
        if (options.autoMarkVisited && options.stepId !== undefined) {
          await markPageVisited(options.stepId);
        }
      } catch (err) {
        console.error('Failed to initialize progress:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeProgress();
  }, [options.stepId, options.autoMarkVisited, refreshProgress, markPageVisited]);

  const updateStep = useCallback(async (stepId: number) => {
    try {
      await sellerService.updateStep(stepId);
      await refreshProgress();
      // 触发全局更新
      triggerGlobalProgressUpdate();
    } catch (err) {
      console.error('Failed to update step:', err);
      throw err;
    }
  }, [refreshProgress]);

  return {
    progress,
    loading,
    error,
    refreshProgress,
    markPageVisited,
    updateStep
  };
}; 