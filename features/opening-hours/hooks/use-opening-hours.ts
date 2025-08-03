'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dayOffFormFields, weeklyFormFields } from '@/features/opening-hours/schemas';
import { getDayOffSchedule, postDayOffSchedule, deleteDayOffSchedule, getWeeklySchedule, patchWeeklySchedule } from '@/features/opening-hours/services';
import type { DayOffRow, TabType } from '@/features/opening-hours/types';
import { FormResolver, type FormData, type FormFieldType } from '@/components/base-form/type';
import { convertDataToTable, convertHookFormToData } from '@/features/opening-hours/utils/day-off-format';

interface UseOpeningHoursReturn {
  // Tab state
  tab: TabType;
  setTab: (tab: TabType) => void;
  
  // Day off state
  createDayOff: boolean;
  setCreateDayOff: (createDayOff: boolean) => void;
  isDayOffFormUploading: boolean;
  dayOffTable: DayOffRow[];
  setDayOffTable: (dayOffTable: DayOffRow[]) => void;
  dayOffFormHook: ReturnType<typeof useForm<FormData>>;
  
  // Weekly state
  isWeeklyFormUploading: boolean;
  weeklyFormHook: ReturnType<typeof useForm<FormData>>;
  weeklyFormFields: FormFieldType[];
  
  // Handlers
  handleCreateDayOffClick: () => void;
  handleDayOffFormSubmit: (formData: FormData) => void;
  handleDeleteDayOffList: (id: string) => void;
  handleWeeklyFormSubmit: (formData: FormData) => Promise<void>;
  handleWeeklyFormCancel: () => Promise<void>;
}

const useOpeningHours = (): UseOpeningHoursReturn => {
  const [tab, setTab] = useState<TabType>('NORMAL');
  const [createDayOff, setCreateDayOff] = useState(false);
  const [isDayOffFormUploading, setIsDayOffFormUploading] = useState(false);
  const [isWeeklyFormUploading, setIsWeeklyFormUploading] = useState(false);
  const [dayOffTable, setDayOffTable] = useState<DayOffRow[]>([]);

  // 計算 excludeDates，從 dayOffTable 取得已存在的日期
  const excludeDates = useMemo(() => {
    return dayOffTable.map(row => row.dayOffDate);
  }, [dayOffTable]);

  // 動態生成 dayOffFormFields，傳入 excludeDates
  const dynamicDayOffFormFields = useMemo(() => {
    return dayOffFormFields(excludeDates);
  }, [excludeDates]);

  const weeklyFormHook = useForm<FormData>({
    resolver: zodResolver(FormResolver(weeklyFormFields)),
    defaultValues: Object.fromEntries(weeklyFormFields.map(field => [field.name, field.value])),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const dayOffFormHook = useForm<FormData>({
    resolver: zodResolver(FormResolver(dynamicDayOffFormFields)),
    defaultValues: Object.fromEntries(dynamicDayOffFormFields.map(field => [field.name, field.value])),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    const loadInitialDayOffSchedule = async () => {
      try {
        const initialDayOffSchedule = await getDayOffSchedule();
        const table = convertDataToTable(initialDayOffSchedule);
        setDayOffTable(table);
      } catch (error) {
        console.error('載入初始營業時間失敗：', error);
      }
    };

    loadInitialDayOffSchedule();
  }, [dayOffFormHook]);

  useEffect(() => {
    const loadInitialWeeklySchedule = async () => {
      try {
        const initialWeeklySchedule = await getWeeklySchedule();
        weeklyFormHook.setValue('weeklySchedule', initialWeeklySchedule);
      } catch (error) {
        console.error('載入初始週時間失敗：', error);
      }
    };

    loadInitialWeeklySchedule();
  }, [weeklyFormHook]);


  const handleCreateDayOffClick = () => {
    setCreateDayOff(true);
  };

  const handleDayOffFormSubmit = useCallback(
    async (formData: FormData) => {
      setIsDayOffFormUploading(true);
      try {
        console.log('特殊日期表單送出資料', formData);
        // TODO: POST API
        await postDayOffSchedule(convertHookFormToData(formData));
        const updatedDayOffSchedule = await getDayOffSchedule();
        const table = convertDataToTable(updatedDayOffSchedule);
        setDayOffTable(table);

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

  const handleDeleteDayOffList = useCallback(async (dayOffDate: string) => {
    setIsDayOffFormUploading(true);
    try {
      // TODO: DELETE API
      const updatedDayOffSchedule = await deleteDayOffSchedule(dayOffDate);
      const table = convertDataToTable(updatedDayOffSchedule);
      setDayOffTable(table);
    } catch (error) {
      console.error('刪除特殊日期失敗：', error);
    } finally {
      setIsDayOffFormUploading(false);
    }
  }, []);

  const handleWeeklyFormSubmit = useCallback(async (formData: FormData) => {
    setIsWeeklyFormUploading(true);
    try {
      // TODO: PATCH API
      const updatedWeeklySchedule = await patchWeeklySchedule(formData.weeklySchedule);
      console.log('一般營業時間更新成功：', updatedWeeklySchedule);
      weeklyFormHook.reset({
        weeklySchedule: updatedWeeklySchedule,
      });
    } catch (error) {
      console.error('儲存週時間表失敗：', error);
    } finally {
      setIsWeeklyFormUploading(false);
    }
  }, [weeklyFormHook]);

  const handleWeeklyFormCancel = useCallback(async () => {
    try {
      // TODO: GET API
      const initialWeeklySchedule = await getWeeklySchedule();
      weeklyFormHook.reset({
        weeklySchedule: initialWeeklySchedule,
      });
    } catch (error) {
      console.error('載入初始週時間失敗：', error);
    }
  }, [weeklyFormHook]);

  return {
    tab,
    setTab,
    createDayOff,
    setCreateDayOff,
    isDayOffFormUploading,
    dayOffTable,
    setDayOffTable,
    dayOffFormHook,
    isWeeklyFormUploading,
    weeklyFormHook,
    weeklyFormFields,
    handleCreateDayOffClick,
    handleDayOffFormSubmit,
    handleDeleteDayOffList,
    handleWeeklyFormSubmit,
    handleWeeklyFormCancel,
  };
};

export default useOpeningHours; 