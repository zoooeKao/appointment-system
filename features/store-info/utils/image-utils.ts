import type { PreviewImage } from '@/features/store-info/types';

// 建立預覽圖片的函式
export const createPreviewUrl = (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

// 驗證圖片檔案
export const validateImageFiles = (
  selectedFiles: FileList | null,
  currentImageCount: number,
  imageLimit: number,
  maxFileSize: number,
) => {
  if (!selectedFiles) return { validFiles: [], errors: [] };

  const selectedArray = Array.from(selectedFiles);
  const errors: string[] = [];

  // 檢查數量限制
  if (currentImageCount + selectedArray.length > imageLimit) {
    errors.push(`最多只能上傳 ${imageLimit} 張圖片`);
    return { validFiles: [], errors };
  }

  // 檢查檔案大小
  const oversizedFiles = selectedArray.filter(file => file.size > maxFileSize);
  const validFiles = selectedArray.filter(file => file.size <= maxFileSize);

  if (oversizedFiles.length > 0) {
    errors.push(`以下檔案超過 1MB：${oversizedFiles.map(f => f.name).join(', ')}`);
  }

  return { validFiles, errors };
};

// 建立預覽圖片陣列
export const createPreviewImages = async (validFiles: File[]): Promise<PreviewImage[]> => {
  return Promise.all(
    validFiles.map(async file => ({
      file,
      url: await createPreviewUrl(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`,
    })),
  );
};

// 建立上傳用的 FormData
export const createImageFormData = (files: File[]): FormData => {
  const formData = new FormData();
  files.forEach((file: File, index: number) => {
    formData.append(`file${index}`, file);
  });
  return formData;
};

// 清理預覽 URL
export const cleanupPreviewUrls = (previewImages: PreviewImage[]) => {
  previewImages.forEach(img => URL.revokeObjectURL(img.url));
}; 