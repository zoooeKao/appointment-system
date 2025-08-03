'use client';

import React from 'react';
import DayOff from '@/features/opening-hours/components/DayOff';
import Weekly from '@/features/opening-hours/components/Weekly';
import useOpeningHours from '@/features/opening-hours/hooks/use-opening-hours';
import BasePageWrapper from '@/components/base-page-wrapper/BasePageWrapper';
import { Button } from '@/components/ui/button';
import type { TabType } from '../types';

const OpeningHoursView = () => {
  const {
    tab,
    setTab,
    createDayOff,
    setCreateDayOff,
    isDayOffFormUploading,
    dayOffTable,
    dayOffFormHook,
    isWeeklyFormUploading,
    weeklyFormHook,
    weeklyFormFields,
    handleCreateDayOffClick,
    handleDayOffFormSubmit,
    handleDeleteDayOffList,
    handleWeeklyFormSubmit,
    handleWeeklyFormCancel,
  } = useOpeningHours();

  const constantTab: Record<TabType, string> = {
    NORMAL: '一般營業時間',
    SPECIAL: '特殊日期設定',
  };

  const tabComponent: Record<TabType, React.ReactNode> = {
    NORMAL: (
      <Weekly
        formFieldsScheme={weeklyFormFields}
        formHook={weeklyFormHook}
        button={{ primary: '儲存設定', secondary: '取消' }}
        onSubmit={handleWeeklyFormSubmit}
        handleCancel={handleWeeklyFormCancel}
        isUploading={isWeeklyFormUploading}
      />
    ),
    SPECIAL: (
      <DayOff
        onButtonClick={handleCreateDayOffClick}
        dayOffTable={dayOffTable}
        onDeleteDayOffList={handleDeleteDayOffList}
        onDayOffFormSubmit={handleDayOffFormSubmit}
        createDayOff={createDayOff}
        setCreateDayOff={setCreateDayOff}
        dayOffFormHook={dayOffFormHook}
        isDayOffFormUploading={isDayOffFormUploading}
      />
    ),
  };

  return (
    <BasePageWrapper
      title="營業時間"
      titleSize="text-2xl"
      subTitle="管理店家的營業時間，讓顧客能在營業時間內預約服務。"
      subTitleSize="text-sm"
    >
      <section className="mb-6 flex gap-2">
        {Object.entries(constantTab).map(([key, label]) => (
          <Button
            key={key}
            variant={tab === key ? 'third' : 'outline'}
            onClick={() => setTab(key as TabType)}
            className={`${tab === key ? 'outline-foreground' : ''} transition-all duration-200`}
          >
            {label}
          </Button>
        ))}
      </section>

      {tabComponent[tab]}
    </BasePageWrapper>
  );
};

export default OpeningHoursView;
