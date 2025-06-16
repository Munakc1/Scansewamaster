'use client';

import React, { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import {
  LocalHospitalOutlined,
  BiotechOutlined,
  Groups2Outlined,
  VaccinesOutlined,
  MedicationOutlined,
  MonitorHeartOutlined,
  AirlineSeatIndividualSuiteOutlined,
  MedicalServicesOutlined,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, CartesianGrid, Line } from 'recharts';
import anime from 'animejs';
import { useTheme } from '../components/ThemeContext';

interface MedicalCategoryData {
  category: string;
  count: number;
  barColor: string;
  darkBarColor: string;
}

interface PatientStatus {
  label: string;
  count: number;
  bgColor: string;
  darkBgColor: string;
  textColor?: string;
  darkTextColor?: string;
}

interface DepartmentData {
  department: string;
  patients: number;
  revenue: number;
}

type MedicalIconType = 'patients' | 'tests' | 'doctors' | 'vaccines' | 'medications' | 'surgeries' | 'beds' | 'departments';

interface MedicalSummaryCardProps {
  title: string;
  value: number;
  description: string;
  iconType: MedicalIconType;
}

interface AppointmentTrendData {
  month: string;
  appointments: number;
  followUps: number;
}

const medicalCategoryData: MedicalCategoryData[] = [
  { category: 'Cardiology', count: 1250, barColor: '#EF4444', darkBarColor: '#FCA5A5' },
  { category: 'Pediatrics', count: 980, barColor: '#3B82F6', darkBarColor: '#93C5FD' },
  { category: 'Neurology', count: 750, barColor: '#8B5CF6', darkBarColor: '#C4B5FD' },
  { category: 'Orthopedics', count: 620, barColor: '#10B981', darkBarColor: '#6EE7B7' },
];

const patientStatusData: PatientStatus[] = [
  { label: 'Admitted', count: 125, bgColor: '#F59E0B', darkBgColor: '#FCD34D', textColor: 'white', darkTextColor: 'black' },
  { label: 'Discharged', count: 320, bgColor: '#10B981', darkBgColor: '#6EE7B7', textColor: 'white', darkTextColor: 'black' },
  { label: 'Emergency', count: 85, bgColor: '#EF4444', darkBgColor: '#FCA5A5', textColor: 'white', darkTextColor: 'black' },
  { label: 'Recovered', count: 780, bgColor: '#8B5CF6', darkBgColor: '#C4B5FD', textColor: 'white', darkTextColor: 'black' },
];

const departmentData: DepartmentData[] = [
  { department: 'Q1', patients: 4000, revenue: 1200000 },
  { department: 'Q2', patients: 3000, revenue: 900000 },
  { department: 'Q3', patients: 5000, revenue: 1500000 },
  { department: 'Q4', patients: 2000, revenue: 600000 },
];

const medicalSummaryData: MedicalSummaryCardProps[] = [
  { title: 'Total Patients', value: 12500, description: 'Active patients this month', iconType: 'patients' },
  { title: 'Tests Conducted', value: 8500, description: 'Tests completed this quarter', iconType: 'tests' },
  { title: 'Doctors', value: 420, description: 'Active medical professionals', iconType: 'doctors' },
  { title: 'Vaccinations', value: 12500, description: 'Vaccines administered this year', iconType: 'vaccines' },
  { title: 'Medications', value: 25600, description: 'Prescriptions this month', iconType: 'medications' },
  { title: 'Surgeries', value: 1240, description: 'Surgeries performed', iconType: 'surgeries' },
  { title: 'Hospital Beds', value: 850, description: 'Total available beds', iconType: 'beds' },
  { title: 'Departments', value: 32, description: 'Specialized units', iconType: 'departments' },
];

const appointmentTrendData: AppointmentTrendData[] = [
  { month: 'Jan', appointments: 4000, followUps: 2400 },
  { month: 'Feb', appointments: 3000, followUps: 1398 },
  { month: 'Mar', appointments: 5000, followUps: 2800 },
  { month: 'Apr', appointments: 2000, followUps: 1800 },
  { month: 'May', appointments: 3500, followUps: 2100 },
  { month: 'Jun', appointments: 4200, followUps: 2500 },
];

const MedicalCategoryBar = ({ data = [], isLoading = false }: { data?: MedicalCategoryData[], isLoading?: boolean }) => {
  const { darkMode } = useTheme();
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className={`space-y-4 p-6 rounded-xl shadow border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <h2 className={`text-xl font-semibold ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>Patient Distribution by Department</h2>
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <Skeleton variant="text" width="40%" height={20} className={darkMode ? 'bg-gray-700' : ''} />
              <Skeleton variant="rectangular" width="100%" height={12} sx={{ borderRadius: 999 }} className={darkMode ? 'bg-gray-700' : ''} />
            </div>
          ))
        : data.map(({ category, count, barColor, darkBarColor }) => {
            const widthPercent = (count / maxCount) * 100;
            return (
              <div key={category} className="space-y-1">
                <div className={`text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {category}: {count.toLocaleString()}
                </div>
                <div className={`w-full h-3 rounded-full overflow-hidden ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-full rounded-full transition-all duration-300 hover:opacity-90"
                    style={{ 
                      width: `${widthPercent}%`, 
                      backgroundColor: darkMode ? darkBarColor : barColor 
                    }}
                  />
                </div>
              </div>
            );
          })}
    </div>
  );
};

const PatientStatusCard = ({ 
  label, 
  count, 
  total, 
  bgColor,
  darkBgColor,
  textColor = 'white',
  darkTextColor = 'black',
}: PatientStatus & { total: number }) => {
  const { darkMode } = useTheme();
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const formattedCount = new Intl.NumberFormat('en-US').format(count);
  
  return (
    <div
      className="rounded-xl p-6 text-center font-semibold shadow-md transition-all hover:scale-[1.02] hover:shadow-lg w-full"
      style={{
        backgroundColor: darkMode ? darkBgColor : bgColor,
        color: darkMode ? darkTextColor : textColor,
      }}
    >
      <div className="mb-2 text-sm uppercase tracking-wider opacity-90">
        {label}
      </div>
      <div className="my-3 text-3xl font-bold leading-none">
        {formattedCount}
      </div>
      <div 
        className="inline-block rounded-full px-3 py-1 text-xs"
        style={{ background: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)' }}
      >
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
};

const DepartmentBarChart = ({ data }: { data: DepartmentData[] }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`w-full h-full p-6 rounded-xl shadow border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>Department Patient Load</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barCategoryGap="30%"
          >
            <XAxis 
              dataKey="department" 
              stroke={darkMode ? '#D1D5DB' : '#4B5563'} 
              tick={{ fill: darkMode ? '#F3F4F6' : '#1F2937' }}
            />
            <YAxis 
              allowDecimals={false} 
              stroke={darkMode ? '#D1D5DB' : '#4B5563'} 
              tick={{ fill: darkMode ? '#F3F4F6' : '#1F2937' }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'revenue') return [`₹${Number(value).toLocaleString()}`, 'Revenue'];
                return [`${value} patients`, name === 'patients' ? 'Patients' : ''];
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
            <Bar 
              dataKey="patients" 
              name="Patients"
              fill={darkMode ? '#93C5FD' : '#3B82F6'} 
              barSize={50} 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="revenue" 
              name="Revenue (₹)"
              fill={darkMode ? '#6EE7B7' : '#10B981'} 
              barSize={50} 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const MedicalSummaryCard: React.FC<MedicalSummaryCardProps> = ({ title, value, description, iconType }) => {
  const { darkMode } = useTheme();
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  const iconConfig = {
    patients: {
      icon: <Groups2Outlined />,
      color: darkMode ? 'text-blue-400' : 'text-blue-600',
      bgColor: darkMode ? 'bg-blue-900' : 'bg-blue-50'
    },
    tests: {
      icon: <BiotechOutlined />,
      color: darkMode ? 'text-green-400' : 'text-green-600',
      bgColor: darkMode ? 'bg-green-900' : 'bg-green-50'
    },
    doctors: {
      icon: <LocalHospitalOutlined />,
      color: darkMode ? 'text-purple-400' : 'text-purple-600',
      bgColor: darkMode ? 'bg-purple-900' : 'bg-purple-50'
    },
    vaccines: {
      icon: <VaccinesOutlined />,
      color: darkMode ? 'text-orange-400' : 'text-orange-600',
      bgColor: darkMode ? 'bg-orange-900' : 'bg-orange-50'
    },
    medications: {
      icon: <MedicationOutlined />,
      color: darkMode ? 'text-indigo-400' : 'text-indigo-600',
      bgColor: darkMode ? 'bg-indigo-900' : 'bg-indigo-50'
    },
    surgeries: {
      icon: <MedicalServicesOutlined />,
      color: darkMode ? 'text-red-400' : 'text-red-600',
      bgColor: darkMode ? 'bg-red-900' : 'bg-red-50'
    },
    beds: {
      icon: <AirlineSeatIndividualSuiteOutlined />,
      color: darkMode ? 'text-teal-400' : 'text-teal-600',
      bgColor: darkMode ? 'bg-teal-900' : 'bg-teal-50'
    },
    departments: {
      icon: <MonitorHeartOutlined />,
      color: darkMode ? 'text-pink-400' : 'text-pink-600',
      bgColor: darkMode ? 'bg-pink-900' : 'bg-pink-50'
    }
  };

  const { icon, color, bgColor } = iconConfig[iconType];

  React.useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.random(0, 200)
      });
    }
  }, []);

  const formatNumberToWord = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div
      ref={cardRef}
      className={`rounded-xl p-6 shadow-sm border flex flex-col justify-between transition-all duration-300 w-full h-full hover:shadow-md hover:border-transparent hover:translate-y-[-4px] ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-sm font-medium uppercase tracking-wider ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>{title}</h2>
        <div className={`${bgColor} rounded-lg p-2 ${color}`}>
          {React.cloneElement(icon, { fontSize: 'small' })}
        </div>
      </div>
      <div className="mt-2">
        <p className={`text-3xl font-bold ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {formatNumberToWord(value)}
        </p>
        <p className={`text-xs mt-2 leading-relaxed ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {description}
        </p>
      </div>
      <div className={`mt-3 h-1 w-full rounded-full overflow-hidden ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <div 
          className={`h-full rounded-full ${
            bgColor.replace(darkMode ? 'bg-' : 'bg-', 'bg-opacity-70 ')
          }`}
          style={{ width: `${Math.min(100, value / (title.includes('Revenue') ? 10000 : 1000) * 100)}%` }}
        />
      </div>
    </div>
  );
};

const DepartmentPieChart = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`w-full h-full p-6 rounded-xl shadow border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>Patient Distribution</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={medicalCategoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {medicalCategoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={darkMode ? entry.darkBarColor : entry.barColor} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} patients`, 'Count']}
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
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AppointmentTrendChart = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`w-full h-full p-6 rounded-xl shadow border ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>Appointment Trends</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={appointmentTrendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={darkMode ? '#4B5563' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="month" 
              stroke={darkMode ? '#D1D5DB' : '#4B5563'} 
              tick={{ fill: darkMode ? '#F3F4F6' : '#1F2937' }}
            />
            <YAxis 
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
            />
            <Legend 
              wrapperStyle={{ 
                color: darkMode ? '#F3F4F6' : '#1F2937',
                paddingTop: '20px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="appointments" 
              stroke={darkMode ? '#93C5FD' : '#3B82F6'} 
              strokeWidth={2}
              name="New Appointments"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="followUps" 
              stroke={darkMode ? '#6EE7B7' : '#10B981'} 
              strokeWidth={2}
              name="Follow-ups"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function MedicalAnalysisDashboard() {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const totalPatients = patientStatusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="w-full">
        <div className={`shadow-sm px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Medical Analytics Dashboard
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Comprehensive overview of hospital performance and patient statistics
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {medicalSummaryData.slice(0, 4).map((item, index) => (
              <MedicalSummaryCard
                key={index}
                title={item.title}
                value={item.value}
                description={item.description}
                iconType={item.iconType}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {medicalSummaryData.slice(4).map((item, index) => (
              <MedicalSummaryCard
                key={index}
                title={item.title}
                value={item.value}
                description={item.description}
                iconType={item.iconType}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
            <div className={`p-6 rounded-xl shadow border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Patient Status</h2>
              <div className="grid grid-cols-2 gap-4">
                {patientStatusData.map((status, index) => (
                  <PatientStatusCard
                    key={index}
                    label={status.label}
                    count={status.count}
                    total={totalPatients}
                    bgColor={status.bgColor}
                    darkBgColor={status.darkBgColor}
                    textColor={status.textColor}
                    darkTextColor={status.darkTextColor}
                  />
                ))}
              </div>
            </div>
            <div className="xl:col-span-2">
              <MedicalCategoryBar data={medicalCategoryData} isLoading={isLoading} />
            </div>
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 mb-6">
            <div className="w-full h-full">
              <DepartmentBarChart data={departmentData} />
            </div>
            <div className="w-full h-full">
              <DepartmentPieChart />
            </div>
          </div>

          <div className="w-full mb-6">
            <AppointmentTrendChart />
          </div>

          <div className={`rounded-xl shadow border overflow-hidden w-full ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className={`p-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>Recent Medical Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className={`flex items-start pb-4 ${
                    darkMode ? 'border-b border-gray-700' : 'border-b border-gray-100'
                  } last:border-0`}>
                    <div className={`p-2 rounded-lg mr-4 ${
                      darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <LocalHospitalOutlined fontSize="small" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>New patient admission #{1000 + item}</p>
                      <p className={`text-sm mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Cardiology Department - 2 hours ago</p>
                    </div>
                    <div className={`text-sm font-medium ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>Stable</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}