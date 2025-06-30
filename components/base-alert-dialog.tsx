// import { useState } from 'react';
// import type { UseFormReturn } from 'react-hook-form';
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import type { ServiceItem } from '@/app/(dashboard)/service-management/page';
// import BaseForm from './base-form';
// import type { FormData, FormFieldType } from './base-form/formConfig';
// import BaseSelect from './base-select';
// interface BaseAlertDialogProps {
//   triggerButton: string | null;
//   // 以下與 Form 相關參數
//   formFieldsScheme: FormFieldType[];
//   formHook: UseFormReturn<FormData>;
//   onSubmit: (data?: FormData) => void;
//   handleCancel: () => void;
//   button: { primary: string; secondary?: string; outline?: string };
//   isUploading: boolean;
//   // 刪除類別相關參數
//   deleteCategory?: {
//     categoryName: string;
//     affectedServices: ServiceItem[];
//     availableCategories: string[];
//   };
// }
// const BaseAlertDialog = ({
//   triggerButton,
//   formFieldsScheme,
//   formHook,
//   onSubmit,
//   handleCancel,
//   button,
//   isUploading,
//   deleteCategory,
// }: BaseAlertDialogProps) => {
//   const [selectedServicesId, setSelectedServicesId] = useState<string[]>([]);
//   const [newCategory, setNewCategory] = useState<string>('');
//   const isDelete = triggerButton?.startsWith('delete-');
//   const deleteItem = triggerButton?.replace('delete-', '');
//   const handleServiceToggle = (serviceId: string) => {
//     setSelectedServicesId(prev =>
//       prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId],
//     );
//   };
//   const handleDeleteWithReassignment = () => {
//     onSubmit({
//       selectedServicesId,
//       newCategory,
//     } as FormData);
//   };
//   const servicesToReassign: ServiceItem[] =
//     deleteCategory?.affectedServices.filter(service => selectedServicesId.includes(service.id)) ||
//     [];
//   const servicesToDelete: ServiceItem[] =
//     deleteCategory?.affectedServices.filter(service => !selectedServicesId.includes(service.id)) ||
//     [];
//   return (
//     <div>
//       <AlertDialog open={triggerButton === 'create' || triggerButton === 'edit' || isDelete}>
//         <AlertDialogContent className="max-w-2xl">
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               {triggerButton === 'create'
//                 ? '新增服務項目'
//                 : triggerButton === 'edit'
//                   ? `編輯服務項目`
//                   : `刪除類別「${deleteItem}」`}
//             </AlertDialogTitle>
//             {isDelete && (
//               <AlertDialogDescription className="rounded-md border border-orange-300 bg-orange-100 p-4 text-sm text-orange-800">
//                 ⚠️ 此類別下有 {deleteCategory?.affectedServices.length || 0}{' '}
//                 個服務項目。請選擇要保留的服務項目並為它們批量指派新的類別。
//               </AlertDialogDescription>
//             )}
//           </AlertDialogHeader>
//           {(triggerButton === 'create' || triggerButton === 'edit') && (
//             <BaseForm
//               formFieldsScheme={formFieldsScheme}
//               formHook={formHook}
//               onSubmit={onSubmit}
//               handleCancel={handleCancel}
//               button={button}
//               isUploading={isUploading}
//             />
//           )}
//           {isDelete && deleteCategory && (
//             <div className="flex flex-col gap-6">
//               {/* 批量指派服務項目 */}
//               <div className="rounded-md border border-red-500 p-4">
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex size-4 items-center justify-center rounded-full">
//                     <span className="text-xs text-white">🎯</span>
//                   </div>
//                   <span className="font-semibold">批量指派服務項目：</span>
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="mb-2 block text-sm font-medium text-gray-700">
//                       選擇要保留的服務項目：
//                     </label>
//                     {deleteCategory.affectedServices.map(service => (
//                       <div
//                         key={service.id}
//                         className={`flex cursor-pointer items-center justify-between rounded border p-2 transition-colors ${
//                           selectedServicesId.includes(service.id)
//                             ? 'border-blue-300 bg-blue-50'
//                             : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
//                         }`}
//                         onClick={() => handleServiceToggle(service.id)}
//                       >
//                         <div className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={selectedServicesId.includes(service.id)}
//                             onChange={() => handleServiceToggle(service.id)}
//                             className="h-4 w-4"
//                           />
//                           <span className="text-sm font-medium">{service.serviceName}</span>
//                           <span className="text-xs text-gray-500">
//                             ${service.servicePrice} • {service.serviceDuration}分鐘
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div>
//                     <label className="mb-2 block text-sm font-medium text-gray-700">
//                       選擇目標類別：
//                     </label>
//                     <div className="grid max-h-32 grid-cols-1 gap-2 overflow-y-auto">
//                       <BaseSelect
//                         list={deleteCategory.availableCategories}
//                         value={newCategory}
//                         onValueChange={setNewCategory}
//                         placeholder="請選擇類別..."
//                         disabled={isUploading || selectedServicesId.length === 0}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* 已指派的服務項目 */}
//               <div className="rounded-md border border-gray-200 p-4">
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-500">
//                     <span className="text-xs text-white">📋</span>
//                   </div>
//                   <span className="font-semibold">已指派的服務項目：</span>
//                 </div>
//                 <div className="space-y-2">
//                   {servicesToReassign.map(service => (
//                     <div
//                       key={service.id}
//                       className="flex items-center justify-between rounded border border-green-200 bg-green-50 p-2"
//                     >
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm font-medium">{service.serviceName}</span>
//                         <Badge className="bg-green-100 text-green-800">
//                           {newCategory || '未選擇'}
//                         </Badge>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-500">${service.servicePrice}</span>
//                         <span className="text-sm text-gray-500">•</span>
//                         <span className="text-sm text-gray-500">{service.serviceDuration}分鐘</span>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-6 px-2 text-red-600 hover:text-red-800"
//                           onClick={() => handleServiceToggle(service.id)}
//                         >
//                           移除
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                   {servicesToReassign.length === 0 && (
//                     <div className="py-4 text-center text-sm text-gray-500">
//                       尚未選擇要保留的服務項目
//                     </div>
//                   )}
//                 </div>
//               </div>
//               {/* 操作結果摘要 */}
//               <div className="rounded-md border border-gray-200 p-4">
//                 <div className="mb-4 flex items-center gap-2">
//                   <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
//                     <span className="text-xs text-white">📊</span>
//                   </div>
//                   <span className="font-semibold">操作結果摘要：</span>
//                 </div>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex items-center gap-2">
//                     <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
//                       <span className="text-xs text-white">🗑️</span>
//                     </span>
//                     <span>刪除類別「{deleteItem}」</span>
//                   </div>
//                   {servicesToReassign.length > 0 && (
//                     <div className="flex items-center gap-2">
//                       <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
//                         <span className="text-xs text-white">💾</span>
//                       </span>
//                       <span>保留並重新指派 {servicesToReassign.length} 個服務項目</span>
//                     </div>
//                   )}
//                   {servicesToDelete.length > 0 && (
//                     <div className="flex items-center gap-2">
//                       <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
//                         <span className="text-xs text-white">❌</span>
//                       </span>
//                       <span>刪除 {servicesToDelete.length} 個服務項目</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <AlertDialogFooter>
//                 <AlertDialogCancel onClick={handleCancel}>取消</AlertDialogCancel>
//                 <AlertDialogAction
//                   onClick={handleDeleteWithReassignment}
//                   disabled={isUploading}
//                   className="bg-red-600 hover:bg-red-700"
//                 >
//                   確認刪除
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </div>
//           )}
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };
// export default BaseAlertDialog;
// // [Q1] 分析 submit 和 cancel 要在 baseForm 或是 baseAlertDialog 送出
// // 釐清 baseForm type 是 select 的時候，要怎麼處理
import { useCallback, useMemo, useState } from 'react';
import { Check, ChevronDown, MoveRight, X } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import BaseForm from '@/components/base-form';
import type { FormData, FormFieldType } from '@/components/base-form/formConfig';
import BaseSelect from '@/components/base-select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ServiceItem } from '@/app/(dashboard)/service-management/page';

interface BaseAlertDialogProps {
  triggerButton: string | null;
  // 以下與 Form 相關參數
  formFieldsScheme?: FormFieldType[];
  formHook?: UseFormReturn<FormData>;
  onSubmit: (data?: FormData | ServiceItem[]) => void;
  handleCancel?: () => void;
  button?: { primary: string; secondary?: string; outline?: string };
  isUploading: boolean;
  // 刪除類別相關參數
  deleteCategory?: {
    affectedServices: ServiceItem[];
    availableCategories: string[];
  };
}

const BaseAlertDialog = ({
  triggerButton,
  formFieldsScheme,
  formHook,
  onSubmit,
  handleCancel,
  button,
  isUploading,
  deleteCategory,
}: BaseAlertDialogProps) => {
  // 字段映射
  // const FIELD_MAPPING = {
  //   create: {
  //     NEW_ITEM: '新增服務項目',
  //   },
  //   edit: {
  //     NEW_ITEM: '編輯服務項目',
  //   },
  // }[triggerButton as 'create' | 'edit'];

  // - UI State
  const [isServiceItemOpen, setIsServiceItemOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // - 指派因子
  const [selectedServicesId, setSelectedServicesId] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');

  // - 指派列表
  const [reassignServiceList, setReassignServiceList] = useState<ServiceItem[]>([]);

  const isDelete = triggerButton?.startsWith('delete-');
  const deleteItem = triggerButton?.replace('delete-', '');

  const servicesToDelete = useMemo(() => {
    if (!deleteCategory) return [];
    const reassignIds = reassignServiceList.map(list => list.id);
    return deleteCategory.affectedServices
      .filter(service => !reassignIds.includes(service.id))
      .map(service => ({ ...service, serviceCategory: '' }));
  }, [deleteCategory, reassignServiceList]);

  const removeItem = (serviceId: string) => {
    setReassignServiceList(reassignServiceList.filter(list => list.id !== serviceId));
  };

  const toggleItem = (serviceId: string) => {
    setSelectedServicesId(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId],
    );
  };

  const selectAll = () => {
    const assignedIds = reassignServiceList.map(list => list.id);

    setSelectedServicesId(
      deleteCategory?.affectedServices
        .filter(service => !assignedIds.includes(service.id))
        .map(service => service.id) || [],
    );
  };

  const clearAll = () => {
    setSelectedServicesId([]);
  };

  const handleReassignServiceItemTable = () => {
    // - 改類
    //    - 既有的 reassignServiceList
    // - 刪除
    //    - 找到在 affectedServices 當中，不在 reassignServiceList 的 id，將 categoryName 改為 ''
    const del: ServiceItem[] = servicesToDelete;

    console.log('刪除的:', del);
    console.log('改類的:', reassignServiceList);
    onSubmit([...del, ...reassignServiceList]);

    setSelectedServicesId([]);
    setNewCategory('');
    setIsServiceItemOpen(false);
    setIsCategoryOpen(false);
    setReassignServiceList([]);
  };

  const batchReassign = () => {
    // - 改類
    //    - selectedServicesId 和 newCategory 都存在才進行指派
    //    - 排除已指派過的 selectedServicesId (下拉選單先過濾)
    //    - 要清空 selectedServicesId、newCategory
    // - 清空 selectedServicesId、newCategory
    // - 關閉 open

    if (selectedServicesId.length === 0 || newCategory === '')
      alert('請選擇要指派的服務項目和類別');

    const batchReassignList = deleteCategory?.affectedServices
      .filter(service => selectedServicesId.includes(service.id))
      .map(service => ({
        ...service,
        serviceCategory: newCategory,
      }));

    if (!batchReassignList) return;
    setReassignServiceList(prev => [...prev, ...batchReassignList]);

    setSelectedServicesId([]);
    setNewCategory('');

    setIsServiceItemOpen(false);
    setIsCategoryOpen(false);
  };

  return (
    <div>
      <AlertDialog open={triggerButton === 'create' || triggerButton === 'edit' || isDelete}>
        <AlertDialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {triggerButton === 'create'
                ? '新增服務項目'
                : triggerButton === 'edit'
                  ? `編輯服務項目`
                  : `刪除類別「${deleteItem}」`}
            </AlertDialogTitle>
            {isDelete && (
              <AlertDialogDescription className="rounded-md border border-orange-300 bg-orange-100 p-4 text-sm text-orange-800">
                ⚠️ 此類別下有 {deleteCategory?.affectedServices.length || 0}{' '}
                個服務項目。請選擇要保留的服務項目並為它們批量指派新的類別。
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          {(triggerButton === 'create' || triggerButton === 'edit') && (
            <BaseForm
              formFieldsScheme={formFieldsScheme as FormFieldType[]}
              formHook={formHook as UseFormReturn<FormData>}
              onSubmit={onSubmit}
              handleCancel={handleCancel as () => void}
              button={button as { primary: string; secondary?: string; outline?: string }}
              isUploading={isUploading}
            />
          )}

          {isDelete && deleteCategory && (
            <div className="flex flex-col gap-6">
              <div className="rounded-md border border-red-500 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex size-4 items-center justify-center rounded-full">
                    <span className="text-xs text-white">🎯</span>
                  </div>
                  <span className="font-semibold">批量指派服務項目：</span>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      選擇要指派的服務項目：
                    </label>
                    <button
                      onClick={() => {
                        setIsServiceItemOpen(!isServiceItemOpen);
                        setIsCategoryOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-2 text-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <span className="text-gray-600">
                        {selectedServicesId.length === 0 ? (
                          '全選未指派'
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {selectedServicesId.map(id => {
                              const serviceName = deleteCategory?.affectedServices.find(
                                service => service.id === id,
                              )?.serviceName;
                              return (
                                <span
                                  className="bg-secondary-button rounded-md px-2 py-1 text-sm text-white"
                                  key={id}
                                >
                                  {serviceName}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isServiceItemOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {isServiceItemOpen && !isCategoryOpen && (
                      <div className="absolute z-10 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white text-sm shadow-lg">
                        <div className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 p-3">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => selectAll()}
                              className="text-secondary-button hover:text-secondary-button-hover text-sm font-bold"
                            >
                              全選
                            </button>
                            <button
                              onClick={clearAll}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              清空
                            </button>
                          </div>
                        </div>

                        <div className="p-2">
                          {deleteCategory?.affectedServices.map(service => {
                            const isSelected = selectedServicesId.includes(service.id);
                            const isReassigned = reassignServiceList.some(
                              reassignService => reassignService.id === service.id,
                            );
                            if (isReassigned) return;
                            return (
                              <div
                                key={service.id}
                                onClick={() => toggleItem(service.id)}
                                className="flex cursor-pointer items-start rounded-md p-3 hover:bg-gray-50"
                              >
                                <div className="mt-0.5 mr-3 flex h-5 w-5 items-center justify-center">
                                  <div
                                    className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
                                      isSelected
                                        ? 'border-secondary-button bg-secondary-button'
                                        : 'border-gray-300'
                                    }`}
                                  >
                                    {isSelected && <Check size={12} className="text-white" />}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {service.serviceName}
                                  </div>
                                  <div className="mt-1 text-sm text-gray-600">
                                    {service.serviceDescription}
                                  </div>
                                  <div className="mt-1 text-sm text-orange-600">
                                    {Number(service.servicePrice).toLocaleString('zh-TW', {
                                      minimumFractionDigits: 0,
                                      style: 'currency',
                                      currency: 'TWD',
                                    })}{' '}
                                    • {service.serviceDuration}分鐘
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 選擇目標類別 */}
                  <div className="relative">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      選擇目標類別：
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsCategoryOpen(!isCategoryOpen);
                          setIsServiceItemOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-2 text-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <span className="text-gray-600">
                          {newCategory === '' ? (
                            '請選擇類別...'
                          ) : (
                            <span className="bg-secondary-button rounded-md px-2 py-1 text-sm text-white">
                              {newCategory}
                            </span>
                          )}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => batchReassign()}
                        className="bg-third-button w-1/4 cursor-pointer rounded-md p-1 text-sm text-white"
                      >
                        批量指派
                      </button>
                    </div>
                    {isCategoryOpen && (
                      <div className="absolute z-10 mt-1 max-h-80 w-3/4 overflow-y-auto rounded-lg border border-gray-300 bg-white text-sm shadow-lg">
                        {deleteCategory.availableCategories.map(category => (
                          <div
                            key={category}
                            className="flex w-full cursor-pointer p-1"
                            onClick={() => setNewCategory(category)}
                          >
                            <div className="flex w-full items-center justify-between rounded-md p-1 hover:bg-gray-50">
                              <span>{category}</span>
                              <span>
                                {category === newCategory && (
                                  <Check size={12} className="text-green-500" />
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 已指派的服務項目 */}
              <div className="rounded-md border border-gray-200 py-4 pl-4">
                <div className="bg-background flex items-center gap-2 pb-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-500">
                    <span className="text-xs text-white">📋</span>
                  </div>
                  <span className="font-semibold">已指派的服務項目：</span>
                </div>

                <div className="max-h-[200px] space-y-2 overflow-y-auto">
                  {reassignServiceList.length > 0 &&
                    reassignServiceList.map(service => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between rounded-md border border-gray-200 p-2"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col text-sm text-gray-500">
                            <div className="font-medium text-gray-900">{service.serviceName}</div>
                            <div>
                              {Number(service.servicePrice).toLocaleString('zh-TW', {
                                minimumFractionDigits: 0,
                                style: 'currency',
                                currency: 'TWD',
                              })}{' '}
                              • {service.serviceDuration}分鐘
                            </div>
                          </div>

                          <MoveRight className="size-4" />

                          <div className="flex-1">
                            <div className="rounded-md border border-gray-200 bg-gray-200 p-1 text-sm">
                              {service.serviceCategory}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-red-600 hover:text-red-800"
                            onClick={() => removeItem(service.id)}
                          >
                            移除
                          </Button>
                        </div>
                      </div>
                    ))}
                  {reassignServiceList.length === 0 && (
                    <div className="py-4 text-center text-sm text-gray-500">
                      尚未選擇要保留的服務項目
                    </div>
                  )}
                </div>
              </div>

              {/* 操作結果摘要 */}
              <div className="rounded-md border border-gray-200 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full">
                    <span>📊</span>
                  </div>
                  <span className="font-semibold">操作結果摘要：</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full">
                      <span>🗑️</span>
                    </span>
                    <span>刪除類別「{deleteItem}」</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full">
                      <span>📒</span>
                    </span>
                    <span>{`保留並重新指派 ${reassignServiceList.length > 0 ? reassignServiceList.length : 0} 個服務項目`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full">
                      <span>❌</span>
                    </span>
                    <span>{`刪除 ${servicesToDelete.length > 0 ? servicesToDelete.length : 0} 個服務項目`}</span>
                  </div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    handleCancel?.();
                    setSelectedServicesId([]);
                    setNewCategory('');
                    setIsServiceItemOpen(false);
                    setIsCategoryOpen(false);
                    setReassignServiceList([]);
                  }}
                >
                  取消
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReassignServiceItemTable}
                  disabled={isUploading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  確認刪除
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BaseAlertDialog;
