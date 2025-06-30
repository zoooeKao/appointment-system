'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { UseFormReturn } from 'react-hook-form';
import BaseDatePicker from '@/components/base-date-picker';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import BaseSelect from '../base-select';
import type { FormData, FormFieldType, TimeSlotType, TimeType, WeeklySchedule } from './formConfig';


interface BaseFormProps {
  formFieldsScheme: FormFieldType[];
  formHook: UseFormReturn;
  button: { primary: string; secondary?: string; outline?: string };
  onSubmit: (data: FormData) => void;
  handleCancel: () => void;
  isUploading: boolean;
}

const WEEK_LABELS: Record<keyof WeeklySchedule, string> = {
  monday: '星期一',
  tuesday: '星期二',
  wednesday: '星期三',
  thursday: '星期四',
  friday: '星期五',
  saturday: '星期六',
  sunday: '星期日',
} as const;

const BaseForm: React.FC<BaseFormProps> = ({
  formFieldsScheme,
  formHook,
  onSubmit,
  handleCancel,
  button,
  isUploading,
}) => {
  const { register, handleSubmit, control, formState } = formHook;

  return (
    <div>
      <Form {...formHook}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
          <div className={`grid gap-4 ${formFieldsScheme.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {formFieldsScheme.map(scheme => (
              <div key={scheme.name}>
                <FormField
                  control={control}
                  name={scheme.name}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>
                          {scheme.label !== '每週營業時間' && scheme.label}
                          {scheme.required && <span className="ml-1 text-red-500">*</span>}
                        </FormLabel>
                        <FormControl className="w-full">
                          <div className="w-full space-y-1">
                            {scheme.type === 'radio' && (
                              <div className="flex gap-4">
                                {scheme.options?.map((option, index) => {
                                  return (
                                    <Button
                                      key={index}
                                      type="button"
                                      onClick={() => field.onChange(option.value)}
                                      variant={
                                        field.value === option.value ? 'secondary' : 'outline'
                                      }
                                      disabled={isUploading}
                                    >
                                      {option.label}
                                    </Button>
                                  );
                                })}
                              </div>
                            )}

                            {scheme.type === 'select' && (
                              <BaseSelect
                                list={scheme.options || []}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder={scheme.placeholder}
                                disabled={isUploading}
                              />
                            )}

                            {scheme.type === 'number' && (
                              <Input
                                {...register(scheme.name, { valueAsNumber: true })}
                                type="number"
                                placeholder={scheme.placeholder}
                                disabled={isUploading}
                              />
                            )}

                            {scheme.type === 'date' && (
                              <div className="flex flex-col">
                                <DatePicker
                                  selected={field.value}
                                  onChange={date => field.onChange(date)}
                                  dateFormat={scheme.dateFormat || 'yyyy/MM/dd'}
                                  placeholderText={scheme.placeholder}
                                  className="border-input h-9 w-full rounded-md border px-3 py-2 text-sm"
                                  minDate={scheme.minDate || new Date()}
                                  maxDate={scheme.maxDate}
                                  disabled={isUploading}
                                />
                              </div>
                            )}

                            {scheme.type === 'time' && (
                              <div className="w-full space-y-4">
                                {scheme.label === '營業時間' && (
                                  <section className="flex w-full flex-col items-center gap-4 rounded-md md:flex-row md:gap-8">
                                    <section className="mt-2 flex items-center gap-4 md:mt-0">
                                      <Button
                                        type="button"
                                        variant={`${field.value?.isOpen ? 'secondary' : 'outline'}`}
                                        onClick={() =>
                                          field.onChange({
                                            ...field.value,
                                            isOpen: true,
                                          })
                                        }
                                      >
                                        營業
                                      </Button>
                                      <Button
                                        type="button"
                                        variant={`${field.value?.isOpen ? 'outline' : 'secondary'}`}
                                        onClick={() =>
                                          field.onChange({
                                            isOpen: false,
                                            morning: { start: '', end: '' },
                                            afternoon: { start: '', end: '' },
                                          })
                                        }
                                      >
                                        休息
                                      </Button>
                                    </section>

                                    <section className={`${field.value?.isOpen ? '' : 'hidden'}`}>
                                      <BaseDatePicker
                                        fieldFromParent={field}
                                        title="特殊日期營業時間"
                                        timeSlot={['morning', 'afternoon'] as TimeSlotType[]}
                                        timeType={['start', 'end'] as TimeType[]}
                                        updateDayOffSchedule={scheme.updateDayOffSchedule}
                                        parseTimeString={scheme.parseTimeString}
                                        addMinutesToTime={scheme.addMinutesToTime}
                                        minusMinutesToTime={scheme.minusMinutesToTime}
                                        timeIntervals={scheme.timeIntervals}
                                        morningStartFilter={scheme.morningStartFilter}
                                        morningEndFilter={scheme.morningEndFilter}
                                        afternoonStartFilter={scheme.afternoonStartFilter}
                                        afternoonEndFilter={scheme.afternoonEndFilter}
                                        timeFormat={scheme.timeFormat}
                                        isUploading={isUploading}
                                      />
                                    </section>
                                  </section>
                                )}

                                {scheme.label === '每週營業時間' &&
                                  Object.entries(WEEK_LABELS).map(([dayKey, dayLabel]) => (
                                    <div
                                      key={dayKey}
                                      className="flex w-full flex-col items-center gap-6 rounded-md bg-gray-50 p-4 md:flex-row md:gap-0"
                                    >
                                      <section className="flex flex-col items-center gap-6 md:mr-20 md:flex-row md:gap-0">
                                        <div className="mr-0 font-medium md:mr-10">{dayLabel}</div>
                                        <section
                                          data-description="按鈕"
                                          className="flex items-center gap-2"
                                        >
                                          <Button
                                            type="button"
                                            variant={`${field.value?.[dayKey]?.isOpen ? 'secondary' : 'outline'}`}
                                            onClick={() =>
                                              field.onChange({
                                                ...field.value,
                                                [dayKey]: {
                                                  ...field.value?.[dayKey],
                                                  isOpen: true,
                                                },
                                              })
                                            }
                                          >
                                            營業
                                          </Button>
                                          <Button
                                            type="button"
                                            variant={`${field.value?.[dayKey]?.isOpen ? 'outline' : 'secondary'}`}
                                            onClick={() =>
                                              field.onChange({
                                                ...field.value,
                                                [dayKey]: {
                                                  ...field.value?.[dayKey],
                                                  isOpen: false,
                                                  morning: { start: '', end: '' },
                                                  afternoon: { start: '', end: '' },
                                                },
                                              })
                                            }
                                          >
                                            休息
                                          </Button>
                                        </section>
                                      </section>

                                      <section
                                        className={`flex items-center md:block ${field.value?.[dayKey]?.isOpen ? '' : 'hidden'}`}
                                      >
                                        <BaseDatePicker
                                          fieldFromParent={field}
                                          dayKey={dayKey as keyof WeeklySchedule}
                                          title="每週營業時間"
                                          timeSlot={['morning', 'afternoon'] as TimeSlotType[]}
                                          timeType={['start', 'end'] as TimeType[]}
                                          updateWeeklySchedule={scheme.updateWeeklySchedule}
                                          parseTimeString={scheme.parseTimeString}
                                          addMinutesToTime={scheme.addMinutesToTime}
                                          minusMinutesToTime={scheme.minusMinutesToTime}
                                          timeIntervals={scheme.timeIntervals}
                                          morningStartFilter={scheme.morningStartFilter}
                                          morningEndFilter={scheme.morningEndFilter}
                                          afternoonStartFilter={scheme.afternoonStartFilter}
                                          afternoonEndFilter={scheme.afternoonEndFilter}
                                          isUploading={isUploading}
                                        />
                                      </section>
                                    </div>
                                  ))}
                              </div>
                            )}

                            {scheme.type === 'textarea' && (
                              <Textarea
                                {...register(scheme.name)}
                                placeholder={scheme.placeholder}
                                className="h-32 w-full rounded border border-gray-300 p-2"
                                disabled={isUploading}
                              />
                            )}

                            {(scheme.type === 'text' ||
                              scheme.type === 'tel' ||
                              scheme.type === 'email') && (
                              <Input
                                {...register(scheme.name)}
                                type={scheme.type}
                                placeholder={scheme.placeholder}
                                disabled={isUploading}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            {Object.entries(button).map(([variant, txt]) => (
              <div key={txt}>
                {variant === 'primary' ? (
                  <Button type="submit" disabled={isUploading || !formState.isValid}>
                    {isUploading ? '上傳中...' : txt}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    type="reset"
                    onClick={handleCancel}
                    disabled={isUploading}
                  >
                    {txt}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BaseForm;

// {scheme.label === '特殊日期營業時間' && (
//   <section className="flex items-center gap-8">
//     <section className="flex items-center gap-4">
//       <span>上午</span>
//       <DatePicker
//         selected={scheme.parseTimeString?.(
//           field.value?.morning?.start || '',
//         )}
//         onChange={date =>
//           field.onChange(
//             scheme.updateDayOffSchedule?.(
//               field.value || {},
//               'morning',
//               'start',
//               date,
//             ),
//           )
//         }
//         minTime={scheme.parseTimeString?.('00:00') || undefined}
//         maxTime={
//           scheme.minusMinutesToTime?.(
//             field.value?.morning?.end || '12:01',
//             scheme.timeIntervals || 15,
//           ) || undefined
//         }
//         showTimeSelect
//         showTimeSelectOnly
//         timeIntervals={scheme.timeIntervals || 15}
//         filterTime={
//           scheme.morningStartFilter ||
//           (date => date.getHours() <= 12)
//         }
//         dateFormat={scheme.timeFormat || 'HH:mm'}
//         timeFormat={scheme.timeFormat || 'HH:mm'}
//         timeCaption="開始"
//         placeholderText={isOpenValue === 'opening' ? '開始' : '-'}
//         disabled={isUploading || isOpenValue === 'closed'}
//         className="w-20 rounded border px-2 py-1 text-center text-sm"
//       />
//       <span>至</span>
//       <DatePicker
//         selected={scheme.parseTimeString?.(
//           field.value?.morning?.end || '',
//         )}
//         onChange={date =>
//           field.onChange(
//             scheme.updateDayOffSchedule?.(
//               field.value || {},
//               'morning',
//               'end',
//               date,
//             ),
//           )
//         }
//         maxTime={scheme.parseTimeString?.('12:00') || undefined}
//         minTime={
//           scheme.addMinutesToTime?.(
//             field.value?.morning?.start || '00:00',
//             scheme.timeIntervals || 15,
//           ) || undefined
//         }
//         showTimeSelect
//         showTimeSelectOnly
//         timeIntervals={scheme.timeIntervals || 15}
//         filterTime={
//           scheme.morningEndFilter || (date => date.getHours() <= 12)
//         }
//         dateFormat={scheme.timeFormat || 'HH:mm'}
//         timeFormat={scheme.timeFormat || 'HH:mm'}
//         timeCaption="結束"
//         placeholderText={`${field.value?.isOpen === 'opening' ? '結束' : '-'}`}
//         disabled={isUploading || field.value?.isOpen === 'closed'}
//         className="w-20 rounded border px-4 py-1 text-center text-sm"
//       />
//     </section>
//     <section className="flex items-center gap-4">
//       {/* 下午時段 */}
//       <span>下午</span>
//       <DatePicker
//         selected={scheme.parseTimeString?.(
//           field.value?.afternoon?.start || '',
//         )}
//         onChange={date =>
//           field.onChange(
//             scheme.updateDayOffSchedule?.(
//               field.value || {},
//               'afternoon',
//               'start',
//               date,
//             ),
//           )
//         }
//         minTime={scheme.parseTimeString?.('12:01') || undefined}
//         maxTime={
//           scheme.minusMinutesToTime?.(
//             field.value?.afternoon?.end || '23:59',
//             scheme.timeIntervals || 15,
//           ) || undefined
//         }
//         showTimeSelect
//         showTimeSelectOnly
//         timeIntervals={scheme.timeIntervals || 15}
//         filterTime={
//           scheme.afternoonStartFilter ||
//           (date => date.getHours() >= 12)
//         }
//         dateFormat={scheme.timeFormat || 'HH:mm'}
//         timeFormat={scheme.timeFormat || 'HH:mm'}
//         timeCaption="開始"
//         placeholderText={`${field.value?.isOpen === 'opening' ? '開始' : '-'}`}
//         className="w-20 rounded border px-2 py-1 text-center text-sm"
//         disabled={isUploading || field.value?.isOpen === 'closed'}
//       />
//       <span>至</span>
//       <DatePicker
//         selected={scheme.parseTimeString?.(
//           field.value?.afternoon?.end || '',
//         )}
//         onChange={date =>
//           field.onChange(
//             scheme.updateDayOffSchedule?.(
//               field.value || {},
//               'afternoon',
//               'end',
//               date,
//             ),
//           )
//         }
//         maxTime={scheme.parseTimeString?.('23:59') || undefined}
//         minTime={
//           scheme.addMinutesToTime?.(
//             field.value?.afternoon?.start || '12:01',
//             scheme.timeIntervals || 15,
//           ) || undefined
//         }
//         showTimeSelect
//         showTimeSelectOnly
//         timeIntervals={scheme.timeIntervals || 15}
//         filterTime={
//           scheme.afternoonEndFilter ||
//           (date => date.getHours() >= 12)
//         }
//         dateFormat={scheme.timeFormat || 'HH:mm'}
//         timeFormat={scheme.timeFormat || 'HH:mm'}
//         timeCaption="結束"
//         placeholderText={`${field.value?.isOpen === 'opening' ? '結束' : '-'}`}
//         className="w-20 rounded border px-2 py-1 text-center text-sm"
//         disabled={isUploading || field.value?.isOpen === 'closed'}
//       />
//     </section>
//   </section>
// )}