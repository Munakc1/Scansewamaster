'use client';

import { usePathname } from 'next/navigation';
import MasterDashNavbar from './MasterDashNavbar';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define routes where the navbar should NOT be shown
  const excludedRoutes = [
    '/',               // Home page
    '/login',          // Login page
    '/register',       // Registration page
    '/auth',           // Authentication routes
    '/forgot-password' // Password recovery
  ];

  // Check if current route should hide navbar
  const hideNavbar = excludedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  return hideNavbar ? (
    <>{children}</>
  ) : (
    <MasterDashNavbar>
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {children}
      </div>
    </MasterDashNavbar>
  );
}