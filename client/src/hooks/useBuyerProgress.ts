import { useState, useEffect, useCallback, useRef } from 'react';
import { buyerService, BuyerProgress } from '../services/buyer';

interface UseBuyerProgressOptions {
  stepId?: number; // 当前页面对应的step ID
  autoRefreshOnStepChange?: boolean; // 是否在步骤变化时自动刷新
}

// 全局progress事件监听器
const progressEventListeners = new Set<() => void>();

// 触发全局progress更新
export const triggerGlobalBuyerProgressUpdate = () => {
  progressEventListeners.forEach(listener => listener());
};

export const useBuyerProgress = (options: UseBuyerProgressOptions = {}) => {
  const [progress, setProgress] = useState<BuyerProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastCurrentStepRef = useRef<number | null>(null);

  const refreshProgress = useCallback(async () => {
    try {
      setError(null);
      const progressRes = await buyerService.getProgress();
      
      // 检查currentStep是否发生变化
      const newCurrentStep = progressRes.progress.currentStep;
      const hasStepChanged = lastCurrentStepRef.current !== null && 
                           lastCurrentStepRef.current !== newCurrentStep;
      
      setProgress(progressRes.progress);
      lastCurrentStepRef.current = newCurrentStep;
      
      // 如果步骤发生变化，触发全局更新
      if (hasStepChanged && options.autoRefreshOnStepChange !== false) {
        setTimeout(() => triggerGlobalBuyerProgressUpdate(), 100);
      }
      
      return progressRes.progress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch progress';
      setError(errorMessage);
      throw err;
    }
  }, [options.autoRefreshOnStepChange]);

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

  // 初始化
  useEffect(() => {
    const initializeProgress = async () => {
      try {
        setLoading(true);
        await refreshProgress();
      } catch (err) {
        console.error('Failed to initialize progress:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeProgress();
  }, [refreshProgress]);

  const updateStep = useCallback(async (stepId: number, completed: boolean = true) => {
    try {
      await buyerService.updateStep(stepId, completed);
      await refreshProgress();
      // 触发全局更新
      triggerGlobalBuyerProgressUpdate();
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
    updateStep
  };
}; 