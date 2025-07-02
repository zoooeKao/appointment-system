import { z } from 'zod';
import type { FormFieldType } from '@/components/base-form/type';

// 服務項目表單相關參數設定 React Hook Form、Zod Schema
const createServiceItemFormFields = (categoryOptions: string[]): FormFieldType[] => [
  {
    name: 'serviceName',
    label: '服務名稱',
    type: 'text',
    value: '',
    placeholder: '至少需要 2 個字元，不可超過 20 個字元',
    validator: z
      .string() 
      .min(1, { message: '不能為空' })
      .min(2, { message: '至少需要 2 個字元' })
      .max(20, { message: '不可超過 20 個字元' })
      .trim(),
    required: true,
  },
  {
    name: 'serviceCategory',
    label: '服務類別',
    type: 'select',
    value: '',
    placeholder: '請選擇一個選項',
    options: categoryOptions,
    validator: z.string().min(1, '請選擇一個選項'),
    required: true,
  },
  {
    name: 'serviceDuration',
    label: '服務時長(分鐘)',
    type: 'number',
    value: 0,
    placeholder: '不得少於 1 分鐘，不得超過 240 分鐘',
    validator: z.coerce
      .number({ message: '請輸入有效的數字' })
      .min(1, { message: '不得少於 1 分鐘' })
      .max(240, { message: '不得超過 240 分鐘' }),
    required: true,
  },
  {
    name: 'servicePrice',
    label: '服務價格(NT$)',
    type: 'number',
    value: 0,
    validator: z.coerce
      .number({ message: '請輸入有效的數字' })
      .min(100, { message: '不得少於 100 元' })
      .max(10000, { message: '不得超過 10000 元' }),
    required: true,
  },
  {
    name: 'reservationInterval',
    label: '預約間隔(分鐘)',
    type: 'number',
    value: 0,
    validator: z.coerce
      .number({ message: '請輸入有效的數字' })
      .min(1, { message: '不得少於 1 分鐘' }),
    required: true,
  },
  {
    name: 'advanceBookingDays',
    label: '最多提前預約(天)',
    type: 'number',
    value: 0,
    validator: z.coerce.number({ message: '請輸入有效的數字' }).min(0, { message: '不能為負數' }),
    required: false,
  },
  {
    name: 'serviceDescription',
    label: '服務描述',
    type: 'textarea',
    value: '',
    placeholder: '描述服務的內容、特色或注意事項',
    validator: z.string().max(20, { message: '不得超過 20 個字元' }),
    required: false,
  },
  {
    name: 'requireDeposit',
    label: '需要預付訂金',
    type: 'number',
    value: 0,
    validator: z.coerce
      .number({ message: '請輸入有效的數字' })
      .min(0, { message: '不能為負數' })
      .max(5000, { message: '不得超過 5000 元' }),
    required: false,
  },
  {
    name: 'isEnabled',
    label: '啟用此服務項目',
    type: 'radio',
    value: true,
    options: [
      { label: '是', value: true },
      { label: '否', value: false },
    ],
    validator: z.boolean({ message: '必須是布林值' }),
    required: true,
  },
];

export { createServiceItemFormFields };