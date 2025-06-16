'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaFilter, FaFileInvoiceDollar, FaSearch, FaRegCalendarAlt, FaUserMd } from 'react-icons/fa';
import { MdDownload, MdFilterList, MdOutlineAttachMoney, MdMedicalServices } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { useTheme } from '../../components/ThemeContext';

interface DoctorTransaction {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  transactionId: string;
  date: string;
  consultationFee: number;
  platformFee: number;
  platformFeeRate: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  appointmentId?: string;
  patientId?: string;
  consultationType?: 'video' | 'chat' | 'clinic';
  duration?: number; // in minutes
}

interface DoctorSummary {
  doctorId: string;
  doctorName: string;
  specialization: string;
  totalTransactions: number;
  totalFees: number;
  totalPlatformFees: number;
  lastTransactionDate: string;
  averageConsultationDuration?: number;
}

interface DailySummary {
  date: string;
  transactions: number;
  revenue: number;
  platformFees: number;
  averageDuration?: number;
}

const transformTransactionData = (data: any[]): DoctorTransaction[] =>
  data.map((t) => ({
    id: t._id || `trans-${Math.random().toString(36).substr(2, 9)}`,
    doctorId: t.doctorId,
    doctorName: t.doctorName || 'Dr. Unknown',
    specialization: t.specialization || 'General Physician',
    transactionId: t.transactionId || `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    date: t.date || new Date().toISOString(),
    consultationFee: t.consultationFee || 0,
    platformFee: t.platformFee || 0,
    platformFeeRate: t.platformFeeRate || 0.2, // Default 20% platform fee
    paymentMethod: t.paymentMethod || 'Online',
    status: t.status?.toLowerCase() || 'completed',
    appointmentId: t.appointmentId,
    patientId: t.patientId,
    consultationType: t.consultationType || 'video',
    duration: t.duration || 15, // default 15 minutes
  }));

const calculateSummary = (transactions: DoctorTransaction[]): DoctorSummary[] => {
  const doctorMap = new Map<string, DoctorSummary>();

  transactions.forEach((t) => {
    if (!doctorMap.has(t.doctorId)) {
      doctorMap.set(t.doctorId, {
        doctorId: t.doctorId,
        doctorName: t.doctorName,
        specialization: t.specialization,
        totalTransactions: 0,
        totalFees: 0,
        totalPlatformFees: 0,
        lastTransactionDate: t.date,
        averageConsultationDuration: 0,
      });
    }

    const summary = doctorMap.get(t.doctorId)!;
    summary.totalTransactions += 1;
    summary.totalFees += t.consultationFee;
    summary.totalPlatformFees += t.platformFee;
    if (new Date(t.date) > new Date(summary.lastTransactionDate)) {
      summary.lastTransactionDate = t.date;
    }
    
    // Calculate average duration
    if (t.duration) {
      const currentTotalDuration = (summary.averageConsultationDuration || 0) * (summary.totalTransactions - 1);
      summary.averageConsultationDuration = (currentTotalDuration + t.duration) / summary.totalTransactions;
    }
  });

  return Array.from(doctorMap.values());
};

const calculateDailySummary = (transactions: DoctorTransaction[]): DailySummary[] => {
  const dailyMap = new Map<string, DailySummary>();

  transactions.forEach((t) => {
    const date = new Date(t.date).toISOString().split('T')[0];
    const formattedDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date: formattedDate,
        transactions: 0,
        revenue: 0,
        platformFees: 0,
        averageDuration: 0,
      });
    }

    const daily = dailyMap.get(date)!;
    daily.transactions += 1;
    daily.revenue += t.consultationFee;
    daily.platformFees += t.platformFee;
    
    // Calculate average duration
    if (t.duration) {
      const currentTotalDuration = (daily.averageDuration || 0) * (daily.transactions - 1);
      daily.averageDuration = (currentTotalDuration + t.duration) / daily.transactions;
    }
  });

  return Array.from(dailyMap.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

const DoctorTransactions = () => {
  const { darkMode } = useTheme();
  const [transactions, setTransactions] = useState<DoctorTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [consultationTypeFilter, setConsultationTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<DoctorTransaction | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for doctors
        const mockDoctorTransactions: DoctorTransaction[] = [
          {
            id: '1',
            doctorId: 'doc-001',
            doctorName: 'Dr. Sarah Johnson',
            specialization: 'Cardiology',
            transactionId: 'TXN-DOC-001',
            date: new Date(Date.now() - 86400000).toISOString(),
            consultationFee: 1500,
            platformFee: 300,
            platformFeeRate: 0.2,
            paymentMethod: 'Online',
            status: 'completed',
            appointmentId: 'APT-001',
            patientId: 'PAT-001',
            consultationType: 'video',
            duration: 30
          },
          {
            id: '2',
            doctorId: 'doc-002',
            doctorName: 'Dr. Michael Chen',
            specialization: 'Pediatrics',
            transactionId: 'TXN-DOC-002',
            date: new Date(Date.now() - 172800000).toISOString(),
            consultationFee: 1200,
            platformFee: 240,
            platformFeeRate: 0.2,
            paymentMethod: 'Online',
            status: 'completed',
            appointmentId: 'APT-002',
            patientId: 'PAT-002',
            consultationType: 'chat',
            duration: 20
          },
          {
            id: '3',
            doctorId: 'doc-003',
            doctorName: 'Dr. Emily Wilson',
            specialization: 'Dermatology',
            transactionId: 'TXN-DOC-003',
            date: new Date(Date.now() - 259200000).toISOString(),
            consultationFee: 1800,
            platformFee: 360,
            platformFeeRate: 0.2,
            paymentMethod: 'Credit Card',
            status: 'pending',
            appointmentId: 'APT-003',
            patientId: 'PAT-003',
            consultationType: 'clinic',
            duration: 45
          },
          {
            id: '4',
            doctorId: 'doc-001',
            doctorName: 'Dr. Sarah Johnson',
            specialization: 'Cardiology',
            transactionId: 'TXN-DOC-004',
            date: new Date(Date.now() - 345600000).toISOString(),
            consultationFee: 1500,
            platformFee: 300,
            platformFeeRate: 0.2,
            paymentMethod: 'Online',
            status: 'completed',
            appointmentId: 'APT-004',
            patientId: 'PAT-004',
            consultationType: 'video',
            duration: 25
          },
          {
            id: '5',
            doctorId: 'doc-004',
            doctorName: 'Dr. Robert Kim',
            specialization: 'Neurology',
            transactionId: 'TXN-DOC-005',
            date: new Date(Date.now() - 432000000).toISOString(),
            consultationFee: 2000,
            platformFee: 400,
            platformFeeRate: 0.2,
            paymentMethod: 'Debit Card',
            status: 'failed',
            appointmentId: 'APT-005',
            patientId: 'PAT-005',
            consultationType: 'video',
            duration: 30
          },
          {
            id: '6',
            doctorId: 'doc-002',
            doctorName: 'Dr. Michael Chen',
            specialization: 'Pediatrics',
            transactionId: 'TXN-DOC-006',
            date: new Date(Date.now() - 518400000).toISOString(),
            consultationFee: 1000,
            platformFee: 200,
            platformFeeRate: 0.2,
            paymentMethod: 'Online',
            status: 'refunded',
            appointmentId: 'APT-006',
            patientId: 'PAT-006',
            consultationType: 'chat',
            duration: 15
          },
        ];

        setTransactions(mockDoctorTransactions);
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
      'Doctor': t.doctorName,
      'Specialization': t.specialization,
      'Consultation Type': t.consultationType,
      'Duration (min)': t.duration,
      'Fee': `₹${t.consultationFee.toFixed(2)}`,
      'Platform Fee': `₹${t.platformFee.toFixed(2)}`,
      'Platform Fee Rate': `${(t.platformFeeRate * 100).toFixed(1)}%`,
      'Payment Method': t.paymentMethod,
      'Status': t.status.charAt(0).toUpperCase() + t.status.slice(1),
      'Appointment ID': t.appointmentId || 'N/A',
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
      a.download = `doctor_transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (type === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `doctor_transactions_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const visibleTransactions = transactions.filter((t) => {
    // Search filter
    const matchesSearch =
      search === '' ||
      t.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      (t.appointmentId && t.appointmentId.toLowerCase().includes(search.toLowerCase()));

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || t.status === statusFilter;

    // Doctor filter
    const matchesDoctor =
      doctorFilter === 'all' || t.doctorId === doctorFilter;

    // Specialization filter
    const matchesSpecialization =
      specializationFilter === 'all' || t.specialization === specializationFilter;

    // Consultation type filter
    const matchesConsultationType =
      consultationTypeFilter === 'all' || t.consultationType === consultationTypeFilter;

    // Date range filter
    const transactionDate = new Date(t.date);
    const matchesDateRange =
      (!startDate || transactionDate >= startDate) &&
      (!endDate || transactionDate <= new Date(endDate.setHours(23, 59, 59, 999)));

    return matchesSearch && matchesStatus && matchesDoctor && matchesSpecialization && matchesConsultationType && matchesDateRange;
  });

  const doctorSummaries = calculateSummary(visibleTransactions);
  const allDoctors = Array.from(new Set(transactions.map(t => ({ id: t.doctorId, name: t.doctorName }))));
  const allSpecializations = Array.from(new Set(transactions.map(t => t.specialization)));
  const allStatuses = ['completed', 'pending', 'failed', 'refunded'];
  const allConsultationTypes = ['video', 'chat', 'clinic'];

  const totalRevenue = visibleTransactions.reduce((sum, t) => sum + t.consultationFee, 0);
  const totalPlatformFees = visibleTransactions.reduce((sum, t) => sum + t.platformFee, 0);

  // Prepare data for the line chart
  const dailySummaryData = calculateDailySummary(visibleTransactions);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Doctor Transactions</h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>View and manage financial transactions with doctors</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300'}`}
            >
              <MdFilterList className="mr-1" /> {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
            <Button
              onClick={() => handleExport('csv')}
              variant="outline"
              className={`${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300'}`}
            >
              <MdDownload className="mr-1" /> Export CSV
            </Button>
            <Button
              onClick={() => handleExport('json')}
              variant="outline"
              className={`${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300'}`}
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
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Consultations</p>
                <p className={`text-2xl font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{visibleTransactions.length}</p>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <MdMedicalServices className="text-xl" />
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
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Platform Fees</p>
                <p className={`text-2xl font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{totalPlatformFees.toFixed(2)}</p>
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
                    <FaSearch className={`${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
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
                    className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaRegCalendarAlt className={`${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'}`}
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
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Doctor</label>
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'}`}
                >
                  <option value="all">All Doctors</option>
                  {allDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Specialization</label>
                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'}`}
                >
                  <option value="all">All Specializations</option>
                  {allSpecializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Consultation Type</label>
                <select
                  value={consultationTypeFilter}
                  onChange={(e) => setConsultationTypeFilter(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'}`}
                >
                  <option value="all">All Types</option>
                  {allConsultationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Summary */}
        <div className={`rounded-lg shadow-sm border overflow-hidden mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Doctor Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Doctor
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Specialization
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Consultations
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Total Fees
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Platform Fees
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Avg Duration
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    Last Consultation
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {doctorSummaries.map((doctor) => (
                  <tr key={doctor.doctorId} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doctor.doctorName}</div>
                      <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{doctor.doctorId}</div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {doctor.specialization}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {doctor.totalTransactions}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{doctor.totalFees.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ₹{doctor.totalPlatformFees.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {doctor.averageConsultationDuration?.toFixed(1) || 'N/A'} min
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(doctor.lastTransactionDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {doctorSummaries.length === 0 && (
                  <tr>
                    <td colSpan={7} className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No doctor data available with current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`rounded-lg shadow-sm border overflow-hidden mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Consultation Details</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading transactions...</p>
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
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Transaction ID
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Date
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Doctor
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Consultation
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Fee
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Platform Fee
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Payment
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {visibleTransactions.map((transaction) => (
                    <tr key={transaction.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{transaction.transactionId}</div>
                        {transaction.appointmentId && (
                          <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Appt: {transaction.appointmentId}</div>
                        )}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.doctorName}</div>
                        <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{transaction.specialization}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.consultationType}</div>
                        <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{transaction.duration} min</div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        ₹{transaction.consultationFee.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{transaction.platformFee.toFixed(2)}</div>
                        <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{(transaction.platformFeeRate * 100).toFixed(1)}%</div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${transaction.status === 'completed'
                            ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                              ? darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                              : transaction.status === 'failed'
                                ? darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                : darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
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
                      <td colSpan={9} className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
        <div className={`rounded-lg shadow-sm border p-6 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Financial Overview</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Showing financial performance</p>
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
                  stroke={darkMode ? '#D1D5DB' : '#4B5563'} 
                  tick={{ fill: darkMode ? '#F3F4F6' : '#1F2937' }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke={darkMode ? '#D1D5DB' : '#4B5563'} 
                  tick={{ fill: darkMode ? '#F3F4F6' : '#1F2937' }}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: darkMode ? '#374151' : '#FFFFFF',
                    borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    color: darkMode ? '#F3F4F6' : '#1F2937',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'Revenue') return [`₹${value.toFixed(2)}`, name];
                    if (name === 'Platform Fees') return [`₹${value.toFixed(2)}`, name];
                    return [value, name];
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
                  stroke="#3B82F6"
                  fill="#BFDBFE"
                  strokeWidth={2}
                  name="Revenue (₹)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="platformFees"
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Platform Fees (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary */}
        <div className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {visibleTransactions.length} of {transactions.length} transactions
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Consultation Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className={darkMode ? 'text-gray-400 hover:text-gray-300 p-1' : 'text-gray-400 hover:text-gray-600 p-1'}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Consultation Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transaction ID:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTransaction.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {new Date(selectedTransaction.date).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${selectedTransaction.status === 'completed'
                            ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                            : selectedTransaction.status === 'pending'
                              ? darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                              : selectedTransaction.status === 'failed'
                                ? darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                : darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                          }`}>
                          {selectedTransaction.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Payment Method:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedTransaction.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Financial Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Consultation Fee:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ₹{selectedTransaction.consultationFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Platform Fee Rate:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {(selectedTransaction.platformFeeRate * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Platform Fee:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ₹{selectedTransaction.platformFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Net Amount:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ₹{(selectedTransaction.consultationFee - selectedTransaction.platformFee).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Doctor Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Doctor Name:</span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedTransaction.doctorName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Specialization:</span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedTransaction.specialization}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Doctor ID:</span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedTransaction.doctorId}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Consultation Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Consultation Type:</span>
                      <span className={`text-sm font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedTransaction.consultationType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration:</span>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedTransaction.duration} minutes
                      </span>
                    </div>
                    {selectedTransaction.appointmentId && (
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Appointment ID:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedTransaction.appointmentId}
                        </span>
                      </div>
                    )}
                    {selectedTransaction.patientId && (
                      <div className="flex justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Patient ID:</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedTransaction.patientId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => setSelectedTransaction(null)}
                    className="w-full"
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

export default DoctorTransactions;