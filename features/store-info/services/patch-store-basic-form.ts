import type { FormData } from '@/components/base-form/type';

export const patchStoreBasicForm = async (data: FormData): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('基本資料 API 呼叫:', data);
      resolve();
    }, 1000);
  });
};