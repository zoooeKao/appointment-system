import type { FormData } from '@/components/base-form/type';
import { patchStoreBasicForm, patchStoreDesForm } from '@/features/store-info/services';

// 提交店家表單
export const submitStoreForm = async (
  data: FormData,
  formTitle: '基本資料' | '店家說明',
): Promise<void> => {
  try {
    if (formTitle === '基本資料') {
      await patchStoreBasicForm(data);
    }
    if (formTitle === '店家說明') {
      await patchStoreDesForm(data);
    }
  } catch (error) {
    console.error(`${formTitle}儲存失敗:`, error);
    throw new Error(`${formTitle}儲存失敗，請重試`);
  }
};

// 上傳圖片
export const uploadImages = async (imageFormData: globalThis.FormData): Promise<void> => {
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: imageFormData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || '上傳失敗');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('上傳發生未知錯誤');
  }
};

// 載入初始表單資料的通用函式
export const loadInitialFormData = async <T extends Record<string, unknown>>(
  loadFunction: () => Promise<T>,
  setValue: (key: string, value: unknown) => void,
): Promise<void> => {
  try {
    const initialData = await loadFunction();
    Object.entries(initialData).forEach(([key, value]) => {
      setValue(key, value);
    });
  } catch (error) {
    console.error('載入初始表單資料失敗：', error);
    throw error;
  }
}; 