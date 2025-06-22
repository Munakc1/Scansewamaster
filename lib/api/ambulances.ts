// src/lib/api/ambulance.ts
import { fetchWithFallback } from '../apiClient';

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  status: 'available' | 'dispatched' | 'maintenance';
  currentLocation: string;
  lastMaintenanceDate: string;
  type: 'basic' | 'advanced' | 'neonatal';
}

export const fetchAmbulances = async (): Promise<Ambulance[]> => {
  return fetchWithFallback<Ambulance[]>('https://api.caresewa.in/api/ambulances', 'ambulances');
};

export const updateAmbulanceStatus = async (id: string, status: Ambulance['status']): Promise<Ambulance> => {
  try {
    const response = await fetch(`https://api.caresewa.in/api/ambulances${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating ambulance status:', error);
    throw error;
  }
};