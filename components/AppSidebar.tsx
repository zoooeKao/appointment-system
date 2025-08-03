'use client';

import clsx from 'clsx';
import { ChartLine, Clock3, Home, Inbox, PersonStanding, Search, Settings, Smartphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';


// Menu items.
const items = [
  {
    title: '儀表板',
    url: '/',
    icon: Home,
  },
  {
    title: '店家資料',
    url: '/store-info',
    icon: Inbox,
  },
  {
    title: '營業時間',
    url: '/opening-hours',
    icon: Clock3,
  },
  {
    title: '服務項目',
    url: '/service-management',
    icon: Search,
  },
  // {
  //   title: 'LINE設定',
  //   url: '#',
  //   icon: Smartphone,
  // },
  // {
  //   title: '員工管理',
  //   url: '#',
  //   icon: PersonStanding,
  // },
  // {
  //   title: '數據分析',
  //   url: '#',
  //   icon: ChartLine,
  // },
  // {
  //   title: '系統設定',
  //   url: '#',
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-3 flex w-full items-center justify-center gap-1">
            <Image src="/bookbridge.png" width="40" height="40" alt="logo" />
            <span className="pl-2 text-2xl">智慧預約</span>
          </SidebarGroupLabel>
          <Separator />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={clsx(
                        'flex items-center gap-2',
                        pathname === item.url && 'bg-gray-200',
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}