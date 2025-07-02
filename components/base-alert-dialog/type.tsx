import type { UseFormReturn } from 'react-hook-form';
import type { ServiceItem } from '@/types';
import type { FormFieldType } from '@/components/base-form/type';
import type { FormData } from '@/components/base-form/type';

interface BaseAlertDialogProps {
  triggerButton: string | null;
  // 以下與 Form 相關參數
  formFieldsScheme?: FormFieldType[];
  formHook?: UseFormReturn<FormData>;
  onSubmit: (data?: FormData | ServiceItem[]) => void;
  handleCancel?: () => void;
  button?: { primary: string; secondary?: string; outline?: string };
  isUploading: boolean;
  // 刪除類別相關參數
  deleteCategory?: {
    affectedServices: ServiceItem[];
    availableCategories: string[];
  };
}

export type { BaseAlertDialogProps };
