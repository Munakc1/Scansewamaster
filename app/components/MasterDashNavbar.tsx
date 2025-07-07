'use client';

import React, { ReactNode, useState } from 'react';
import {
  Dashboard, Restaurant, People, Inventory, Notifications, 
  Assessment, Receipt, Support, Settings, Menu, ShoppingCart,
  Warning, Search, 
  LightMode as LightModeIcon, DarkMode as DarkModeIcon,
  AccountCircle
} from '@mui/icons-material';
import { 
  List, ListItemButton, ListItemIcon, ListItemText, 
  Popover, IconButton, Tooltip, Typography
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null); // New state for account popover

  const NAVBAR_HEIGHT = 64;

  const navItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { label: 'Restaurants', icon: <Restaurant />, path: '/restaurants' },
    { label: 'Users', icon: <People />, path: '/users' },
    { label: 'KPIs', icon: <Assessment />, path: '/kpis' },
    { label: 'Alerts & Logs', icon: <Warning />, path: '/alerts' },
    { label: 'Billing', icon: <Receipt />, path: '/billing' },
    { label: 'Support', icon: <Support />, path: '/support' },
    { label: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);
  const handleAccountOpen = (event: React.MouseEvent<HTMLElement>) => setAccountAnchor(event.currentTarget); // New handler
  const handleAccountClose = () => setAccountAnchor(null); // New handler

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
            className={`p-2 cursor-pointer rounded transition ${darkMode ? 'hover:bg-orange-900' : 'hover:bg-orange-100'}`}
          >
            <Menu className={darkMode ? 'text-orange-400' : 'text-black'} />
          </button>
          <Typography variant="h6" className={`font-bold ${darkMode ? 'text-orange-400' : 'text-black'}`}>
            SCANSEWA ADMIN
          </Typography>
        </div>

        <div className="flex-grow max-w-md mx-4">
          <div className="relative">
            <Search className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${darkMode ? 'text-orange-300' : 'text-black'}`} />
            <input
              type="search"
              placeholder="Search..."
              className={`w-full py-2 pl-10 pr-4 rounded-md border ${darkMode ? 'bg-gray-800 border-orange-700 text-orange-50 placeholder-orange-300 focus:ring-orange-500' : 'bg-white border-orange-300 text-black placeholder-gray-500 focus:ring-orange-400'} focus:outline-none focus:ring-2`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Tooltip title="Notifications">
            <IconButton onClick={handleNotifOpen}>
              <Notifications className={darkMode ? 'text-orange-400' : 'text-black'} />
            </IconButton>
          </Tooltip>

          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton onClick={toggleDarkMode}>
              {darkMode ? (
                <DarkModeIcon className="text-orange-400" />
              ) : (
                <LightModeIcon className="text-black" />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Admin Profile">
            <IconButton onClick={handleAccountOpen}>
              <AccountCircle className={darkMode ? 'text-orange-400' : 'text-black'} />
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
            <Typography variant="h6" className={`font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-black'}`}>Notifications</Typography>
            <div className="space-y-2">
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-800 text-orange-100' : 'bg-orange-50 text-gray-800'}`}>
                <Typography variant="subtitle2">5 voids processed in 1 hour (Store 3)</Typography>
                <Typography variant="body2" className={darkMode ? 'text-orange-300' : 'text-gray-600'}>Just now</Typography>
              </div>
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-800 text-orange-100' : 'bg-orange-50 text-gray-800'}`}>
                <Typography variant="subtitle2">Payment gateway error (Store 3)</Typography>
                <Typography variant="body2" className={darkMode ? 'text-orange-300' : 'text-gray-600'}>15 min ago</Typography>
              </div>
              <div className={`p-2 rounded ${darkMode ? 'bg-gray-800 text-orange-100' : 'bg-orange-50 text-gray-800'}`}>
                <Typography variant="subtitle2">POS disconnected (Store 2)</Typography>
                <Typography variant="body2" className={darkMode ? 'text-orange-300' : 'text-gray-600'}>30 min ago</Typography>
              </div>
            </div>
            <button className={`mt-2 text-sm font-medium ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-black hover:text-gray-700'}`}>
              View all alerts
            </button>
          </div>
        </Popover>

        {/* Account Popover - New addition */}
        <Popover
          open={Boolean(accountAnchor)}
          anchorEl={accountAnchor}
          onClose={handleAccountClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <div className={`p-4 w-64 ${darkMode ? 'bg-gray-900 border border-orange-800' : 'bg-white border border-orange-200'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <AccountCircle className={darkMode ? 'text-orange-400 text-4xl' : 'text-black text-4xl'} />
              <div>
                <Typography variant="subtitle1" className={`font-bold ${darkMode ? 'text-orange-100' : 'text-black'}`}>
                  Admin User
                </Typography>
                <Typography variant="body2" className={darkMode ? 'text-orange-300' : 'text-gray-600'}>
                  admin@scansewa.com
                </Typography>
              </div>
            </div>
            <div className="space-y-2">
              <Link href="/profile" passHref>
                <ListItemButton 
                  className={`${darkMode ? 'hover:bg-orange-900 text-orange-100' : 'hover:bg-orange-50 text-black'}`}
                  onClick={handleAccountClose}
                >
                  <ListItemText primary="Profile Settings" />
                </ListItemButton>
              </Link>
              <Link href="/settings" passHref>
                <ListItemButton 
                  className={`${darkMode ? 'hover:bg-orange-900 text-orange-100' : 'hover:bg-orange-50 text-black'}`}
                  onClick={handleAccountClose}
                >
                  <ListItemText primary="Account Settings" />
                </ListItemButton>
              </Link>
              <div className="border-t border-orange-700 my-2"></div>
              <ListItemButton 
                className={`${darkMode ? 'hover:bg-orange-900 text-orange-100' : 'hover:bg-orange-50 text-black'}`}
                onClick={() => {
                  // Add your logout logic here
                  handleAccountClose();
                }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </div>
          </div>
        </Popover>
      </nav>

      {/* Rest of your existing code remains exactly the same */}
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
                  <ListItemIcon>
                    {React.cloneElement(item.icon, { className: darkMode ? 'text-orange-400' : 'text-black' })}
                  </ListItemIcon>
                  {sidebarOpen && (
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{
                        className: `${darkMode ? 'text-orange-100' : 'text-black'} ${pathname === item.path ? 'font-bold' : ''}`
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