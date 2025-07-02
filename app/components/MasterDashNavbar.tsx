'use client';

import { ReactNode, useState } from 'react';
import {
  Dashboard, Restaurant, People, Inventory, Notifications, 
  Assessment, Receipt, Support, Settings, Menu, 
  ChevronRight, ArrowUpward, Warning, Search, 
  Mail, LightMode, DarkMode
} from '@mui/icons-material';
import { 
  List, ListItemButton, ListItemIcon, ListItemText, 
  Popover, IconButton, Tooltip, Typography, Badge
} from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './ThemeContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [mailAnchor, setMailAnchor] = useState<null | HTMLElement>(null);

  const NAVBAR_HEIGHT = 64;

  const navItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { label: 'Restaurants', icon: <Restaurant />, path: '/restaurants' },
    { label: 'Users', icon: <People />, path: '/users' },
    { label: 'Inventory', icon: <Inventory />, path: '/inventory' },
    { label: 'KPIs', icon: <Assessment />, path: '/kpis' },
    { label: 'Alerts & Logs', icon: <Warning />, path: '/alerts' },
    { label: 'Billing', icon: <Receipt />, path: '/billing' },
    { label: 'Support', icon: <Support />, path: '/support' },
    { label: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);
  const handleMailOpen = (event: React.MouseEvent<HTMLElement>) => setMailAnchor(event.currentTarget);
  const handleMailClose = () => setMailAnchor(null);

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-orange-50' : 'bg-white text-gray-900'}`}>
      {/* Navbar */}
      <nav
        className={`px-4 py-2 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-sm ${darkMode ? 'bg-gray-900 border-orange-800' : 'bg-white border-orange-200'} border-b`}
        style={{ height: NAVBAR_HEIGHT }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded transition ${darkMode ? 'hover:bg-orange-900 text-orange-400' : 'hover:bg-orange-100 text-orange-600'}`}
          >
            <Menu />
          </button>
          <Typography variant="h6" className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            SCANSEWA ADMIN
          </Typography>
        </div>

        <div className="flex-grow max-w-md mx-4">
          <div className="relative">
            <Search className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${darkMode ? 'text-orange-300' : 'text-orange-500'}`} />
            <input
              type="search"
              placeholder="Search..."
              className={`w-full py-2 pl-10 pr-4 rounded-md border ${darkMode ? 'bg-gray-800 border-orange-700 text-orange-50 placeholder-orange-300 focus:ring-orange-500' : 'bg-white border-orange-300 text-gray-900 placeholder-orange-400 focus:ring-orange-400'} focus:outline-none focus:ring-2`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Tooltip title="Messages">
            <IconButton onClick={handleMailOpen} className={darkMode ? 'text-orange-400' : 'text-orange-600'}>
              <Badge badgeContent={0} color="error">
                <Mail />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton onClick={handleNotifOpen} className={darkMode ? 'text-orange-400' : 'text-orange-600'}>
              <Badge badgeContent={5} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Theme">
            <IconButton onClick={toggleDarkMode}>
              {darkMode ? <LightMode className="text-orange-400" /> : <DarkMode className="text-orange-600" />}
            </IconButton>
          </Tooltip>
        </div>

        {/* Notifications Popover */}
        <Popover
          open={Boolean(notifAnchor)}
          anchorEl={notifAnchor}
          onClose={handleNotifClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <div className={`p-4 w-80 ${darkMode ? 'bg-gray-900 border border-orange-800' : 'bg-white border border-orange-200'}`}>
            <Typography variant="h6" className={`font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>Notifications</Typography>
            <div className="space-y-2">
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-800 text-orange-100' : 'bg-orange-50 text-gray-800'}`}>
                <Typography variant="subtitle2">5 voids processed in 1 hour (Store 3)</Typography>
                <Typography variant="body2" className={darkMode ? 'text-orange-300' : 'text-orange-500'}>Just now</Typography>
              </div>
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-800 text-orange-100' : 'bg-orange-50 text-gray-800'}`}>
                <Typography variant="subtitle2">Payment gateway error (Store 3)</Typography>
                <Typography variant="body2" className={darkMode ? 'text-orange-300' : 'text-orange-500'}>15 min ago</Typography>
              </div>
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-800 text-orange-100' : 'bg-orange-50 text-gray-800'}`}>
                <Typography variant="subtitle2">POS disconnected (Store 2)</Typography>
                <Typography variant="body2" className={darkMode ? 'text-orange-300' : 'text-orange-500'}>30 min ago</Typography>
              </div>
            </div>
            <button className={`mt-2 text-sm font-medium ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}>
              View all alerts
            </button>
          </div>
        </Popover>

        {/* Messages Popover */}
        <Popover
          open={Boolean(mailAnchor)}
          anchorEl={mailAnchor}
          onClose={handleMailClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <div className={`p-4 w-80 ${darkMode ? 'bg-gray-900 border border-orange-800' : 'bg-white border border-orange-200'}`}>
            <Typography variant="h6" className={`font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>Messages</Typography>
            <Typography variant="body2" className={darkMode ? 'text-orange-300' : 'text-orange-500'}>
              No new messages
            </Typography>
          </div>
        </Popover>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1" style={{ paddingTop: NAVBAR_HEIGHT }}>
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} fixed top-[64px] left-0 bottom-0 z-40 ${darkMode ? 'bg-gray-900 border-r border-orange-800' : 'bg-white border-r border-orange-200'}`}
        >
          <List className="overflow-y-auto h-full">
            {navItems.map((item) => (
              <Link key={item.label} href={item.path} passHref>
                <ListItemButton
                  selected={pathname === item.path}
                  className={`${darkMode ? 'hover:bg-orange-900' : 'hover:bg-orange-50'} ${!sidebarOpen ? 'justify-center' : ''} ${pathname === item.path ? (darkMode ? 'bg-orange-900' : 'bg-orange-100') : ''}`}
                >
                  <ListItemIcon className={darkMode ? 'text-orange-400' : 'text-orange-600'}>
                    {item.icon}
                  </ListItemIcon>
                  {sidebarOpen && (
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{
                        className: `${darkMode ? 'text-orange-100' : 'text-gray-800'} ${pathname === item.path ? 'font-bold' : ''}`
                      }} 
                    />
                  )}
                </ListItemButton>
              </Link>
            ))}
          </List>
        </aside>

        {/* Content Area */}
        <main
          className={`flex-grow transition-all duration-300 ease-in-out overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
          style={{ 
            marginLeft: sidebarOpen ? '256px' : '64px',
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
            padding: '1.5rem'
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}