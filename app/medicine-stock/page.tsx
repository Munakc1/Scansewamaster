'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaSearch, FaFilter, FaFileUpload, FaFileDownload, FaTimes, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';

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
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'antibiotic':
        return 'bg-blue-100 text-blue-800';
      case 'analgesic':
        return 'bg-purple-100 text-purple-800';
      case 'antihistamine':
        return 'bg-indigo-100 text-indigo-800';
      case 'antacid':
        return 'bg-pink-100 text-pink-800';
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
            <h1 className="text-2xl font-bold text-gray-900">Medicine Stock Management</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage medicine inventory</p>
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
                  placeholder="Search medicines..."
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
                    {status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-9"
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading medicines...</p>
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
                      Medicine ID
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Generic Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleMedicines.map((medicine) => (
                    <tr key={medicine.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{medicine.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-900">{medicine.name}</div>
                        <div className="text-xs text-gray-500">{medicine.manufacturer}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-900">{medicine.genericName}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-900">{medicine.batchNumber}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-900">
                          {new Date(medicine.expiryDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.floor((new Date(medicine.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-gray-900">{medicine.quantity}</div>
                        <div className="text-xs text-gray-500 capitalize">{medicine.unit}</div>
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
                            className="h-7 w-7 p-0"
                            title="View"
                          >
                            <FaEye className="text-sm" />
                          </Button>
                          <Button
                            onClick={() => editMedicine(medicine)}
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            title="Edit"
                          >
                            <FaEdit className="text-sm" />
                          </Button>
                          <Button
                            onClick={() => deleteMedicine(medicine.id)}
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 border-red-200 hover:bg-red-50"
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
                      <td colSpan={9} className="px-4 py-6 text-center text-gray-500">
                        No medicines found matching your criteria.
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
          Showing {visibleMedicines.length} of {medicines.length} medicines
        </div>
      </div>

      {/* Medicine Details Modal */}
      {showMedicineDetails && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {showEditForm ? 'Edit Medicine' : 'Medicine Details'} - {selectedMedicine.id}
                </h2>
                <button
                  onClick={() => setShowMedicineDetails(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes />
                </button>
              </div>
              
              {showEditForm ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                      <Input
                        type="text"
                        defaultValue={selectedMedicine.name}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
                      <Input
                        type="text"
                        defaultValue={selectedMedicine.genericName}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                      <Input
                        type="text"
                        defaultValue={selectedMedicine.batchNumber}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                      <Input
                        type="text"
                        defaultValue={selectedMedicine.manufacturer}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <Input
                        type="date"
                        defaultValue={selectedMedicine.expiryDate}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        defaultValue={selectedMedicine.category}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <Input
                        type="number"
                        defaultValue={selectedMedicine.quantity}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <select
                        defaultValue={selectedMedicine.unit}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Unit</label>
                      <Input
                        type="number"
                        step="0.01"
                        defaultValue={selectedMedicine.pricePerUnit}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                      <select
                        defaultValue={selectedMedicine.stockStatus}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
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
                      className="flex-1 text-sm h-9"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Medicine Information</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium">{selectedMedicine.name}</p>
                        <p className="text-xs text-gray-500">Generic: {selectedMedicine.genericName}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Manufacturer & Batch</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium">{selectedMedicine.manufacturer}</p>
                        <p className="text-xs text-gray-500">Batch: {selectedMedicine.batchNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Expiry Date</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium">
                          {new Date(selectedMedicine.expiryDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.floor((new Date(selectedMedicine.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Stock Information</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            {selectedMedicine.quantity} {selectedMedicine.unit}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedMedicine.stockStatus)}`}>
                            {selectedMedicine.stockStatus.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {new Date(selectedMedicine.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(selectedMedicine.category)}`}>
                          {selectedMedicine.category}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Pricing</h3>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium">
                          ${selectedMedicine.pricePerUnit.toFixed(2)} per {selectedMedicine.unit.slice(0, -1)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Total value: ${(selectedMedicine.pricePerUnit * selectedMedicine.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShowMedicineDetails(false)}
                      variant="outline"
                      className="flex-1 text-sm h-9"
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