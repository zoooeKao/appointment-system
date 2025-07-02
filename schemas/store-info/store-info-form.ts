import { z } from 'zod';
import type { FormFieldType } from '@/components/base-form/type';
import { IMAGE_LIMIT, IMAGE_MAX_SIZE } from '@/constants';


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

export { storeBasicFormFields, storeDescFormFields, storeImagesFormFields };