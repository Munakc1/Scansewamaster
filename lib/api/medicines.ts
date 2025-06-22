// src/lib/api/stock.ts
import { fetchWithFallback } from '../apiClient';

export interface Medicine {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  pharmacyId: string;
  image?: string;
  requiresPrescription: boolean;
  status: 'Published' | 'Draft' | 'Discontinued';
  medicineId: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  data: Medicine[];
}

interface SingleMedicineResponse {
  success: boolean;
  data: Medicine;
}

export const fetchMedicines = async (): Promise<Medicine[]> => {
  try {
    const response = await fetchWithFallback<ApiResponse>(
      'https://api.caresewa.in/api/medicine',
      await fetch('/mock/data.json').then(res => res.json())
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching medicines:', error);
    throw error;
  }
};

export const getMedicine = async (id: string): Promise<Medicine> => {
  try {
    const response = await fetchWithFallback<SingleMedicineResponse>(
      `https://api.caresewa.in/api/medicine/${id}`,
      JSON.stringify({
        success: true,
        data: (await fetch('/mock/data.json').then(res => res.json()))
          .data.find((med: Medicine) => med.medicineId === id)
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching medicine:', error);
    throw error;
  }
};

export const createMedicine = async (medicine: Omit<Medicine, '_id' | 'medicineId' | 'createdAt' | 'updatedAt' | '__v'>): Promise<Medicine> => {
  try {
    const response = await fetch('https://api.caresewa.in/api/medicine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicine),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating medicine:', error);
    throw error;
  }
};

export const updateMedicine = async (id: string, medicine: Partial<Medicine>): Promise<Medicine> => {
  try {
    const response = await fetch(`https://api.caresewa.in/api/medicine/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicine),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating medicine:', error);
    throw error;
  }
};

export const deleteMedicine = async (id: string): Promise<void> => {
  try {
    await fetch(`https://api.caresewa.in/api/medicine/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    throw error;
  }
};