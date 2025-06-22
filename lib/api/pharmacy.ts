import { fetchWithFallback } from "../apiClient";

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

export interface PharmacySummary {
  pharmacyId: string;
  pharmacyName: string;
  totalTransactions: number;
  totalAmount: number;
  totalCommission: number;
  lastTransactionDate: string;
}

export interface PharmacyInfo {
  _id: string;
  storeName: string;
  location: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    geoLocation: string; // Changed from [number, number] to string
  };
  contact: {
    phone: string;
    email: string;
  };
  legalPapers: {
    drugLicense: string;
    gstNumber: string;
    pan: string;
  };
  status: 'Active' | 'Inactive' | 'Suspended';
  img?: string;
  pharmacyId: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export const fetchPharmacyTransactions = async (): Promise<PharmacyTransaction[]> => {
  try {
    const data = await fetchWithFallback<any[]>('https://api.caresewa.in/api/pharmacy/transactions', 'finance');
    return data.map((t) => ({
      id: t._id || `trans-${Math.random().toString(36).substr(2, 9)}`,
      pharmacyId: t.pharmacyId,
      pharmacyName: t.pharmacyName || 'Unknown Pharmacy',
      transactionId: t.transactionId || `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      date: t.date || new Date().toISOString(),
      amount: t.amount || 0,
      commission: t.commission || 0,
      commissionRate: t.commissionRate || 0.1,
      paymentMethod: t.paymentMethod || 'Online',
      status: t.status?.toLowerCase() as 'completed' | 'pending' | 'failed' | 'refunded',
      orderId: t.orderId,
      customerId: t.customerId,
      items: t.items?.map((i: any) => ({
        name: i.name || 'Unknown Item',
        quantity: i.quantity || 1,
        price: i.price || 0,
      })) || [],
    }));
  } catch (error) {
    console.error('Error fetching pharmacy transactions:', error);
    throw error;
  }
};

export const fetchAllPharmacies = async (): Promise<PharmacyInfo[]> => {
  try {
    const data = await fetchWithFallback<any[]>('https://api.caresewa.in/api/pharmacy', 'pharmacies');
    return data.map((p) => ({
      _id: p._id,
      storeName: p.storeName,
      location: {
        street: p.location?.street || '',
        city: p.location?.city || '',
        state: p.location?.state || '',
        pinCode: p.location?.pinCode || '',
        geoLocation: Array.isArray(p.location?.geoLocation) 
          ? p.location.geoLocation.join(',') 
          : p.location?.geoLocation || '0,0',
      },
      contact: {
        phone: p.contact?.phone || '',
        email: p.contact?.email || '',
      },
      legalPapers: {
        drugLicense: p.legalPapers?.drugLicense || '',
        gstNumber: p.legalPapers?.gstNumber || '',
        pan: p.legalPapers?.pan || '',
      },
      status: p.status as 'Active' | 'Inactive' | 'Suspended',
      img: p.img,
      pharmacyId: p.pharmacyId,
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString(),
      __v: p.__v
    }));
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    throw error;
  }
};

export const calculateSummary = (transactions: PharmacyTransaction[]): PharmacySummary[] => {
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