// app/api/upload/route.ts
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { type NextRequest } from 'next/server';
import { NextResponse as Response } from 'next/server';
import path from 'path';

// 移除 uuid 依賴

// 設定常數
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_FILES = 4;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

// 檔案類型檢查
function isValidFileType(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type);
}

// 檔案副檔名檢查
function isValidFileExtension(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

// 產生隨機字串
function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 產生安全的檔名
function generateSafeFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const safeBaseName = nameWithoutExt
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_') // 保留中文字符
    .substring(0, 50); // 限制長度

  const randomString = generateRandomString(8);
  const timestamp = Date.now();

  return `${safeBaseName}_${timestamp}_${randomString}${ext}`;
}

// 檢查檔案是否已存在
async function getUniqueFilename(dir: string, filename: string): Promise<string> {
  let finalFilename = filename;
  let counter = 1;

  while (existsSync(path.join(dir, finalFilename))) {
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    finalFilename = `${nameWithoutExt}_${counter}${ext}`;
    counter++;
  }

  return finalFilename;
}

// 驗證請求
function validateRequest(files: File[]) {
  if (files.length === 0) {
    return { valid: false, error: '沒有收到任何檔案', status: 400 };
  }

  if (files.length > MAX_FILES) {
    return {
      valid: false,
      error: `檔案數量超過限制，最多允許 ${MAX_FILES} 個檔案`,
      status: 400,
    };
  }

  // 檢查每個檔案
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `檔案 "${file.name}" 大小超過限制 (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
        status: 400,
      };
    }

    if (!isValidFileType(file) || !isValidFileExtension(file.name)) {
      return {
        valid: false,
        error: `檔案 "${file.name}" 格式不支援，只允許 JPG、JPEG、PNG 格式`,
        status: 400,
      };
    }
  }

  return { valid: true };
}

export async function POST(req: NextRequest) {
  try {
    // 解析表單資料
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (error) {
      console.error('解析表單資料失敗:', error);
      return Response.json({ error: '無效的表單資料格式' }, { status: 400 });
    }

    console.log('收到上傳請求，檔案數量:', formData.keys());

    // 提取所有檔案
    const files: File[] = [];
    for (let i = 0; i < MAX_FILES; i++) {
      const file = formData.get(`file${i}`);
      if (file instanceof File) {
        files.push(file);
      } else if (file !== null) {
        // 如果存在但不是 File 類型
        return Response.json({ error: `file${i} 不是有效的檔案` }, { status: 400 });
      }
    }

    // 驗證請求
    const validation = validateRequest(files);
    if (!validation.valid) {
      return Response.json({ error: validation.error }, { status: validation.status });
    }

    // 確保上傳目錄存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
        console.log('建立上傳目錄:', uploadDir);
      }
    } catch (error) {
      console.error('建立上傳目錄失敗:', error);
      return Response.json({ error: '伺服器檔案系統錯誤' }, { status: 500 });
    }

    // 處理每個檔案
    const results = await Promise.allSettled(
      files.map(async file => {
        try {
          // 產生安全的檔名
          const safeFilename = generateSafeFilename(file.name);
          const uniqueFilename = await getUniqueFilename(uploadDir, safeFilename);
          const filePath = path.join(uploadDir, uniqueFilename);

          // 讀取檔案內容
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // 寫入檔案
          await writeFile(filePath, buffer);

          console.log(`檔案上傳成功: ${file.name} -> ${uniqueFilename}`);

          return {
            originalName: file.name,
            savedName: uniqueFilename,
            path: `/uploads/${uniqueFilename}`,
            size: file.size,
            type: file.type,
          };
        } catch (error) {
          console.error(`處理檔案 ${file.name} 時發生錯誤:`, error);
          throw new Error(`處理檔案 "${file.name}" 時發生錯誤`);
        }
      }),
    );

    // 檢查處理結果
    const successful: {
      originalName: string;
      savedName: string;
      path: string;
      size: number;
      type: string;
    }[] = [];
    const failed: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        failed.push(`檔案 ${files[index].name}: ${result.reason.message}`);
      }
    });

    // 如果有檔案處理失敗
    if (failed.length > 0) {
      console.error('部分檔案處理失敗:', failed);

      // 如果全部失敗
      if (successful.length === 0) {
        return Response.json(
          {
            error: '所有檔案處理失敗',
            details: failed,
          },
          { status: 500 },
        );
      }

      // 部分成功的情況
      return Response.json({
        success: true,
        message: '部分檔案上傳成功',
        files: successful,
        warnings: failed,
        totalFiles: files.length,
        successfulFiles: successful.length,
        failedFiles: failed.length,
      });
    }

    // 全部成功
    return Response.json({
      success: true,
      message: `成功上傳 ${successful.length} 個檔案`,
      files: successful,
      totalFiles: files.length,
      successfulFiles: successful.length,
      failedFiles: 0,
    });
  } catch (error) {
    console.error('上傳 API 發生未預期錯誤:', error);
    return Response.json(
      {
        error: '伺服器內部錯誤',
        message: error instanceof Error ? error.message : '未知錯誤',
      },
      { status: 500 },
    );
  }
}

// 新增 GET 方法用於健康檢查
export async function GET() {
  return Response.json({
    message: '檔案上傳 API 正常運作',
    maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
    maxFiles: MAX_FILES,
    allowedTypes: ALLOWED_TYPES,
  });
}
