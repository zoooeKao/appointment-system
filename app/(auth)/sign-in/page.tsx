'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { type FormData, type FormFieldType, FormResolver } from '@/components/base-form/formConfig';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const loginFormFields: FormFieldType[] = [
  {
    name: 'username',
    type: 'text',
    value: '',
    placeholder: '',
    validator: z.string().min(3, '使用者名稱至少3個字'),
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    value: '',
    placeholder: '',
    validator: z.string().min(8, '密碼至少需要8個字元'),
    required: true,
  },
];

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormResolver(loginFormFields)),
    defaultValues: Object.fromEntries(loginFormFields.map(field => [field.name, field.value])),
  });

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      // 在這裡處理登入邏輯
      console.log('登入資料:', values);
      // 調用API登入
      // const response = await loginAPI(values);
    } catch (error) {
      console.error('登入失敗:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Portrait為直屏，Landscape為橫屏
    <div className="responsive-card min-h-dvh">
      <section className="w-1/2">
        <AspectRatio ratio={4 / 3}>
          <Image
            fill
            alt="Image"
            className="rounded-md object-cover"
            src="/bookbridge.png"
            priority
          />
        </AspectRatio>
      </section>

      <section className="w-1/2">
        <div className="text pb-6 text-center">
          <h2 className="text-2xl font-bold">Login</h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>使用者名稱</FormLabel>
                  <FormControl>
                    <Input type="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密碼</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-sm font-medium">記住我</FormLabel>
                  </FormItem>
                )}
              />

              <a
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                忘記密碼?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? '登入中...' : '登入'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            還沒有帳號?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              立即註冊
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

// export default function LoginForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(loginSchema),
//   })

//   const onSubmit = (data: FormData) => {
//     console.log('送出的資料：', data)
//   }

//   return (
//     <section className="flex h-screen items-center justify-center">
//       <form onSubmit={handleSubmit(onSubmit)} className="border">
//         <div>
//           <label>帳號：</label>
//           <input {...register('username')} />
//           {errors.username && <p>{errors.username.message}</p>}
//         </div>

//         <div>
//           <label>密碼：</label>
//           <input type="number" {...register('age')} />
//           {errors.age && <p>{errors.age.message}</p>}
//         </div>

//         <button type="submit">送出</button>
//       </form>
//     </section>
//   )
// }

