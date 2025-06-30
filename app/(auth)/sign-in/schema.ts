import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, '使用者名稱至少3個字'),
  password: z.string().min(8, '密碼至少需要8個字元'),
  rememberMe: z.boolean().default(false),
});

export type FormData = z.infer<typeof loginSchema>;
