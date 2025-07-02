// 服務項目表格 Tanstack Table Schema
const baseTableSchema = {
  serviceName: {
    header: '服務名稱',
    size: 200,
    enableSorting: false,
  },
  serviceCategory: {
    header: '服務類別',
    size: 120,
    enableSorting: false,
  },
  serviceDuration: {
    header: '服務時長(分鐘)',
    size: 140,
    enableSorting: true,
  },
  servicePrice: {
    header: '服務價格(NT$)',
    size: 150,
    enableSorting: true,
  },
  isEnabled: {
    header: '狀態',
    size: 100,
    enableSorting: false,
  },
  action: {
    header: '操作',
    size: 150,
    enableSorting: false,
  },
};

export { baseTableSchema };