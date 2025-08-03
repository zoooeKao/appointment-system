import type { WeeklySchedule } from "@/components/base-date-picker/type";
import { DEFAULT_WEEKLY_SCHEDULE } from ".";

export const getWeeklySchedule = (): Promise<WeeklySchedule> => {
  return new Promise(resolve => {
    return resolve(DEFAULT_WEEKLY_SCHEDULE)
  })
};