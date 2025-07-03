'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaFileMedical, FaSearch, FaFilter, FaFileUpload, FaFileDownload, FaTimes } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { useTheme } from '../components/ThemeContext';
import { fetchOrders, updateOrderStatus as apiUpdateOrderStatus, Order } from '@/lib/api/orders';

const OrderManagement = () => {
  const { darkMode } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

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

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updatedOrder = await apiUpdateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      setShowOrderDetails(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
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
        return darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'in-progress':
        return darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'pending':
        return darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default:
        return darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800';
      case 'stat':
        return darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default:
        return darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full p-4">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6`}>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Orders Management</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>View and manage all medical orders</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => alert('Create new order functionality would go here')}
              className={`bg-blue-600 hover:bg-blue-700 text-white text-sm h-9 ${darkMode ? 'ring-offset-gray-900' : ''}`}
            >
              <MdAdd className="mr-1" /> New Order
            </Button>
            <Button 
              onClick={handleImport}
              variant="outline"
              className={`border-gray-300 text-sm h-9 ${darkMode ? 'border-gray-600 hover:bg-gray-800 hover:text-white' : ''}`}
            >
              <FaFileUpload className="mr-1" /> Import
            </Button>
            <Button 
              onClick={() => handleExport('csv')}
              variant="outline"
              className={`border-gray-300 text-sm h-9 ${darkMode ? 'border-gray-600 hover:bg-gray-800 hover:text-white' : ''}`}
            >
              <FaFileDownload className="mr-1" /> CSV
            </Button>
            <Button 
              onClick={() => handleExport('json')}
              variant="outline"
              className={`border-gray-300 text-sm h-9 ${darkMode ? 'border-gray-600 hover:bg-gray-800 hover:text-white' : ''}`}
            >
              <FaFileDownload className="mr-1" /> JSON
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className={`rounded-lg shadow-sm border p-4 mb-4 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-1">
              <div className="relative">
                <Input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-8 text-sm h-9 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''
                  }`}
                />
                <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-9 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
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
                className={`w-full border rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-9 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
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
        <div className={`rounded-lg shadow-sm border overflow-hidden ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {loading ? (
            <div className={`p-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 text-sm">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y text-sm">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Order ID
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Patient
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Doctor
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Date & Time
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Items
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Amount
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Status
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Priority
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'
                }`}>
                  {visibleOrders.map((order) => (
                    <tr key={order.id} className={`transition-colors ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{order.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>{order.patientName}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: {order.patientId}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>{order.doctorName}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: {order.doctorId}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {item.name}
                            </span>
                          ))}
                          {order.items.length > 2 && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                            }`}>
                              +{order.items.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                          className={`text-xs h-7 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : ''}`}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {visibleOrders.length === 0 && (
                    <tr>
                      <td colSpan={9} className={`px-4 py-6 text-center ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
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
        <div className={`mt-4 text-center text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Showing {visibleOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Order Details - {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className={`p-1 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Patient Information
                    </h3>
                    <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>{selectedOrder.patientName}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: {selectedOrder.patientId}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Doctor Information
                    </h3>
                    <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>{selectedOrder.doctorName}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: {selectedOrder.doctorId}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Order Information
                  </h3>
                  <div className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Order Date</p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>
                          {new Date(selectedOrder.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Priority</p>
                        <p className={`text-sm font-medium capitalize ${darkMode ? 'text-white' : ''}`}>
                          {selectedOrder.priority}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Amount</p>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>₹{selectedOrder.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Order Items
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className={`border rounded-md p-3 ${
                        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>{item.name}</p>
                            <p className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.type}</p>
                          </div>
                          {item.quantity && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                            }`}>
                              Qty: {item.quantity}
                            </span>
                          )}
                        </div>
                        {item.instructions && (
                          <div className="mt-2">
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Instructions:</p>
                            <p className={`text-xs font-medium ${darkMode ? 'text-gray-300' : ''}`}>{item.instructions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Update Status
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.status !== 'pending' && (
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                        variant="outline"
                        className={`text-xs h-8 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : ''}`}
                      >
                        Mark as Pending
                      </Button>
                    )}
                    {selectedOrder.status !== 'in-progress' && (
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'in-progress')}
                        variant="outline"
                        className={`text-xs h-8 ${
                          darkMode 
                            ? 'bg-blue-900 text-blue-200 border-blue-800 hover:bg-blue-800' 
                            : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                        }`}
                      >
                        Mark as In Progress
                      </Button>
                    )}
                    {selectedOrder.status !== 'completed' && (
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                        variant="outline"
                        className={`text-xs h-8 ${
                          darkMode 
                            ? 'bg-green-900 text-green-200 border-green-800 hover:bg-green-800' 
                            : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        }`}
                      >
                        Mark as Completed
                      </Button>
                    )}
                    {selectedOrder.status !== 'cancelled' && (
                      <Button
                        onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                        variant="outline"
                        className={`text-xs h-8 ${
                          darkMode 
                            ? 'bg-red-900 text-red-200 border-red-800 hover:bg-red-800' 
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
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
                    className={`flex-1 text-sm h-9 ${
                      darkMode ? 'border-gray-600 hover:bg-gray-700' : ''
                    }`}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => alert('Print order functionality would go here')}
                    className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm h-9 ${
                      darkMode ? 'ring-offset-gray-800' : ''
                    }`}
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