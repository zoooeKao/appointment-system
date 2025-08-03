import type { FormData } from '@/components/base-form/type';

const DEFAULT_STORE_DES_FORM: FormData = {
  storeDesc: '',
};

export const getStoreDesForm = (): Promise<FormData> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(DEFAULT_STORE_DES_FORM);
    }, 500);
  });
};