'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaUser, FaEdit, FaTrash, FaTimes, FaUserInjured, FaEye } from 'react-icons/fa';
import { MdAdd, MdFileUpload, MdDownload } from 'react-icons/md';

interface Patient {
  id: string;
  fullName: string;
  profilePhoto: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  status: string;
  admissionDate: string;
  condition: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string[];
  location: string;
  assignedDoctor: string;
}

const dummyPatients: Patient[] = [
  {
    id: '1',
    fullName: 'John Doe',
    profilePhoto: '',
    age: 45,
    gender: 'Male',
    email: 'john.doe@example.com',
    phone: '+1-555-123-4567',
    status: 'admitted',
    admissionDate: '2023-05-15',
    condition: 'Diabetes Management',
    emergencyContact: '+1-555-987-6543',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Shellfish'],
    location: 'Room 101, Ward A',
    assignedDoctor: 'Dr. Sarah Wilson'
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    profilePhoto: '',
    age: 32,
    gender: 'Female',
    email: 'jane.smith@example.com',
    phone: '+1-555-234-5678',
    status: 'stable',
    admissionDate: '2023-06-01',
    condition: 'Hypertension',
    emergencyContact: '+1-555-876-5432',
    bloodType: 'B-',
    allergies: ['Latex'],
    location: 'Room 205, Ward B',
    assignedDoctor: 'Dr. Michael Johnson'
  },
  {
    id: '3',
    fullName: 'Robert Brown',
    profilePhoto: '',
    age: 58,
    gender: 'Male',
    email: 'robert.brown@example.com',
    phone: '+1-555-345-6789',
    status: 'critical',
    admissionDate: '2023-06-10',
    condition: 'Pneumonia',
    emergencyContact: '+1-555-765-4321',
    bloodType: 'O+',
    allergies: ['Peanuts', 'Sulfa'],
    location: 'ICU Room 3',
    assignedDoctor: 'Dr. Emily Davis'
  },
  {
    id: '4',
    fullName: 'Alice Johnson',
    profilePhoto: '',
    age: 28,
    gender: 'Female',
    email: 'alice.johnson@example.com',
    phone: '+1-555-456-7890',
    status: 'discharged',
    admissionDate: '2023-05-20',
    condition: 'Appendectomy Recovery',
    emergencyContact: '+1-555-654-3210',
    bloodType: 'AB+',
    allergies: [],
    location: '',
    assignedDoctor: 'Dr. James Miller'
  }
];

const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>(dummyPatients);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: '',
    status: 'admitted',
    condition: '',
    emergencyContact: '',
    bloodType: 'O+',
    allergies: '',
    location: '',
    assignedDoctor: ''
  });

  // View patient details
  const handleViewPatient = (patient: Patient) => {
    setCurrentPatient(patient);
    setShowViewModal(true);
  };

  // Edit patient - open form with current data
  const handleEditPatient = (patient: Patient) => {
    setCurrentPatient(patient);
    setFormData({
      fullName: patient.fullName,
      age: patient.age.toString(),
      gender: patient.gender,
      email: patient.email,
      phone: patient.phone,
      status: patient.status,
      condition: patient.condition,
      emergencyContact: patient.emergencyContact,
      bloodType: patient.bloodType,
      allergies: patient.allergies.join(', '),
      location: patient.location,
      assignedDoctor: patient.assignedDoctor
    });
    setShowEditModal(true);
  };

  // Delete patient
  const handleDeletePatient = (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(patient => patient.id !== id));
    }
  };

  // Save edited patient
  const handleSaveEdit = () => {
    if (!currentPatient) return;
    
    const updatedPatients = patients.map(patient => {
      if (patient.id === currentPatient.id) {
        return {
          ...patient,
          fullName: formData.fullName,
          age: parseInt(formData.age) || 0,
          gender: formData.gender,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          condition: formData.condition,
          emergencyContact: formData.emergencyContact,
          bloodType: formData.bloodType,
          allergies: formData.allergies.split(',').map(s => s.trim()).filter(s => s),
          location: formData.location,
          assignedDoctor: formData.assignedDoctor
        };
      }
      return patient;
    });
    
    setPatients(updatedPatients);
    setShowEditModal(false);
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
  const handleAddPatient = () => {
    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      fullName: formData.fullName,
      profilePhoto: '',
      age: parseInt(formData.age) || 0,
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      admissionDate: new Date().toISOString().split('T')[0],
      condition: formData.condition,
      emergencyContact: formData.emergencyContact,
      bloodType: formData.bloodType,
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(s => s),
      location: formData.location,
      assignedDoctor: formData.assignedDoctor
    };

    setPatients([...patients, newPatient]);
    setShowAddForm(false);
    setFormData({
      fullName: '',
      age: '',
      gender: 'Male',
      email: '',
      phone: '',
      status: 'admitted',
      condition: '',
      emergencyContact: '',
      bloodType: 'O+',
      allergies: '',
      location: '',
      assignedDoctor: ''
    });
  };

  // Export patient data
  const handleExport = (format: 'csv' | 'json') => {
    try {
      let data: string;
      if (format === 'csv') {
        const headers = Object.keys(dummyPatients[0]).join(',');
        const rows = patients.map(patient => 
          Object.values({
            ...patient,
            allergies: patient.allergies.join(', '),
            age: patient.age.toString()
          }).map(value => `"${value}"`).join(',')
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
      let importedPatients: Patient[] = [];

      if (file.name.endsWith('.json')) {
        importedPatients = JSON.parse(content);
      } else if (file.name.endsWith('.csv')) {
        const lines = content.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        importedPatients = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',');
          const patient: any = {};
          
          headers.forEach((header, index) => {
            let value = values[index]?.replace(/^"|"$/g, '').trim() || '';
            
            // Handle different field types appropriately
            switch (header) {
              case 'allergies':
                patient[header] = value ? value.split(',').map(s => s.trim()).filter(s => s) : [];
                break;
              case 'age':
                patient[header] = parseInt(value) || 0;
                break;
              case 'id':
              case 'fullName':
              case 'profilePhoto':
              case 'gender':
              case 'email':
              case 'phone':
              case 'status':
              case 'admissionDate':
              case 'condition':
              case 'emergencyContact':
              case 'bloodType':
              case 'location':
              case 'assignedDoctor':
                patient[header] = value;
                break;
              default:
                // Ignore unknown headers
                break;
            }
          });
          
          return patient as Patient;
        });
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
    const matchesSearch =
      patient.fullName.toLowerCase().includes(q) ||
      patient.condition.toLowerCase().includes(q) ||
      patient.assignedDoctor.toLowerCase().includes(q) ||
      patient.location.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === 'all' ||
      patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const allStatuses = Array.from(
    new Set(patients.map((p) => p.status))
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'admitted':
        return 'bg-blue-100 text-blue-800';
      case 'discharged':
        return 'bg-green-100 text-green-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'stable':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage and view all patient records</p>
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
              className="border-gray-300 text-xs sm:text-sm p-1 sm:p-2"
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
              className="border-gray-300 text-xs sm:text-sm p-1 sm:p-2"
              size="sm"
            >
              <MdDownload className="mr-1" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8 sm:h-10"
              >
                <option value="all">All Statuses</option>
                {allStatuses.map((status) => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">Loading patients...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-600 text-xs sm:text-sm">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visiblePatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUserInjured className="text-blue-600 text-sm" />
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px]">
                              {patient.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {patient.gender}, {patient.age} yrs
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 truncate max-w-[100px]">
                          {patient.condition}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900 truncate max-w-[100px]">
                        {patient.location}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-900 truncate max-w-[100px]">
                        {patient.assignedDoctor}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleViewPatient(patient)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <FaEye className="text-xs" />
                          </button>
                          <button 
                            onClick={() => handleEditPatient(patient)}
                            className="text-green-600 hover:text-green-800 p-1 rounded-md hover:bg-green-50 transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button 
                            onClick={() => handleDeletePatient(patient.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
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
                      <td colSpan={6} className="px-3 py-4 text-center text-xs sm:text-sm text-gray-500">
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
        <div className="mt-4 text-center text-xs sm:text-sm text-gray-600">
          Showing {visiblePatients.length} of {patients.length} patients
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add New Patient</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <Input
                      name="age"
                      type="number"
                      min="0"
                      value={formData.age}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                      placeholder="45"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8 sm:h-10"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                      placeholder="john.doe@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                      placeholder="+1-555-0123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <Input
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                    placeholder="+1-555-0124"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <Input
                    name="condition"
                    value={formData.condition}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                    placeholder="Diabetes Management"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Blood Type
                    </label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8 sm:h-10"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8 sm:h-10"
                    >
                      <option value="admitted">Admitted</option>
                      <option value="discharged">Discharged</option>
                      <option value="critical">Critical</option>
                      <option value="stable">Stable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  <Input
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                    placeholder="Penicillin, Shellfish"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                    placeholder="Room 101, Ward A"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Assigned Doctor
                  </label>
                  <Input
                    name="assignedDoctor"
                    value={formData.assignedDoctor}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                    placeholder="Dr. Sarah Wilson"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 h-8 sm:h-10 text-xs sm:text-sm"
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
      )}

      {/* View Patient Modal */}
      {showViewModal && currentPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Patient Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <FaUserInjured className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-900">{currentPatient.fullName}</h3>
                    <p className="text-xs sm:text-sm text-gray-500">ID: {currentPatient.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700">Age/Gender</h4>
                    <p className="text-xs sm:text-sm">{currentPatient.age} yrs, {currentPatient.gender}</p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700">Status</h4>
                    <p className="text-xs sm:text-sm capitalize">{currentPatient.status}</p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700">Blood Type</h4>
                    <p className="text-xs sm:text-sm">{currentPatient.bloodType}</p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700">Location</h4>
                    <p className="text-xs sm:text-sm">{currentPatient.location}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700">Condition</h4>
                  <p className="text-xs sm:text-sm">{currentPatient.condition}</p>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700">Allergies</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentPatient.allergies.length > 0 ? (
                      currentPatient.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800"
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs sm:text-sm text-gray-500">None</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700">Contact</h4>
                    <p className="text-xs sm:text-sm">{currentPatient.phone}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{currentPatient.email}</p>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700">Emergency Contact</h4>
                    <p className="text-xs sm:text-sm">{currentPatient.emergencyContact}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-gray-700">Assigned Doctor</h4>
                  <p className="text-xs sm:text-sm">{currentPatient.assignedDoctor}</p>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Edit Patient</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <Input
                      name="age"
                      type="number"
                      min="0"
                      value={formData.age}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8 sm:h-10"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <Input
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <Input
                    name="condition"
                    value={formData.condition}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Blood Type
                    </label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8 sm:h-10"
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8 sm:h-10"
                    >
                      <option value="admitted">Admitted</option>
                      <option value="discharged">Discharged</option>
                      <option value="critical">Critical</option>
                      <option value="stable">Stable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  <Input
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                    placeholder="Separate with commas"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Assigned Doctor
                  </label>
                  <Input
                    name="assignedDoctor"
                    value={formData.assignedDoctor}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 h-8 sm:h-10 text-xs sm:text-sm"
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