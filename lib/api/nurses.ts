import { fetchWithFallback } from '../apiClient';

export interface Nurse {
  _id: string;
  patientId: string;
  nurseId: string;
  fullName: string;
  profilePhoto: string;
  experience: number;
  ratePerHour: number;
  specialty: string;
  rating: number;
  languagesSpoken: string[];
  location: {
    street?: string;
    city?: string;
    pinCode?: string;
  };
  availability: {
    days?: string[];
    time?: string;
  };
  status: string;
  hiringId: string;
  startDate: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export const fetchNurses = async (): Promise<Nurse[]> => {
  return fetchWithFallback<Nurse[]>('https://api.caresewa.in/api/nurse', 'nurses');
};

export const getNurse = async (id: string): Promise<Nurse> => {
  return fetchWithFallback<Nurse>(`https://api.caresewa.in/api/nurse/${id}`, `nurses.find(n => n._id === '${id}')`);
};

export const createNurse = async (nurse: Omit<Nurse, '_id' | 'hiringId' | 'startDate'>): Promise<Nurse> => {
  try {
    const response = await fetch('https://api.caresewa.in/api/nurse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...nurse,
        hiringId: `hire-${Date.now()}`, // Generate a unique hiring ID
        startDate: new Date().toISOString()
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating nurse:', error);
    throw error;
  }
};

export const updateNurse = async (id: string, nurse: Partial<Nurse>): Promise<Nurse> => {
  try {
    const response = await fetch(`https://api.caresewa.in/api/nurse/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nurse),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating nurse:', error);
    throw error;
  }
};

export const deleteNurse = async (id: string): Promise<void> => {
  try {
    await fetch(`https://api.caresewa.in/api/nurse/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting nurse:', error);
    throw error;
  }
};