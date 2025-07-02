import React from 'react';
import type { PageWrapperProps } from './type';

const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  subTitle,
  titleSize,
  subTitleSize,
  children,
}) => {
  return (
    <div>
      <div className="mb-6">
        {title && <div className={`font-bold ${titleSize} mb-4`}>{title}</div>}
        {subTitle && <div className={`${subTitleSize}`}>{subTitle}</div>}
      </div>
      {children}
    </div>
  );
};

export default PageWrapper;
