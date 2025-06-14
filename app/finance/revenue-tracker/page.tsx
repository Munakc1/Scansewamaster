'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaFilter, FaFileInvoiceDollar, FaSearch, FaRegCalendarAlt, FaUserMd, FaUserNurse, FaUserInjured, FaClinicMedical } from 'react-icons/fa';
import { MdDownload, MdFilterList, MdOutlineAttachMoney, MdMedicalServices, MdLocalPharmacy } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, PieChart, Pie, Cell } from 'recharts';

interface RevenueData {
  date: string;
  totalRevenue: number;
  nurseRevenue: number;
  patientRevenue: number;
  pharmacyRevenue: number;
  doctorRevenue: number;
}

interface RevenueByCategory {
  name: string;
  value: number;
  color: string;
}

interface RevenueSummary {
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  revenueByCategory: RevenueByCategory[];
  revenueTrend: RevenueData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const RevenueTracker = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [revenueData, setRevenueData] = useState<RevenueSummary | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data - in a real app, you would fetch this from your API
        const mockRevenueData: RevenueSummary = {
          totalRevenue: 458900,
          totalTransactions: 1243,
          averageTransaction: 369.2,
          revenueByCategory: [
            { name: 'Doctors', value: 185600, color: COLORS[0] },
            { name: 'Patients', value: 124300, color: COLORS[1] },
            { name: 'Nurses', value: 87600, color: COLORS[2] },
            { name: 'Pharmacy', value: 61400, color: COLORS[3] },
          ],
          revenueTrend: [
            { date: 'Jan 1', totalRevenue: 12000, nurseRevenue: 2500, patientRevenue: 3500, pharmacyRevenue: 2000, doctorRevenue: 4000 },
            { date: 'Jan 2', totalRevenue: 19000, nurseRevenue: 4000, patientRevenue: 5000, pharmacyRevenue: 3000, doctorRevenue: 7000 },
            { date: 'Jan 3', totalRevenue: 15000, nurseRevenue: 3000, patientRevenue: 4000, pharmacyRevenue: 2500, doctorRevenue: 5500 },
            { date: 'Jan 4', totalRevenue: 22000, nurseRevenue: 4500, patientRevenue: 6000, pharmacyRevenue: 3500, doctorRevenue: 8000 },
            { date: 'Jan 5', totalRevenue: 18000, nurseRevenue: 3500, patientRevenue: 4500, pharmacyRevenue: 3000, doctorRevenue: 7000 },
            { date: 'Jan 6', totalRevenue: 25000, nurseRevenue: 5000, patientRevenue: 7000, pharmacyRevenue: 4000, doctorRevenue: 9000 },
            { date: 'Jan 7', totalRevenue: 21000, nurseRevenue: 4500, patientRevenue: 5500, pharmacyRevenue: 3500, doctorRevenue: 7500 },
          ],
        };

        setRevenueData(mockRevenueData);
      } catch (err) {
        console.error('Failed to load revenue data', err);
        setError('Unable to load revenue data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const handleExport = (type: 'csv' | 'json') => {
    if (!revenueData) return;

    const dataToExport = {
      'Total Revenue': `₹${revenueData.totalRevenue.toFixed(2)}`,
      'Total Transactions': revenueData.totalTransactions,
      'Average Transaction': `₹${revenueData.averageTransaction.toFixed(2)}`,
      'Revenue By Category': revenueData.revenueByCategory.map(c => `${c.name}: ₹${c.value.toFixed(2)}`).join(', '),
      'Date Range': dateRange[0] && dateRange[1] 
        ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}`
        : 'All Dates',
    };

    if (type === 'csv') {
      const csv = [
        Object.keys(dataToExport).join(','),
        Object.values(dataToExport).map(val => `"${val}"`).join(','),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue_summary_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (type === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue_summary_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center p-4 max-w-md">
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-center p-4 max-w-md">
          <p className="text-lg font-medium">No revenue data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Revenue Tracker</h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">Track and analyze revenue across all services</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable={true}
                placeholderText="Select date range"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaRegCalendarAlt className="text-gray-400" />
              </div>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <Button
              onClick={() => handleExport('csv')}
              variant="outline"
              className="border-gray-300"
            >
              <MdDownload className="mr-1" /> Export CSV
            </Button>
            <Button
              onClick={() => handleExport('json')}
              variant="outline"
              className="border-gray-300"
            >
              <MdDownload className="mr-1" /> Export JSON
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1">
                  ₹{revenueData.totalRevenue.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600">
                <MdOutlineAttachMoney className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1">
                  {revenueData.totalTransactions.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600">
                <FaFileInvoiceDollar className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Transaction</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1">
                  ₹{revenueData.averageTransaction.toFixed(2)}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-purple-100 text-purple-600">
                <FaFilter className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Time Period</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1 capitalize">
                  {timeRange}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FaRegCalendarAlt className="text-lg sm:text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Revenue by Category - Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Revenue by Category</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData.revenueByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueData.revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue by Service - Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Revenue by Service</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData.revenueByCategory}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Revenue Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData.revenueTrend}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke="#3B82F6" strokeWidth={2} name="Total Revenue" />
                <Line type="monotone" dataKey="doctorRevenue" stroke="#10B981" strokeWidth={2} name="Doctor Revenue" />
                <Line type="monotone" dataKey="patientRevenue" stroke="#F59E0B" strokeWidth={2} name="Patient Revenue" />
                <Line type="monotone" dataKey="nurseRevenue" stroke="#EF4444" strokeWidth={2} name="Nurse Revenue" />
                <Line type="monotone" dataKey="pharmacyRevenue" stroke="#8B5CF6" strokeWidth={2} name="Pharmacy Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Doctors */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Doctors</h3>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <FaUserMd className="text-base sm:text-lg" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Revenue:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  ₹{revenueData.revenueByCategory.find(c => c.name === 'Doctors')?.value.toLocaleString('en-IN') || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Share:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {((revenueData.revenueByCategory.find(c => c.name === 'Doctors')?.value || 0) / revenueData.totalRevenue * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Avg. Transaction:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  ₹{(((revenueData.revenueByCategory.find(c => c.name === 'Doctors')?.value || 0) / 420) || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Patients */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Patients</h3>
              <div className="p-2 rounded-full bg-green-100 text-green-600">
                <FaUserInjured className="text-base sm:text-lg" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Revenue:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  ₹{revenueData.revenueByCategory.find(c => c.name === 'Patients')?.value.toLocaleString('en-IN') || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Share:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {((revenueData.revenueByCategory.find(c => c.name === 'Patients')?.value || 0) / revenueData.totalRevenue * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Avg. Transaction:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  ₹{(((revenueData.revenueByCategory.find(c => c.name === 'Patients')?.value || 0) / 380) || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Nurses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Nurses</h3>
              <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                <FaUserNurse className="text-base sm:text-lg" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Revenue:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  ₹{revenueData.revenueByCategory.find(c => c.name === 'Nurses')?.value.toLocaleString('en-IN') || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Share:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {((revenueData.revenueByCategory.find(c => c.name === 'Nurses')?.value || 0) / revenueData.totalRevenue * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Avg. Transaction:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  ₹{(((revenueData.revenueByCategory.find(c => c.name === 'Nurses')?.value || 0) / 250) || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Pharmacy */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Pharmacy</h3>
              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                <MdLocalPharmacy className="text-base sm:text-lg" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Revenue:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  ₹{revenueData.revenueByCategory.find(c => c.name === 'Pharmacy')?.value.toLocaleString('en-IN') || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Share:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {((revenueData.revenueByCategory.find(c => c.name === 'Pharmacy')?.value || 0) / revenueData.totalRevenue * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-500">Avg. Transaction:</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  ₹{(((revenueData.revenueByCategory.find(c => c.name === 'Pharmacy')?.value || 0) / 190) || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">Today, 10:30 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="flex items-center">
                      <FaUserMd className="text-blue-500 mr-2" />
                      Doctor Consultation
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-blue-600">TXN-DOC-789</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">₹1,500.00</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">Today, 9:15 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="flex items-center">
                      <FaUserNurse className="text-yellow-500 mr-2" />
                      Nurse Service
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-blue-600">TXN-NUR-456</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">₹2,500.00</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">Yesterday, 2:45 PM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="flex items-center">
                      <MdLocalPharmacy className="text-purple-500 mr-2" />
                      Pharmacy Order
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-blue-600">TXN-PHR-123</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">₹1,800.00</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">Yesterday, 11:20 AM</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="flex items-center">
                      <FaUserInjured className="text-green-500 mr-2" />
                      Patient Payment
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-blue-600">TXN-PAT-987</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">₹3,200.00</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTracker;