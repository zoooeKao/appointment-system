import type { ServiceCategory } from '../types/service-category';

export const getInitialServiceCategory = (): Promise<ServiceCategory[]> => {
  return new Promise(resolve => {
    return resolve([
      {
        item: '基本剪髮',
        color: 'bg-secondary-button',
      },
      {
        item: '染髮',
        color: 'bg-fourth-button',
      },
      {
        item: '燙髮',
        color: 'bg-primary-button',
      },
      {
        item: '護髮',
        color: 'bg-third-button',
      },
      {
        item: '造型',
        color: 'bg-fifth-button',
      },
    ]);
  });
};
