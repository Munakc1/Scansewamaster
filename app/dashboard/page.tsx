'use client';

import { Card, CardContent, Typography, Chip, Divider } from '@mui/material';
import { useTheme } from '../components/ThemeContext';
import { CheckCircle, Warning, Error, Restaurant, People, Notifications, 
  Engineering, Computer, Chair, Receipt, WarningAmber, CalendarToday } from '@mui/icons-material';

export default function DashboardPage() {
  const { darkMode } = useTheme();

  // Sample data
  type Trend = 'up' | 'down';

  const stats: {
    restaurants: {
      total: number;
      active: number;
      inactive: number;
      trend: Trend;
    };
    customers: {
      total: number;
      newToday: number;
      trend: Trend;
    };
    alerts: {
      total: number;
      critical: number;
      resolved: number;
    };
    staff: {
      total: number;
      active: number;
    };
    terminals: {
      total: number;
      online: number;
    };
    tables: {
      total: number;
      occupied: number;
      available: number;
    };
    orders: {
      pending: number;
      completed: number;
    };
    inventory: {
      outOfStock: number;
      lowStock: number;
    };
    reservations: {
      active: number;
      upcoming: number;
    };
  } = {
    restaurants: {
      total: 42,
      active: 38,
      inactive: 4,
      trend: 'up'
    },
    customers: {
      total: 1285,
      newToday: 24,
      trend: 'up'
    },
    alerts: {
      total: 15,
      critical: 3,
      resolved: 8
    },
    staff: {
      total: 126,
      active: 118
    },
    terminals: {
      total: 42,
      online: 38
    },
    tables: {
      total: 85,
      occupied: 42,
      available: 43
    },
    orders: {
      pending: 18,
      completed: 124
    },
    inventory: {
      outOfStock: 7,
      lowStock: 15
    },
    reservations: {
      active: 32,
      upcoming: 18
    }
  };

  const getAlertColor = (status: string) => {
    switch(status) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      default: return 'info';
    }
  };

  const StatCard = ({ icon, title, value, trend, className = '' }: { 
    icon: React.ReactNode, 
    title: string, 
    value: string | number,
    trend?: 'up' | 'down',
    className?: string 
  }) => (
    <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'} ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              {icon}
            </div>
            <div>
              <Typography variant="subtitle2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                {title}
              </Typography>
              <Typography variant="h5" className="font-bold">
                {value}
              </Typography>
            </div>
          </div>
          {trend && (
            <div className={`p-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Typography variant="body2" className={`font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? '↑' : '↓'}
              </Typography>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Typography variant="h4" className="font-bold">
            System Dashboard
          </Typography>
          <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
            Overview of your restaurant network
          </Typography>
        </div>
        <div className="mt-2 md:mt-0">
          <Chip 
            label="Live Updates" 
            color="success" 
            size="small" 
            icon={<CheckCircle fontSize="small" />}
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard 
          icon={<Restaurant className={darkMode ? 'text-orange-400' : 'text-orange-600'} />} 
          title="Total Restaurants" 
          value={stats.restaurants.total} 
          trend={stats.restaurants.trend}
        />
        <StatCard 
          icon={<People className={darkMode ? 'text-green-400' : 'text-green-600'} />} 
          title="Total Customers" 
          value={stats.customers.total.toLocaleString()} 
          trend={stats.customers.trend}
        />
        <StatCard 
          icon={<Notifications className={darkMode ? 'text-red-400' : 'text-red-600'} />} 
          title="Total Alerts" 
          value={stats.alerts.total} 
        />
        <StatCard 
          icon={<Engineering className={darkMode ? 'text-blue-400' : 'text-blue-600'} />} 
          title="Active Staff" 
          value={`${stats.staff.active}/${stats.staff.total}`} 
        />
        <StatCard 
          icon={<Computer className={darkMode ? 'text-purple-400' : 'text-purple-600'} />} 
          title="Online Terminals" 
          value={`${stats.terminals.online}/${stats.terminals.total}`} 
        />
        <StatCard 
          icon={<Chair className={darkMode ? 'text-yellow-400' : 'text-yellow-600'} />} 
          title="Open Tables" 
          value={`${stats.tables.available}/${stats.tables.total}`} 
        />
        <StatCard 
          icon={<Receipt className={darkMode ? 'text-indigo-400' : 'text-indigo-600'} />} 
          title="Pending Orders" 
          value={stats.orders.pending} 
        />
        <StatCard 
          icon={<WarningAmber className={darkMode ? 'text-amber-400' : 'text-amber-600'} />} 
          title="Out of Stock" 
          value={stats.inventory.outOfStock} 
        />
        <StatCard 
          icon={<CalendarToday className={darkMode ? 'text-teal-400' : 'text-teal-600'} />} 
          title="Active Reservations" 
          value={stats.reservations.active} 
        />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Restaurants Card */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-semibold">
                Restaurants
              </Typography>
              <div className={`p-2 rounded-full ${darkMode ? 'bg-orange-900' : 'bg-orange-100'}`}>
                <Typography variant="body2" className={`font-bold ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                  {stats.restaurants.trend === 'up' ? '↑ 5%' : '↓ 2%'}
                </Typography>
              </div>
            </div>
            
            <Typography variant="h3" className={`font-bold mb-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {stats.restaurants.total}
            </Typography>
            
            <Divider className={`my-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            
            <div className="flex justify-between">
              <div>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Active
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {stats.restaurants.active}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Inactive
                </Typography>
                <Typography variant="body1" className="font-medium">
                  {stats.restaurants.inactive}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-semibold">
                Customers
              </Typography>
              <div className={`p-2 rounded-full ${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <Typography variant="body2" className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                  {stats.customers.trend === 'up' ? '↑ 12%' : '↓ 5%'}
                </Typography>
              </div>
            </div>
            
            <Typography variant="h3" className={`font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {stats.customers.total.toLocaleString()}
            </Typography>
            
            <Divider className={`my-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            
            <div className="flex justify-between">
              <div>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  New Today
                </Typography>
                <Typography variant="body1" className="font-medium">
                  +{stats.customers.newToday}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Avg. Daily
                </Typography>
                <Typography variant="body1" className="font-medium">
                  ~45
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health Card */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-semibold">
                System Health
              </Typography>
              <Chip 
                label="Stable" 
                color="success" 
                size="small" 
                icon={<CheckCircle fontSize="small" />}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  POS Systems
                </Typography>
                <Typography variant="body1" className="font-medium">
                  38/42 Online
                </Typography>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Payment Gateways
                </Typography>
                <Typography variant="body1" className="font-medium">
                  40/42 Active
                </Typography>
              </div>
            </div>
            
            <Divider className={`my-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            
            <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Last system check: 5 min ago
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'} mb-8`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h6" className="font-semibold">
              Recent Alerts
            </Typography>
            <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              {stats.alerts.critical} critical, {stats.alerts.total - stats.alerts.resolved} unresolved
            </Typography>
          </div>
          
          <div className="space-y-4">
            {/* ... existing alerts code ... */}
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className={`text-sm text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}