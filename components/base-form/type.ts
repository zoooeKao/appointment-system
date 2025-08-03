import { type ZodTypeAny, z } from 'zod';
import type { DaySchedule, TimeSlotType, TimeType, WeeklySchedule } from '@/components/base-date-picker/type';
import type { UseFormReturn } from 'react-hook-form';

type FieldTypeMap = {
  text: string;
  tel: string;
  email: string;
  textarea: string;
  radio: string | boolean;
  number: number;
  file: File[];
  password: string;
  date: Date | null;
  time: WeeklySchedule | DaySchedule;
  select: string;
};

type FieldType = keyof FieldTypeMap;

type CommonFieldProps = {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  validator: ZodTypeAny;
};

type FieldTypeExtras = {
  radio: {
    options: {
      label: string;
      value: string | boolean;
    }[];
  };
  select: {
    options: string[];
  };
  time: {
    timeIntervals?: number;
    timeFormat?: string;
    timeCaption?: string;
    morningStartFilter?: (date: Date) => boolean;
    morningEndFilter?: (date: Date) => boolean;
    afternoonStartFilter?: (date: Date) => boolean;
    afternoonEndFilter?: (date: Date) => boolean;
    parseTimeString?: (timeString: string) => Date | null;
    formatTimeString?: (date: Date | null) => string;
    addMinutesToTime?: (timeString: string, minutes: number) => Date | null;
    minusMinutesToTime?: (timeString: string, minutes: number) => Date | null;
    updateWeeklySchedule?: (
      currentValue: WeeklySchedule,
      weekDay: keyof WeeklySchedule,
      timeSlot: TimeSlotType,
      timeType: TimeType,
      date: Date | null,
    ) => WeeklySchedule;
    updateDayOffSchedule?: (
      currentValue: DaySchedule,
      timeSlot: TimeSlotType,
      timeType: TimeType,
      date: Date | null,
    ) => DaySchedule;
  };
  date: {
    minDate?: Date;
    maxDate?: Date;
    dateFormat?: string;
    excludeDates?: string[];
  };
};

type ExtraProps<T extends FieldType> = T extends keyof FieldTypeExtras
  ? FieldTypeExtras[T]
  : object;

type FieldByType<T extends FieldType> = CommonFieldProps & {
  type: T;
  value: FieldTypeMap[T];
} & ExtraProps<T>;

type FormFieldType = {
  [K in FieldType]: FieldByType<K>;
}[FieldType];

export const FormResolver = (fields: FormFieldType[]) => {
  const entries = fields.map(f => [f.name, f.validator]);
  return z.object(Object.fromEntries(entries));
};

type FormData = z.infer<ReturnType<typeof FormResolver>>;

export type { FieldType, FormFieldType, FormData};


export interface BaseFormProps {
  formFieldsScheme: FormFieldType[];
  formHook: UseFormReturn;
  button: { primary: string; secondary?: string; outline?: string };
  onSubmit: (data: FormData) => void;
  handleCancel: () => void;
  isUploading: boolean;
}