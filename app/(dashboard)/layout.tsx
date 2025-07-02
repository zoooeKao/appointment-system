'use client';

import React from 'react';
import BaseNavbar from '@/components/base-navbar';
import { AppSidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className="flex min-h-screen flex-1 flex-col">
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full">
            <BaseNavbar />
            <div className="mt-12 p-6">{children}</div>
          </main>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default HomeLayout;