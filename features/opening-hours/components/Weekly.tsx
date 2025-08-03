import BaseCard from '@/components/base-card/BaseCard';
import BaseForm from '@/components/base-form/BaseForm';
import type { BaseFormProps } from '@/components/base-form/type';

const Weekly = ({
  formFieldsScheme,
  formHook,
  button,
  onSubmit,
  handleCancel,
  isUploading,
}: BaseFormProps) => {
  return (
    <>
      <BaseCard
        title="每週營業時間"
        titleSize="text-lg"
        subTitle="設定每週的營業時間，讓顧客能在週間的營業時間內預約服務。"
        subTitleSize="text-sm"
        buttonTitle="套用到工作日"
        hasSeparator={false}
      >
        <BaseForm
          formFieldsScheme={formFieldsScheme}
          formHook={formHook}
          button={button}
          onSubmit={onSubmit}
          handleCancel={handleCancel}
          isUploading={isUploading}
        />
      </BaseCard>
    </>
  );
};

export default Weekly;
