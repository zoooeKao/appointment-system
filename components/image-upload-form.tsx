'use client';

import Image from 'next/image';
import { type UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { type PreviewImage } from '@/app/(dashboard)/store-info/page';


interface ImageUploadFormProps {
  IMAGE_LIMIT: number;
  formHook: UseFormReturn;
  previewImages: PreviewImage[];
  isUploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (id: string) => void;
  onSubmit: () => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  IMAGE_LIMIT,
  formHook,
  previewImages,
  isUploading,
  onFileChange,
  onRemoveImage,
  onSubmit,
}) => {
  const { control, handleSubmit } = formHook;

  return (
    <Form {...formHook}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={control}
          name="files"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="flex flex-wrap gap-4">
                  {previewImages.map(image => (
                    <div key={image.id} className="group relative size-40">
                      <Image
                        src={image.url}
                        alt={`預覽圖：${image.file.name}`}
                        className="h-full w-full rounded-lg border object-cover shadow-sm transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveImage(image.id)}
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white transition-opacity hover:bg-red-600"
                        title="移除圖片"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                      <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/50 p-2 text-xs text-white">
                        <div className="truncate">{image.file.name}</div>
                        {Number(image.file.size.toFixed(2)) < 1024
                          ? `${image.file.size.toFixed(2)} B`
                          : `${(image.file.size / 1024).toFixed(2)} KB`}
                      </div>
                    </div>
                  ))}

                  {previewImages.length < IMAGE_LIMIT && (
                    <div className="relative size-40 rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400 hover:bg-gray-50">
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="text-sm font-medium">上傳圖片</span>
                        <div className="text-center text-xs text-gray-400">
                          <div>最大 1 MB</div>
                          <div>剩餘 {IMAGE_LIMIT - previewImages.length} 張</div>
                          <div>JPEG、JPG、PNG</div>
                        </div>
                      </div>

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        multiple
                        onChange={onFileChange}
                        className="absolute inset-0 cursor-pointer opacity-0"
                        disabled={isUploading}
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
              {previewImages.length > 0 && (
                <div className="text-sm text-gray-500">已選擇 {previewImages.length} 張圖片</div>
              )}
            </FormItem>
          )}
        />

        <div className="flex w-full justify-end">
          <Button type="submit" disabled={previewImages.length === 0 || isUploading} className="">
            {isUploading ? '上傳中...' : `上傳 (${previewImages.length} 張)`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ImageUploadForm;