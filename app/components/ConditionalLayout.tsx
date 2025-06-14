'use client';

import { usePathname } from 'next/navigation';
import MasterDashNavbar from './MasterDashNavbar';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define routes where the navbar should NOT be shown
  const excludedRoutes = ['/login', '/register', '/auth'];

  const showNavbar = !excludedRoutes.includes(pathname);

  return (
    <>
      {showNavbar && <MasterDashNavbar />}
      {children}
    </>
  );
}
