// lib/api/nurse-transactions.ts

import { fetchWithFallback } from '../apiClient';

export interface NurseTransaction {
  id: string;
  nurseId: string;
  nurseName: string;
  transactionId: string;
  date: string;
  amount: number;
  serviceType: string;
  serviceDetails: string;
  duration: number;
  patientId?: string;
  patientName?: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  visitId?: string;
  rating?: number;
}

export interface NurseSummary {
  nurseId: string;
  nurseName: string;
  totalTransactions: number;
  totalAmount: number;
  totalHours: number;
  lastTransactionDate: string;
  averageRating?: number;
}

export interface DailySummary {
  date: string;
  transactions: number;
  revenue: number;
  averageAmount: number;
}

const transformTransactionData = (data: any[]): NurseTransaction[] =>
  data.map((t) => ({
    id: t._id || `trans-${Math.random().toString(36).substr(2, 9)}`,
    nurseId: t.nurseId,
    nurseName: t.nurseName || 'Unknown Nurse',
    transactionId: t.transactionId || `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    date: t.date || new Date().toISOString(),
    amount: t.amount || 0,
    serviceType: t.serviceType || 'Home Care',
    serviceDetails: t.serviceDetails || 'General Nursing Care',
    duration: t.duration || 1,
    patientId: t.patientId,
    patientName: t.patientName,
    paymentMethod: t.paymentMethod || 'Online',
    status: t.status?.toLowerCase() || 'completed',
    visitId: t.visitId,
    rating: t.rating,
  }));

export const fetchNurseTransactions = async (): Promise<NurseTransaction[]> => {
  const data = await fetchWithFallback<any[]>('/api/nurse-transactions', 'nurseTransactions');
  return transformTransactionData(data);
};

export const calculateNurseSummary = (transactions: NurseTransaction[]): NurseSummary[] => {
  const nurseMap = new Map<string, NurseSummary>();

  transactions.forEach((t) => {
    if (!nurseMap.has(t.nurseId)) {
      nurseMap.set(t.nurseId, {
        nurseId: t.nurseId,
        nurseName: t.nurseName,
        totalTransactions: 0,
        totalAmount: 0,
        totalHours: 0,
        lastTransactionDate: t.date,
        averageRating: 0,
      });
    }

    const summary = nurseMap.get(t.nurseId)!;
    summary.totalTransactions += 1;
    summary.totalAmount += t.amount;
    summary.totalHours += t.duration;
    if (new Date(t.date) > new Date(summary.lastTransactionDate)) {
      summary.lastTransactionDate = t.date;
    }
    if (t.rating) {
      const currentTotalRating = (summary.averageRating || 0) * (summary.totalTransactions - 1);
      summary.averageRating = (currentTotalRating + t.rating) / summary.totalTransactions;
    }
  });

  return Array.from(nurseMap.values());
};

export const calculateDailySummary = (transactions: NurseTransaction[]): DailySummary[] => {
  const dailyMap = new Map<string, DailySummary>();

  transactions.forEach((t) => {
    const date = new Date(t.date).toISOString().split('T')[0];
    const formattedDate = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date: formattedDate,
        transactions: 0,
        revenue: 0,
        averageAmount: 0,
      });
    }

    const daily = dailyMap.get(date)!;
    daily.transactions += 1;
    daily.revenue += t.amount;
    daily.averageAmount = daily.revenue / daily.transactions;
  });

  return Array.from(dailyMap.values()).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};