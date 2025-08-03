import type { DayOffRow, DayOffSchedule } from "@/features/opening-hours/types";
import type { DaySchedule } from "@/components/base-date-picker/type";
import type { FormData } from "@/components/base-form/type";


const convertDataToTable = (getData: DayOffSchedule): DayOffRow[] => {
  return Object.entries(getData).map(([dayOffDate, { isOpen, morning, afternoon, weeklyAndDayOff }]) => {
    return {
      dayOffDate: dayOffDate,
      dayOffEvent: weeklyAndDayOff || '',
      isOpening: isOpen,
      time: `上午：${morning.start} ~ ${morning.end} 下午：${afternoon.start} ~ ${afternoon.end}`,
    };
  });
};

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const convertHookFormToData = (formData: FormData): DayOffSchedule => {
  const dayOffDate = formatLocalDate(formData.dayOffDate);
  const daySchedule = formData.daySchedule;

  const dayScheduleData: DaySchedule = {
    isOpen: daySchedule.isOpen,
    morning: {
      start: daySchedule.morning.start,
      end: daySchedule.morning.end,
    },
    afternoon: {
      start: daySchedule.afternoon.start,
      end: daySchedule.afternoon.end,
    },
    weeklyAndDayOff: formData.dayOffEvent,
  };


  return {
    [dayOffDate]: dayScheduleData,
  };
}

export { convertDataToTable, convertHookFormToData };