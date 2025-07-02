import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  titleSize?: string;
  subTitle?: string;
  subTitleSize?: string;
  buttonTitle?: string;
  hasSeparator?: boolean;
  onButtonClick?: () => void;
  className?: string;
  children: ReactNode;
};

export type { CardProps };