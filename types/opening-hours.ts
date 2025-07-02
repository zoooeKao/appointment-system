type TimeSlotType = 'morning' | 'afternoon';
type TimeType = 'start' | 'end';
type TimeSlot = Record<TimeType, string>;
type TabType = '一般營業時間' | '特殊日期設定';


type DaySchedule = {
  morning: TimeSlot;
  afternoon: TimeSlot;
  isOpen: boolean;
  weeklyAndDayOff?: string;
};

type WeeklySchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

type DayOffSchedule = {
  [dayOffDate: string]: DaySchedule;
};

// 新增特殊日期的類型定義
type DayOffRow = {
  id: string;
  dayOffDate: string;
  dayOffEvent: string;
  isOpening: boolean;
  time: string;
};

export type { TimeSlotType, TimeType, TimeSlot, TabType, DayOffRow, DaySchedule, WeeklySchedule, DayOffSchedule };