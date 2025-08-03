'use client';

import React from 'react';
import ImageUploadForm from '@/features/store-info/components/ImageUploadForm';
import { IMAGE_LIMIT } from '@/features/store-info/constants';
import { useStoreFormHooks } from '@/features/store-info/hooks/use-form-hooks';
import { useStore } from '@/features/store-info/hooks/use-store';
import { storeBasicFormFields, storeDescFormFields } from '@/features/store-info/schemas';
import BaseCard from '@/components/base-card/BaseCard';
import BaseForm from '@/components/base-form/BaseForm';
import BasePageWrapper from '@/components/base-page-wrapper/BasePageWrapper';

const Store = () => {
  const { storeBasicFormHook, storeDescFormHook, storeImagesFormHook } = useStoreFormHooks();
  const {
    previewImages,
    isBasicFormUploading,
    isDesFormUploading,
    isImagesUploading,
    handleAddImages,
    handleRemoveImage,
    handleSubmitImages,
    handleFormSubmit,
  } = useStore({ storeBasicFormHook, storeDescFormHook, storeImagesFormHook });

  return (
    <BasePageWrapper
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
            imageLimit={IMAGE_LIMIT}
            formHook={storeImagesFormHook}
            previewImages={previewImages}
            isUploading={isImagesUploading}
            onFileChange={handleAddImages}
            onRemoveImage={handleRemoveImage}
            onSubmit={() => handleSubmitImages(storeImagesFormHook.getValues())}
          />
        </BaseCard>
      </div>
    </BasePageWrapper>
  );
};

export default Store;