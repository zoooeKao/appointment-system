import type { FieldValues } from 'react-hook-form';
import type { DaySchedule, TimeSlotType, TimeType, WeeklySchedule } from '@/types';

interface BaseDatePickerProps {
  fieldFromParent: FieldValues;
  dayKey?: keyof WeeklySchedule;
  title: '每週營業時間' | '特殊日期營業時間';
  timeSlot: TimeSlotType[];
  timeType: TimeType[];
  updateWeeklySchedule?: (
    currentValue: WeeklySchedule,
    weekDay: keyof WeeklySchedule,
    timeSlot: TimeSlotType,
    timeType: TimeType,
    date: Date | null,
  ) => WeeklySchedule;
  updateDayOffSchedule?: (
    currentValue: DaySchedule,
    timeSlot: TimeSlotType,
    timeType: TimeType,
    date: Date | null,
  ) => DaySchedule;
  parseTimeString?: (timeString: string) => Date | null;
  addMinutesToTime?: (timeString: string, minutes: number) => Date | null;
  minusMinutesToTime?: (timeString: string, minutes: number) => Date | null;
  timeIntervals?: number;
  morningStartFilter?: (date: Date) => boolean;
  morningEndFilter?: (date: Date) => boolean;
  afternoonStartFilter?: (date: Date) => boolean;
  afternoonEndFilter?: (date: Date) => boolean;
  timeFormat?: string;
  isUploading?: boolean;
}

export type { BaseDatePickerProps };