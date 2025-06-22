'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaSearch, FaFilter, FaFileUpload, FaFileDownload, FaTimes, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import { useTheme } from '../components/ThemeContext';
import { 
  fetchMedicines, 
  createMedicine, 
  updateMedicine as apiUpdateMedicine, 
  deleteMedicine as apiDeleteMedicine,
  Medicine as ApiMedicine
} from '@/lib/api/medicines';

// Define the Medicine interface to match the API data structure
interface Medicine {
  id: string; // Maps to medicineId
  _id: string; // Internal MongoDB ID
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  pharmacyId: string;
  image: string;
  requiresPrescription: boolean;
  status: string;
  createdAt: string;
  updatedAt: string; // Maps to lastUpdated
}

const MedicineStock = () => {
  const { darkMode } = useTheme();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showMedicineDetails, setShowMedicineDetails] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, 'id' | '_id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    brand: '',
    category: 'OTC',
    description: '',
    price: 0,
    stock: 0,
    pharmacyId: '',
    image: '',
    requiresPrescription: false,
    status: 'Published',
  });

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true);
        const data = await fetchMedicines();
        // Map API data to Medicine interface, ensuring id is set to medicineId
        const mappedData = data.map((item: any) => ({
          ...item,
          id: item.medicineId,
          updatedAt: item.updatedAt || new Date().toISOString(),
        }));
        setMedicines(mappedData);
        setError(null);
      } catch (err) {
        setError('Failed to load medicines. Using fallback data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMedicines();
  }, []);

  const handleExport = (type: 'csv' | 'json') => {
    const dataToExport = visibleMedicines.map(medicine => ({
      'Medicine ID': medicine.id,
      'Name': medicine.name,
      'Brand': medicine.brand,
      'Category': medicine.category,
      'Description': medicine.description,
      'Price': `$${medicine.price.toFixed(2)}`,
      'Stock': medicine.stock,
      'Pharmacy ID': medicine.pharmacyId,
      'Image': medicine.image,
      'Requires Prescription': medicine.requiresPrescription ? 'Yes' : 'No',
      'Status': medicine.status,
      'Last Updated': new Date(medicine.updatedAt).toLocaleString(),
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
    input.onchange = async (e) => {
      const inputElem = e.target as HTMLInputElement;
      const file = inputElem.files?.[0];
      if (file) {
        try {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const content = reader?.result as string;
              if (file.name.endsWith('.json')) {
                const importedData = JSON.parse(content);
                // Process imported data
                const newMedicines = importedData.map((item: any) => ({
                  ...item,
                  id: item.medicineId || `MED-${Math.floor(1000 + Math.random() * 9000)}`,
                  _id: '',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  status: (item.status === 'Published' || item.status === 'Draft' || item.status === 'Discontinued')
                    ? item.status
                    : 'Published',
                }));

                // Batch create medicines
                await Promise.all(
                  newMedicines.map((med: Medicine) =>
                    createMedicine({
                      ...med,
                      status: med.status as 'Published' | 'Draft' | 'Discontinued',
                    })
                  )
                );
                setMedicines([...medicines, ...newMedicines]);
                alert(`${newMedicines.length} medicines imported successfully`);
              } else if (file.name.endsWith('.csv')) {
                // Handle CSV import
                alert('CSV import would be processed here');
              }
            } catch (err) {
              console.error('Error importing file:', err);
              alert('Error importing file. Please check the format.');
            }
          };
          reader.readAsText(file);
        } catch (err) {
          console.error('Import error:', err);
          setError('Failed to import medicines');
        }
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

  const deleteMedicine = async (medicineId: string) => {
    if (confirm('Are you sure you want to delete this medicine from stock?')) {
      try {
        await apiDeleteMedicine(medicineId);
        setMedicines(medicines.filter(medicine => medicine.id !== medicineId));
        setShowMedicineDetails(false);
      } catch (err) {
        console.error('Error deleting medicine:', err);
        setError('Failed to delete medicine');
      }
    }
  };

  const handleUpdateMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine) return;

    try {
      const updated = await apiUpdateMedicine(selectedMedicine.id, {
        ...selectedMedicine,
        status: selectedMedicine.status as 'Published' | 'Draft' | 'Discontinued',
        updatedAt: new Date().toISOString(),
      });
      // Map the API response to your local Medicine interface
      const updatedMapped: Medicine = {
        ...updated,
        id: updated.medicineId ?? updated._id, // fallback if already present
        _id: updated._id ?? '',
        name: updated.name,
        brand: updated.brand,
        category: updated.category,
        description: updated.description,
        price: updated.price,
        stock: updated.stock,
        pharmacyId: updated.pharmacyId,
        image: updated.image ?? '',
        requiresPrescription: updated.requiresPrescription,
        status: updated.status,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt || new Date().toISOString(),
      };
      setMedicines(medicines.map(medicine => 
        medicine.id === updatedMapped.id ? updatedMapped : medicine
      ));
      setShowEditForm(false);
      setShowMedicineDetails(false);
    } catch (err) {
      console.error('Error updating medicine:', err);
      setError('Failed to update medicine');
    }
  };

  const handleCreateMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createMedicine({
        ...newMedicine,
        status: newMedicine.status as 'Published' | 'Draft' | 'Discontinued',
      });
      // Map API response to local Medicine interface
      const createdMapped: Medicine = {
        ...created,
        id: created.medicineId ?? `MED-${Math.floor(1000 + Math.random() * 9000)}`,
        _id: created._id ?? '',
        name: created.name,
        brand: created.brand,
        category: created.category,
        description: created.description,
        price: created.price,
        stock: created.stock,
        pharmacyId: created.pharmacyId,
        image: created.image ?? '',
        requiresPrescription: created.requiresPrescription,
        status: created.status,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt || new Date().toISOString(),
      };
      setMedicines([...medicines, createdMapped]);
      setShowAddForm(false);
      setNewMedicine({
        name: '',
        brand: '',
        category: 'OTC',
        description: '',
        price: 0,
        stock: 0,
        pharmacyId: '',
        image: '',
        requiresPrescription: false,
        status: 'Published',
      });
    } catch (err) {
      console.error('Error creating medicine:', err);
      setError('Failed to create medicine');
    }
  };

  const visibleMedicines = medicines.filter((medicine) => {
    const q = search.toLowerCase();
    const matchesSearch =
      medicine.name.toLowerCase().includes(q) ||
      medicine.brand.toLowerCase().includes(q) ||
      medicine.description.toLowerCase().includes(q) ||
      medicine.id.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'all' ||
      medicine.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory =
      categoryFilter === 'all' ||
      medicine.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const allStatuses = ['Published', 'Draft']; // Adjusted based on API data
  const allCategories = ['OTC', 'Prescription']; // Adjusted based on API data

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'draft':
        return darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      default:
        return darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'otc':
        return darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800';
      case 'prescription':
        return darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800';
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
              onClick={() => setShowAddForm(true)}
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

        {error && (
          <div className={`p-3 mb-4 rounded-md ${
            darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'
          }`}>
            {error}
          </div>
        )}

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
                  <option key={status} value={status.toLowerCase()}>
                    {status}
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
                  <option key={category} value={category.toLowerCase()}>
                    {category}
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
                      Brand
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Category
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Stock
                    </th>
                    <th className={`px-4 py-3 text-left font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Price
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
                  {visibleMedicines.map((medicine) => (
                    <tr key={medicine.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{medicine.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>{medicine.name}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{medicine.description}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>{medicine.brand}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(medicine.category)}`}>
                          {medicine.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>{medicine.stock}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={darkMode ? 'text-white' : 'text-gray-900'}>${medicine.price.toFixed(2)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(medicine.status)}`}>
                          {medicine.status}
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
                      <td colSpan={8} className="px-4 py-6 text-center">
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

        {/* Add Medicine Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className={`rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
            }`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Add New Medicine
                  </h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className={darkMode ? 'text-gray-400 hover:text-gray-200 p-1' : 'text-gray-400 hover:text-gray-600 p-1'}
                  >
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleCreateMedicine}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Medicine Name</label>
                        <Input
                          type="text"
                          value={newMedicine.name}
                          onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                          className={getInputClasses()}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Brand</label>
                        <Input
                          type="text"
                          value={newMedicine.brand}
                          onChange={(e) => setNewMedicine({ ...newMedicine, brand: e.target.value })}
                          className={getInputClasses()}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Category</label>
                        <select
                          value={newMedicine.category}
                          onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
                          className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none ${getSelectClasses()}`}
                        >
                          {allCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Description</label>
                        <Input
                          type="text"
                          value={newMedicine.description}
                          onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
                          className={getInputClasses()}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Price</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newMedicine.price}
                          onChange={(e) => setNewMedicine({ ...newMedicine, price: parseFloat(e.target.value) || 0 })}
                          className={getInputClasses()}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Stock</label>
                        <Input
                          type="number"
                          value={newMedicine.stock}
                          onChange={(e) => setNewMedicine({ ...newMedicine, stock: parseInt(e.target.value) || 0 })}
                          className={getInputClasses()}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Pharmacy ID</label>
                        <Input
                          type="text"
                          value={newMedicine.pharmacyId}
                          onChange={(e) => setNewMedicine({ ...newMedicine, pharmacyId: e.target.value })}
                          className={getInputClasses()}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Image URL</label>
                        <Input
                          type="text"
                          value={newMedicine.image}
                          onChange={(e) => setNewMedicine({ ...newMedicine, image: e.target.value })}
                          className={getInputClasses()}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Requires Prescription</label>
                        <select
                          value={newMedicine.requiresPrescription ? 'Yes' : 'No'}
                          onChange={(e) => setNewMedicine({ ...newMedicine, requiresPrescription: e.target.value === 'Yes' })}
                          className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none ${getSelectClasses()}`}
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Status</label>
                        <select
                          value={newMedicine.status}
                          onChange={(e) => setNewMedicine({ ...newMedicine, status: e.target.value })}
                          className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none ${getSelectClasses()}`}
                        >
                          {allStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
                      >
                        Add Medicine
                      </Button>
                      <Button
                        onClick={() => setShowAddForm(false)}
                        type="button"
                        variant="outline"
                        className={`flex-1 text-sm h-9 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

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
                  <form onSubmit={handleUpdateMedicine}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Medicine Name</label>
                          <Input
                            type="text"
                            value={selectedMedicine.name}
                            onChange={(e) => setSelectedMedicine({
                              ...selectedMedicine,
                              name: e.target.value
                            })}
                            className={getInputClasses()}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Brand</label>
                          <Input
                            type="text"
                            value={selectedMedicine.brand}
                            onChange={(e) => setSelectedMedicine({
                              ...selectedMedicine,
                              brand: e.target.value
                            })}
                            className={getInputClasses()}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Category</label>
                          <select
                            value={selectedMedicine.category}
                            onChange={(e) => setSelectedMedicine({
                              ...selectedMedicine,
                              category: e.target.value
                            })}
                            className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none ${getSelectClasses()}`}
                          >
                            {allCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Description</label>
                          <Input
                            type="text"
                            value={selectedMedicine.description}
                            onChange={(e) => setSelectedMedicine({
                              ...selectedMedicine,
                              description: e.target.value
                            })}
                            className={getInputClasses()}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Price</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={selectedMedicine.price}
                            onChange={(e) => setSelectedMedicine({
                              ...selectedMedicine,
                              price: parseFloat(e.target.value) || 0
                            })}
                            className={getInputClasses()}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Stock</label>
                          <Input
                            type="number"
                            value={selectedMedicine.stock}
                            onChange={(e) => setSelectedMedicine({
                              ...selectedMedicine,
                              stock: parseInt(e.target.value) || 0
                            })}
                            className={getInputClasses()}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Pharmacy ID</label>
                          <Input
                            type="text"
                            value={selectedMedicine.pharmacyId}
                            onChange={(e) => setSelectedMedicine({
                              ...selectedMedicine,
                              pharmacyId: e.target.value
                            })}
                            className={getInputClasses()}
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Image URL</label>
                          <Input
                            type="text"
                            value={selectedMedicine.image}
                            onChange={(e) => setSelectedMedicine({
                              ...selectedMedicine,
                              image: e.target.value
                            })}
                            className={getInputClasses()}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Requires Prescription</label>
                          <select
                            value={selectedMedicine.requiresPrescription ? 'Yes' : 'No'}
                            onChange={(e) => setSelectedMedicine({
                              ...selectedMedicine,
                              requiresPrescription: e.target.value === 'Yes'
                            })}
                            className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none ${getSelectClasses()}`}
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>Status</label>
                          <select
                            value={selectedMedicine.status}
                            onChange={(e) => setSelectedMedicine({
                              ...selectedMedicine,
                              status: e.target.value
                            })}
                            className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none ${getSelectClasses()}`}
                          >
                            {allStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm h-9"
                        >
                          Save Changes
                        </Button>
                        <Button
                          onClick={() => setShowEditForm(false)}
                          type="button"
                          variant="outline"
                          className={`flex-1 text-sm h-9 ${
                            darkMode ? 'hover:bg-gray-700' : ''
                          }`}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
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
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Description: {selectedMedicine.description}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className={`text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Brand & Pharmacy</h3>
                        <div className={`p-3 rounded-md ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedMedicine.brand}</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pharmacy ID: {selectedMedicine.pharmacyId}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className={`text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>Stock Information</h3>
                        <div className={`p-3 rounded-md ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <div className="flex justify-between">
                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selectedMedicine.stock} units
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedMedicine.status)}`}>
                              {selectedMedicine.status}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Last updated: {new Date(selectedMedicine.updatedAt).toLocaleString()}
                          </p>
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
                            ${selectedMedicine.price.toFixed(2)} per unit
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Total value: ${(selectedMedicine.price * selectedMedicine.stock).toFixed(2)}
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
                        }`}>Prescription</h3>
                        <div className={`p-3 rounded-md ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedMedicine.requiresPrescription ? 'Required' : 'Not Required'}
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
    </div>
  );
};

export default MedicineStock;