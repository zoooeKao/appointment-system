export type ServiceItem = {
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
