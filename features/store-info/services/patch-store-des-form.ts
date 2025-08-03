import type { FormData } from '@/components/base-form/type';

export const patchStoreDesForm = async (data: FormData): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('店家說明 API 呼叫:', data);
      resolve();
    }, 1000);
  });
};