import { useState } from 'react';
import {
  INITIAL_SERVICE_CATEGORY,
  INITIAL_SERVICE_ITEM_TABLE,
  INITIAL_TEMP_CATEGORY,
} from '@/constants';
import { X } from 'lucide-react';
import type { ServiceCategory, ServiceItem, TempCategory } from '@/types';
import BaseCard from '@/components/base-card/BaseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ServiceCategoryManagementView = () => {
  // - UI State
  const [isCreateServiceCategoryOpen, setIsCreateServiceCategoryOpen] = useState(false);
  const [triggerButton, setTriggerButton] = useState<string | null>(null);

  // - 初始資料
  const [serviceCategory, setServiceCategory] =
    useState<ServiceCategory[]>(INITIAL_SERVICE_CATEGORY);
  const [serviceItemTable, setServiceItemTable] = useState<ServiceItem[]>(
    INITIAL_SERVICE_ITEM_TABLE,
  );

  // - 編輯暫存資料
  const [editingCategory, setEditingCategory] = useState<TempCategory>(INITIAL_TEMP_CATEGORY);

  // #region 一、服務類別
  // 新增/編輯共用
  const handleChangeCategory = (value: string): void => {
    setEditingCategory({ ...editingCategory, reName: value });
  };

  const isCategoryNameValid = (newCategory: string, originalCategory: string): boolean => {
    // - invalid  -> false
    //    - 排除原類別名稱
    //    - 類別名稱重複
    //    - 類別名稱為空字串
    if (newCategory === originalCategory) return true;
    return !serviceCategory.map(({ item }) => item).includes(newCategory) && newCategory !== '';
  };

  const handleEditCategory = () => {
    const newCategory = editingCategory.reName.trim();
    const originalCategory = editingCategory.originalName.trim();

    if (!isCategoryNameValid(newCategory, originalCategory) && editingCategory.event === 'edit') {
      setEditingCategory({ ...editingCategory, reName: editingCategory.originalName, event: '' });
      alert('類別名稱不能重複或空值');
      return;
    }

    if (newCategory && editingCategory.event === 'edit') {
      const newServiceCategory: ServiceCategory[] = [...serviceCategory];
      newServiceCategory.forEach(category => {
        if (category.item === editingCategory.originalName) {
          category.item = newCategory;
        }
      });
      setServiceCategory(newServiceCategory);

      const updatedServiceItemTable = serviceItemTable.map(item =>
        item.serviceCategory === editingCategory.originalName
          ? { ...item, serviceCategory: newCategory }
          : item,
      );
      setServiceItemTable(updatedServiceItemTable);

      setEditingCategory(INITIAL_TEMP_CATEGORY);
    }
    return;
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCategory = editingCategory.reName.trim();
    const originalCategory = editingCategory.originalName.trim();

    if (!isCategoryNameValid(newCategory, originalCategory) && editingCategory.event === 'create') {
      setEditingCategory({
        ...editingCategory,
        reName: editingCategory.originalName,
        event: 'edit',
      });
      alert('類別名稱不能重複');
      return;
    }

    if (
      newCategory &&
      isCategoryNameValid(newCategory, originalCategory) &&
      editingCategory.event === 'create'
    ) {
      const newServiceCategory: ServiceCategory[] = [...serviceCategory];
      newServiceCategory.push({ item: newCategory, color: 'bg-secondary-button' });
      setServiceCategory(newServiceCategory);
      setEditingCategory(INITIAL_TEMP_CATEGORY);
    }
    return;
  };

  const handleDeleteCategory = (item: string) => {
    console.log('item', `delete-${item}`);
    setTriggerButton(`delete-${item}`);
  };

  // #endregion

  return (
    <BaseCard
      title="服務類別"
      titleSize="text-lg"
      hasSeparator={false}
      buttonTitle="新增類別"
      onButtonClick={() => setIsCreateServiceCategoryOpen(true)}
    >
      <div className="flex w-full flex-wrap items-center gap-2">
        {serviceCategory.map(({ item, color }) => (
          <div key={item}>
            <Badge className={`px-2 py-1 text-xs text-gray-800 ${color} `}>
              <input
                type="text"
                value={
                  item === editingCategory.originalName && editingCategory.event === 'edit'
                    ? editingCategory.reName
                    : item
                }
                size={
                  item === editingCategory.originalName && editingCategory.event === 'edit'
                    ? editingCategory.reName.length + 1
                    : item.length + 1
                }
                onFocus={() =>
                  setEditingCategory({ reName: item, originalName: item, event: 'edit' })
                }
                onChange={e => handleChangeCategory(e.target.value)}
                onBlur={handleEditCategory}
                className="border-none bg-transparent outline-none"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteCategory(item);
                }}
                className="h-6 w-6"
              >
                <X color="#db1a1a" />
              </Button>
            </Badge>
          </div>
        ))}
      </div>
      {isCreateServiceCategoryOpen && (
        <div className="mt-4 rounded-lg border-1 border-gray-200">
          <form onSubmit={handleCreateCategory} className="flex items-center gap-2 p-3">
            <Input
              type="text"
              placeholder="輸入類別名稱"
              value={editingCategory.event === 'create' ? editingCategory.reName : ''}
              onFocus={() =>
                setEditingCategory({ ...editingCategory, reName: '', event: 'create' })
              }
              onChange={e => handleChangeCategory(e.target.value)}
            />
            <Button type="submit" variant="secondary">
              新增
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateServiceCategoryOpen(false);
                setEditingCategory(INITIAL_TEMP_CATEGORY);
              }}
            >
              取消
            </Button>
          </form>
        </div>
      )}
    </BaseCard>
  );
};
