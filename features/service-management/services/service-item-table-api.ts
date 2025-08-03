import type { ServiceItem } from '../types/service-item';

export const getInitialServiceItemTable = (): Promise<ServiceItem[]> => {
  return new Promise(resolve => {
    return resolve([
      {
        id: 'service-001',
        serviceName: '洗剪吹',
        serviceCategory: '基本剪髮',
        serviceDuration: 60,
        servicePrice: 500,
        reservationInterval: 30,
        serviceDescription: '包含洗髮、剪髮、吹整',
        requireDeposit: 0,
        isEnabled: true,
      },
      {
        id: 'service-002',
        serviceName: '染髮(全頭)',
        serviceCategory: '染髮',
        serviceDuration: 180,
        servicePrice: 1800,
        reservationInterval: 60,
        serviceDescription: '全頭染髮，包含洗髮護髮',
        requireDeposit: 500,
        isEnabled: true,
      },
      {
        id: 'service-003',
        serviceName: '燙髮',
        serviceCategory: '燙髮',
        serviceDuration: 210,
        servicePrice: 2500,
        reservationInterval: 90,
        serviceDescription: '燙髮造型，包含洗髮護髮',
        requireDeposit: 800,
        isEnabled: true,
      },
      {
        id: 'service-004',
        serviceName: '深層護髮',
        serviceCategory: '護髮',
        serviceDuration: 45,
        servicePrice: 800,
        reservationInterval: 30,
        serviceDescription: '深層護髮療程，修復受損髮質',
        requireDeposit: 0,
        isEnabled: true,
      },
      {
        id: 'service-005',
        serviceName: '新娘造型',
        serviceCategory: '造型',
        serviceDuration: 120,
        servicePrice: 3500,
        reservationInterval: 60,
        serviceDescription: '新娘專用造型設計',
        requireDeposit: 1000,
        isEnabled: false,
      },
    ]);
  });
};
