// app/dashboard/page.tsx
'use client';

import { Card, CardContent, Typography, Divider } from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useTheme } from '../components/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const restaurantPerformanceData = [
  { name: 'Store 1', sales: 63, orders: 100, complaints: 100 },
  { name: 'Store 2', sales: 57, orders: 100, complaints: 100 },
  { name: 'Store 3', sales: 51, orders: 89, complaints: 98 },
  { name: 'Store 4', sales: 46, orders: 98, complaints: 98 },
  { name: 'Store 5', sales: 53, orders: 100, complaints: 100 },
];

export default function DashboardPage() {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Typography variant="h4" className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Last updated: Today, 12:45 PM
        </Typography>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <Card className={`shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between items-center">
              <Typography variant="h6" className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Sales
              </Typography>
              <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Today
              </Typography>
            </div>
            <Typography variant="h4" className={`font-bold mt-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              $25,384
            </Typography>
            <div className={`flex items-center mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              <ChevronRight className="transform rotate-90" fontSize="small" />
              <Typography variant="body2" className="ml-1">
                12% from yesterday
              </Typography>
            </div>
          </CardContent>
        </Card>

        {/* Low-Stock Items */}
        <Card className={`shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent>
            <Typography variant="h6" className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Low-Stock Items
            </Typography>
            <Typography variant="h4" className={`font-bold mt-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              14
            </Typography>
            <Typography variant="body2" className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Across all locations
            </Typography>
          </CardContent>
        </Card>

        {/* Inventory Health */}
        <Card className={`shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent>
            <Typography variant="h6" className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Inventory Health
            </Typography>
            <div className="flex space-x-4 mt-4">
              <div>
                <Typography variant="h4" className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  5
                </Typography>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  low-stock
                </Typography>
              </div>
              <div>
                <Typography variant="h4" className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  2
                </Typography>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  expired
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card className={`shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent>
            <Typography variant="h6" className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Critical Alerts
            </Typography>
            <Typography variant="h4" className={`font-bold mt-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              284
            </Typography>
            <div className="flex justify-between items-center mt-2">
              <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Total users
              </Typography>
              <button className={`text-sm font-medium ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}>
                View all
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Alerts */}
        <Card className={`shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} lg:col-span-1`}>
          <CardContent>
            <Typography variant="h6" className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Real-Time Alerts
            </Typography>
            <div className="space-y-3">
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Typography variant="body1" className="font-medium">
                  5 voids processed in 1 hour (Store 3)
                </Typography>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Just now
                </Typography>
              </div>
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Typography variant="body1" className="font-medium">
                  Payment gateway error (Store 3)
                </Typography>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  15 min ago
                </Typography>
              </div>
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Typography variant="body1" className="font-medium">
                  POS disconnected (Store 2)
                </Typography>
                <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  30 min ago
                </Typography>
              </div>
            </div>
            <button className={`mt-4 text-sm font-medium ${darkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}>
              View all alerts
            </button>
          </CardContent>
        </Card>

        {/* Restaurant Performance */}
        <Card className={`shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} lg:col-span-2`}>
          <CardContent>
            <Typography variant="h6" className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Restaurant Performance
            </Typography>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={restaurantPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis 
                    dataKey="name" 
                    stroke={darkMode ? '#D1D5DB' : '#4B5563'} 
                  />
                  <YAxis 
                    stroke={darkMode ? '#D1D5DB' : '#4B5563'} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                      borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                      borderRadius: '8px',
                      color: darkMode ? '#F3F4F6' : '#1F2937',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      color: darkMode ? '#F3F4F6' : '#1F2937',
                      paddingTop: '10px'
                    }}
                  />
                  <Bar 
                    dataKey="sales" 
                    name="Sales" 
                    fill={darkMode ? '#F97316' : '#EA580C'} 
                  />
                  <Bar 
                    dataKey="orders" 
                    name="Orders (%)" 
                    fill={darkMode ? '#FDBA74' : '#F59E0B'} 
                  />
                  <Bar 
                    dataKey="complaints" 
                    name="Complaints (%)" 
                    fill={darkMode ? '#FB923C' : '#F97316'} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Analytics */}
        <Card className={`shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent>
            <Typography variant="h6" className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Customer Analytics
            </Typography>
            <div className="flex justify-center items-center h-40">
              <div className="relative w-32 h-32">
                {/* Pie chart would go here - using a simplified version */}
                <div className="absolute inset-0 rounded-full border-8 border-orange-400"></div>
                <div className="absolute inset-0 rounded-full border-8 border-orange-600" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Typography variant="h5" className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    65%
                  </Typography>
                  <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    Repeat
                  </Typography>
                </div>
              </div>
              <div className="ml-8">
                <div className="flex items-center mb-2">
                  <div className="w-4 h-4 rounded-full bg-orange-400 mr-2"></div>
                  <Typography variant="body2">Repeat (65%)</Typography>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-600 mr-2"></div>
                  <Typography variant="body2">New (35%)</Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Performance */}
        <Card className={`shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <CardContent>
            <Typography variant="h6" className={`font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Employee Performance
            </Typography>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Avg. Billing Time
                </Typography>
                <Typography variant="h4" className={`font-bold mt-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  2.4 min
                </Typography>
              </div>
              <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Typography variant="h5" className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  +12%
                </Typography>
              </div>
            </div>
            <Divider className={`my-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <Typography variant="body2" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Improved from last month's average of 2.7 min
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}