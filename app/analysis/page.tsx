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

interface MedicalCategoryData {
  category: string;
  count: number;
  barColor: string;
}

interface PatientStatus {
  label: string;
  count: number;
  bgColor: string;
  textColor?: string;
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
  { category: 'Cardiology', count: 1250, barColor: '#EF4444' },
  { category: 'Pediatrics', count: 980, barColor: '#3B82F6' },
  { category: 'Neurology', count: 750, barColor: '#8B5CF6' },
  { category: 'Orthopedics', count: 620, barColor: '#10B981' },
];

const patientStatusData: PatientStatus[] = [
  { label: 'Admitted', count: 125, bgColor: '#F59E0B' },
  { label: 'Discharged', count: 320, bgColor: '#10B981' },
  { label: 'Emergency', count: 85, bgColor: '#EF4444' },
  { label: 'Recovered', count: 780, bgColor: '#8B5CF6' },
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
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow border border-gray-100 w-full">
      <h2 className="text-xl font-semibold text-gray-800">Patient Distribution by Department</h2>
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="rectangular" width="100%" height={12} sx={{ borderRadius: 999 }} />
            </div>
          ))
        : data.map(({ category, count, barColor }) => {
            const widthPercent = (count / maxCount) * 100;
            return (
              <div key={category} className="space-y-1">
                <div className="text-sm font-medium text-gray-700">
                  {category}: {count.toLocaleString()}
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 hover:opacity-90"
                    style={{ width: `${widthPercent}%`, backgroundColor: barColor }}
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
  textColor = 'white',
}: PatientStatus & { total: number }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const formattedCount = new Intl.NumberFormat('en-US').format(count);
  
  return (
    <div
      className="rounded-xl p-6 text-center font-semibold shadow-md transition-all hover:scale-[1.02] hover:shadow-lg w-full"
      style={{
        backgroundColor: bgColor,
        color: textColor,
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
        style={{ background: 'rgba(255, 255, 255, 0.2)' }}
      >
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
};

const DepartmentBarChart = ({ data }: { data: DepartmentData[] }) => {
  return (
    <div className="w-full h-full bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Department Patient Load</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barCategoryGap="30%"
          >
            <XAxis dataKey="department" stroke="#4B5563" />
            <YAxis allowDecimals={false} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'revenue') return [`₹${Number(value).toLocaleString()}`, 'Revenue'];
                return [`${value} patients`, name === 'patients' ? 'Patients' : ''];
              }}
              labelStyle={{ color: '#1F2937' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend />
            <Bar 
              dataKey="patients" 
              name="Patients"
              fill="#3B82F6" 
              barSize={50} 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="revenue" 
              name="Revenue (₹)"
              fill="#10B981" 
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
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  const iconConfig = {
    patients: {
      icon: <Groups2Outlined />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    tests: {
      icon: <BiotechOutlined />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    doctors: {
      icon: <LocalHospitalOutlined />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    vaccines: {
      icon: <VaccinesOutlined />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    medications: {
      icon: <MedicationOutlined />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    surgeries: {
      icon: <MedicalServicesOutlined />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    beds: {
      icon: <AirlineSeatIndividualSuiteOutlined />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    departments: {
      icon: <MonitorHeartOutlined />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
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
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between transition-all duration-300 w-full h-full hover:shadow-md hover:border-transparent hover:translate-y-[-4px]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</h2>
        <div className={`${bgColor} rounded-lg p-2 ${color}`}>
          {React.cloneElement(icon, { fontSize: 'small' })}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-gray-800">
          {formatNumberToWord(value)}
        </p>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${bgColor.replace('bg-', 'bg-opacity-70 ')} rounded-full`}
          style={{ width: `${Math.min(100, value / (title.includes('Revenue') ? 10000 : 1000) * 100)}%` }}
        />
      </div>
    </div>
  );
};

const DepartmentPieChart = () => {
  return (
    <div className="w-full h-full bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Distribution</h2>
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
                <Cell key={`cell-${index}`} fill={entry.barColor} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} patients`, 'Count']}
              labelStyle={{ color: '#1F2937' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AppointmentTrendChart = () => {
  return (
    <div className="w-full h-full bg-white p-6 rounded-xl shadow border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Trends</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={appointmentTrendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              labelStyle={{ color: '#1F2937' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="appointments" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="New Appointments"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="followUps" 
              stroke="#10B981" 
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
  const [isLoading, setIsLoading] = useState(false);
  const totalPatients = patientStatusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="min-h-screen bg-gray-50 m-0">
      <div className="w-full">
        <div className="bg-white shadow-sm px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Medical Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive overview of hospital performance and patient statistics</p>
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
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Status</h2>
              <div className="grid grid-cols-2 gap-4">
                {patientStatusData.map((status, index) => (
                  <PatientStatusCard
                    key={index}
                    label={status.label}
                    count={status.count}
                    total={totalPatients}
                    bgColor={status.bgColor}
                    textColor={status.textColor}
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

          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Recent Medical Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-4">
                      <LocalHospitalOutlined fontSize="small" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">New patient admission #{1000 + item}</p>
                      <p className="text-sm text-gray-500 mt-1">Cardiology Department - 2 hours ago</p>
                    </div>
                    <div className="text-sm font-medium text-green-600">Stable</div>
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