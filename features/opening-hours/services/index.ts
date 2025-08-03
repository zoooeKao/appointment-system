import type { DaySchedule,WeeklySchedule } from '@/components/base-date-picker/type';
import { getWeeklySchedule } from './get-weekly-schedule';
import { patchWeeklySchedule } from './patch-weekly-schedule';
import { getDayOffSchedule } from './get-day-off-schedule';
import { postDayOffSchedule } from './post-day-off-schedule';
import { deleteDayOffSchedule } from './delete-day-off-schedule';
import type { DayOffSchedule } from "@/features/opening-hours/types";

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


let DEFAULT_DAY_OFF_SCHEDULE: DayOffSchedule = {
  '2026-01-01': {
    isOpen: true,
    morning: { start: '02:05', end: '03:00' },
    afternoon: { start: '14:00', end: '15:00' },
    weeklyAndDayOff: '元旦'
  },
  '2026-02-02': {
    isOpen: false,
    morning: { start: '', end: '' },
    afternoon: { start: '', end: '' },
    weeklyAndDayOff: '春節'
  },
};

const updateDefaultDayOffSchedule = (method: 'post' | 'delete', patchData?: DayOffSchedule, deleteDate?: string): DayOffSchedule => {
  if (method === 'post') {
    DEFAULT_DAY_OFF_SCHEDULE = { ...DEFAULT_DAY_OFF_SCHEDULE, ...patchData };
  } 

  if (method === 'delete' && deleteDate) {
    delete DEFAULT_DAY_OFF_SCHEDULE[deleteDate];
  }

  return DEFAULT_DAY_OFF_SCHEDULE;
};

export { DEFAULT_DAY_SCHEDULE, DEFAULT_WEEKLY_SCHEDULE,DEFAULT_DAY_OFF_SCHEDULE, updateDefaultDayOffSchedule, getDayOffSchedule, postDayOffSchedule, deleteDayOffSchedule , getWeeklySchedule, patchWeeklySchedule};