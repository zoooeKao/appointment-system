import { dayOffFormFields } from '@/features/opening-hours/schemas';
import type { DayOffRow } from '@/features/opening-hours/types';
import type { UseFormReturn } from 'react-hook-form';
import BaseCard from '@/components/base-card/BaseCard';
import BaseForm from '@/components/base-form/BaseForm';
import type { FormData } from '@/components/base-form/type';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DayOffProps {
  onButtonClick: () => void;
  dayOffTable: DayOffRow[];
  onDeleteDayOffList: (dayOffDate: string) => void;
  onDayOffFormSubmit: (data: FormData) => void;
  createDayOff: boolean;
  setCreateDayOff: (createDayOff: boolean) => void;
  dayOffFormHook: UseFormReturn<FormData>;
  isDayOffFormUploading: boolean;
}

const DayOff: React.FC<DayOffProps> = ({
  onButtonClick,
  dayOffTable,
  onDeleteDayOffList,
  onDayOffFormSubmit,
  createDayOff,
  setCreateDayOff,
  dayOffFormHook,
  isDayOffFormUploading,
}) => {
  return (
    <div>
      <BaseCard
        title="特殊日期設定"
        titleSize="text-lg"
        subTitle="設定特殊日期，如節假日休息或特別活動延長營業，特殊日期的設定將會覆蓋該日的一般營業時間。"
        subTitleSize="text-sm"
        buttonTitle="新增特殊日期"
        onButtonClick={onButtonClick}
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
                        dayOff.isOpening ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                      onClick={() => onDeleteDayOffList(dayOff.dayOffDate)}
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
              formFieldsScheme={dayOffFormFields(dayOffTable.map(dayOff => dayOff.dayOffDate))}
              formHook={dayOffFormHook}
              button={{ primary: '儲存變更', secondary: '取消' }}
              onSubmit={onDayOffFormSubmit}
              handleCancel={() => {
                dayOffFormHook.reset();
                setCreateDayOff(false);
              }}
              isUploading={isDayOffFormUploading}
            />
          </div>
        )}
      </BaseCard>
    </div>
  );
};

export default DayOff;
