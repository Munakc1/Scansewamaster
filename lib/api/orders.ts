// lib/api/orders.ts
import { fetchWithFallback } from "../apiClient";
import apiClient from "../apiClient";

export interface OrderItem {
  name: string;
  type: 'medicine' | 'test' | 'procedure';
  quantity?: number;
  instructions?: string;
}

export interface Order {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  orderDate: string;
  status: 'pending' | 'completed' | 'cancelled' | 'in-progress';
  items: OrderItem[];
  totalAmount: number;
  priority: 'routine' | 'urgent' | 'stat';
}

// Fetch orders with fallback to mock data
export const fetchOrders = async (): Promise<Order[]> => {
  return await fetchWithFallback<Order[]>('/orders', 'pharmacyOrders');
};

export const createOrder = async (order: Omit<Order, 'id'>): Promise<Order> => {
  try {
    const response = await apiClient.post('/orders', order);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (
  id: string,
  status: 'pending' | 'completed' | 'cancelled' | 'in-progress'
): Promise<Order> => {
  try {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/orders/${id}`);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};