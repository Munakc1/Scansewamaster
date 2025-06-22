// src/lib/api/doctors.ts
import { fetchWithFallback } from '../apiClient';

export interface Address {
  street: string;
  city: string;
  pinCode: string;
  geoLocation?: string;
  state?: string;
}

export interface ConsultationFees {
  inClinic: number;
  online: number;
}

export interface Documents {
  aadhaar: string;
  pan: string;
  gstNumber?: string;
  digitalSignature: string;
  mbbsCertificate?: string;
  pgCertificate?: string;
  profilePhoto?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  _id?: string;
}

export interface Doctor {
  _id: string;
  doctorId: string;
  fullName: string;
  dateOfBirth?: string;
  gender: string;
  phone: string;
  password: string;
  email: string;
  profilePhoto?: string;
  registrationNumber: string;
  medicalCouncil: string;
  state?: string;
  yearsOfExperience: number;
  specializations: string[];
  languagesSpoken: string[];
  clinicName: string;
  workingDays: string[];
  availableTimeSlots: TimeSlot[];
  appointmentModes: string[];
  upiId?: string;
  status: string;
  holidayMode: boolean;
  address: Address;
  consultationFees: ConsultationFees;
  documents: Documents;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export const fetchDoctors = async (): Promise<Doctor[]> => {
  return fetchWithFallback<Doctor[]>('https://api.caresewa.in/api/doctors', 'doctors');
};

export const getDoctor = async (id: string): Promise<Doctor> => {
  return fetchWithFallback<Doctor>(`https://api.caresewa.in/api/doctors/${id}`, `doctors.find(d => d._id === '${id}')`);
};

export const createDoctor = async (doctor: Omit<Doctor, '_id' | 'doctorId' | 'createdAt' | 'updatedAt' | '__v'>): Promise<Doctor> => {
  try {
    const response = await fetch('https://api.caresewa.in/api/doctors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctor),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};

export const updateDoctor = async (id: string, doctor: Partial<Doctor>): Promise<Doctor> => {
  try {
    const response = await fetch(`https://api.caresewa.in/api/doctors/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctor),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};

export const deleteDoctor = async (id: string): Promise<void> => {
  try {
    await fetch(`https://api.caresewa.in/api/doctors/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
};