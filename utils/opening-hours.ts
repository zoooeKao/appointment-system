import type { TimeSlotType, TimeType, DaySchedule, WeeklySchedule } from '@/types/opening-hours';

const parseTimeString = (timeString: string): Date | null => {
  if (!timeString) return null;
  return new Date(`2000-01-01T${timeString}`);
};

const formatTimeString = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const addMinutesToTime = (timeString: string, minutes: number): Date | null => {
  if (!timeString) return null;
  const date = parseTimeString(timeString);
  if (!date) return null;
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
};

const minusMinutesToTime = (timeString: string, minutes: number): Date | null => {
  if (!timeString) return null;
  const date = parseTimeString(timeString);
  if (!date) return null;
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() - minutes);
  return newDate;
};

const updateDayOffSchedule = (
  currentValue: DaySchedule,
  timeSlot: TimeSlotType,
  timeType: TimeType,
  date: Date | null,
): DaySchedule => {
  return {
    ...currentValue,
    [timeSlot]: {
      ...currentValue[timeSlot],
      [timeType]: formatTimeString(date),
    },
  };
};

const updateWeeklySchedule = (
  currentValue: WeeklySchedule,
  weekDay: keyof WeeklySchedule,
  timeSlot: TimeSlotType,
  timeType: TimeType,
  date: Date | null,
): WeeklySchedule => {
  return {
    ...currentValue,
    [weekDay]: {
      ...currentValue[weekDay],
      [timeSlot]: {
        ...currentValue[weekDay][timeSlot],
        [timeType]: formatTimeString(date),
      },
    },
  };
};

export { parseTimeString, formatTimeString, addMinutesToTime, minusMinutesToTime, updateDayOffSchedule, updateWeeklySchedule };