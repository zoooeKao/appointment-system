import { DEFAULT_DAY_OFF_SCHEDULE } from ".";
import type { DayOffSchedule } from "@/features/opening-hours/types";

export const getDayOffSchedule = (): Promise<DayOffSchedule> => {
  return new Promise(resolve => {
    return resolve(DEFAULT_DAY_OFF_SCHEDULE)
  })
};