import { z } from 'zod';
import type { FormFieldType } from '@/components/base-form/type';
import { DEFAULT_WEEKLY_SCHEDULE } from '@/constants/opening-hours';
import { parseTimeString, formatTimeString, addMinutesToTime, minusMinutesToTime, updateWeeklySchedule } from '@/utils/opening-hours';


const dayScheduleSchema = z.object({
  isOpen: z.boolean(),
  morning: z.object({ start: z.string(), end: z.string() }),
  afternoon: z.object({ start: z.string(), end: z.string() }),
  weeklyAndDayOff: z.string().optional(),
});

const weeklyScheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

const weeklyFormFields: FormFieldType[] = [
  {
    name: 'weeklySchedule',
    label: '每週營業時間',
    type: 'time',
    value: DEFAULT_WEEKLY_SCHEDULE,
    placeholder: '請設定營業時間',
    validator: weeklyScheduleSchema,
    required: false,
    timeIntervals: 1,
    timeFormat: 'HH:mm',
    morningStartFilter: (date: Date) => date.getHours() <= 12,
    morningEndFilter: (date: Date) => date.getHours() <= 12,
    afternoonStartFilter: (date: Date) => date.getHours() >= 12,
    afternoonEndFilter: (date: Date) => date.getHours() >= 12,
    parseTimeString,
    formatTimeString,
    addMinutesToTime,
    minusMinutesToTime,
    updateWeeklySchedule,
  },
];

export { weeklyFormFields };