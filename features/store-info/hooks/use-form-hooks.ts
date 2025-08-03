import type { UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type FormData, FormResolver } from '@/components/base-form/type';
import {
  storeBasicFormFields,
  storeDescFormFields,
  storeImagesFormFields,
} from '@/features/store-info/schemas';

interface StoreFormHooks {
  storeBasicFormHook: UseFormReturn<FormData>;
  storeDescFormHook: UseFormReturn<FormData>;
  storeImagesFormHook: UseFormReturn<FormData>;
}

/**
 * 店家資訊表單 hooks
 * 整合三個表單的 useForm hooks：基本資料、店家說明、店家照片
 */
const useStoreFormHooks = (): StoreFormHooks => {
  const storeBasicFormHook = useForm<FormData>({
    resolver: zodResolver(FormResolver(storeBasicFormFields)),
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

  return {
    storeBasicFormHook,
    storeDescFormHook,
    storeImagesFormHook,
  };
};

export { useStoreFormHooks };
export type { StoreFormHooks };
