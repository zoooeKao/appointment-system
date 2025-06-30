'use client';

import React, { useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import BaseCard from '@/components/base-card';
import {
  type DaySchedule,
  type FormData,
  type FormFieldType,
  FormResolver,
  type TimeSlotType,
  type TimeType,
  type WeeklySchedule,
} from '@/components/base-form/formConfig';
import BaseForm from '@/components/base-form/index';
import PageWrapper from '@/components/page-wrapper';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


type TabType = '一般營業時間' | '特殊日期設定';

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

const DEFAULT_DAY_SCHEDULE: DaySchedule = {
  isOpen: false,
  morning: { start: '', end: '' },
  afternoon: { start: '', end: '' },
} as const;

const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  monday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'monday' },
  tuesday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'tuesday' },
  wednesday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'wednesday' },
  thursday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'thursday' },
  friday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'friday' },
  saturday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'saturday' },
  sunday: { ...DEFAULT_DAY_SCHEDULE, weeklyAndDayOff: 'sunday' },
} as const;

const dayScheduleSchema = z.object({
  isOpen: z.boolean(),
  morning: z.object({ start: z.string(), end: z.string() }),
  afternoon: z.object({ start: z.string(), end: z.string() }),
  weeklyAndDayOff: z.string().optional(),
});

const weeklyScheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

//#region tab-一般營業時間  時間處理函數
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
//#endregion

//#region 特殊日期營業時間
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
//#endregion

const weeklyFormFields: FormFieldType[] = [
  {
    name: 'weeklySchedule',
    label: '每週營業時間',
    type: 'time',
    value: DEFAULT_WEEKLY_SCHEDULE,
    placeholder: '請設定營業時間',
    validator: weeklyScheduleSchema,
    required: false,
    timeIntervals: 1,
    timeFormat: 'HH:mm',
    morningStartFilter: (date: Date) => date.getHours() <= 12,
    morningEndFilter: (date: Date) => date.getHours() <= 12,
    afternoonStartFilter: (date: Date) => date.getHours() >= 12,
    afternoonEndFilter: (date: Date) => date.getHours() >= 12,
    parseTimeString,
    formatTimeString,
    addMinutesToTime,
    minusMinutesToTime,
    updateWeeklySchedule,
  },
];

const dayOffFormFields: FormFieldType[] = [
  {
    name: 'dayOffDate',
    label: '日期',
    type: 'date',
    value: new Date(),
    placeholder: '請選擇日期',
    validator: z.date(),
    required: true,
    dateFormat: 'yyyy/MM/dd',
    minDate: new Date(),
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  },
  {
    name: 'dayOffEvent',
    label: '名稱',
    type: 'text',
    value: '',
    placeholder: '至少需要 2 個字元',
    validator: z.string().min(2, '至少需要 2 個字元'),
    required: true,
  },
  {
    name: 'daySchedule',
    label: '營業時間',
    type: 'time',
    value: DEFAULT_DAY_SCHEDULE,
    placeholder: '請設定營業時間',
    validator: z.object({
      isOpen: z.boolean(),
      morning: z.object({ start: z.string(), end: z.string() }),
      afternoon: z.object({ start: z.string(), end: z.string() }),
    }),
    required: true,
    timeIntervals: 1,
    timeFormat: 'HH:mm',
    morningStartFilter: (date: Date) => date.getHours() <= 12,
    morningEndFilter: (date: Date) => date.getHours() <= 12,
    afternoonStartFilter: (date: Date) => date.getHours() >= 12,
    afternoonEndFilter: (date: Date) => date.getHours() >= 12,
    parseTimeString,
    formatTimeString,
    addMinutesToTime,
    minusMinutesToTime,
    updateDayOffSchedule,
  },
];

const OpeningHours = () => {
  const [tab, setTab] = useState<TabType>('一般營業時間');
  const [createDayOff, setCreateDayOff] = useState(false);
  const [isDayOffFormUploading, setIsDayOffFormUploading] = useState(false);
  const [isWeeklyFormUploading, setIsWeeklyFormUploading] = useState(false);
  const [_, setDayOffSchedule] = useState<DayOffSchedule>({});
  const [dayOffTable, setDayOffTable] = useState<DayOffRow[]>([]);

  const weeklyFormHook = useForm<FormData>({
    resolver: zodResolver(FormResolver(weeklyFormFields)),
    defaultValues: Object.fromEntries(weeklyFormFields.map(field => [field.name, field.value])),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const dayOffFormHook = useForm<FormData>({
    resolver: zodResolver(FormResolver(dayOffFormFields)),
    defaultValues: Object.fromEntries(dayOffFormFields.map(field => [field.name, field.value])),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  //#region 特殊日期設定
  const handleDayOffFormSubmit = useCallback(
    (formData: FormData) => {
      setIsDayOffFormUploading(true);
      try {
        // TODO: POST API
        console.log('特殊日期表單送出資料', formData);

        const formatLocalDate = (date: Date): string => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const dayOffDate = formatLocalDate(formData.dayOffDate);

        const dayScheduleData: DaySchedule = {
          isOpen: formData.daySchedule.isOpen,
          morning: {
            start: formData.daySchedule.morning.start,
            end: formData.daySchedule.morning.end,
          },
          afternoon: {
            start: formData.daySchedule.afternoon.start,
            end: formData.daySchedule.afternoon.end,
          },
          weeklyAndDayOff: formData.dayOffEvent,
        };

        setDayOffSchedule(prev => ({
          ...prev,
          [dayOffDate]: dayScheduleData,
        }));

        setDayOffTable(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 15),
            dayOffDate: dayOffDate,
            dayOffEvent: formData.dayOffEvent,
            isOpening: formData.daySchedule.isOpen,
            time: `上午：${formData.daySchedule.morning.start} ~ ${formData.daySchedule.morning.end} 下午：${
              formData.daySchedule.afternoon.start
            } ~ ${formData.daySchedule.afternoon.end}`,
          },
        ]);

        console.log('dayOffSchedule：', {
          [dayOffDate]: dayScheduleData,
        });
      } catch (error) {
        console.error('儲存特殊日期失敗：', error);
      } finally {
        dayOffFormHook.reset();
        setIsDayOffFormUploading(false);
        setCreateDayOff(false);
      }
    },
    [dayOffFormHook],
  );

  const handleDeleteDayOffList = useCallback((id: string) => {
    setDayOffTable(prev => prev.filter(date => date.id !== id));
    // TODO: API
  }, []);
  //#endregion

  //#region 一般營業時間
  // 處理週時間表表單提交
  const handleWeeklyFormSubmit = useCallback((formData: FormData) => {
    setIsWeeklyFormUploading(true);
    try {
      // TODO: 呼叫 API 儲存資料
      console.log('特殊日期表單送出資料', formData);
      // console.log('收到的週時間表資料：', formData.weeklySchedule);
    } catch (error) {
      console.error('儲存週時間表失敗：', error);
    } finally {
      setIsWeeklyFormUploading(false);
    }
  }, []);

  // 處理週時間表表單取消
  const handleWeeklyFormCancel = useCallback(() => {
    weeklyFormHook.reset({
      weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
    });
  }, [weeklyFormHook]);
  //#endregion

  return (
    <>
      <PageWrapper
        title="營業時間"
        titleSize="text-2xl"
        subTitle="管理店家的營業時間，讓顧客能在營業時間內預約服務。"
        subTitleSize="text-sm"
      >
        <section className="mb-6 flex gap-2">
          {['一般營業時間', '特殊日期設定'].map(label => (
            <Button
              key={label}
              variant={tab === label ? 'third' : 'outline'}
              onClick={() => setTab(label as TabType)}
              className={`${tab === label ? 'outline-foreground' : ''} transition-all duration-200`}
            >
              {label}
            </Button>
          ))}
        </section>

        {tab === '一般營業時間' && (
          <BaseCard
            title="每週營業時間"
            titleSize="text-lg"
            subTitle="設定每週的營業時間，讓顧客能在週間的營業時間內預約服務。"
            subTitleSize="text-sm"
            buttonTitle="套用到工作日"
            hasSeparator={false}
          >
            <BaseForm
              formFieldsScheme={weeklyFormFields}
              formHook={weeklyFormHook}
              button={{ primary: '儲存設定', secondary: '取消' }}
              onSubmit={handleWeeklyFormSubmit}
              handleCancel={handleWeeklyFormCancel}
              isUploading={isWeeklyFormUploading}
            />
          </BaseCard>
        )}

        {tab === '特殊日期設定' && (
          <BaseCard
            title="特殊日期設定"
            titleSize="text-lg"
            subTitle="設定特殊日期，如節假日休息或特別活動延長營業，特殊日期的設定將會覆蓋該日的一般營業時間。"
            subTitleSize="text-sm"
            buttonTitle="新增特殊日期"
            onButtonClick={() => setCreateDayOff(true)}
            hasSeparator={false}
          >
            {dayOffTable.length > 0 && (
              <Table className="mb-6 rounded-md border-[1px] border-gray-200 p-6">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">日期</TableHead>
                    <TableHead className="text-center">名稱</TableHead>
                    <TableHead className="text-center">狀態</TableHead>
                    <TableHead className="text-center">營業時間</TableHead>
                    <TableHead className="text-center">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dayOffTable.map(dayOff => (
                    <TableRow key={dayOff.dayOffDate}>
                      <TableCell className="font-medium">{dayOff.dayOffDate}</TableCell>
                      <TableCell>{dayOff.dayOffEvent}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            dayOff.isOpening
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {dayOff.isOpening ? '營業' : '休息'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {dayOff.isOpening ? dayOff.time : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDayOffList(dayOff.id)}
                          className="text-red-600 hover:bg-red-50 hover:text-red-800"
                        >
                          刪除
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {createDayOff && (
              <div className="rounded-md border-[1px] border-gray-200 p-6">
                <div className="mb-6">
                  <p className="text-base">新增特殊日期</p>
                </div>
                <BaseForm
                  formFieldsScheme={dayOffFormFields}
                  formHook={dayOffFormHook}
                  button={{ primary: '儲存變更', secondary: '取消' }}
                  onSubmit={handleDayOffFormSubmit}
                  handleCancel={() => {
                    dayOffFormHook.reset();
                    setCreateDayOff(false);
                  }}
                  isUploading={isDayOffFormUploading}
                />
              </div>
            )}
          </BaseCard>
        )}
      </PageWrapper>
    </>
  );
};

export default OpeningHours;