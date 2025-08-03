import { type ReactNode } from 'react';


interface BasePageWrapperProps {
  title: string;
  titleSize?: string;
  subTitle?: string;
  subTitleSize?: string;
  children: ReactNode;
}

export type { BasePageWrapperProps };