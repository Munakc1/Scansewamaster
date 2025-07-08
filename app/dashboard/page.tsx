'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '../components/ThemeContext';
import { CheckCircle, AlertTriangle, Bell, Utensils, Users, Laptop, Table, ShoppingCart, AlertCircle, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const { darkMode } = useTheme();

  // Sample data
  type Trend = 'up' | 'down';

  const stats = {
    restaurants: {
      total: 42,
      active: 38,
      inactive: 4,
      trend: 'up' as Trend
    },
    customers: {
      total: 1285,
      newToday: 24,
      trend: 'up' as Trend
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

  const StatCard = ({ 
    icon, 
    title, 
    value,
    trend,
    className = ''
  }: { 
    icon: React.ReactNode, 
    title: string, 
    value: string | number,
    trend?: Trend,
    className?: string 
  }) => (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`h-4 w-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? '↑ 5% from last month' : '↓ 2% from last month'}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-background text-foreground' : 'bg-background text-foreground'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">System Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your restaurant network
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-green-800 dark:text-green-200">Live Updates</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          icon={<Utensils className="h-4 w-4" />} 
          title="Total Restaurants" 
          value={stats.restaurants.total} 
          trend={stats.restaurants.trend}
        />
        <StatCard 
          icon={<Users className="h-4 w-4" />} 
          title="Total Customers" 
          value={stats.customers.total.toLocaleString()} 
          trend={stats.customers.trend}
        />
        <StatCard 
          icon={<Bell className="h-4 w-4" />} 
          title="Total Alerts" 
          value={stats.alerts.total}
        />
        <StatCard 
          icon={<Users className="h-4 w-4" />} 
          title="Active Staff" 
          value={`${stats.staff.active}/${stats.staff.total}`}
        />
        <StatCard 
          icon={<Laptop className="h-4 w-4" />} 
          title="Online Terminals" 
          value={`${stats.terminals.online}/${stats.terminals.total}`}
        />
        <StatCard 
          icon={<Table className="h-4 w-4" />} 
          title="Open Tables" 
          value={`${stats.tables.available}/${stats.tables.total}`}
        />
        <StatCard 
          icon={<ShoppingCart className="h-4 w-4" />} 
          title="Pending Orders" 
          value={stats.orders.pending}
        />
        <StatCard 
          icon={<AlertCircle className="h-4 w-4" />} 
          title="Out of Stock" 
          value={stats.inventory.outOfStock}
        />
        <StatCard 
          icon={<Calendar className="h-4 w-4" />} 
          title="Active Reservations" 
          value={stats.reservations.active}
        />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Restaurants Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-orange-500" />
              <span>Restaurants</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">{stats.restaurants.total}</div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active</span>
                <span className="font-medium">{stats.restaurants.active}</span>
              </div>
              <Progress 
                value={(stats.restaurants.active / stats.restaurants.total) * 100} 
                className="h-2 bg-orange-100 dark:bg-orange-900/30"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Inactive</span>
                <span className="font-medium">{stats.restaurants.inactive}</span>
              </div>
              <Progress 
                value={(stats.restaurants.inactive / stats.restaurants.total) * 100} 
                className="h-2 bg-gray-100 dark:bg-gray-800"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <span>Customers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">{stats.customers.total.toLocaleString()}</div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Today</p>
                  <p className="font-medium">+{stats.customers.newToday}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Daily</p>
                  <p className="font-medium">~45</p>
                </div>
              </div>
              
              <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <span className="font-medium">↑ 12%</span> from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm">All systems operational</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">POS Systems</p>
                <p className="font-medium">38/42 Online</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">Payment Gateways</p>
                <p className="font-medium">40/42 Active</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Last system check: 5 min ago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span>Recent Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
              </div>
              <div>
                <h4 className="font-medium">POS Terminal Offline</h4>
                <p className="text-sm text-muted-foreground">Terminal #42 at Downtown location has been offline for 2 hours</p>
                <p className="text-xs text-red-500 mt-1">Critical • Just now</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <div>
                <h4 className="font-medium">Low Inventory</h4>
                <p className="text-sm text-muted-foreground">Chicken Breast is running low (12 remaining)</p>
                <p className="text-xs text-yellow-500 mt-1">Warning • 15 min ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div>
                <h4 className="font-medium">Issue Resolved</h4>
                <p className="text-sm text-muted-foreground">Payment gateway at Westside location is back online</p>
                <p className="text-xs text-green-500 mt-1">Resolved • 1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-sm text-center text-muted-foreground mt-6">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}