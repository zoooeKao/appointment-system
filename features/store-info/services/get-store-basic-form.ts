import type { FormData } from '@/components/base-form/type';

const DEFAULT_STORE_BASIC_INFO: FormData = {
  storeName: '',
  storeAddress: '',
  storeCategory: '',
  storeTell: '',
  storeManager: '',
  storeLineId: '',
  storeEmail: '',
  storeStatus: 'opening',
};

export const getStoreBasicForm = (): Promise<FormData> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(DEFAULT_STORE_BASIC_INFO);
    }, 500);
  });
}; 