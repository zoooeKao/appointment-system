import { z } from 'zod';
import type { FormFieldType } from '@/components/base-form/type';
import { IMAGE_LIMIT, IMAGE_MAX_SIZE } from '@/features/store-info/constants';

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

export { storeImagesFormFields }; 