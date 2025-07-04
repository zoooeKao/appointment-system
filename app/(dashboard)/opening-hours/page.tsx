'use client';

import React, { useCallback, useState } from 'react';
import { DEFAULT_WEEKLY_SCHEDULE } from '@/constants';
import { dayOffFormFields, weeklyFormFields } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import type { DayOffRow, DayOffSchedule, DaySchedule, TabType } from '@/types/opening-hours';
import BaseCard from '@/components/base-card';
import BaseForm from '@/components/base-form/index';
import { type FormData, FormResolver } from '@/components/base-form/type';
import PageWrapper from '@/components/base-page-wrapper';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


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

        // TODO: POST API dayOffSchedule
        setDayOffSchedule(prev => ({
          ...prev,
          [dayOffDate]: dayScheduleData,
        }));

        const generateId = () => `dayoff-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const formatTimeRange = (
          morning: { start: string; end: string },
          afternoon: { start: string; end: string },
        ) => {
          return `上午：${morning.start} ~ ${morning.end} 下午：${afternoon.start} ~ ${afternoon.end}`;
        };

        setDayOffTable(prev => [
          ...prev,
          {
            id: generateId(),
            dayOffDate: dayOffDate,
            dayOffEvent: formData.dayOffEvent,
            isOpening: formData.daySchedule.isOpen,
            time: formatTimeRange(formData.daySchedule.morning, formData.daySchedule.afternoon),
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

  const handleDeleteDayOffList = (id: string) => {
    setDayOffTable(prev => prev.filter(date => date.id !== id));
    // TODO: API
  };
  //#endregion

  //#region 一般營業時間
  // 處理週時間表表單提交
  const handleWeeklyFormSubmit = (formData: FormData) => {
    setIsWeeklyFormUploading(true);
    try {
      // TODO: POST API weeklySchedule
      console.log('一般營業時間日期表單送出資料', formData);
    } catch (error) {
      console.error('儲存週時間表失敗：', error);
    } finally {
      setIsWeeklyFormUploading(false);
    }
  };

  // 處理週時間表表單取消
  const handleWeeklyFormCancel = () => {
    weeklyFormHook.reset({
      weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
    });
  };
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