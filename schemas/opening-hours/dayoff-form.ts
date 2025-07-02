import { z } from 'zod';
import type { FormFieldType } from '@/components/base-form/type';
import { DEFAULT_DAY_SCHEDULE } from '@/constants/opening-hours';
import { parseTimeString, formatTimeString, addMinutesToTime, minusMinutesToTime, updateDayOffSchedule } from '@/utils/opening-hours';

const dayOffFormFields: FormFieldType[] = [
  {
    name: 'dayOffDate',
    label: '日期',
    type: 'date',
    value: new Date(),
    placeholder: '請選擇日期',
    validator: z.date(),
    required: true,
    dateFormat: 'yyyy/MM/dd',
    minDate: new Date(),
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  },
  {
    name: 'dayOffEvent',
    label: '名稱',
    type: 'text',
    value: '',
    placeholder: '至少需要 2 個字元',
    validator: z.string().min(2, '至少需要 2 個字元'),
    required: true,
  },
  {
    name: 'daySchedule',
    label: '營業時間',
    type: 'time',
    value: DEFAULT_DAY_SCHEDULE,
    placeholder: '請設定營業時間',
    validator: z.object({
      isOpen: z.boolean(),
      morning: z.object({ start: z.string(), end: z.string() }),
      afternoon: z.object({ start: z.string(), end: z.string() }),
    }),
    required: true,
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
    updateDayOffSchedule,
  },
];

export { dayOffFormFields };