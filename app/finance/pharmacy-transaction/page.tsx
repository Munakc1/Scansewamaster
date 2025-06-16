'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaFilter, FaFileInvoiceDollar, FaSearch, FaRegCalendarAlt } from 'react-icons/fa';
import { MdDownload, MdFilterList, MdOutlineAttachMoney } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { useTheme } from '../../components/ThemeContext';

interface PharmacyTransaction {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  transactionId: string;
  date: string;
  amount: number;
  commission: number;
  commissionRate: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  orderId?: string;
  customerId?: string;
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface PharmacySummary {
  pharmacyId: string;
  pharmacyName: string;
  totalTransactions: number;
  totalAmount: number;
  totalCommission: number;
  lastTransactionDate: string;
}

interface DailySummary {
  date: string;
  transactions: number;
  revenue: number;
  commission: number;
}

const transformTransactionData = (data: any[]): PharmacyTransaction[] =>
  data.map((t) => ({
    id: t._id || `trans-${Math.random().toString(36).substr(2, 9)}`,
    pharmacyId: t.pharmacyId,
    pharmacyName: t.pharmacyName || 'Unknown Pharmacy',
    transactionId: t.transactionId || `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    date: t.date || new Date().toISOString(),
    amount: t.amount || 0,
    commission: t.commission || 0,
    commissionRate: t.commissionRate || 0.1, // Default 10% commission
    paymentMethod: t.paymentMethod || 'Online',
    status: t.status?.toLowerCase() || 'completed',
    orderId: t.orderId,
    customerId: t.customerId,
    items: t.items?.map((i: any) => ({
      name: i.name || 'Unknown Item',
      quantity: i.quantity || 1,
      price: i.price || 0,
    })) || [],
  }));

const calculateSummary = (transactions: PharmacyTransaction[]): PharmacySummary[] => {
  const pharmacyMap = new Map<string, PharmacySummary>();

  transactions.forEach((t) => {
    if (!pharmacyMap.has(t.pharmacyId)) {
      pharmacyMap.set(t.pharmacyId, {
        pharmacyId: t.pharmacyId,
        pharmacyName: t.pharmacyName,
        totalTransactions: 0,
        totalAmount: 0,
        totalCommission: 0,
        lastTransactionDate: t.date,
      });
    }

    const summary = pharmacyMap.get(t.pharmacyId)!;
    summary.totalTransactions += 1;
    summary.totalAmount += t.amount;
    summary.totalCommission += t.commission;
    if (new Date(t.date) > new Date(summary.lastTransactionDate)) {
      summary.lastTransactionDate = t.date;
    }
  });

  return Array.from(pharmacyMap.values());
};

const calculateDailySummary = (transactions: PharmacyTransaction[]): DailySummary[] => {
  const dailyMap = new Map<string, DailySummary>();

  transactions.forEach((t) => {
    const date = new Date(t.date).toISOString().split('T')[0];
    const formattedDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date: formattedDate,
        transactions: 0,
        revenue: 0,
        commission: 0,
      });
    }

    const daily = dailyMap.get(date)!;
    daily.transactions += 1;
    daily.revenue += t.amount;
    daily.commission += t.commission;
  });

  return Array.from(dailyMap.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

const PharmacyFinances = () => {
  const { darkMode } = useTheme();
  const [transactions, setTransactions] = useState<PharmacyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pharmacyFilter, setPharmacyFilter] = useState('all');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PharmacyTransaction | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data
        const mockData = [
          {
            _id: '1',
            pharmacyId: 'PHARM-1001',
            pharmacyName: 'City Pharmacy',
            transactionId: 'TXN-20230601-001',
            date: '2023-06-01T10:30:00Z',
            amount: 2500,
            commission: 250,
            commissionRate: 0.1,
            paymentMethod: 'Credit Card',
            status: 'completed',
            orderId: 'ORD-5001',
            customerId: 'CUST-1001',
            items: [
              { name: 'Pain Relief Tablets', quantity: 2, price: 500 },
              { name: 'Vitamin C', quantity: 1, price: 1500 }
            ]
          },
          {
            _id: '2',
            pharmacyId: 'PHARM-1002',
            pharmacyName: 'Village Meds',
            transactionId: 'TXN-20230601-002',
            date: '2023-06-01T11:15:00Z',
            amount: 1800,
            commission: 180,
            commissionRate: 0.1,
            paymentMethod: 'Insurance',
            status: 'completed',
            orderId: 'ORD-5002',
            customerId: 'CUST-1002',
            items: [
              { name: 'Antibiotic Ointment', quantity: 3, price: 600 }
            ]
          },
          {
            _id: '3',
            pharmacyId: 'PHARM-1001',
            pharmacyName: 'City Pharmacy',
            transactionId: 'TXN-20230602-001',
            date: '2023-06-02T09:45:00Z',
            amount: 3000,
            commission: 300,
            commissionRate: 0.1,
            paymentMethod: 'Debit Card',
            status: 'pending',
            orderId: 'ORD-5003',
            items: [
              { name: 'Blood Pressure Monitor', quantity: 1, price: 3000 }
            ]
          },
          {
            _id: '4',
            pharmacyId: 'PHARM-1003',
            pharmacyName: '24/7 Meds',
            transactionId: 'TXN-20230603-001',
            date: '2023-06-03T14:20:00Z',
            amount: 2200,
            commission: 220,
            commissionRate: 0.1,
            paymentMethod: 'Insurance',
            status: 'failed',
            orderId: 'ORD-5004'
          },
          {
            _id: '5',
            pharmacyId: 'PHARM-1004',
            pharmacyName: 'Health Plus',
            transactionId: 'TXN-20230604-001',
            date: '2023-06-04T10:00:00Z',
            amount: 2000,
            commission: 200,
            commissionRate: 0.1,
            paymentMethod: 'Cash',
            status: 'refunded',
            orderId: 'ORD-5005',
            items: [
              { name: 'Diabetes Test Strips', quantity: 1, price: 2000 }
            ]
          }
        ];

        setTransactions(transformTransactionData(mockData));
      } catch (err) {
        console.error('Failed to load transactions', err);
        setError('Unable to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleExport = (type: 'csv' | 'json') => {
    const dataToExport = visibleTransactions.map(t => ({
      'Transaction ID': t.transactionId,
      'Date': new Date(t.date).toLocaleDateString(),
      'Pharmacy': t.pharmacyName,
      'Amount': `₹${t.amount.toFixed(2)}`,
      'Commission': `₹${t.commission.toFixed(2)}`,
      'Commission Rate': `${(t.commissionRate * 100).toFixed(1)}%`,
      'Payment Method': t.paymentMethod,
      'Status': t.status.charAt(0).toUpperCase() + t.status.slice(1),
      'Order ID': t.orderId || 'N/A',
    }));

    if (type === 'csv') {
      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pharmacy_transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (type === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pharmacy_transactions_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const visibleTransactions = transactions.filter((t) => {
    // Search filter
    const matchesSearch =
      search === '' ||
      t.pharmacyName.toLowerCase().includes(search.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      (t.orderId && t.orderId.toLowerCase().includes(search.toLowerCase()));

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || t.status === statusFilter;

    // Pharmacy filter
    const matchesPharmacy =
      pharmacyFilter === 'all' || t.pharmacyId === pharmacyFilter;

    // Date range filter
    const transactionDate = new Date(t.date);
    const matchesDateRange =
      (!startDate || transactionDate >= startDate) &&
      (!endDate || transactionDate <= new Date(endDate.setHours(23, 59, 59, 999)));

    return matchesSearch && matchesStatus && matchesPharmacy && matchesDateRange;
  });

  const pharmacySummaries = calculateSummary(visibleTransactions);
  const allPharmacies = Array.from(new Set(transactions.map(t => ({ id: t.pharmacyId, name: t.pharmacyName }))));
  const allStatuses = ['completed', 'pending', 'failed', 'refunded'];

  const totalRevenue = visibleTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCommission = visibleTransactions.reduce((sum, t) => sum + t.commission, 0);

  // Prepare data for the line chart
  const dailySummaryData = calculateDailySummary(visibleTransactions);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pharmacy Finances</h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>View and manage financial transactions with partner pharmacies</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={darkMode ? "secondary" : "outline"}
              className={darkMode ? "bg-gray-800 hover:bg-gray-700" : "border-gray-300"}
            >
              <MdFilterList className="mr-1" /> {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Button
              onClick={() => handleExport('csv')}
              variant={darkMode ? "secondary" : "outline"}
              className={darkMode ? "bg-gray-800 hover:bg-gray-700" : "border-gray-300"}
            >
              <MdDownload className="mr-1" /> Export CSV
            </Button>
            <Button
              onClick={() => handleExport('json')}
              variant={darkMode ? "secondary" : "outline"}
              className={darkMode ? "bg-gray-800 hover:bg-gray-700" : "border-gray-300"}
            >
              <MdDownload className="mr-1" /> Export JSON
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`rounded-lg shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Transactions</p>
                <p className={`text-2xl font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{visibleTransactions.length}</p>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <FaFileInvoiceDollar className="text-xl" />
              </div>
            </div>
          </div>
          <div className={`rounded-lg shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Revenue</p>
                <p className={`text-2xl font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{totalRevenue.toFixed(2)}</p>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600'}`}>
                <MdOutlineAttachMoney className="text-xl" />
              </div>
            </div>
          </div>
          <div className={`rounded-lg shadow-sm border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Commission</p>
                <p className={`text-2xl font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{totalCommission.toFixed(2)}</p>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                <FaFilter className="text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={`rounded-lg shadow-sm border p-6 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                  </div>
                  <Input
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date Range</label>
                <div className="relative">
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    isClearable={true}
                    placeholderText="Select date range"
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none pl-10 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaRegCalendarAlt className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                >
                  <option value="all">All Statuses</option>
                  {allStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pharmacy</label>
                <select
                  value={pharmacyFilter}
                  onChange={(e) => setPharmacyFilter(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                >
                  <option value="all">All Pharmacies</option>
                  {allPharmacies.map((pharmacy) => (
                    <option key={pharmacy.id} value={pharmacy.id}>
                      {pharmacy.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Pharmacy Summary */}
        <div className={`rounded-lg shadow-sm border overflow-hidden mb-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`p-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pharmacy Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Pharmacy
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Transactions
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Total Amount
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Total Commission
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    darkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Last Transaction
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {pharmacySummaries.map((pharmacy) => (
                  <tr key={pharmacy.pharmacyId} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pharmacy.pharmacyName}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pharmacy.pharmacyId}</div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {pharmacy.totalTransactions}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      ₹{pharmacy.totalAmount.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      ₹{pharmacy.totalCommission.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {new Date(pharmacy.lastTransactionDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {pharmacySummaries.length === 0 && (
                  <tr>
                    <td colSpan={5} className={`px-6 py-8 text-center ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      No pharmacy data available with current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`rounded-lg shadow-sm border overflow-hidden mb-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className={`p-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transaction Details</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                darkMode ? 'border-blue-500' : 'border-blue-600'
              } mx-auto`}></div>
              <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Transaction ID
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Date
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Pharmacy
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Amount
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Commission
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Payment
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {visibleTransactions.map((transaction) => (
                    <tr key={transaction.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>{transaction.transactionId}</div>
                        {transaction.orderId && (
                          <div className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>Order: {transaction.orderId}</div>
                        )}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{transaction.pharmacyName}</div>
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{transaction.pharmacyId}</div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        ₹{transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>₹{transaction.commission.toFixed(2)}</div>
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{(transaction.commissionRate * 100).toFixed(1)}%</div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          transaction.status === 'completed'
                            ? darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                              ? darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                              : transaction.status === 'failed'
                                ? darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                                : darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className={darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {visibleTransactions.length === 0 && (
                    <tr>
                      <td colSpan={8} className={`px-6 py-8 text-center ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Financial Trends Chart */}
        <div className={`rounded-lg shadow-sm border p-6 mb-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Financial Overview</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Showing financial performance over time</p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailySummaryData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#4B5563' : '#E5E7EB'} />
                <XAxis 
                  dataKey="date" 
                  stroke={darkMode ? '#D1D5DB' : '#4B5563'} 
                  tick={{ fill: darkMode ? '#F3F4F6' : '#1F2937' }}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  stroke={darkMode ? '#3B82F6' : '#3B82F6'} 
                  tick={{ fill: darkMode ? '#F3F4F6' : '#1F2937' }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke={darkMode ? '#EC4899' : '#EC4899'} 
                  tick={{ fill: darkMode ? '#F3F4F6' : '#1F2937' }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'Revenue') return [`₹${value.toFixed(2)}`, name];
                    if (name === 'Commission') return [`₹${value.toFixed(2)}`, name];
                    return [value, name];
                  }}
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                    borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    color: darkMode ? '#F3F4F6' : '#1F2937',
                  }}
                />
                <Legend 
                  wrapperStyle={{ 
                    color: darkMode ? '#F3F4F6' : '#1F2937',
                    paddingTop: '20px'
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke={darkMode ? '#3B82F6' : '#3B82F6'}
                  fill={darkMode ? '#1E40AF' : '#BFDBFE'}
                  strokeWidth={2}
                  name="Revenue (₹)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="commission"
                  stroke={darkMode ? '#EC4899' : '#EC4899'}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Commission (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary */}
        <div className={`mt-6 text-center text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Showing {visibleTransactions.length} of {transactions.length} transactions
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transaction Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className={`p-1 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transaction Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Transaction ID:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTransaction.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Date:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {new Date(selectedTransaction.date).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          selectedTransaction.status === 'completed'
                            ? darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                            : selectedTransaction.status === 'pending'
                              ? darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                              : selectedTransaction.status === 'failed'
                                ? darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
                                : darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {selectedTransaction.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Payment Method:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedTransaction.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Financial Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Amount:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ₹{selectedTransaction.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Commission Rate:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {(selectedTransaction.commissionRate * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Commission Amount:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ₹{selectedTransaction.commission.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Net Amount:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ₹{(selectedTransaction.amount - selectedTransaction.commission).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pharmacy Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Pharmacy Name:</span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedTransaction.pharmacyName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Pharmacy ID:</span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedTransaction.pharmacyId}
                      </span>
                    </div>
                    {selectedTransaction.orderId && (
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Order ID:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedTransaction.orderId}
                        </span>
                      </div>
                    )}
                    {selectedTransaction.customerId && (
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Customer ID:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedTransaction.customerId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedTransaction.items && selectedTransaction.items.length > 0 && (
                  <div>
                    <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Items</h3>
                    <div className="overflow-x-auto">
                      <table className={`min-w-full divide-y ${
                        darkMode ? 'divide-gray-700' : 'divide-gray-200'
                      }`}>
                        <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                          <tr>
                            <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                              darkMode ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              Item
                            </th>
                            <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                              darkMode ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              Quantity
                            </th>
                            <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                              darkMode ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              Price
                            </th>
                            <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                              darkMode ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${
                          darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
                        }`}>
                          {selectedTransaction.items.map((item, index) => (
                            <tr key={index}>
                              <td className={`px-4 py-2 whitespace-nowrap text-sm font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {item.name}
                              </td>
                              <td className={`px-4 py-2 whitespace-nowrap text-sm ${
                                darkMode ? 'text-gray-300' : 'text-gray-900'
                              }`}>
                                {item.quantity}
                              </td>
                              <td className={`px-4 py-2 whitespace-nowrap text-sm ${
                                darkMode ? 'text-gray-300' : 'text-gray-900'
                              }`}>
                                ₹{item.price.toFixed(2)}
                              </td>
                              <td className={`px-4 py-2 whitespace-nowrap text-sm ${
                                darkMode ? 'text-gray-300' : 'text-gray-900'
                              }`}>
                                ₹{(item.quantity * item.price).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    onClick={() => setSelectedTransaction(null)}
                    className="w-full"
                    variant={darkMode ? "secondary" : "default"}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyFinances;