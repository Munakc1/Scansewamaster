'use client';

import { ReactNode, useState } from 'react';
import {
  Dashboard, People, LocalHospital, Healing, Inventory2, ShoppingCart, LocalPharmacy,
  SupportAgent, BarChart, LocalShipping,
  Menu, Mail, Notifications, LightMode, DarkMode, Search, ChevronRight,
} from '@mui/icons-material';

import {
  List, ListItemButton, ListItemIcon, ListItemText,
  Popover, IconButton, Tooltip, Typography,
} from '@mui/material';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const [mailAnchor, setMailAnchor] = useState<null | HTMLElement>(null);
  const [financeOpen, setFinanceOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const handleNotifOpen = (event: React.MouseEvent<HTMLElement>) => setNotifAnchor(event.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);
  const handleMailOpen = (event: React.MouseEvent<HTMLElement>) => setMailAnchor(event.currentTarget);
  const handleMailClose = () => setMailAnchor(null);

  const navItems = [
    { label: 'Analysis', icon: <Dashboard fontSize="medium" />, path: '/analysis' },
    { label: 'Patient', icon: <People fontSize="medium" />, path: '/patient' },
    { label: 'Doctor', icon: <LocalHospital fontSize="medium" />, path: '/doctor' },
    { label: 'Nurse', icon: <Healing fontSize="medium" />, path: '/nurse' },
    { label: 'Stock', icon: <Inventory2 fontSize="medium" />, path: '/medicine-stock' },
    { label: 'Orders', icon: <ShoppingCart fontSize="medium" />, path: '/orders' },
    { label: 'Pharmacy', icon: <LocalPharmacy fontSize="medium" />, path: '/pharmacy' },
    { label: 'Finance', icon: <BarChart fontSize="medium" /> },
    { label: 'Ambulance Service', icon: <LocalShipping fontSize="medium" />, path: '/ambulance' },
  ];

  const financeSubItems = [
    { label: 'Pharmacy Transaction', path: '/finance/pharmacy-transaction' },
    { label: 'Patient Transaction', path: '/finance/patient-transaction' },
    { label: 'Doctor Transaction', path: '/finance/doctor-transaction' },
    { label: 'Nurse Transaction', path: '/finance/nurse-transaction' },
    { label: 'Revenue Tracker', path: '/finance/revenue-tracker' },
  ];

  const NAVBAR_HEIGHT = 72;

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      {!isHomePage && (
        <>
          {/* Navbar */}
          <nav
            className={`px-4 py-2 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-md border-b ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-[#0077B6] border-gray-200'}`}
            style={{ height: NAVBAR_HEIGHT }}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded hover:bg-[#CAF0F8] transition flex items-center justify-center"
                style={{ width: 48, height: 48 }}
              >
                <Menu fontSize="large" className={darkMode ? 'text-white' : 'text-black'} />
              </button>
              <div
                className="hidden sm:block select-none"
                style={{
                  color: darkMode ? 'white' : 'black',
                  fontWeight: 'bold',
                  fontSize: '1.75rem',
                  userSelect: 'none',
                }}
              >
                Dashboard
              </div>
            </div>
            <div className="flex-grow max-w-lg mx-4">
              <div className="relative">
                <Search className={`absolute top-1/2 left-3 transform -translate-y-1/2 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                <input
                  type="search"
                  placeholder="Search patient and doctor…"
                  className={`w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#62c0ec] shadow-inner
                    ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' : 'bg-white text-black placeholder-gray-500'}`}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Tooltip title="Messages">
                <IconButton onClick={handleMailOpen}>
                  <Mail className={darkMode ? 'text-white' : 'text-black'} />
                </IconButton>
              </Tooltip>
              <Popover
                open={Boolean(mailAnchor)}
                anchorEl={mailAnchor}
                onClose={handleMailClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <div className={`p-4 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <Typography variant="subtitle1">Messages</Typography>
                  <Typography variant="body2" className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                    No new messages.
                  </Typography>
                </div>
              </Popover>
              <Tooltip title="Notifications">
                <IconButton onClick={handleNotifOpen}>
                  <Notifications className={darkMode ? 'text-white' : 'text-black'} />
                </IconButton>
              </Tooltip>
              <Popover
                open={Boolean(notifAnchor)}
                anchorEl={notifAnchor}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <div className={`p-4 w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <Typography variant="subtitle1">Notifications</Typography>
                  <Typography variant="body2" className={darkMode ? 'text-gray-300' : 'text-gray-500'}>
                    No new notifications.
                  </Typography>
                </div>
              </Popover>
              <Tooltip title="Toggle Dark Mode">
                <IconButton onClick={toggleDarkMode}>
                  {darkMode ? <DarkMode className="text-white" /> : <LightMode className="text-black" />}
                </IconButton>
              </Tooltip>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex flex-1" style={{ paddingTop: NAVBAR_HEIGHT }}>
            {/* Sidebar */}
            <aside
              className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} fixed top-[72px] left-0 bottom-0 z-40 flex flex-col justify-between ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-200'} border-r`}
            >
              <List dense className="flex-grow overflow-auto">
                {navItems.map((item) => {
                  if (item.label === 'Finance') {
                    return (
                      <div key={item.label}>
                        <ListItemButton
                          onClick={() => setFinanceOpen(prev => !prev)}
                          className={`py-1 px-2 cursor-pointer ${!sidebarOpen ? 'justify-center' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          selected={pathname.startsWith('/finance')}
                          style={{
                            margin: sidebarOpen ? '0 8px' : '0 auto',
                            borderRadius: 8,
                          }}
                        >
                          <ListItemIcon
                            className="min-w-0 justify-center"
                            style={{
                              minWidth: sidebarOpen ? 40 : 'auto',
                              color: darkMode ? '#ffffff' : '#000000',
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          {sidebarOpen && (
                            <>
                              <ListItemText
                                primary={
                                  <Typography className={`text-base font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                                    {item.label}
                                  </Typography>
                                }
                              />
                              <ChevronRight
                                className={`ml-auto mr-2 transition-transform ${financeOpen ? 'rotate-90' : ''}`}
                              />
                            </>
                          )}
                        </ListItemButton>

                        {financeOpen && sidebarOpen && (
                          <List component="div" disablePadding className="pl-0">
                            {financeSubItems.map((subItem) => (
                              <Link key={subItem.label} href={subItem.path} passHref>
                                <ListItemButton
                                  selected={pathname === subItem.path}
                                  className={`py-1 px-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                  style={{
                                    marginLeft: 24,
                                    borderRadius: 6,
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Typography className={`text-sm ${darkMode ? 'text-white' : 'text-black'}`}>
                                        {subItem.label}
                                      </Typography>
                                    }
                                  />
                                </ListItemButton>
                              </Link>
                            ))}
                          </List>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <Link key={item.label} href={item.path ?? '#'} passHref>
                        <ListItemButton
                          selected={pathname === item.path}
                          className={`py-1 px-2 ${!sidebarOpen ? 'justify-center' : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          style={{
                            margin: sidebarOpen ? '0 8px' : '0 auto',
                            borderRadius: 8,
                          }}
                        >
                          <ListItemIcon
                            className="min-w-0 justify-center"
                            style={{
                              minWidth: sidebarOpen ? 40 : 'auto',
                              color: darkMode ? '#ffffff' : '#000000',
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          {sidebarOpen && (
                            <ListItemText
                              primary={
                                <Typography className={`text-base font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                                  {item.label}
                                </Typography>
                              }
                            />
                          )}
                        </ListItemButton>
                      </Link>
                    );
                  }
                })}
              </List>
            </aside>

            {/* Main Content */}
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
        </>
      )}

      {isHomePage && (
        <main className="flex-grow">
          {children}
        </main>
      )}
    </div>
  );
}