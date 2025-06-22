// lib/api/revenue-tracker.ts
import { fetchWithFallback } from '../apiClient';

export interface RevenueData {
  date: string;
  totalRevenue: number;
  nurseRevenue: number;
  patientRevenue: number;
  pharmacyRevenue: number;
  doctorRevenue: number;
}

export interface RevenueByCategory {
  name: string;
  value: number;
  color?: string;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalTransactions: number;
  averageTransaction: number;
  revenueByCategory: RevenueByCategory[];
  revenueTrend: RevenueData[];
}

export const fetchRevenueSummary = async (): Promise<RevenueSummary> => {
  return fetchWithFallback<RevenueSummary>('/api/revenue/summary', 'revenueSummary');
};

export const fetchRevenueTrend = async (params: {
  startDate?: string;
  endDate?: string;
  interval?: 'daily' | 'weekly' | 'monthly';
}): Promise<RevenueData[]> => {
  const query = new URLSearchParams();
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  if (params.interval) query.append('interval', params.interval);

  return fetchWithFallback<RevenueData[]>(
    `/api/revenue/trend?${query.toString()}`,
    'revenueTrend'
  );
};

// Utility function to transform API data to our frontend format
export const transformRevenueData = (data: any): RevenueSummary => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return {
    totalRevenue: data.totalRevenue || 0,
    totalTransactions: data.totalTransactions || 0,
    averageTransaction: data.averageTransaction || 0,
    revenueByCategory: (data.revenueByCategory || []).map((item: any, index: number) => ({
      name: item.name || 'Unknown',
      value: item.value || 0,
      color: item.color || COLORS[index % COLORS.length]
    })),
    revenueTrend: (data.revenueTrend || []).map((item: any) => ({
      date: item.date || new Date().toISOString(),
      totalRevenue: item.totalRevenue || 0,
      nurseRevenue: item.nurseRevenue || 0,
      patientRevenue: item.patientRevenue || 0,
      pharmacyRevenue: item.pharmacyRevenue || 0,
      doctorRevenue: item.doctorRevenue || 0
    }))
  };
};