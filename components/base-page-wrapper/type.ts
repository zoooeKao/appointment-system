import { type ReactNode } from 'react';


interface PageWrapperProps {
  title: string;
  titleSize?: string;
  subTitle?: string;
  subTitleSize?: string;
  children: ReactNode;
}

export type { PageWrapperProps };