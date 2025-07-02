import type { DaySchedule, WeeklySchedule } from '@/types/opening-hours';

const DEFAULT_DAY_SCHEDULE: DaySchedule = {
  isOpen: false,
  morning: { start: '', end: '' },
  afternoon: { start: '', end: '' },
} as const;

const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  monday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'monday' },
  tuesday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'tuesday' },
  wednesday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'wednesday' },
  thursday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'thursday' },
  friday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'friday' },
  saturday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'saturday' },
  sunday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'sunday' },
} as const;

export { DEFAULT_DAY_SCHEDULE, DEFAULT_WEEKLY_SCHEDULE };