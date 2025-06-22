import { fetchWithFallback } from '../apiClient';

export interface PatientTransaction {
  id: string;
  patientId: string;
  patientName: string;
  transactionId: string;
  date: string;
  amount: number;
  serviceType: string;
  serviceDetails: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  prescriptionId?: string;
  doctorId?: string;
  items?: {
    name: string;
    type: 'medicine' | 'consultation' | 'test' | 'procedure';
    quantity: number;
    price: number;
  }[];
}

export const fetchPatientTransactions = async (): Promise<PatientTransaction[]> => {
  return fetchWithFallback<PatientTransaction[]>('/api/transactions', 'transactions');
};

export const getPatientTransaction = async (id: string): Promise<PatientTransaction> => {
  return fetchWithFallback<PatientTransaction>(`/api/transactions/${id}`, `transactions.find(t => t.id === '${id}')`);
};

export const createPatientTransaction = async (transaction: Omit<PatientTransaction, 'id'>): Promise<PatientTransaction> => {
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const updatePatientTransaction = async (
  id: string,
  transaction: Partial<PatientTransaction>
): Promise<PatientTransaction> => {
  try {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deletePatientTransaction = async (id: string): Promise<void> => {
  try {
    await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// Utility function to transform API data to our frontend format
export const transformTransactionData = (data: any[]): PatientTransaction[] => {
  return data.map((t) => ({
    id: t._id || `trans-${Math.random().toString(36).substr(2, 9)}`,
    patientId: t.patientId,
    patientName: t.patientName || 'Unknown Patient',
    transactionId: t.transactionId || `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    date: t.date || new Date().toISOString(),
    amount: t.amount || 0,
    serviceType: t.serviceType || 'Consultation',
    serviceDetails: t.serviceDetails || 'General Consultation',
    paymentMethod: t.paymentMethod || 'Online',
    status: t.status?.toLowerCase() || 'completed',
    prescriptionId: t.prescriptionId,
    doctorId: t.doctorId,
    items: t.items?.map((i: any) => ({
      name: i.name || 'Unknown Service',
      type: i.type || 'consultation',
      quantity: i.quantity || 1,
      price: i.price || 0,
    })) || [],
  }));
};