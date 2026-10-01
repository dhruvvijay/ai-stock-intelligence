'use client';

import TopNavbar from '@/components/layout/TopNavbar';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen mesh-gradient">
      <TopNavbar />
      <Sidebar />
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-[68px]' : 'lg:pl-64'
        )}
      >
        <div className="min-h-[calc(100vh-4rem)] p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
