import { useCallback, useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { FormData } from '@/components/base-form/type';
import { IMAGE_LIMIT, IMAGE_MAX_SIZE } from '@/features/store-info/constants';
import { getStoreBasicForm, getStoreDesForm } from '@/features/store-info/services';
import type { PreviewImage } from '@/features/store-info/types';
import {
  cleanupPreviewUrls,
  createImageFormData,
  createPreviewImages,
  loadInitialFormData,
  submitStoreForm,
  uploadImages,
  validateImageFiles,
} from '@/features/store-info/utils';

interface UseStoreProps {
  storeBasicFormHook: UseFormReturn<FormData>;
  storeDescFormHook: UseFormReturn<FormData>;
  storeImagesFormHook: UseFormReturn<FormData>;
}

interface UseStoreReturn {
  previewImages: PreviewImage[];
  isBasicFormUploading: boolean;
  isDesFormUploading: boolean;
  isImagesUploading: boolean;
  handleAddImages: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: (id: string) => void;
  handleSubmitImages: (data: FormData) => Promise<void>;
  handleFormSubmit: (data: FormData, formTitle: '基本資料' | '店家說明') => Promise<void>;
}

/**
 * 店家資訊管理 hook
 * 管理所有狀態和事件處理邏輯
 */
const useStore = ({
  storeBasicFormHook,
  storeDescFormHook,
  storeImagesFormHook,
}: UseStoreProps): UseStoreReturn => {
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [isBasicFormUploading, setIsBasicFormUploading] = useState(false);
  const [isDesFormUploading, setIsDesFormUploading] = useState(false);
  const [isImagesUploading, setIsImagesUploading] = useState(false);

  // 新增圖片
  const handleAddImages = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { validFiles, errors } = validateImageFiles(
        event.target.files,
        previewImages.length,
        IMAGE_LIMIT,
        IMAGE_MAX_SIZE,
      );

      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      try {
        const newPreviewImages = await createPreviewImages(validFiles);
        setPreviewImages(prev => [...prev, ...newPreviewImages]);
      } catch (error) {
        alert(`處理圖片時發生錯誤 ${error}，請重試`);
      }
    },
    [previewImages.length],
  );

  // 移除圖片
  const handleRemoveImage = useCallback((id: string) => {
    setPreviewImages(prev => {
      const updated = prev.filter(img => img.id !== id);

      // 清理 URL 避免記憶體洩漏
      const removedImage = prev.find(img => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.url);
      }

      return updated;
    });
  }, []);

  // 圖片提交
  const handleSubmitImages = useCallback(async (data: FormData) => {
    setIsImagesUploading(true);

    try {
      const imageFormData = createImageFormData(data.files);
      await uploadImages(imageFormData);

      cleanupPreviewUrls(previewImages);
      alert('上傳成功！');
    } catch (error) {
      alert(error instanceof Error ? error.message : '上傳發生未知錯誤');
    } finally {
      setIsImagesUploading(false);
    }
  }, [previewImages]);

  // 表單提交
  const handleFormSubmit = useCallback(
    async (data: FormData, formTitle: '基本資料' | '店家說明') => {
      if (formTitle === '基本資料') setIsBasicFormUploading(true);
      if (formTitle === '店家說明') setIsDesFormUploading(true);

      try {
        await submitStoreForm(data, formTitle);
        alert(`${formTitle}儲存成功！`);
      } catch (error) {
        alert(error instanceof Error ? error.message : `${formTitle}儲存失敗，請重試`);
      } finally {
        if (formTitle === '基本資料') setIsBasicFormUploading(false);
        if (formTitle === '店家說明') setIsDesFormUploading(false);
      }
    },
    [],
  );

  // 當預覽圖片變更時，更新表單的檔案值
  useEffect(() => {
    const allFiles = previewImages.map(img => img.file);
    storeImagesFormHook.setValue('files', allFiles);
  }, [previewImages, storeImagesFormHook]);

  // 載入初始基本資料
  useEffect(() => {
    loadInitialFormData(getStoreBasicForm, storeBasicFormHook.setValue).catch(error => {
      console.error('載入初始店家基本資料失敗：', error);
    });
  }, [storeBasicFormHook]);

  // 載入初始店家說明
  useEffect(() => {
    loadInitialFormData(getStoreDesForm, storeDescFormHook.setValue).catch(error => {
      console.error('載入初始店家說明失敗：', error);
    });
  }, [storeDescFormHook]);

  return {
    previewImages,
    isBasicFormUploading,
    isDesFormUploading,
    isImagesUploading,
    handleAddImages,
    handleRemoveImage,
    handleSubmitImages,
    handleFormSubmit,
  };
};

export { useStore };
export type { UseStoreReturn, UseStoreProps }; 