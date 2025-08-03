import type { DayOffSchedule } from "@/features/opening-hours/types";
import {updateDefaultDayOffSchedule } from ".";

export const postDayOffSchedule = (dayOffSchedule: DayOffSchedule): Promise<DayOffSchedule> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mergedDayOffSchedule =  updateDefaultDayOffSchedule('post', dayOffSchedule);
      resolve(mergedDayOffSchedule);
    }, 1000);
  });
};
