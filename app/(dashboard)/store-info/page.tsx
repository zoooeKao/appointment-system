'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { IMAGE_LIMIT, IMAGE_MAX_SIZE } from '@/constants';
import { storeBasicFormFields, storeDescFormFields, storeImagesFormFields } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { PreviewImage } from '@/types';
import BaseCard from '@/components/base-card';
import BaseForm from '@/components/base-form/index';
import { type FormData, FormResolver } from '@/components/base-form/type';
import PageWrapper from '@/components/base-page-wrapper';
import ImageUploadForm from '@/components/image-upload-form';


const Store = () => {
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [isBasicFormUploading, setIsBasicFormUploading] = useState(false);
  const [isDesFormUploading, setIsDesFormUploading] = useState(false);
  const [isImagesUploading, setIsImagesUploading] = useState(false);

  const storeBasicFormHook = useForm<FormData>({
    resolver: zodResolver(FormResolver(storeBasicFormFields)),
    defaultValues: Object.fromEntries(storeBasicFormFields.map(field => [field.name, field.value])),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const storeDescFormHook = useForm<FormData>({
    resolver: zodResolver(FormResolver(storeDescFormFields)),
    defaultValues: Object.fromEntries(storeDescFormFields.map(field => [field.name, field.value])),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const storeImagesFormHook = useForm<FormData>({
    resolver: zodResolver(FormResolver(storeImagesFormFields)),
    defaultValues: {
      files: [],
    },
  });

  // 建立預覽圖片的函式
  const createPreviewUrl = useCallback((file: File): Promise<string> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }, []);

  const { setValue } = storeImagesFormHook;

  // 處理檔案選擇
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files;
      if (!selected) return;

      const selectedArray = Array.from(selected);

      if (previewImages.length + selectedArray.length > IMAGE_LIMIT) {
        alert(`最多只能上傳 ${IMAGE_LIMIT} 張圖片`);
        return;
      }

      const oversizedFiles = selectedArray.filter(file => file.size > IMAGE_MAX_SIZE);
      const validFiles = selectedArray.filter(file => file.size <= IMAGE_MAX_SIZE);

      if (oversizedFiles.length > 0) {
        alert(`以下檔案超過 1MB：${oversizedFiles.map(f => f.name).join(', ')}\n`);
      }

      try {
        const newPreviewImages = await Promise.all(
          validFiles.map(async file => ({
            file,
            url: await createPreviewUrl(file),
            id: `${file.name}-${Date.now()}-${Math.random()}`,
          })),
        );

        setPreviewImages(prev => {
          const updated = [...prev, ...newPreviewImages];
          return updated;
        });
      } catch (error) {
        alert(`處理圖片時發生錯誤 ${error}，請重試`);
      }
    },
    [createPreviewUrl, previewImages.length],
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
  const handleImagesSubmit = async (data: FormData) => {
    setIsImagesUploading(true);

    const formData = new FormData();
    data.files.forEach((file: File, index: number) => {
      formData.append(`file${index}`, file);
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || '上傳失敗');
      }

      // 清理所有預覽 URL
      previewImages.forEach(img => URL.revokeObjectURL(img.url));

      alert('上傳成功！');
    } catch (err) {
      alert(err instanceof Error ? err.message : '上傳發生未知錯誤');
    } finally {
      setIsImagesUploading(false);
    }
  };

  const handleFormSubmit = async (data: FormData, formTitle: '基本資料' | '店家說明') => {
    if (formTitle === '基本資料') setIsBasicFormUploading(true);
    if (formTitle === '店家說明') setIsDesFormUploading(true);
    try {
      // TODO: API
      console.log('表單送出資料', data);
    } catch {
    } finally {
      if (formTitle === '基本資料') setIsBasicFormUploading(false);
      if (formTitle === '店家說明') setIsDesFormUploading(false);
    }
  };

  useEffect(() => {
    const allFiles = previewImages.map(img => img.file);
    setValue('files', allFiles);
  }, [previewImages, setValue]);

  return (
    <PageWrapper
      title="店家資訊"
      titleSize="text-2xl"
      subTitle="設定店家基本資訊，讓顧客更容易找到您。"
      subTitleSize="text-sm"
    >
      <div className="flex flex-col gap-6">
        <BaseCard title="基本資料" titleSize="text-lg">
          <BaseForm
            formFieldsScheme={storeBasicFormFields}
            formHook={storeBasicFormHook}
            button={{ primary: '儲存變更', secondary: '取消' }}
            onSubmit={() => handleFormSubmit(storeBasicFormHook.getValues(), '基本資料')}
            handleCancel={() => {
              storeBasicFormHook.reset();
            }}
            isUploading={isBasicFormUploading}
          />
        </BaseCard>
        <BaseCard title="店家說明" titleSize="text-lg">
          <BaseForm
            formFieldsScheme={storeDescFormFields}
            formHook={storeDescFormHook}
            button={{ primary: '儲存說明' }}
            onSubmit={() => handleFormSubmit(storeDescFormHook.getValues(), '店家說明')}
            handleCancel={() => {
              storeDescFormHook.reset();
            }}
            isUploading={isDesFormUploading}
          />
        </BaseCard>
        <BaseCard title="店家照片" titleSize="text-lg">
          <ImageUploadForm
            IMAGE_LIMIT={IMAGE_LIMIT}
            formHook={storeImagesFormHook}
            previewImages={previewImages}
            isUploading={isImagesUploading}
            onFileChange={handleFileChange}
            onRemoveImage={handleRemoveImage}
            onSubmit={() => handleImagesSubmit(storeImagesFormHook.getValues())}
          />
        </BaseCard>
      </div>
    </PageWrapper>
  );
};

export default Store;