'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import BaseCard from '@/components/base-card';
import { type FormData, type FormFieldType, FormResolver } from '@/components/base-form/formConfig';
import BaseForm from '@/components/base-form/index';
import ImageUploadForm from '@/components/image-upload-form';
import PageWrapper from '@/components/page-wrapper';

export type PreviewImage = {
  file: File;
  url: string;
  id: string;
};

const IMAGE_LIMIT = 4; // 圖片上傳張數限制
const IMAGE_MAX_SIZE = 1 * 1024 * 1024; // 圖片大小 1 MB

const storeBasicFormFields: FormFieldType[] = [
  {
    name: 'storeName',
    label: '店家名稱',
    type: 'text',
    value: '',
    placeholder: '至少需要 2 個字元',
    validator: z
      .string()
      .min(1, { message: '不能為空' })
      .min(2, { message: '至少需要 2 個字元' })
      .max(20, { message: '不可超過 20 個字元' })
      .trim(),
    required: true,
  },
  {
    name: 'storeAddress',
    label: '店家地址',
    type: 'text',
    value: '',
    placeholder: '至少需要 5 個字元，不可超過 100 個字元',
    validator: z
      .string()
      .min(5, { message: '至少需要 5 個字元' })
      .max(100, { message: '不可超過 100 個字元' })
      .trim(),
    required: true,
  },
  {
    name: 'storeCategory',
    label: '店家分類',
    type: 'text',
    value: '',
    placeholder: '至少需要 3 個字元',
    validator: z.string().min(1, { message: '不能為空' }).min(3, '至少需要 3 個字元'),
    required: true,
  },
  {
    name: 'storeTell',
    label: '聯絡電話',
    type: 'tel',
    value: '',
    placeholder: '市話或手機號碼',
    validator: z
      .string()
      .min(1, { message: '不能為空' })
      .refine(val => /^0\d{1,2}-?\d{6,8}$/.test(val) || /^09\d{2}-?\d{6}$/.test(val), {
        message: '請輸入正確的市話或手機號碼格式',
      }),
    required: true,
  },
  {
    name: 'storeManager',
    label: '聯絡人',
    type: 'text',
    value: '',
    placeholder: '至少需要 2 個字元',
    validator: z.string().min(2, '至少需要 2 個字元'),
    required: true,
  },
  {
    name: 'storeLineId',
    label: 'LINE@ID',
    type: 'text',
    value: '',
    placeholder: '至少 3 個字元，只能包含半形英數字、點（.）、連字號（-）、底線（_）',
    validator: z
      .string()
      .min(3, { message: '請輸入至少 3 個字元' })
      .regex(/^[a-zA-Z0-9._-]+$/, {
        message: '只能包含半形英數字、點（.）、連字號（-）、底線（_）',
      })
      .or(z.literal('')),
    required: false,
  },
  {
    name: 'storeEmail',
    label: 'Email',
    type: 'email',
    value: '',
    placeholder: '請輸入有效的電子郵件地址',
    validator: z
      .string()
      .optional()
      .refine(
        val => {
          if (!val || val.trim() === '') return true; // 允許空值
          return z.string().email().safeParse(val).success;
        },
        { message: '請輸入有效的電子郵件格式' },
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          // 檢查是否包含常見的無效字元
          return !/[<>()[\]\\,;:\s@"]+/.test(val.split('@')[0]);
        },
        { message: '電子郵件格式包含無效字元' },
      )
      .refine(
        val => {
          if (!val || val.trim() === '') return true;
          // 檢查域名部分
          const parts = val.split('@');
          if (parts.length !== 2) return false;
          const domain = parts[1];
          return domain.includes('.') && domain.length >= 3;
        },
        { message: '請輸入有效的電子郵件域名' },
      ),
    required: false,
  },
  {
    name: 'storeStatus',
    label: '店家狀態',
    type: 'radio',
    value: 'opening',
    placeholder: '',
    options: [
      { label: '營業中', value: 'opening' },
      { label: '暫停營業', value: 'closed' },
    ],
    validator: z.enum(['opening', 'closed']),
    required: false,
  },
];

const storeDescFormFields: FormFieldType[] = [
  {
    name: 'storeDesc',
    type: 'textarea',
    value: '',
    placeholder: '',
    validator: z.string().or(z.literal('')),
    required: false,
  },
];

const storeImagesFormFields: FormFieldType[] = [
  {
    name: 'files',
    type: 'file',
    value: [],
    validator: z
      .array(z.instanceof(File))
      .min(1, '請至少選擇一張圖片')
      .max(IMAGE_LIMIT, `最多只能上傳 ${IMAGE_LIMIT} 張圖片`)
      .refine(files => files.every(file => file.size <= IMAGE_MAX_SIZE), '檔案大小不能超過 1MB')
      .refine(
        files => files.every(file => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)),
        '只支援 JPG、JPEG、PNG 格式',
      ),
    required: false,
  },
];

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
    [createPreviewUrl, previewImages.length, setValue],
  );

  // 移除圖片
  const handleRemoveImage = useCallback(
    (id: string) => {
      setPreviewImages(prev => {
        const updated = prev.filter(img => img.id !== id);
        // const allFiles = updated.map(img => img.file);
        // setValue('files', allFiles);

        // 清理 URL 避免記憶體洩漏
        const removedImage = prev.find(img => img.id === id);
        if (removedImage) {
          URL.revokeObjectURL(removedImage.url);
        }

        return updated;
      });
    },
    [setValue],
  );

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
