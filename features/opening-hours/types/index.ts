import type { DaySchedule } from '@/components/base-date-picker/type';

type TabType = 'NORMAL' | 'SPECIAL';

type DayOffSchedule = {
  [dayOffDate: string]: DaySchedule;
};

// 新增特殊日期的類型定義
type DayOffRow = {
  dayOffDate: string;
  dayOffEvent: string;
  isOpening: boolean;
  time: string;
};

export type { TabType, DayOffRow, DayOffSchedule };
