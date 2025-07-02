type ServiceCategory = {
  item: string;
  color: string;
};

type ServiceItem = {
  id: string;
  serviceName: string;
  serviceCategory: string;
  serviceDuration: number;
  servicePrice: number;
  reservationInterval: number;
  advanceBookingDays?: number;
  serviceDescription?: string;
  requireDeposit?: number;
  isEnabled: boolean;
};

type TempCategory = {
  reName: string;
  originalName: string;
  event: 'create' | 'edit' | '';
};

export type { ServiceCategory, ServiceItem, TempCategory };