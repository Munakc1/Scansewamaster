'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaFileMedical, FaSearch, FaFilter, FaFileUpload, FaFileDownload, FaTimes } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';

interface Order {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  orderDate: string;
  status: 'pending' | 'completed' | 'cancelled' | 'in-progress';
  items: {
    name: string;
    type: 'medicine' | 'test' | 'procedure';
    quantity?: number;
    instructions?: string;
  }[];
  totalAmount: number;
  priority: 'routine' | 'urgent' | 'stat';
}

// Dummy orders data
const dummyOrders: Order[] = [
  {
    id: 'ORD-1001',
    patientName: 'John Doe',
    patientId: 'PT-1001',
    doctorName: 'Dr. Sarah Wilson',
    doctorId: 'DR-2001',
    orderDate: '2024-03-15T09:30:00',
    status: 'completed',
    items: [
      { name: 'Paracetamol 500mg', type: 'medicine', quantity: 30, instructions: 'Take 1 tablet every 6 hours as needed for pain' },
      { name: 'Complete Blood Count', type: 'test' },
      { name: 'ECG', type: 'procedure' }
    ],
    totalAmount: 1250,
    priority: 'routine'
  },
  {
    id: 'ORD-1002',
    patientName: 'Jane Smith',
    patientId: 'PT-1002',
    doctorName: 'Dr. Michael Chen',
    doctorId: 'DR-2002',
    orderDate: '2024-03-16T14:15:00',
    status: 'in-progress',
    items: [
      { name: 'Amoxicillin 500mg', type: 'medicine', quantity: 20, instructions: 'Take 1 capsule every 8 hours for 7 days' },
      { name: 'Urine Culture', type: 'test' }
    ],
    totalAmount: 850,
    priority: 'urgent'
  },
  {
    id: 'ORD-1003',
    patientName: 'Amit Verma',
    patientId: 'PT-1003',
    doctorName: 'Dr. Emily Rodriguez',
    doctorId: 'DR-2003',
    orderDate: '2024-03-17T11:00:00',
    status: 'pending',
    items: [
      { name: 'MRI Brain', type: 'procedure' },
      { name: 'Lipid Profile', type: 'test' }
    ],
    totalAmount: 4500,
    priority: 'routine'
  },
  {
    id: 'ORD-1004',
    patientName: 'Priya Patel',
    patientId: 'PT-1004',
    doctorName: 'Dr. Lisa Thompson',
    doctorId: 'DR-2004',
    orderDate: '2024-03-18T16:45:00',
    status: 'cancelled',
    items: [
      { name: 'Ibuprofen 400mg', type: 'medicine', quantity: 15, instructions: 'Take 1 tablet every 8 hours as needed' }
    ],
    totalAmount: 300,
    priority: 'routine'
  },
  {
    id: 'ORD-1005',
    patientName: 'David Johnson',
    patientId: 'PT-1005',
    doctorName: 'Dr. Robert Kim',
    doctorId: 'DR-2005',
    orderDate: '2024-03-19T08:20:00',
    status: 'in-progress',
    items: [
      { name: 'CT Scan Abdomen', type: 'procedure' },
      { name: 'Liver Function Test', type: 'test' },
      { name: 'Omeprazole 20mg', type: 'medicine', quantity: 14, instructions: 'Take 1 capsule every morning before food' }
    ],
    totalAmount: 6200,
    priority: 'urgent'
  }
];

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleExport = (type: 'csv' | 'json') => {
    const dataToExport = visibleOrders.map(order => ({
      'Order ID': order.id,
      'Patient': order.patientName,
      'Doctor': order.doctorName,
      'Date': new Date(order.orderDate).toLocaleDateString(),
      'Status': order.status,
      'Priority': order.priority,
      'Items': order.items.map(item => item.name).join(', '),
      'Total Amount': `₹${order.totalAmount}`
    }));

    if (type === 'csv') {
      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (type === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            if (file.name.endsWith('.json')) {
              const importedData = JSON.parse(content);
              console.log('Imported JSON data:', importedData);
              alert('Orders imported successfully (demo)');
            } else if (file.name.endsWith('.csv')) {
              console.log('Imported CSV data:', content);
              alert('Orders imported successfully (demo)');
            }
          } catch (err) {
            console.error('Error importing file:', err);
            alert('Error importing file. Please check the format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setShowOrderDetails(false);
  };

  const visibleOrders = orders.filter((order) => {
    const q = search.toLowerCase();
    const matchesSearch =
      order.patientName.toLowerCase().includes(q) ||
      order.doctorName.toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q) ||
      order.items.some(item => item.name.toLowerCase().includes(q));
    const matchesStatus =
      statusFilter === 'all' ||
      order.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' ||
      order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const allStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
  const allPriorities = ['routine', 'urgent', 'stat'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-orange-100 text-orange-800';
      case 'stat':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage all medical orders</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => alert('Create new order functionality would go here')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
            >
              <MdAdd className="mr-1" /> New Order
            </Button>
            <Button 
              onClick={handleImport}
              variant="outline"
              className="border-gray-300 text-sm h-9"
            >
              <FaFileUpload className="mr-1" /> Import
            </Button>
            <Button 
              onClick={() => handleExport('csv')}
              variant="outline"
              className="border-gray-300 text-sm h-9"
            >
              <FaFileDownload className="mr-1" /> CSV
            </Button>
            <Button 
              onClick={() => handleExport('json')}
              variant="outline"
              className="border-gray-300 text-sm h-9"
            >
              <FaFileDownload className="mr-1" /> JSON
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-1">
              <div className="relative">
                <Input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-8 text-sm h-9"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-9"
              >
                <option value="all">All Statuses</option>
                {allStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-9"
              >
                <option value="all">All Priorities</option>
                {allPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{order.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-900">{order.patientName}</div>
                        <div className="text-xs text-gray-500">ID: {order.patientId}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-900">{order.doctorName}</div>
                        <div className="text-xs text-gray-500">ID: {order.doctorId}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-900">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {item.name}
                            </span>
                          ))}
                          {order.items.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{order.items.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {order.priority !== 'routine' && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(order.priority)}`}>
                            {order.priority}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Button
                          onClick={() => viewOrderDetails(order)}
                          variant="outline"
                          className="text-xs h-7"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {visibleOrders.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {visibleOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Order Details - {selectedOrder.id}</h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Patient Information</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium">{selectedOrder.patientName}</p>
                      <p className="text-xs text-gray-500">ID: {selectedOrder.patientId}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Doctor Information</h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium">{selectedOrder.doctorName}</p>
                      <p className="text-xs text-gray-500">ID: {selectedOrder.doctorId}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Order Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Order Date</p>
                        <p className="text-sm font-medium">
                          {new Date(selectedOrder.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Priority</p>
                        <p className="text-sm font-medium capitalize">
                          {selectedOrder.priority}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Current Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-sm font-medium">₹{selectedOrder.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                          </div>
                          {item.quantity && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Qty: {item.quantity}
                            </span>
                          )}
                        </div>
                        {item.instructions && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">Instructions:</p>
                            <p className="text-xs font-medium">{item.instructions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status !== 'pending' && (
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                        variant="outline"
                        className="text-xs h-8"
                      >
                        Mark as Pending
                      </Button>
                    )}
                    {selectedOrder.status !== 'in-progress' && (
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'in-progress')}
                        variant="outline"
                        className="text-xs h-8 bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Mark as In Progress
                      </Button>
                    )}
                    {selectedOrder.status !== 'completed' && (
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                        variant="outline"
                        className="text-xs h-8 bg-green-50 text-green-700 border-green-200"
                      >
                        Mark as Completed
                      </Button>
                    )}
                    {selectedOrder.status !== 'cancelled' && (
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                        variant="outline"
                        className="text-xs h-8 bg-red-50 text-red-700 border-red-200"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowOrderDetails(false)}
                    variant="outline"
                    className="flex-1 text-sm h-9"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => alert('Print order functionality would go here')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
                  >
                    Print Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;