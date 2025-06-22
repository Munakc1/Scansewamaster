import { fetchWithFallback } from '../apiClient';

export interface PharmacyTransaction {
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

export const fetchPharmacyTransactions = async (): Promise<PharmacyTransaction[]> => {
  const data = await fetchWithFallback<any[]>('/api/pharmacy-transactions', 'pharmacyTransactions');
  return transformTransactionData(data);
};

export const calculatePharmacySummary = (transactions: PharmacyTransaction[]): PharmacySummary[] => {
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

export const calculateDailySummary = (transactions: PharmacyTransaction[]): DailySummary[] => {
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