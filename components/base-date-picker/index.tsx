import type { FocusEventHandler } from 'react';
import DatePicker from 'react-datepicker';
import type { TimeSlotType, TimeType } from '@/types';
import type { BaseDatePickerProps } from './type';


const datePickerClassName =
  'w-20 rounded outline outline-1 outline-gray-300 px-2 py-1 text-center text-sm transition-colors focus:outline-blue-500 focus:outline-2 focus:outline disabled:bg-gray-100 disabled:cursor-not-allowed';

const BaseDatePicker: React.FC<BaseDatePickerProps> = ({
  fieldFromParent,
  dayKey,
  title,
  timeSlot,
  timeType,
  updateWeeklySchedule,
  updateDayOffSchedule,
  parseTimeString,
  addMinutesToTime,
  minusMinutesToTime,
  timeIntervals,
  morningStartFilter,
  morningEndFilter,
  afternoonStartFilter,
  afternoonEndFilter,
  timeFormat,
  isUploading,
}: BaseDatePickerProps) => {
  const getCurrentSchedule = () => {
    if (title === '每週營業時間' && dayKey) {
      return fieldFromParent.value?.[dayKey];
    }
    return fieldFromParent.value;
  };

  const isScheduleOpen = () => {
    const schedule = getCurrentSchedule();
    return schedule?.isOpen;
  };

  const getTimeValue = (slot: TimeSlotType, type: TimeType) => {
    const schedule = getCurrentSchedule();
    return schedule?.[slot]?.[type] || '';
  };

  const handleTimeChange = (slot: TimeSlotType, type: TimeType, date: Date | null) => {
    if (title === '每週營業時間' && dayKey && updateWeeklySchedule) {
      fieldFromParent.onChange(
        updateWeeklySchedule(fieldFromParent.value || {}, dayKey, slot, type, date),
      );
    } else if (title === '特殊日期營業時間' && updateDayOffSchedule) {
      fieldFromParent.onChange(updateDayOffSchedule(fieldFromParent.value || {}, slot, type, date));
    }
  };

  const handleFocus: FocusEventHandler<HTMLElement> = e => {
    try {
      const wrapper = e.currentTarget.closest('.react-datepicker-wrapper');
      const parent = wrapper!.parentElement;

      setTimeout(() => {
        const list = parent!.querySelector('.react-datepicker__time-list');
        list!.scrollTop = 0;
      }, 0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="flex flex-col items-center gap-6 lg:flex-row">
      {/* 上午時段 */}
      <section className="flex items-center gap-2">
        <span className="px-2">{timeSlot[0] === 'morning' ? '上午' : '下午'}</span>
        {/* 將 input 框與下拉式選單包裹 */}
        <div>
          <DatePicker
            selected={parseTimeString?.(getTimeValue(timeSlot[0], timeType[0]))}
            onChange={date => handleTimeChange(timeSlot[0], timeType[0], date)}
            minTime={parseTimeString?.('00:00') || undefined}
            maxTime={
              minusMinutesToTime?.(
                getTimeValue(timeSlot[0], timeType[1]) || '12:01',
                timeIntervals || 15,
              ) || undefined
            }
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={timeIntervals || 15}
            filterTime={morningStartFilter || (date => date.getHours() <= 12)}
            dateFormat={timeFormat || 'HH:mm'}
            timeFormat={timeFormat || 'HH:mm'}
            timeCaption="開始"
            placeholderText={isScheduleOpen() ? '開始' : '-'}
            disabled={isUploading || !isScheduleOpen()}
            className={datePickerClassName}
            onFocus={handleFocus}
          />
        </div>
        <div className="px-2">至</div>
        {/* 將 input 框與下拉式選單包裹 */}
        <div>
          <DatePicker
            selected={parseTimeString?.(getTimeValue(timeSlot[0], timeType[1]))}
            onChange={date => handleTimeChange(timeSlot[0], timeType[1], date)}
            maxTime={parseTimeString?.('12:00') || undefined}
            minTime={
              addMinutesToTime?.(
                getTimeValue(timeSlot[0], timeType[0]) || '00:00',
                timeIntervals || 15,
              ) || undefined
            }
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={timeIntervals || 15}
            filterTime={morningEndFilter || (date => date.getHours() <= 12)}
            dateFormat={timeFormat || 'HH:mm'}
            timeFormat={timeFormat || 'HH:mm'}
            timeCaption="結束"
            placeholderText={isScheduleOpen() ? '結束' : '-'}
            disabled={isUploading || !isScheduleOpen()}
            className={datePickerClassName}
            onFocus={handleFocus}
          />
        </div>
      </section>

      {/* 下午時段 */}
      <section className="flex items-center gap-2">
        <span className="px-2">{timeSlot[1] === 'afternoon' ? '下午' : '上午'}</span>
        <div>
          <DatePicker
            selected={parseTimeString?.(getTimeValue(timeSlot[1], timeType[0]))}
            onChange={date => handleTimeChange(timeSlot[1], timeType[0], date)}
            minTime={parseTimeString?.('12:01') || undefined}
            maxTime={
              minusMinutesToTime?.(
                getTimeValue(timeSlot[1], timeType[1]) || '23:59',
                timeIntervals || 15,
              ) || undefined
            }
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={timeIntervals || 15}
            filterTime={afternoonStartFilter || (date => date.getHours() >= 12)}
            dateFormat={timeFormat || 'HH:mm'}
            timeFormat={timeFormat || 'HH:mm'}
            timeCaption="開始"
            placeholderText={isScheduleOpen() ? '開始' : '-'}
            className={datePickerClassName}
            onFocus={handleFocus}
            disabled={isUploading || !isScheduleOpen()}
          />
        </div>
        <span className="px-2">至</span>
        <div>
          <DatePicker
            selected={parseTimeString?.(getTimeValue(timeSlot[1], timeType[1]))}
            onChange={date => handleTimeChange(timeSlot[1], timeType[1], date)}
            maxTime={parseTimeString?.('23:59') || undefined}
            minTime={
              addMinutesToTime?.(
                getTimeValue(timeSlot[1], timeType[0]) || '12:01',
                timeIntervals || 15,
              ) || undefined
            }
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={timeIntervals || 15}
            filterTime={afternoonEndFilter || (date => date.getHours() >= 12)}
            dateFormat={timeFormat || 'HH:mm'}
            timeFormat={timeFormat || 'HH:mm'}
            timeCaption="結束"
            placeholderText={isScheduleOpen() ? '結束' : '-'}
            className={datePickerClassName}
            onFocus={handleFocus}
            disabled={isUploading || !isScheduleOpen()}
          />
        </div>
      </section>
    </section>
  );
};

export default BaseDatePicker;