import type { WeeklySchedule } from '@/components/base-date-picker/type';

export const WEEK_LABELS: Record<keyof WeeklySchedule, string> = {
  monday: '星期一',
  tuesday: '星期二',
  wednesday: '星期三',
  thursday: '星期四',
  friday: '星期五',
  saturday: '星期六',
  sunday: '星期日',
} as const;