import type { WeeklySchedule } from "@/components/base-date-picker/type";

export const patchWeeklySchedule = (weeklySchedule: WeeklySchedule): Promise<WeeklySchedule> => {
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(weeklySchedule);
    }, 1000); // 1秒延遲模擬網路請求
  });
}; 