'use client';

import { useMemo, useState } from 'react';
import { INITIAL_SERVICE_CATEGORY, INITIAL_SERVICE_ITEM_TABLE, INITIAL_TEMP_CATEGORY } from '@/constants';
import { baseTableSchema, createServiceItemFormFields } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronDown, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, ChevronUp, ChevronsUpDown, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { ServiceCategory, ServiceItem, TempCategory } from '@/types';
import BaseAlertDialog from '@/components/base-alert-dialog';
import BaseCard from '@/components/base-card';
import type { FormData } from '@/components/base-form/type';
import { FormResolver } from '@/components/base-form/type';
import PageWrapper from '@/components/base-page-wrapper';
import BaseSelect from '@/components/base-select/base-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


const ServiceManagement = () => {
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
  const [editingServiceItem, setEditingServiceItem] = useState<ServiceItem | null>(null);

  // - 篩選狀態
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // - 其他狀態
  const [isServiceItemFormUploading, setIsServiceItemFormUploading] = useState(false);

  const serviceItemFormFields = useMemo(
    () => createServiceItemFormFields(serviceCategory.map(({ item }) => item)),
    [serviceCategory],
  );

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

  const handleConfirmDeleteCategory = (data: ServiceItem[]) => {
    // 當 all 中元素的 id 屬性與 updateData 中元素的 id 屬性相同時，要對 all 陣列做資料處理，情境有以下兩種：
    // 1. 當該 updateData 元素的 serviceCategory 屬性是空字串時，all 元素該筆資料要刪除
    // 2. 當該 updateData 元素的 serviceCategory 屬性不是空字串時，要將 all 元素該筆資料的serviceCategory更新為 updateData 的 serviceCategory 屬性值
    function processServiceData(allData: ServiceItem[], updateData: ServiceItem[]) {
      return allData
        .map(item => {
          const updateItem = updateData.find(update => update.id === item.id);
          if (updateItem) {
            // 如果 serviceCategory 是空字串，標記為要刪除
            if (updateItem.serviceCategory === '') {
              return null; // 標記為刪除
            }
            // 更新 serviceCategory
            return { ...item, serviceCategory: updateItem.serviceCategory };
          }
          return item; // 沒有更新資料的項目保持不變
        })
        .filter(item => item !== null); // 過濾掉標記為刪除的項目
    }

    setServiceCategory(pre =>
      pre.filter(category => category.item !== triggerButton?.replace('delete-', '')),
    );

    setServiceItemTable(processServiceData(serviceItemTable, data));

    handleDialogClose();
  };

  // 取得將被刪除類別的相關資料
  const getDeleteCategoryData = () => {
    if (!triggerButton?.startsWith('delete-')) return undefined;

    const categoryToDelete = triggerButton.replace('delete-', '');
    const affectedServices = serviceItemTable.filter(
      item => item.serviceCategory === categoryToDelete,
    );
    const availableCategories = serviceCategory
      .filter(category => category.item !== categoryToDelete)
      .map(category => category.item);

    return {
      categoryName: categoryToDelete,
      affectedServices,
      availableCategories,
    };
  };
  // #endregion

  // #region 二、服務項目表格
  const columnHelper = createColumnHelper<ServiceItem>();

  const filteredServiceItems = useMemo(() => {
    return serviceItemTable.filter(item => {
      const matchesSearch =
        searchKeyword === '' ||
        item.serviceName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (item.serviceDescription &&
          item.serviceDescription.toLowerCase().includes(searchKeyword.toLowerCase()));

      const matchesCategory = selectedCategory === '' || item.serviceCategory === selectedCategory;

      const matchesStatus =
        selectedStatus === '' ||
        (selectedStatus === '啟用中' && item.isEnabled) ||
        (selectedStatus === '已停用' && !item.isEnabled);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [serviceItemTable, searchKeyword, selectedCategory, selectedStatus]);

  const columns = [
    columnHelper.accessor('serviceName', {
      header: () => {
        return <div className="text-gray-900">{baseTableSchema.serviceName.header}</div>;
      },
      cell: ({ row }) => {
        const { serviceName, serviceDescription, requireDeposit } = row.original;
        return (
          <div className="space-y-1">
            <div className="text-gray-900">{serviceName}</div>
            {serviceDescription && (
              <div className="text-sm text-gray-600">{serviceDescription}</div>
            )}
            {typeof requireDeposit === 'number' && requireDeposit > 0 && (
              <div className="text-sm text-orange-600">
                需預付訂金：${requireDeposit.toLocaleString()}
              </div>
            )}
          </div>
        );
      },
      size: baseTableSchema.serviceName.size,
      enableSorting: baseTableSchema.serviceName.enableSorting,
    }),
    columnHelper.accessor('serviceCategory', {
      header: baseTableSchema.serviceCategory.header,
      cell: ({ getValue }) => {
        const category = getValue();
        const categoryColor =
          serviceCategory.find(c => c.item === category)?.color || 'bg-gray-200';
        return (
          <div className="flex justify-center">
            <Badge className={` ${categoryColor} px-2 py-1 text-xs text-gray-800`}>
              {category}
            </Badge>
          </div>
        );
      },
      size: baseTableSchema.serviceCategory.size,
      enableSorting: baseTableSchema.serviceCategory.enableSorting,
    }),
    columnHelper.accessor('serviceDuration', {
      header: ({ column }) => {
        return (
          <div
            className="flex cursor-pointer items-center justify-center gap-1 text-gray-900 hover:text-gray-700"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {baseTableSchema.serviceDuration.header}
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronsUpDown className="h-4 w-4" />
            )}
          </div>
        );
      },
      cell: ({ getValue }) => <div className="text-center">{`${getValue()} 分鐘`}</div>,
      size: baseTableSchema.serviceDuration.size,
      enableSorting: baseTableSchema.serviceDuration.enableSorting,
    }),
    columnHelper.accessor('servicePrice', {
      header: ({ column }) => {
        return (
          <div
            className="flex cursor-pointer items-center justify-center gap-1 text-gray-900 hover:text-gray-700"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {baseTableSchema.servicePrice.header}
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronsUpDown className="h-4 w-4" />
            )}
          </div>
        );
      },
      cell: ({ getValue }) => (
        <div className="text-center">
          {`${getValue().toLocaleString('zh-TW', {
            minimumFractionDigits: 0,
            style: 'currency',
            currency: 'TWD',
          })}`}
        </div>
      ),
      size: baseTableSchema.servicePrice.size,
      enableSorting: baseTableSchema.servicePrice.enableSorting,
    }),
    columnHelper.accessor('isEnabled', {
      header: baseTableSchema.isEnabled.header,
      cell: ({ getValue, row }) => {
        const isEnabled = getValue();
        const serviceItem = row.original;
        return (
          <div className="flex justify-center">
            <Badge
              variant={isEnabled ? 'default' : 'secondary'}
              className={`cursor-pointer transition-colors hover:opacity-80 ${
                isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
              onClick={() => handleToggleServiceStatus(serviceItem)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggleServiceStatus(serviceItem);
                }
              }}
            >
              {isEnabled ? '啟用中' : '已停用'}
            </Badge>
          </div>
        );
      },
      size: baseTableSchema.isEnabled.size,
      enableSorting: baseTableSchema.isEnabled.enableSorting,
    }),
    columnHelper.display({
      id: 'action',
      header: baseTableSchema.action.header,
      cell: props => (
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => {
              handleDialogOpen('edit', props.row.original);
            }}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-800"
          >
            編輯
          </Button>
          <Button
            onClick={() => {
              handleDeleteServiceItem(props.row.original);
            }}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800"
          >
            刪除
          </Button>
        </div>
      ),
      size: baseTableSchema.action.size,
      enableSorting: baseTableSchema.action.enableSorting,
    }),
  ];

  const table = useReactTable({
    data: filteredServiceItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    getSortedRowModel: getSortedRowModel(),
    getRowId: row => row.id, // 使用 id 作為 row 的唯一識別
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleToggleServiceStatus = (serviceItem: ServiceItem) => {
    const updatedServiceItemTable = serviceItemTable.map(item =>
      item.id === serviceItem.id ? { ...item, isEnabled: !item.isEnabled } : item,
    );
    setServiceItemTable(updatedServiceItemTable);
  };

  // #endregion

  // #region 三、服務項目 Dialog
  const serviceItemFormHook = useForm<FormData>({
    resolver: zodResolver(FormResolver(serviceItemFormFields)),
    defaultValues: Object.fromEntries(
      serviceItemFormFields.map(field => [field.name, field.value]),
    ),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  // 新增/編輯共用
  const handleFormSubmit = (data: FormData) => {
    console.log('表單送出資料', data);
    setIsServiceItemFormUploading(true);
    try {
      if (triggerButton === 'edit' && editingServiceItem && Object.keys(data).length > 0) {
        // 更新服務項目
        const updatedServiceItemTable = serviceItemTable.map(item =>
          item.id === editingServiceItem.id
            ? { ...item, ...(data as Omit<ServiceItem, 'id'>) }
            : item,
        );
        setServiceItemTable(updatedServiceItemTable);
      } else {
        // 新增服務項目
        const newServiceItem: ServiceItem = {
          id: `service-${Date.now()}`,
          ...(data as Omit<ServiceItem, 'id'>),
        };
        setServiceItemTable([...serviceItemTable, newServiceItem]);
      }
    } catch (error) {
      console.error('表單送出錯誤', error);
    } finally {
      setIsServiceItemFormUploading(false);
      handleDialogClose();
    }
  };

  const handleDeleteServiceItem = (serviceItem: ServiceItem) => {
    const updatedServiceItemTable = serviceItemTable.filter(item => item.id !== serviceItem.id);
    setServiceItemTable(updatedServiceItemTable);
  };

  const handleDialogClose = () => {
    serviceItemFormHook.reset();
    setTriggerButton(null);
    setEditingServiceItem(null);
  };

  const handleDialogOpen = (mode: string, serviceItem?: ServiceItem) => {
    setTriggerButton(mode);
    if (mode === 'edit' && serviceItem) {
      setEditingServiceItem(serviceItem);
      serviceItemFormHook.reset({
        serviceName: serviceItem.serviceName,
        serviceCategory: serviceItem.serviceCategory,
        serviceDuration: serviceItem.serviceDuration,
        servicePrice: serviceItem.servicePrice,
        reservationInterval: serviceItem.reservationInterval,
        advanceBookingDays: serviceItem.advanceBookingDays || 0,
        serviceDescription: serviceItem.serviceDescription || '',
        requireDeposit: serviceItem.requireDeposit || 0,
        isEnabled: serviceItem.isEnabled ?? true,
      });
    }

    if (mode === 'create') {
      setEditingServiceItem(null);
      serviceItemFormHook.reset(
        Object.fromEntries(serviceItemFormFields.map(field => [field.name, field.value])),
      );
    }
  };
  // #endregion

  return (
    <>
      <PageWrapper
        title="服務項目管理"
        titleSize="text-2xl"
        subTitle="管理您的服務項目，設定服務內容、價格和預約規則。"
        subTitleSize="text-sm"
      >
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

        <BaseCard hasSeparator={false} className="mt-4">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="搜尋服務名稱或描述..."
            />
            <BaseSelect
              list={serviceCategory.map(({ item }) => item)}
              value={selectedCategory}
              onValueChange={value => setSelectedCategory(value)}
              allOptionText="所有類別"
              placeholder="所有類別"
            />
            <BaseSelect
              list={['啟用中', '已停用']}
              value={selectedStatus}
              onValueChange={value => setSelectedStatus(value)}
              allOptionText="所有狀態"
              placeholder="所有狀態"
            />
            <Button onClick={() => handleDialogOpen('create')}>新增服務項目</Button>
          </div>
        </BaseCard>

        <section className="hidden">
          {/* 由 triggerButton 觸發 */}
          <BaseAlertDialog
            triggerButton={
              triggerButton === 'edit'
                ? 'edit'
                : triggerButton === 'create'
                  ? 'create'
                  : triggerButton?.startsWith('delete-')
                    ? triggerButton
                    : null
            }
            formFieldsScheme={serviceItemFormFields}
            formHook={serviceItemFormHook}
            onSubmit={data => {
              if (triggerButton?.startsWith('delete-')) {
                handleConfirmDeleteCategory(data as ServiceItem[]);
              } else {
                handleFormSubmit(serviceItemFormHook.getValues());
              }
            }}
            handleCancel={handleDialogClose}
            button={{
              outline: '取消',
              primary: triggerButton === 'edit' ? '更新' : '新增',
            }}
            isUploading={isServiceItemFormUploading}
            deleteCategory={getDeleteCategoryData()}
          />
        </section>

        <Table className="mt-4 table-fixed rounded-md bg-white">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead
                    key={header.id}
                    className={`bg-gray-300 font-semibold text-gray-900 ${
                      header.id === 'action' ||
                      header.id === 'isEnabled' ||
                      header.id === 'serviceDuration' ||
                      header.id === 'servicePrice' ||
                      header.id === 'serviceCategory'
                        ? 'text-center'
                        : ''
                    }`}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50 border-b"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  暫無資料
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <section className="mt-4 flex flex-nowrap items-center justify-between rounded-md p-4">
          <div className="flex flex-shrink-0 items-center space-x-2">
            <div className="text-sm whitespace-nowrap text-gray-700">每頁顯示</div>
            <BaseSelect
              list={['3', '5', '10', '20', '50']}
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={value => table.setPageSize(Number(value))}
              placeholder="10"
            />
            <div className="text-sm whitespace-nowrap text-gray-700">筆資料</div>
          </div>

          <div className="flex flex-shrink-0 items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronFirst />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
            <span className="whitespace-nowrap">
              第 {table.getState().pagination.pageIndex + 1} 頁
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronLast />
            </Button>
          </div>

          <div className="flex flex-shrink-0 items-center space-x-2">
            <span className="text-sm whitespace-nowrap text-gray-700">
              共 {table.getPageCount()} 頁 （總共 {filteredServiceItems.length} 筆資料）
            </span>
          </div>
        </section>
      </PageWrapper>
    </>
  );
};

export default ServiceManagement;