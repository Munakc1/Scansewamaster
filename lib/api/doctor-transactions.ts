import { fetchWithFallback } from '../apiClient';

export interface DoctorTransaction {
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

export const fetchDoctorTransactions = async (): Promise<DoctorTransaction[]> => {
  const data = await fetchWithFallback<any[]>('/api/doctor-transactions', 'doctorTransactions');
  return transformTransactionData(data);
};

export const calculateDoctorSummary = (transactions: DoctorTransaction[]): DoctorSummary[] => {
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

export const calculateDailySummary = (transactions: DoctorTransaction[]): DailySummary[] => {
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