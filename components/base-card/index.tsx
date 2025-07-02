import React from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import type { CardProps } from './type';

const BaseCard: React.FC<CardProps> = ({
  title,
  titleSize = 'text-lg',
  subTitle = '',
  subTitleSize = 'text-base',
  buttonTitle = '',
  hasSeparator = true,
  onButtonClick,
  className = '',
  children,
}) => {
  return (
    <div className={`rounded-md bg-white ${className}`}>
      <div>
        <div className="flex items-center justify-between">
          {title && <div className={`${titleSize} p-4`}>{title}</div>}
          {buttonTitle && (
            <Button variant="outline" onClick={onButtonClick} className="mr-4">
              {buttonTitle}
            </Button>
          )}
        </div>
        {subTitle && <div className={`${subTitleSize} p-4 pt-0`}>{subTitle}</div>}
        {hasSeparator && <Separator className="mb-2" />}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default BaseCard;
