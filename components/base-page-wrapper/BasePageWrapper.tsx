import React from 'react';
import type { BasePageWrapperProps } from './type';

const BasePageWrapper: React.FC<BasePageWrapperProps> = ({
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

export default BasePageWrapper;
