import type { DayOffSchedule } from "@/features/opening-hours/types";
import { updateDefaultDayOffSchedule } from ".";

export const deleteDayOffSchedule = (dayOffDate: string): Promise<DayOffSchedule> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedDayOffSchedule = updateDefaultDayOffSchedule('delete', undefined, dayOffDate);
      resolve(updatedDayOffSchedule);
    }, 1000);
  });
};
