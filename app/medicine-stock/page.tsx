'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaSearch, FaFilter, FaFileUpload, FaFileDownload, FaTimes, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { useTheme } from '../components/ThemeContext';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  batchNumber: string;
  manufacturer: string;
  expiryDate: string;
  quantity: number;
  unit: 'tablets' | 'bottles' | 'tubes' | 'vials' | 'capsules';
  pricePerUnit: number;
  category: 'antibiotic' | 'analgesic' | 'antihistamine' | 'antacid' | 'other';
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
}

// Dummy medicine stock data
const dummyMedicines: Medicine[] = [
  {
    id: 'MED-1001',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    batchNumber: 'BATCH-2023-001',
    manufacturer: 'ABC Pharma',
    expiryDate: '2025-06-30',
    quantity: 1500,
    unit: 'tablets',
    pricePerUnit: 0.50,
    category: 'analgesic',
    stockStatus: 'in-stock',
    lastUpdated: '2024-03-15T09:30:00'
  },
  {
    id: 'MED-1002',
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin',
    batchNumber: 'BATCH-2023-045',
    manufacturer: 'XYZ Pharmaceuticals',
    expiryDate: '2024-12-31',
    quantity: 45,
    unit: 'tablets',
    pricePerUnit: 2.75,
    category: 'antibiotic',
    stockStatus: 'low-stock',
    lastUpdated: '2024-03-18T14:15:00'
  },
  {
    id: 'MED-1003',
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine Hydrochloride',
    batchNumber: 'BATCH-2024-012',
    manufacturer: 'DEF Meds',
    expiryDate: '2026-03-31',
    quantity: 0,
    unit: 'tablets',
    pricePerUnit: 1.20,
    category: 'antihistamine',
    stockStatus: 'out-of-stock',
    lastUpdated: '2024-03-20T11:00:00'
  },
  {
    id: 'MED-1004',
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    batchNumber: 'BATCH-2024-078',
    manufacturer: 'GHI Healthcare',
    expiryDate: '2025-09-30',
    quantity: 320,
    unit: 'capsules',
    pricePerUnit: 3.50,
    category: 'antacid',
    stockStatus: 'in-stock',
    lastUpdated: '2024-03-22T16:45:00'
  },
  {
    id: 'MED-1005',
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    batchNumber: 'BATCH-2023-156',
    manufacturer: 'JKL Pharma',
    expiryDate: '2024-08-15',
    quantity: 85,
    unit: 'tablets',
    pricePerUnit: 1.80,
    category: 'analgesic',
    stockStatus: 'low-stock',
    lastUpdated: '2024-03-25T08:20:00'
  }
];

const MedicineStock = () => {
  const { darkMode } = useTheme();
  const [medicines, setMedicines] = useState<Medicine[]>(dummyMedicines);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showMedicineDetails, setShowMedicineDetails] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleExport = (type: 'csv' | 'json') => {
    const dataToExport = visibleMedicines.map(medicine => ({
      'Medicine ID': medicine.id,
      'Name': medicine.name,
      'Generic Name': medicine.genericName,
      'Batch Number': medicine.batchNumber,
      'Manufacturer': medicine.manufacturer,
      'Expiry Date': new Date(medicine.expiryDate).toLocaleDateString(),
      'Quantity': medicine.quantity,
      'Unit': medicine.unit,
      'Price Per Unit': `$${medicine.pricePerUnit.toFixed(2)}`,
      'Category': medicine.category,
      'Stock Status': medicine.stockStatus
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
      a.download = `medicine_stock_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (type === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medicine_stock_${new Date().toISOString().split('T')[0]}.json`;
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
              alert('Medicine stock imported successfully (demo)');
            } else if (file.name.endsWith('.csv')) {
              console.log('Imported CSV data:', content);
              alert('Medicine stock imported successfully (demo)');
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

  const viewMedicineDetails = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowMedicineDetails(true);
    setShowEditForm(false);
  };

  const editMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowMedicineDetails(true);
    setShowEditForm(true);
  };

  const deleteMedicine = (medicineId: string) => {
    if (confirm('Are you sure you want to delete this medicine from stock?')) {
      setMedicines(medicines.filter(medicine => medicine.id !== medicineId));
      setShowMedicineDetails(false);
    }
  };

  const updateMedicine = (updatedMedicine: Medicine) => {
    setMedicines(medicines.map(medicine => 
      medicine.id === updatedMedicine.id ? updatedMedicine : medicine
    ));
    setShowEditForm(false);
    setShowMedicineDetails(false);
  };

  const visibleMedicines = medicines.filter((medicine) => {
    const q = search.toLowerCase();
    const matchesSearch =
      medicine.name.toLowerCase().includes(q) ||
      medicine.genericName.toLowerCase().includes(q) ||
      medicine.batchNumber.toLowerCase().includes(q) ||
      medicine.manufacturer.toLowerCase().includes(q) ||
      medicine.id.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'all' ||
      medicine.stockStatus === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' ||
      medicine.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const allStatuses = ['in-stock', 'low-stock', 'out-of-stock'];
  const allCategories = ['antibiotic', 'analgesic', 'antihistamine', 'antacid', 'other'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'low-stock':
        return darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default:
        return darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'antibiotic':
        return darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'analgesic':
        return darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800';
      case 'antihistamine':
        return darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800';
      case 'antacid':
        return darkMode ? 'bg-pink-900 text-pink-200' : 'bg-pink-100 text-pink-800';
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
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Medicine Stock Management</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              View and manage medicine inventory
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => alert('Add new medicine functionality would go here')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
            >
              <MdAdd className="mr-1" /> Add Medicine
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
                  placeholder="Search medicines..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${getInputClasses()} pl-8 text-sm h-9`}
                />
                <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
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
                    {status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none h-9 ${getSelectClasses()}`}
              >
                <option value="all">All Categories</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Medicines Table */}
        <div className={`rounded-lg overflow-hidden ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm border'
        }`}>
          {loading ? (
            <div className="p-8 text-center">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                darkMode ? 'border-blue-500' : 'border-blue-600'
              } mx-auto`}></div>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading medicines...
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
                      Medicine ID
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Name
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Generic Name
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Batch
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Expiry
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Quantity
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Status
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Category
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
                  {visibleMedicines.map((medicine) => (
                    <tr key={medicine.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>{medicine.name}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{medicine.manufacturer}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>{medicine.genericName}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>{medicine.batchNumber}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>
                          {new Date(medicine.expiryDate).toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {Math.floor((new Date(medicine.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>{medicine.quantity}</div>
                        <div className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{medicine.unit}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(medicine.stockStatus)}`}>
                          {medicine.stockStatus.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(medicine.category)}`}>
                          {medicine.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-1">
                          <Button
                            onClick={() => viewMedicineDetails(medicine)}
                            variant="outline"
                            size="sm"
                            className={`h-7 w-7 p-0 ${
                              darkMode ? 'hover:bg-gray-700' : ''
                            }`}
                            title="View"
                          >
                            <FaEye className="text-sm" />
                          </Button>
                          <Button
                            onClick={() => editMedicine(medicine)}
                            variant="outline"
                            size="sm"
                            className={`h-7 w-7 p-0 ${
                              darkMode ? 'hover:bg-gray-700' : ''
                            }`}
                            title="Edit"
                          >
                            <FaEdit className="text-sm" />
                          </Button>
                          <Button
                            onClick={() => deleteMedicine(medicine.id)}
                            variant="outline"
                            size="sm"
                            className={`h-7 w-7 p-0 ${
                              darkMode ? 'text-red-400 border-red-700 hover:bg-gray-700' : 'text-red-600 border-red-200 hover:bg-red-50'
                            }`}
                            title="Delete"
                          >
                            <FaTrash className="text-sm" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleMedicines.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-6 text-center">
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          No medicines found matching your criteria.
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
          Showing {visibleMedicines.length} of {medicines.length} medicines
        </div>
      </div>

      {/* Medicine Details Modal */}
      {showMedicineDetails && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {showEditForm ? 'Edit Medicine' : 'Medicine Details'} - {selectedMedicine.id}
                </h2>
                <button
                  onClick={() => setShowMedicineDetails(false)}
                  className={darkMode ? 'text-gray-400 hover:text-gray-200 p-1' : 'text-gray-400 hover:text-gray-600 p-1'}
                >
                  <FaTimes />
                </button>
              </div>
              
              {showEditForm ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Medicine Name</label>
                      <Input
                        type="text"
                        defaultValue={selectedMedicine.name}
                        className={getInputClasses()}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Generic Name</label>
                      <Input
                        type="text"
                        defaultValue={selectedMedicine.genericName}
                        className={getInputClasses()}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Batch Number</label>
                      <Input
                        type="text"
                        defaultValue={selectedMedicine.batchNumber}
                        className={getInputClasses()}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Manufacturer</label>
                      <Input
                        type="text"
                        defaultValue={selectedMedicine.manufacturer}
                        className={getInputClasses()}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Expiry Date</label>
                      <Input
                        type="date"
                        defaultValue={selectedMedicine.expiryDate}
                        className={getInputClasses()}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Category</label>
                      <select
                        defaultValue={selectedMedicine.category}
                        className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none ${getSelectClasses()}`}
                      >
                        {allCategories.map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Quantity</label>
                      <Input
                        type="number"
                        defaultValue={selectedMedicine.quantity}
                        className={getInputClasses()}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Unit</label>
                      <select
                        defaultValue={selectedMedicine.unit}
                        className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none ${getSelectClasses()}`}
                      >
                        <option value="tablets">Tablets</option>
                        <option value="bottles">Bottles</option>
                        <option value="tubes">Tubes</option>
                        <option value="vials">Vials</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Price Per Unit</label>
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={selectedMedicine.pricePerUnit}
                        className={getInputClasses()}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Stock Status</label>
                      <select
                        defaultValue={selectedMedicine.stockStatus}
                        className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none ${getSelectClasses()}`}
                      >
                        {allStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        // In a real app, you would collect form data here
                        const updatedMedicine = {
                          ...selectedMedicine,
                          // Update with form values
                        };
                        updateMedicine(updatedMedicine);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setShowEditForm(false)}
                      variant="outline"
                      className={`flex-1 text-sm h-9 ${
                        darkMode ? 'hover:bg-gray-700' : ''
                      }`}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Medicine Information</h3>
                      <div className={`p-3 rounded-md ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedMedicine.name}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Generic: {selectedMedicine.genericName}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Manufacturer & Batch</h3>
                      <div className={`p-3 rounded-md ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedMedicine.manufacturer}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Batch: {selectedMedicine.batchNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Expiry Date</h3>
                      <div className={`p-3 rounded-md ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {new Date(selectedMedicine.expiryDate).toLocaleDateString()}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {Math.floor((new Date(selectedMedicine.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Stock Information</h3>
                      <div className={`p-3 rounded-md ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <div className="flex justify-between">
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedMedicine.quantity} {selectedMedicine.unit}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedMedicine.stockStatus)}`}>
                            {selectedMedicine.stockStatus.replace('-', ' ')}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Last updated: {new Date(selectedMedicine.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Category</h3>
                      <div className={`p-3 rounded-md ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(selectedMedicine.category)}`}>
                          {selectedMedicine.category}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-sm font-medium mb-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Pricing</h3>
                      <div className={`p-3 rounded-md ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${selectedMedicine.pricePerUnit.toFixed(2)} per {selectedMedicine.unit.slice(0, -1)}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Total value: ${(selectedMedicine.pricePerUnit * selectedMedicine.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShowMedicineDetails(false)}
                      variant="outline"
                      className={`flex-1 text-sm h-9 ${
                        darkMode ? 'hover:bg-gray-700' : ''
                      }`}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => setShowEditForm(true)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
                    >
                      Edit Medicine
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineStock;