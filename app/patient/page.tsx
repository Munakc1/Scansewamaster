'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaUser, FaEdit, FaTrash, FaTimes, FaUserInjured, FaEye } from 'react-icons/fa';
import { MdAdd, MdFileUpload, MdDownload } from 'react-icons/md';
import { useTheme } from '../components/ThemeContext';
import { fetchPatients, createPatient, updatePatient, deletePatient, Patient } from '@/lib/api/patients';

interface Address {
  street: string;
  city: string;
  state: string;
  pinCode: string;
}

interface MedicalHistoryItem {
  condition: string;
  diagnosedDate: string;
  _id: string;
}

interface PatientData {
  _id: string;
  patientId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  allergies: string;
  address: Address;
  medicalHistory: MedicalHistoryItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const PatientManagement = () => {
  const { darkMode } = useTheme();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    allergies: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    password: ''
  });

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        // Assuming fetchPatients returns Patient[]; map to PatientData
        const data = await fetchPatients();
        const mappedPatients: PatientData[] = data.map((patient: any) => ({
          _id: patient._id ?? '',
          patientId: patient.patientId ?? '',
          name: patient.name ?? '',
          email: patient.email ?? '',
          phone: patient.phone ?? '',
          age: patient.age ?? 0,
          allergies: patient.allergies ?? '',
          address: {
            street: patient.address?.street ?? '',
            city: patient.address?.city ?? '',
            state: patient.address?.state ?? '',
            pinCode: patient.address?.pinCode ?? ''
          },
          medicalHistory: Array.isArray(patient.medicalHistory)
            ? patient.medicalHistory.map((mh: any) => ({
                condition: mh.condition ?? '',
                diagnosedDate: mh.diagnosedDate ?? '',
                _id: mh._id ?? ''
              }))
            : [],
          createdAt: patient.createdAt ?? '',
          updatedAt: patient.updatedAt ?? '',
          __v: patient.__v ?? 0
        }));
        setPatients(mappedPatients);
      } catch (err) {
        setError('Failed to load patients');
        console.error('Error loading patients:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  // View patient details
  const handleViewPatient = (patient: PatientData) => {
    setCurrentPatient(patient);
    setShowViewModal(true);
  };

  // Edit patient - open form with current data
  const handleEditPatient = (patient: PatientData) => {
    setCurrentPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      email: patient.email,
      phone: patient.phone,
      allergies: patient.allergies,
      street: patient.address.street,
      city: patient.address.city,
      state: patient.address.state,
      pinCode: patient.address.pinCode,
      password: ''
    });
    setShowEditModal(true);
  };

  // Delete patient
  const handleDeletePatient = async (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
        setPatients(patients.filter(patient => patient._id !== id));
      } catch (err) {
        setError('Failed to delete patient');
        console.error('Error deleting patient:', err);
      }
    }
  };

  // Save edited patient
  const handleSaveEdit = async () => {
    if (!currentPatient) return;
    
    try {
      const updatedPatient = await updatePatient(currentPatient._id, {
        name: formData.name,
        age: parseInt(formData.age) || 0,
        email: formData.email,
        phone: formData.phone,
        allergies: formData.allergies,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode
        }
      });
      
      setPatients(patients.map(patient => 
        patient._id === currentPatient._id ? updatedPatient : patient
      ));
      setShowEditModal(false);
    } catch (err) {
      setError('Failed to update patient');
      console.error('Error updating patient:', err);
    }
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

// Add new patient
const handleAddPatient = async () => {
  try {
    const newPatient = await createPatient({
      name: formData.name,
      age: parseInt(formData.age) || 0,
      email: formData.email,
      phone: formData.phone,
      allergies: formData.allergies,
      password: formData.password, // ✅ Add this
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode
      },
      medicalHistory: []
    });

    setPatients([...patients, newPatient]);
    setFormData({
      name: '',
      age: '',
      email: '',
      phone: '',
      allergies: '',
      street: '',
      city: '',
      state: '',
      pinCode: '',
      password: ''
    });
    setShowAddForm(false);
  } catch (err) {
    setError('Failed to add patient');
    console.error('Error adding patient:', err);
  }
};

  // Export patient data
  const handleExport = (format: 'csv' | 'json') => {
    try {
      let data: string;
      if (format === 'csv') {
        const headers = ['ID', 'Name', 'Age', 'Email', 'Phone', 'Allergies', 'Address', 'Medical History'].join(',');
        const rows = patients.map(patient => 
          [
            patient.patientId,
            patient.name,
            patient.age.toString(),
            patient.email,
            patient.phone,
            patient.allergies,
            `${patient.address.street}, ${patient.address.city}, ${patient.address.state} ${patient.address.pinCode}`,
            patient.medicalHistory.map(mh => `${mh.condition} (${new Date(mh.diagnosedDate).toLocaleDateString()}`).join('; ')
          ].map(value => `"${value}"`).join(',')
        ).join('\n');
        data = `${headers}\n${rows}`;
      } else {
        data = JSON.stringify(patients, null, 2);
      }

      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patients-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to export data');
      console.error('Export error:', error);
    }
  };

  // Import patient data
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let importedPatients: PatientData[] = [];

        if (file.name.endsWith('.json')) {
          importedPatients = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          // Implement CSV parsing logic if needed
          setError('CSV import not fully implemented');
          return;
        }

        if (Array.isArray(importedPatients) && importedPatients.length > 0) {
          setPatients(importedPatients);
        } else {
          setError('Invalid file format or empty data');
        }
      } catch (error) {
        setError('Failed to parse imported file');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  const visiblePatients = patients.filter((patient) => {
    const q = search.toLowerCase();
    return (
      patient.name.toLowerCase().includes(q) ||
      patient.email.toLowerCase().includes(q) ||
      patient.phone.toLowerCase().includes(q) ||
      patient.address.city.toLowerCase().includes(q) ||
      patient.address.state.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Patient Management</h1>
            <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage and view all patient records
            </p>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm p-1 sm:p-2"
              size="sm"
            >
              <MdAdd className="mr-1" /> Add Patient
            </Button>
            <Button 
              onClick={() => document.getElementById('file-import')?.click()}
              variant="outline"
              className={`border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} text-xs sm:text-sm p-1 sm:p-2`}
              size="sm"
            >
              <MdFileUpload className="mr-1" /> Import
            </Button>
            <input
              id="file-import"
              type="file"
              accept=".csv,.json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            <Button 
              onClick={() => handleExport('csv')}
              variant="outline"
              className={`border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} text-xs sm:text-sm p-1 sm:p-2`}
              size="sm"
            >
              <MdDownload className="mr-1" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Search Filter */}
        <div className={`rounded-lg shadow-sm border p-3 sm:p-4 mb-4 mx-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className={`rounded-lg shadow-sm border overflow-hidden mx-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-2 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading patients...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-600 text-xs sm:text-sm">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Patient
                    </th>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Contact
                    </th>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Address
                    </th>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Medical History
                    </th>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {visiblePatients.map((patient) => (
                    <tr key={patient._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'
                            }`}>
                              <FaUserInjured className="text-sm" />
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className={`text-xs sm:text-sm font-medium truncate max-w-[120px] ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {patient.name}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {patient.age} yrs
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {patient.email}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {patient.phone}
                        </div>
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        <div className="truncate max-w-[150px]">
                          {patient.address.street}, {patient.address.city}, {patient.address.state} {patient.address.pinCode}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {patient.medicalHistory.length > 0 ? (
                            patient.medicalHistory.slice(0, 2).map((history, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {history.condition}
                              </span>
                            ))
                          ) : (
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>None</span>
                          )}
                          {patient.medicalHistory.length > 2 && (
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              +{patient.medicalHistory.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleViewPatient(patient)}
                            className={`p-1 rounded-md transition-colors ${
                              darkMode 
                                ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-600' 
                                : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                            }`}
                            title="View"
                          >
                            <FaEye className="text-xs" />
                          </button>
                          <button 
                            onClick={() => handleEditPatient(patient)}
                            className={`p-1 rounded-md transition-colors ${
                              darkMode 
                                ? 'text-green-400 hover:text-green-300 hover:bg-gray-600' 
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                            }`}
                            title="Edit"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button 
                            onClick={() => handleDeletePatient(patient._id)}
                            className={`p-1 rounded-md transition-colors ${
                              darkMode 
                                ? 'text-red-400 hover:text-red-300 hover:bg-gray-600' 
                                : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                            }`}
                            title="Delete"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visiblePatients.length === 0 && (
                    <tr>
                      <td colSpan={5} className={`px-3 py-4 text-center text-xs sm:text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        No patients found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className={`mt-4 text-center text-xs sm:text-sm mx-4 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Showing {visiblePatients.length} of {patients.length} patients
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-[60]">
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Add New Patient</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Age
                    </label>
                    <Input
                      name="age"
                      type="number"
                      min="0"
                      value={formData.age}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="45"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="john.doe@email.com"
                  />
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Phone
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="+1-555-0123"
                  />
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Allergies
                  </label>
                  <Input
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="Penicillin, Shellfish"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Street
                    </label>
                    <Input
                      name="street"
                      value={formData.street}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      City
                    </label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="New York"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      State
                    </label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      ZIP Code
                    </label>
                    <Input
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="10001"
                    />
                  </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Password *
                  </label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="Enter password"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className={`flex-1 h-8 sm:h-10 text-xs sm:text-sm ${
                      darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddPatient}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-10 text-xs sm:text-sm"
                  >
                    Add Patient
                  </Button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Patient Modal */}
      {showViewModal && currentPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-[60]">
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Patient Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className={darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-3 ${
                    darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <FaUserInjured className="text-xl" />
                  </div>
                  <div>
                    <h3 className={`text-sm sm:text-base font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{currentPatient.name}</h3>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>ID: {currentPatient.patientId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Age</h4>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>{currentPatient.age} years</p>
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Contact</h4>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>{currentPatient.phone}</p>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{currentPatient.email}</p>
                  </div>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Allergies</h4>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>{currentPatient.allergies || 'None'}</p>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Address</h4>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {currentPatient.address.street}<br />
                    {currentPatient.address.city}, {currentPatient.address.state} {currentPatient.address.pinCode}
                  </p>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Medical History</h4>
                  {currentPatient.medicalHistory.length > 0 ? (
                    <div className="space-y-2 mt-2">
                      {currentPatient.medicalHistory.map((history, idx) => (
                        <div key={idx} className={`p-2 rounded ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                          <p className={`text-xs sm:text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>
                            <span className="font-medium">{history.condition}</span> - {new Date(history.diagnosedDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>No medical history recorded</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => setShowViewModal(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-10 text-xs sm:text-sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditModal && currentPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-[60]">
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Edit Patient</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Age
                    </label>
                    <Input
                      name="age"
                      type="number"
                      min="0"
                      value={formData.age}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                  />
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Phone
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                  />
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Allergies
                  </label>
                  <Input
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="Separate with commas"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Street
                    </label>
                    <Input
                      name="street"
                      value={formData.street}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      City
                    </label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      State
                    </label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      ZIP Code
                    </label>
                    <Input
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className={`flex-1 h-8 sm:h-10 text-xs sm:text-sm ${
                      darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-10 text-xs sm:text-sm"
                  >
                    Save Changes
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

export default PatientManagement;