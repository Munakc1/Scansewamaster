'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaAmbulance, FaSearch, FaFilter, FaFileUpload, FaFileDownload, FaTimes, FaEdit, FaTrash, FaEye, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { useTheme } from '../components/ThemeContext';

interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  vehicleType: 'Basic' | 'Advanced' | 'Mobile ICU';
  status: 'available' | 'on-call' | 'maintenance';
  currentLocation: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  insuranceExpiry: string;
  baseStation: string;
  equipment: string[];
}

const dummyAmbulances: Ambulance[] = [
  {
    id: 'AMB-1001',
    vehicleNumber: 'MH02AB1234',
    driverName: 'Rajesh Kumar',
    driverContact: '+919876543210',
    vehicleType: 'Advanced',
    status: 'available',
    currentLocation: 'Main Hospital',
    lastMaintenanceDate: '2024-02-15',
    nextMaintenanceDate: '2024-05-15',
    insuranceExpiry: '2024-12-31',
    baseStation: 'Central Station',
    equipment: ['Oxygen', 'Defibrillator', 'Stretcher', 'First Aid Kit']
  },
  {
    id: 'AMB-1002',
    vehicleNumber: 'MH02CD5678',
    driverName: 'Vikram Singh',
    driverContact: '+919876543211',
    vehicleType: 'Mobile ICU',
    status: 'on-call',
    currentLocation: 'En route to patient',
    lastMaintenanceDate: '2024-01-20',
    nextMaintenanceDate: '2024-04-20',
    insuranceExpiry: '2024-11-30',
    baseStation: 'North Station',
    equipment: ['Ventilator', 'Monitor', 'IV Pump', 'Oxygen', 'Defibrillator']
  },
  {
    id: 'AMB-1003',
    vehicleNumber: 'MH02EF9012',
    driverName: 'Anil Sharma',
    driverContact: '+919876543212',
    vehicleType: 'Basic',
    status: 'maintenance',
    currentLocation: 'Service Center',
    lastMaintenanceDate: '2024-03-01',
    nextMaintenanceDate: '2024-06-01',
    insuranceExpiry: '2025-01-31',
    baseStation: 'South Station',
    equipment: ['Stretcher', 'First Aid Kit', 'Oxygen']
  }
];

const AmbulanceManagement = () => {
  const { darkMode } = useTheme();
  const [ambulances, setAmbulances] = useState<Ambulance[]>(dummyAmbulances);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAmbulanceDetails, setShowAmbulanceDetails] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    driverName: '',
    driverContact: '',
    vehicleType: 'Basic',
    currentLocation: '',
    baseStation: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    insuranceExpiry: '',
    equipment: ''
  });

  const handleExport = (type: 'csv' | 'json') => {
    const dataToExport = visibleAmbulances.map(amb => ({
      'ID': amb.id,
      'Vehicle Number': amb.vehicleNumber,
      'Driver Name': amb.driverName,
      'Driver Contact': amb.driverContact,
      'Type': amb.vehicleType,
      'Status': amb.status,
      'Current Location': amb.currentLocation,
      'Base Station': amb.baseStation,
      'Last Maintenance': amb.lastMaintenanceDate,
      'Next Maintenance': amb.nextMaintenanceDate,
      'Insurance Expiry': amb.insuranceExpiry,
      'Equipment': amb.equipment.join(', ')
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
      a.download = `ambulances_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (type === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ambulances_${new Date().toISOString().split('T')[0]}.json`;
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
              alert('Ambulances imported successfully (demo)');
            } else if (file.name.endsWith('.csv')) {
              console.log('Imported CSV data:', content);
              alert('Ambulances imported successfully (demo)');
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

  const viewAmbulanceDetails = (ambulance: Ambulance) => {
    setSelectedAmbulance(ambulance);
    setShowAmbulanceDetails(true);
  };

  const handleAddAmbulance = () => {
    if (!formData.vehicleNumber.trim()) {
      alert('Please enter vehicle number');
      return;
    }
    
    const newAmbulance: Ambulance = {
      id: `AMB-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleNumber: formData.vehicleNumber,
      driverName: formData.driverName,
      driverContact: formData.driverContact,
      vehicleType: formData.vehicleType as 'Basic' | 'Advanced' | 'Mobile ICU',
      status: 'available',
      currentLocation: formData.currentLocation,
      lastMaintenanceDate: formData.lastMaintenanceDate,
      nextMaintenanceDate: formData.nextMaintenanceDate,
      insuranceExpiry: formData.insuranceExpiry,
      baseStation: formData.baseStation,
      equipment: formData.equipment.split(',').map(item => item.trim()).filter(item => item)
    };
    
    setAmbulances([...ambulances, newAmbulance]);
    setFormData({
      vehicleNumber: '',
      driverName: '',
      driverContact: '',
      vehicleType: 'Basic',
      currentLocation: '',
      baseStation: '',
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      insuranceExpiry: '',
      equipment: ''
    });
    setShowAddForm(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDeleteAmbulance = (ambulanceId: string) => {
    if (confirm('Are you sure you want to delete this ambulance?')) {
      setAmbulances(ambulances.filter(amb => amb.id !== ambulanceId));
    }
  };

  const handleEditAmbulance = (ambulance: Ambulance) => {
    setSelectedAmbulance(ambulance);
    alert(`Edit functionality would open for ambulance ${ambulance.id}`);
  };

  const updateStatus = (ambulanceId: string, newStatus: 'available' | 'on-call' | 'maintenance') => {
    setAmbulances(ambulances.map(amb => 
      amb.id === ambulanceId ? { 
        ...amb, 
        status: newStatus
      } : amb
    ));
    setShowAmbulanceDetails(false);
  };

  const visibleAmbulances = ambulances.filter((amb) => {
    const q = search.toLowerCase();
    const matchesSearch =
      amb.vehicleNumber.toLowerCase().includes(q) ||
      amb.driverName.toLowerCase().includes(q) ||
      amb.id.toLowerCase().includes(q) ||
      amb.baseStation.toLowerCase().includes(q);
    const matchesType =
      typeFilter === 'all' ||
      amb.vehicleType === typeFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      amb.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const allTypes = ['Basic', 'Advanced', 'Mobile ICU'];
  const allStatuses = ['available', 'on-call', 'maintenance'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'on-call':
        return darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      default:
        return darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  const getInputClasses = () => {
    return darkMode 
      ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  const getSelectClasses = () => {
    return darkMode 
      ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full p-4">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 rounded-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
        }`}>
          <div>
            <h1 className="text-2xl font-bold">Ambulance Management</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage ambulance fleet and dispatch
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
            >
              <MdAdd className="mr-1" /> Add Ambulance
            </Button>
            <Button 
              onClick={handleImport}
              variant="outline"
              className={`text-sm h-9 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300'}`}
            >
              <FaFileUpload className="mr-1" /> Import
            </Button>
            <Button 
              onClick={() => handleExport('csv')}
              variant="outline"
              className={`text-sm h-9 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300'}`}
            >
              <FaFileDownload className="mr-1" /> CSV
            </Button>
            <Button 
              onClick={() => handleExport('json')}
              variant="outline"
              className={`text-sm h-9 ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300'}`}
            >
              <FaFileDownload className="mr-1" /> JSON
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className={`rounded-lg p-4 mb-4 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm border'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-1">
              <div className="relative">
                <Input
                  placeholder="Search ambulances..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${getInputClasses()} pl-8 text-sm h-9`}
                />
                <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none h-9 ${getSelectClasses()}`}
              >
                <option value="all">All Types</option>
                {allTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none h-9 ${getSelectClasses()}`}
              >
                <option value="all">All Statuses</option>
                {allStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ambulances Table */}
        <div className={`rounded-lg overflow-hidden ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm border'
        }`}>
          {loading ? (
            <div className="p-8 text-center">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                darkMode ? 'border-blue-500' : 'border-blue-600'
              } mx-auto`}></div>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading ambulances...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y text-sm">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Ambulance
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Driver
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Type
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Location
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Base Station
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Status
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
                  {visibleAmbulances.map((amb) => (
                    <tr key={amb.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${
                            darkMode ? 'bg-red-900' : 'bg-red-100'
                          }`}>
                            <FaAmbulance className={darkMode ? 'text-red-300' : 'text-red-600'} />
                          </div>
                          <div className="ml-4">
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {amb.vehicleNumber}
                            </div>
                            <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              ID: {amb.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {amb.driverName}
                        </div>
                        <div className={`flex items-center ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <FaPhone className="mr-1 text-xs" /> {amb.driverContact}
                        </div>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {amb.vehicleType}
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className={`mr-1 text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          {amb.currentLocation}
                        </div>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {amb.baseStation}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(amb.status)}`}>
                          {amb.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => viewAmbulanceDetails(amb)}
                            variant="ghost"
                            size="sm"
                            className={`h-7 w-7 p-0 ${
                              darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700' : 'text-blue-600 hover:text-blue-800'
                            }`}
                            title="View"
                          >
                            <FaEye className="text-sm" />
                          </Button>
                          <Button
                            onClick={() => handleEditAmbulance(amb)}
                            variant="ghost"
                            size="sm"
                            className={`h-7 w-7 p-0 ${
                              darkMode ? 'text-green-400 hover:text-green-300 hover:bg-gray-700' : 'text-green-600 hover:text-green-800'
                            }`}
                            title="Edit"
                          >
                            <FaEdit className="text-sm" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteAmbulance(amb.id)}
                            variant="ghost"
                            size="sm"
                            className={`h-7 w-7 p-0 ${
                              darkMode ? 'text-red-400 hover:text-red-300 hover:bg-gray-700' : 'text-red-600 hover:text-red-800'
                            }`}
                            title="Delete"
                          >
                            <FaTrash className="text-sm" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleAmbulances.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center">
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          No ambulances found matching your criteria.
                        </p>
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
          Showing {visibleAmbulances.length} of {ambulances.length} ambulances
        </div>
      </div>

      {/* Ambulance Details Modal */}
      {showAmbulanceDetails && selectedAmbulance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className={`rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Ambulance Details</h2>
                <button
                  onClick={() => setShowAmbulanceDetails(false)}
                  className={darkMode ? 'text-gray-400 hover:text-gray-200 p-1' : 'text-gray-400 hover:text-gray-600 p-1'}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`h-16 w-16 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-red-900' : 'bg-red-100'
                  }`}>
                    <FaAmbulance className={darkMode ? 'text-red-300 text-2xl' : 'text-red-600 text-2xl'} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{selectedAmbulance.vehicleNumber}</h3>
                    <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>
                      ID: {selectedAmbulance.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={darkMode ? 'text-gray-400 text-xs' : 'text-gray-500 text-xs'}>Driver Name</p>
                    <p className={darkMode ? 'text-white text-sm font-medium' : 'text-gray-900 text-sm font-medium'}>
                      {selectedAmbulance.driverName}
                    </p>
                  </div>
                  <div>
                    <p className={darkMode ? 'text-gray-400 text-xs' : 'text-gray-500 text-xs'}>Driver Contact</p>
                    <p className={`text-sm font-medium flex items-center ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <FaPhone className={`mr-1 text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} /> {selectedAmbulance.driverContact}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={darkMode ? 'text-gray-400 text-xs' : 'text-gray-500 text-xs'}>Vehicle Type</p>
                    <p className={darkMode ? 'text-white text-sm font-medium' : 'text-gray-900 text-sm font-medium'}>
                      {selectedAmbulance.vehicleType}
                    </p>
                  </div>
                  <div>
                    <p className={darkMode ? 'text-gray-400 text-xs' : 'text-gray-500 text-xs'}>Base Station</p>
                    <p className={darkMode ? 'text-white text-sm font-medium' : 'text-gray-900 text-sm font-medium'}>
                      {selectedAmbulance.baseStation}
                    </p>
                  </div>
                </div>

                <div>
                  <p className={darkMode ? 'text-gray-400 text-xs' : 'text-gray-500 text-xs'}>Current Location</p>
                  <p className={`text-sm font-medium flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <FaMapMarkerAlt className={`mr-1 text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    {selectedAmbulance.currentLocation}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={darkMode ? 'text-gray-400 text-xs' : 'text-gray-500 text-xs'}>Last Maintenance</p>
                    <p className={darkMode ? 'text-white text-sm font-medium' : 'text-gray-900 text-sm font-medium'}>
                      {new Date(selectedAmbulance.lastMaintenanceDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className={darkMode ? 'text-gray-400 text-xs' : 'text-gray-500 text-xs'}>Next Maintenance</p>
                    <p className={darkMode ? 'text-white text-sm font-medium' : 'text-gray-900 text-sm font-medium'}>
                      {new Date(selectedAmbulance.nextMaintenanceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className={darkMode ? 'text-gray-400 text-xs' : 'text-gray-500 text-xs'}>Insurance Expiry</p>
                  <p className={darkMode ? 'text-white text-sm font-medium' : 'text-gray-900 text-sm font-medium'}>
                    {new Date(selectedAmbulance.insuranceExpiry).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className={darkMode ? 'text-gray-400 text-xs' : 'text-gray-500 text-xs'}>Equipment</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedAmbulance.equipment.map((item, index) => (
                      <span key={index} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className={`text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => updateStatus(selectedAmbulance.id, 'available')}
                      variant={selectedAmbulance.status === 'available' ? 'default' : 'outline'}
                      className="h-8"
                    >
                      Available
                    </Button>
                    <Button
                      onClick={() => updateStatus(selectedAmbulance.id, 'on-call')}
                      variant={selectedAmbulance.status === 'on-call' ? 'default' : 'outline'}
                      className="h-8"
                    >
                      On Call
                    </Button>
                    <Button
                      onClick={() => updateStatus(selectedAmbulance.id, 'maintenance')}
                      variant={selectedAmbulance.status === 'maintenance' ? 'default' : 'outline'}
                      className="h-8"
                    >
                      Maintenance
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowAmbulanceDetails(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => alert('Dispatch functionality would go here')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={selectedAmbulance.status !== 'available'}
                  >
                    Dispatch
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Ambulance Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className={`rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Add New Ambulance</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={darkMode ? 'text-gray-400 hover:text-gray-200 p-1' : 'text-gray-400 hover:text-gray-600 p-1'}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Vehicle Number *
                  </label>
                  <Input
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleFormChange}
                    required
                    className={getInputClasses()}
                    placeholder="MH02AB1234"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Driver Name *
                    </label>
                    <Input
                      name="driverName"
                      value={formData.driverName}
                      onChange={handleFormChange}
                      required
                      className={getInputClasses()}
                      placeholder="Rajesh Kumar"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Driver Contact *
                    </label>
                    <Input
                      name="driverContact"
                      value={formData.driverContact}
                      onChange={handleFormChange}
                      required
                      className={getInputClasses()}
                      placeholder="+919876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Vehicle Type *
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleFormChange}
                    className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none ${getSelectClasses()}`}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Mobile ICU">Mobile ICU</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Current Location
                    </label>
                    <Input
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleFormChange}
                      className={getInputClasses()}
                      placeholder="Main Hospital"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Base Station *
                    </label>
                    <Input
                      name="baseStation"
                      value={formData.baseStation}
                      onChange={handleFormChange}
                      required
                      className={getInputClasses()}
                      placeholder="Central Station"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Last Maintenance Date
                    </label>
                    <Input
                      name="lastMaintenanceDate"
                      type="date"
                      value={formData.lastMaintenanceDate}
                      onChange={handleFormChange}
                      className={getInputClasses()}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Next Maintenance Date
                    </label>
                    <Input
                      name="nextMaintenanceDate"
                      type="date"
                      value={formData.nextMaintenanceDate}
                      onChange={handleFormChange}
                      className={getInputClasses()}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Insurance Expiry Date
                  </label>
                  <Input
                    name="insuranceExpiry"
                    type="date"
                    value={formData.insuranceExpiry}
                    onChange={handleFormChange}
                    className={getInputClasses()}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Equipment (comma separated)
                  </label>
                  <Input
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleFormChange}
                    className={getInputClasses()}
                    placeholder="Oxygen, Defibrillator, Stretcher"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddAmbulance}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Add Ambulance
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

export default AmbulanceManagement;