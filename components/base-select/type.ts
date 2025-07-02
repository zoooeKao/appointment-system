interface BaseSelectProps {
  list: string[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  allOptionText?: string;
}

export type { BaseSelectProps };