'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaUserMd, FaEdit, FaTrash, FaTimes, FaEye } from 'react-icons/fa';
import { MdAdd, MdFileUpload, MdDownload, MdFilterList } from 'react-icons/md';
import { useTheme } from '../components/ThemeContext';

interface Doctor {
  id: string;
  fullName: string;
  profilePhoto: string;
  yearsOfExperience: number;
  clinicName: string;
  phone: string;
  email: string;
  status: string;
  specializations: string[];
  city: string;
  registrationNumber: string;
  consultationFees: {
    inClinic: number;
    online: number;
  };
}

const DoctorDetails = () => {
  const { darkMode } = useTheme();
  
  // Dummy data
  const dummyDoctors: Doctor[] = [
    {
      id: '1',
      fullName: 'Dr. Rajesh Kumar',
      profilePhoto: '/placeholder.jpg',
      yearsOfExperience: 12,
      clinicName: 'City Health Care',
      phone: '+919876543210',
      email: 'dr.rajesh@example.com',
      status: 'verified',
      specializations: ['Cardiology', 'Internal Medicine'],
      city: 'Mumbai',
      registrationNumber: 'MHMC12345',
      consultationFees: {
        inClinic: 800,
        online: 600
      }
    },
    {
      id: '2',
      fullName: 'Dr. Priya Sharma',
      profilePhoto: '/placeholder.jpg',
      yearsOfExperience: 8,
      clinicName: 'Sharma Clinic',
      phone: '+919876543211',
      email: 'dr.priya@example.com',
      status: 'active',
      specializations: ['Pediatrics', 'General Medicine'],
      city: 'Delhi',
      registrationNumber: 'DMC54321',
      consultationFees: {
        inClinic: 700,
        online: 500
      }
    },
    {
      id: '3',
      fullName: 'Dr. Amit Patel',
      profilePhoto: '/placeholder.jpg',
      yearsOfExperience: 15,
      clinicName: 'Patel Nursing Home',
      phone: '+919876543212',
      email: 'dr.amit@example.com',
      status: 'pending',
      specializations: ['Orthopedics', 'Sports Medicine'],
      city: 'Bangalore',
      registrationNumber: 'KMC98765',
      consultationFees: {
        inClinic: 1000,
        online: 800
      }
    },
    {
      id: '4',
      fullName: 'Dr. Anjali Gupta',
      profilePhoto: '/placeholder.jpg',
      yearsOfExperience: 5,
      clinicName: 'Gupta Medical Center',
      phone: '+919876543213',
      email: 'dr.anjali@example.com',
      status: 'inactive',
      specializations: ['Dermatology'],
      city: 'Hyderabad',
      registrationNumber: 'TGMC45678',
      consultationFees: {
        inClinic: 600,
        online: 400
      }
    },
    {
      id: '5',
      fullName: 'Dr. Sanjay Verma',
      profilePhoto: '/placeholder.jpg',
      yearsOfExperience: 20,
      clinicName: 'Verma MultiSpecialty',
      phone: '+919876543214',
      email: 'dr.sanjay@example.com',
      status: 'verified',
      specializations: ['Neurology', 'Psychiatry'],
      city: 'Chennai',
      registrationNumber: 'TNMCR23456',
      consultationFees: {
        inClinic: 1200,
        online: 900
      }
    }
  ];

  const [doctors, setDoctors] = useState<Doctor[]>(dummyDoctors);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    yearsOfExperience: '',
    clinicName: '',
    phone: '',
    email: '',
    status: 'active',
    specializations: '',
    city: '',
    registrationNumber: '',
    inClinicFees: '',
    onlineFees: ''
  });
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleViewDoctor = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setShowViewModal(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setFormData({
      fullName: doctor.fullName,
      yearsOfExperience: doctor.yearsOfExperience.toString(),
      clinicName: doctor.clinicName,
      phone: doctor.phone,
      email: doctor.email,
      status: doctor.status,
      specializations: doctor.specializations.join(', '),
      city: doctor.city,
      registrationNumber: doctor.registrationNumber,
      inClinicFees: doctor.consultationFees.inClinic.toString(),
      onlineFees: doctor.consultationFees.online.toString()
    });
    setShowEditModal(true);
  };

  const handleDeleteDoctor = (id: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(doctor => doctor.id !== id));
    }
  };

  const handleSaveEdit = () => {
    if (!currentDoctor) return;
    
    const updatedDoctors = doctors.map(doctor => {
      if (doctor.id === currentDoctor.id) {
        return {
          ...doctor,
          fullName: formData.fullName,
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
          clinicName: formData.clinicName,
          phone: formData.phone,
          email: formData.email,
          status: formData.status,
          specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s),
          city: formData.city,
          registrationNumber: formData.registrationNumber,
          consultationFees: {
            inClinic: parseInt(formData.inClinicFees) || 0,
            online: parseInt(formData.onlineFees) || 0,
          },
        };
      }
      return doctor;
    });
    
    setDoctors(updatedDoctors);
    setShowEditModal(false);
  };

  const handleAddDoctor = () => {
    if (!formData.fullName.trim()) {
      alert('Please enter a full name');
      return;
    }
    
    const newDoctor: Doctor = {
      id: `new-${Date.now()}`,
      fullName: formData.fullName,
      profilePhoto: '/placeholder.jpg',
      yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
      clinicName: formData.clinicName,
      phone: formData.phone,
      email: formData.email,
      status: formData.status,
      specializations: formData.specializations.split(',').map(s => s.trim()).filter(s => s),
      city: formData.city,
      registrationNumber: formData.registrationNumber,
      consultationFees: {
        inClinic: parseInt(formData.inClinicFees) || 0,
        online: parseInt(formData.onlineFees) || 0,
      },
    };
    
    setDoctors([...doctors, newDoctor]);
    setFormData({
      fullName: '',
      yearsOfExperience: '',
      clinicName: '',
      phone: '',
      email: '',
      status: 'active',
      specializations: '',
      city: '',
      registrationNumber: '',
      inClinicFees: '',
      onlineFees: ''
    });
    setShowAddForm(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const visibleDoctors = doctors.filter((doc) => {
    const q = search.toLowerCase();
    const matchesSearch =
      doc.fullName.toLowerCase().includes(q) ||
      doc.specializations.some((s) => s.toLowerCase().includes(q)) ||
      doc.clinicName.toLowerCase().includes(q) ||
      doc.city.toLowerCase().includes(q);
    const matchesSpec =
      specializationFilter === 'all' ||
      doc.specializations.includes(specializationFilter);
    return matchesSearch && matchesSpec;
  });

  const allSpecializations = Array.from(
    new Set(doctors.flatMap((d) => d.specializations))
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4`}>
      <div className="w-full">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6`}>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Doctor Management</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Manage and view all registered doctors</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              size="sm"
            >
              <MdAdd className="mr-1" /> Add Doctor
            </Button>
            <Button 
              onClick={() => alert('Export functionality would go here')}
              variant="outline"
              className={`${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-200' : 'border-gray-300'} text-sm`}
              size="sm"
            >
              <MdDownload className="mr-1" /> Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className={`rounded-lg shadow-sm border p-4 mb-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search doctors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-sm h-9`}
              />
            </div>
            <div className="sm:w-48">
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none h-9 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
              >
                <option value="all">All Specializations</option>
                {allSpecializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`rounded-lg shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {isSmallScreen ? (
            // Mobile-friendly list view
            <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {visibleDoctors.length === 0 ? (
                <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No doctors found matching your criteria.
                </div>
              ) : (
                visibleDoctors.map((doc) => (
                  <div key={doc.id} className={`p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center mb-2">
                      <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                        <FaUserMd className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} text-sm`} />
                      </div>
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc.fullName}</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{doc.specializations.join(', ')}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div className={darkMode ? 'text-gray-300' : ''}>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Clinic:</span> {doc.clinicName}
                      </div>
                      <div className={darkMode ? 'text-gray-300' : ''}>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Exp:</span> {doc.yearsOfExperience} yrs
                      </div>
                      <div className={darkMode ? 'text-gray-300' : ''}>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>City:</span> {doc.city}
                      </div>
                      <div className={darkMode ? 'text-gray-300' : ''}>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Fees:</span> ₹{doc.consultationFees.inClinic}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewDoctor(doc)}
                        className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} p-1`}
                      >
                        <FaEye size={14} />
                      </button>
                      <button 
                        onClick={() => handleEditDoctor(doc)}
                        className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'} p-1`}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteDoctor(doc.id)}
                        className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} p-1`}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Desktop table view
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Doctor
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Specializations
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Exp
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Clinic
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Contact
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Fees
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Status
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {visibleDoctors.map((doc) => (
                    <tr key={doc.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                              <FaUserMd className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} text-sm`} />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc.fullName}</div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{doc.registrationNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {doc.specializations.map((spec, idx) => (
                            <span
                              key={idx}
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>
                        {doc.yearsOfExperience} yrs
                      </td>
                      <td className="px-4 py-3">
                        <div className={darkMode ? 'text-gray-300' : ''}>{doc.clinicName}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{doc.city}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={darkMode ? 'text-gray-300' : ''}>{doc.phone}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{doc.email}</div>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>
                        <div>Clinic: ₹{doc.consultationFees.inClinic}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Online: ₹{doc.consultationFees.online}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          doc.status === 'verified' || doc.status === 'active'
                            ? darkMode 
                              ? 'bg-green-900 text-green-200'
                              : 'bg-green-100 text-green-800'
                            : doc.status === 'pending'
                            ? darkMode
                              ? 'bg-yellow-900 text-yellow-200'
                              : 'bg-yellow-100 text-yellow-800'
                            : darkMode
                              ? 'bg-red-900 text-red-200'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewDoctor(doc)}
                            className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} p-1`}
                            title="View"
                          >
                            <FaEye size={14} />
                          </button>
                          <button 
                            onClick={() => handleEditDoctor(doc)}
                            className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'} p-1`}
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteDoctor(doc.id)}
                            className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'} p-1`}
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleDoctors.length === 0 && (
                    <tr>
                      <td colSpan={8} className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No doctors found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className={`mt-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {visibleDoctors.length} of {doctors.length} doctors
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New Doctor</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} p-1`}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    placeholder="Dr. John Smith"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Years of Experience
                    </label>
                    <Input
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className={`w-full rounded-md px-2 py-1 text-sm focus:outline-none h-9 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Clinic Name
                  </label>
                  <Input
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    placeholder="City Health Center"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    City
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Registration Number
                  </label>
                  <Input
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    placeholder="MC123456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                      placeholder="doctor@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      In-Clinic Fees (₹)
                    </label>
                    <Input
                      name="inClinicFees"
                      type="number"
                      min="0"
                      value={formData.inClinicFees}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                      placeholder="800"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Online Fees (₹)
                    </label>
                    <Input
                      name="onlineFees"
                      type="number"
                      min="0"
                      value={formData.onlineFees}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                      placeholder="700"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Specializations
                  </label>
                  <Input
                    name="specializations"
                    value={formData.specializations}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    placeholder="Cardiology, Internal Medicine"
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Separate with commas</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className={`flex-1 h-9 text-sm ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-200' : ''}`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddDoctor}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm"
                  >
                    Add Doctor
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Doctor Modal */}
      {showViewModal && currentDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Doctor Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} p-1`}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center mr-4 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <FaUserMd className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} text-2xl`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentDoctor.fullName}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{currentDoctor.registrationNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Experience</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>{currentDoctor.yearsOfExperience} years</p>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>{currentDoctor.status}</p>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Clinic</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>{currentDoctor.clinicName}</p>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>City</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>{currentDoctor.city}</p>
                  </div>
                </div>

                <div>
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Specializations</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentDoctor.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contact</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>{currentDoctor.phone}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{currentDoctor.email}</p>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Consultation Fees</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>In-Clinic: ₹{currentDoctor.consultationFees.inClinic}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>Online: ₹{currentDoctor.consultationFees.online}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={() => setShowViewModal(false)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {showEditModal && currentDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Doctor</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} p-1`}
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Years of Experience
                    </label>
                    <Input
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className={`w-full rounded-md px-2 py-1 text-sm focus:outline-none h-9 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Clinic Name
                  </label>
                  <Input
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    City
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Registration Number
                  </label>
                  <Input
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      In-Clinic Fees (₹)
                    </label>
                    <Input
                      name="inClinicFees"
                      type="number"
                      min="0"
                      value={formData.inClinicFees}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Online Fees (₹)
                    </label>
                    <Input
                      name="onlineFees"
                      type="number"
                      min="0"
                      value={formData.onlineFees}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Specializations
                  </label>
                  <Input
                    name="specializations"
                    value={formData.specializations}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} h-9 text-sm`}
                    placeholder="Separate with commas"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className={`flex-1 h-9 text-sm ${darkMode ? 'border-gray-600 hover:bg-gray-700 text-gray-200' : ''}`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm"
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

export default DoctorDetails;