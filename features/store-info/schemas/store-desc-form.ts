import { z } from 'zod';
import type { FormFieldType } from '@/components/base-form/type';

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

export { storeDescFormFields }; 