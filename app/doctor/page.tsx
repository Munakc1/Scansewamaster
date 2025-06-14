'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaUserMd, FaEdit, FaTrash, FaTimes, FaEye } from 'react-icons/fa';
import { MdAdd, MdFileUpload, MdDownload, MdFilterList } from 'react-icons/md';

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
    // This will only run on the client side
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // View doctor details
  const handleViewDoctor = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setShowViewModal(true);
  };

  // Edit doctor - open form with current data
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

  // Delete doctor
  const handleDeleteDoctor = (id: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(doctor => doctor.id !== id));
    }
  };

  // Save edited doctor
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

  // Add new doctor
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and view all registered doctors</p>
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
              className="border-gray-300 text-sm"
              size="sm"
            >
              <MdDownload className="mr-1" /> Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search doctors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm h-9"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-9"
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isSmallScreen ? (
            // Mobile-friendly list view
            <div className="divide-y divide-gray-200">
              {visibleDoctors.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No doctors found matching your criteria.
                </div>
              ) : (
                visibleDoctors.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FaUserMd className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.fullName}</h3>
                        <p className="text-xs text-gray-500">{doc.specializations.join(', ')}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-gray-500">Clinic:</span> {doc.clinicName}
                      </div>
                      <div>
                        <span className="text-gray-500">Exp:</span> {doc.yearsOfExperience} yrs
                      </div>
                      <div>
                        <span className="text-gray-500">City:</span> {doc.city}
                      </div>
                      <div>
                        <span className="text-gray-500">Fees:</span> ₹{doc.consultationFees.inClinic}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewDoctor(doc)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <FaEye size={14} />
                      </button>
                      <button 
                        onClick={() => handleEditDoctor(doc)}
                        className="text-green-600 hover:text-green-800 p-1"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteDoctor(doc.id)}
                        className="text-red-600 hover:text-red-800 p-1"
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
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specializations
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clinic
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fees
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <FaUserMd className="text-blue-600 text-sm" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{doc.fullName}</div>
                            <div className="text-xs text-gray-500">{doc.registrationNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {doc.specializations.map((spec, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {doc.yearsOfExperience} yrs
                      </td>
                      <td className="px-4 py-3">
                        <div>{doc.clinicName}</div>
                        <div className="text-xs text-gray-500">{doc.city}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{doc.phone}</div>
                        <div className="text-xs text-gray-500">{doc.email}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>Clinic: ₹{doc.consultationFees.inClinic}</div>
                        <div className="text-xs text-gray-500">Online: ₹{doc.consultationFees.online}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          doc.status === 'verified' || doc.status === 'active'
                            ? 'bg-green-100 text-green-800' 
                            : doc.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewDoctor(doc)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="View"
                          >
                            <FaEye size={14} />
                          </button>
                          <button 
                            onClick={() => handleEditDoctor(doc)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteDoctor(doc.id)}
                            className="text-red-600 hover:text-red-800 p-1"
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
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
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
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {visibleDoctors.length} of {doctors.length} doctors
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add New Doctor</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    placeholder="Dr. John Smith"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <Input
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-9"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clinic Name
                  </label>
                  <Input
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    placeholder="City Health Center"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    placeholder="Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <Input
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    placeholder="MC123456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                      placeholder="doctor@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      In-Clinic Fees (₹)
                    </label>
                    <Input
                      name="inClinicFees"
                      type="number"
                      min="0"
                      value={formData.inClinicFees}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                      placeholder="800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Online Fees (₹)
                    </label>
                    <Input
                      name="onlineFees"
                      type="number"
                      min="0"
                      value={formData.onlineFees}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                      placeholder="700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specializations
                  </label>
                  <Input
                    name="specializations"
                    value={formData.specializations}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    placeholder="Cardiology, Internal Medicine"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 h-9 text-sm"
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Doctor Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <FaUserMd className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{currentDoctor.fullName}</h3>
                    <p className="text-sm text-gray-500">{currentDoctor.registrationNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Experience</h4>
                    <p className="text-sm">{currentDoctor.yearsOfExperience} years</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Status</h4>
                    <p className="text-sm capitalize">{currentDoctor.status}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Clinic</h4>
                    <p className="text-sm">{currentDoctor.clinicName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">City</h4>
                    <p className="text-sm">{currentDoctor.city}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Specializations</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentDoctor.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Contact</h4>
                    <p className="text-sm">{currentDoctor.phone}</p>
                    <p className="text-sm text-gray-500">{currentDoctor.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Consultation Fees</h4>
                    <p className="text-sm">In-Clinic: ₹{currentDoctor.consultationFees.inClinic}</p>
                    <p className="text-sm">Online: ₹{currentDoctor.consultationFees.online}</p>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Edit Doctor</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <Input
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-9"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clinic Name
                  </label>
                  <Input
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <Input
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      In-Clinic Fees (₹)
                    </label>
                    <Input
                      name="inClinicFees"
                      type="number"
                      min="0"
                      value={formData.inClinicFees}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Online Fees (₹)
                    </label>
                    <Input
                      name="onlineFees"
                      type="number"
                      min="0"
                      value={formData.onlineFees}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specializations
                  </label>
                  <Input
                    name="specializations"
                    value={formData.specializations}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    placeholder="Separate with commas"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 h-9 text-sm"
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