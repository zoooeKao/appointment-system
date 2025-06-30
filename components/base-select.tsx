import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


interface BaseSelectProps {
  list: string[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  allOptionText?: string;
}

const BaseSelect = ({
  list,
  value,
  onValueChange,
  allOptionText = '全部',
  placeholder = '請選擇',
  showAllOption = true,
  disabled = false,
}: BaseSelectProps) => {
  const handleValueChange = (selectedValue: string) => {
    const valueToPass = selectedValue === allOptionText ? '' : selectedValue;
    onValueChange?.(valueToPass);
  };

  return (
    <Select
      value={value || (showAllOption ? allOptionText : '')}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && <SelectItem value={allOptionText}>{allOptionText}</SelectItem>}
        {list.map(item => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BaseSelect;