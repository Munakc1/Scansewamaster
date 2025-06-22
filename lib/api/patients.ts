// src/lib/api/patients.ts
import { fetchWithFallback } from '../apiClient';

export interface Address {
  street: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface MedicalHistoryItem {
  condition: string;
  diagnosedDate: string;
  _id: string;
}

export interface Patient {
  _id: string;
  patientId: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  allergies: string;
  address: Address;
  medicalHistory: MedicalHistoryItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const fetchPatients = async (): Promise<Patient[]> => {
  return fetchWithFallback<Patient[]>('https://api.caresewa.in/api/patients', 'patients');
};

export const getPatient = async (id: string): Promise<Patient> => {
  return fetchWithFallback<Patient>(`https://api.caresewa.in/api/patients/${id}`, `patients.find(p => p._id === '${id}')`);
};

export const createPatient = async (patient: Omit<Patient, '_id' | 'patientId' | 'createdAt' | 'updatedAt' | '__v'>): Promise<Patient> => {
  try {
    const response = await fetch('https://api.caresewa.in/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

export const updatePatient = async (id: string, patient: Partial<Patient>): Promise<Patient> => {
  try {
    const response = await fetch(`https://api.caresewa.in/api/patients/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patient),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};

export const deletePatient = async (id: string): Promise<void> => {
  try {
    await fetch(`https://api.caresewa.in/api/patients/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};