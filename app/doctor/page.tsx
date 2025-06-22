'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaUserMd, FaEdit, FaTrash, FaTimes, FaEye } from 'react-icons/fa';
import { MdAdd, MdDownload } from 'react-icons/md';
import { useTheme } from '../components/ThemeContext';

// Define the Doctor type based on the new data structure
interface Address {
  street: string;
  city: string;
  pinCode: string;
  geoLocation: string;
}

interface ConsultationFees {
  inClinic: number;
  online: number;
}

interface Documents {
  aadhaar: string;
  pan: string;
  gstNumber?: string;
  digitalSignature?: string;
  profilePhoto?: string;
  mbbsCertificate?: string;
  pgCertificate?: string;
}

interface TimeSlot {
  start: string;
  end: string;
  _id?: string;
}

interface Doctor {
  _id: string;
  doctorId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email?: string;
  password: string;
  profilePhoto?: string;
  mbbsCertificate?: string;
  pgCertificate?: string;
  registrationNumber?: string;
  medicalCouncil?: string;
  state?: string;
  yearsOfExperience: number;
  specializations: string[];
  languagesSpoken: string[];
  clinicName?: string;
  address: Address;
  consultationFees: ConsultationFees;
  documents: Documents;
  workingDays: string[];
  availableTimeSlots: TimeSlot[];
  appointmentModes: string[];
  upiId?: string;
  status: string;
  holidayMode: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock API functions (to be implemented in ../lib/api/doctors)
const fetchDoctors = async (): Promise<Doctor[]> => {
  // Simulated API call
  return [
    {
      _id: "684a9e4f3cc31a991066962a",
      doctorId: "4463896b-60a9-4b18-8b74-eeabb1a88d85",
      fullName: "Dr. Anubhav Das",
      dateOfBirth: "1990-05-15T00:00:00.000Z",
      gender: "Male",
      phone: "9876543213",
      email: "anubhav.das18@example.com",
      password: "$2b$10$kznu8qIrJyi79xcULwRggu0CnntrqwRu/xcgzww3YT0JefhkORTb.",
      profilePhoto: "https://example.com/profile/anubhav.jpg",
      mbbsCertificate: "https://example.com/certificates/mbbs.pdf",
      pgCertificate: "https://example.com/certificates/pg.pdf",
      registrationNumber: "REG1234567",
      medicalCouncil: "Delhi Medical Council",
      state: "Delhi",
      yearsOfExperience: 10,
      specializations: ["Cardiology", "General Medicine"],
      languagesSpoken: ["English", "Hindi"],
      clinicName: "Anubhav Health Clinic",
      address: {
        street: "123 MG Road",
        city: "New Delhi",
        pinCode: "110001",
        geoLocation: "28.6139,77.2090",
      },
      consultationFees: {
        inClinic: 500,
        online: 300,
      },
      documents: {
        aadhaar: "123456789012",
        pan: "ABCDE1234F",
        gstNumber: "07ABCDE1234F1Z5",
        digitalSignature: "https://example.com/signatures/anubhav-signature.png",
      },
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      availableTimeSlots: [
        { start: "09:00", end: "13:00", _id: "684a9e4f3cc31a991066962b" },
        { start: "15:00", end: "18:00", _id: "684a9e4f3cc31a991066962c" },
      ],
      appointmentModes: ["In-person", "Video", "Chat"],
      upiId: "anubhavdas@upi",
      status: "Verified",
      holidayMode: false,
      createdAt: "2025-06-12T09:30:55.622Z",
      updatedAt: "2025-06-12T09:30:55.622Z",
    },
    // Add more mock data as needed
  ];
};

const createDoctor = async (doctor: Omit<Doctor, '_id' | 'doctorId' | 'createdAt' | 'updatedAt'>): Promise<Doctor> => {
  // Simulated API call
  return { ...doctor, _id: "new-id", doctorId: "new-doctor-id", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
};

const updateDoctor = async (doctorId: string, doctor: Partial<Doctor>): Promise<Doctor> => {
  // Simulated API call
  return { ...doctor, doctorId, _id: "updated-id", updatedAt: new Date().toISOString() } as Doctor;
};

const deleteDoctor = async (doctorId: string): Promise<void> => {
  // Simulated API call
};

const DoctorDetails = () => {
  const { darkMode } = useTheme();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    status: 'Verified',
    specializations: '',
    yearsOfExperience: '',
    clinicName: '',
    city: '',
    registrationNumber: '',
    inClinicFees: '',
    onlineFees: '',
  });
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        let data = await fetchDoctors();

        if (!data || data.length === 0) {
          const mockResponse = await fetch('/mock/data.json');
          data = await mockResponse.json();
        }

        setDoctors(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading from API, trying mock data...', err);
        try {
          const mockResponse = await fetch('/mock/data.json');
          const mockData = await mockResponse.json();
          setDoctors(mockData);
          setLoading(false);
        } catch (mockErr) {
          console.error('Failed to load mock data', mockErr);
          setError('Failed to load doctors data');
          setLoading(false);
        }
      }
    };

    loadDoctors();

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
      fullName: doctor.fullName || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      status: doctor.status || 'Verified',
      specializations: doctor.specializations?.join(', ') || '',
      yearsOfExperience: doctor.yearsOfExperience?.toString() || '0',
      clinicName: doctor.clinicName || '',
      city: doctor.address?.city || '',
      registrationNumber: doctor.registrationNumber || '',
      inClinicFees: doctor.consultationFees?.inClinic?.toString() || '0',
      onlineFees: doctor.consultationFees?.online?.toString() || '0',
    });
    setShowEditModal(true);
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(doctorId);
        setDoctors(doctors.filter((doctor) => doctor.doctorId !== doctorId));
      } catch (err) {
        setError('Failed to delete doctor');
        console.error(err);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!currentDoctor) return;

    try {
      const updatedDoctor: Partial<Doctor> = {
        ...currentDoctor,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        specializations: formData.specializations.split(',').map((s) => s.trim()).filter((s) => s),
        registrationNumber: formData.registrationNumber,
        clinicName: formData.clinicName,
        address: {
          ...currentDoctor.address,
          city: formData.city,
        },
        consultationFees: {
          inClinic: parseInt(formData.inClinicFees) || 0,
          online: parseInt(formData.onlineFees) || 0,
        },
      };

      const savedDoctor = await updateDoctor(currentDoctor.doctorId, updatedDoctor);
      setDoctors(doctors.map((d) => (d.doctorId === savedDoctor.doctorId ? savedDoctor : d)));
      setShowEditModal(false);
    } catch (err) {
      setError('Failed to update doctor');
      console.error(err);
    }
  };

  const handleAddDoctor = async () => {
    if (!formData.fullName.trim()) {
      alert('Please enter a full name');
      return;
    }

    try {
      const newDoctor: Omit<Doctor, '_id' | 'doctorId' | 'createdAt' | 'updatedAt'> = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        profilePhoto: '/placeholder.jpg',
        dateOfBirth: new Date().toISOString(),
        gender: 'Male',
        password: 'default-hashed-password',
        mbbsCertificate: '',
        pgCertificate: '',
        registrationNumber: formData.registrationNumber,
        medicalCouncil: 'State Medical Council',
        state: 'Unknown',
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        specializations: formData.specializations.split(',').map((s) => s.trim()).filter((s) => s),
        languagesSpoken: ['English', 'Hindi'],
        clinicName: formData.clinicName,
        address: {
          street: '',
          city: formData.city,
          pinCode: '',
          geoLocation: '0,0',
        },
        consultationFees: {
          inClinic: parseInt(formData.inClinicFees) || 0,
          online: parseInt(formData.onlineFees) || 0,
        },
        documents: {
          aadhaar: '',
          pan: '',
          profilePhoto: '',
          mbbsCertificate: '',
          pgCertificate: '',
        },
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        availableTimeSlots: [{ start: '09:00', end: '17:00' }],
        appointmentModes: ['In-person', 'Video'],
        upiId: '',
        status: formData.status,
        holidayMode: false,
      };

      const createdDoctor = await createDoctor(newDoctor);
      setDoctors([...doctors, createdDoctor]);
      setFormData({
        fullName: '',
        yearsOfExperience: '',
        clinicName: '',
        phone: '',
        email: '',
        status: 'Verified',
        specializations: '',
        city: '',
        registrationNumber: '',
        inClinicFees: '',
        onlineFees: '',
      });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to create doctor');
      console.error(err);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const allSpecializations = Array.from(new Set(doctors.flatMap((d) => d.specializations || [])));

  const visibleDoctors = doctors.filter((doc) => {
    const q = search.toLowerCase();
    const specializations = doc.specializations || [];
    const clinicName = doc.clinicName || '';
    const city = doc.address?.city || '';

    const matchesSearch =
      doc.fullName.toLowerCase().includes(q) ||
      specializations.some((s) => s.toLowerCase().includes(q)) ||
      clinicName.toLowerCase().includes(q) ||
      city.toLowerCase().includes(q);

    const matchesSpec = specializationFilter === 'all' || specializations.includes(specializationFilter);

    return matchesSearch && matchesSpec;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={darkMode ? 'text-white' : 'text-gray-900'}>Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`text-red-500 mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
                  <div key={doc.doctorId} className={`p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center mb-2">
                      <div className={`h-8 w-8 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                        <FaUserMd className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} text-sm`} />
                      </div>
                      <div>
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc.fullName}</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {doc.specializations?.join(', ') || 'No specializations'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div className={darkMode ? 'text-gray-300' : ''}>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Clinic:</span> {doc.clinicName || 'N/A'}
                      </div>
                      <div className={darkMode ? 'text-gray-300' : ''}>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Exp:</span> {doc.yearsOfExperience || 0} yrs
                      </div>
                      <div className={darkMode ? 'text-gray-300' : ''}>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>City:</span> {doc.address?.city || 'N/A'}
                      </div>
                      <div className={darkMode ? 'text-gray-300' : ''}>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Fees:</span> ₹{doc.consultationFees?.inClinic || 0}
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
                        onClick={() => handleDeleteDoctor(doc.doctorId)}
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
                    <tr key={doc.doctorId} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                              <FaUserMd className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} text-sm`} />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{doc.fullName}</div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {doc.registrationNumber || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(doc.specializations || []).map((spec, idx) => (
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
                        {doc.yearsOfExperience || 0} yrs
                      </td>
                      <td className="px-4 py-3">
                        <div className={darkMode ? 'text-gray-300' : ''}>{doc.clinicName || 'N/A'}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {doc.address?.city || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={darkMode ? 'text-gray-300' : ''}>{doc.phone || 'N/A'}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {doc.email || 'N/A'}
                        </div>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>
                        <div>Clinic: ₹{doc.consultationFees?.inClinic || 0}</div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Online: ₹{doc.consultationFees?.online || 0}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            doc.status === 'Verified' || doc.status === 'Active'
                              ? darkMode
                                ? 'bg-green-900 text-green-200'
                                : 'bg-green-100 text-green-800'
                              : doc.status === 'Pending' || doc.status === 'Not Verified'
                              ? darkMode
                                ? 'bg-yellow-900 text-yellow-200'
                                : 'bg-yellow-100 text-yellow-800'
                              : darkMode
                                ? 'bg-red-900 text-red-200'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {doc.status || 'Unknown'}
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
                            onClick={() => handleDeleteDoctor(doc.doctorId)}
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
                      <td
                        colSpan={8}
                        className={`px-6 py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
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
          <div
            className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
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
                      <option value="Verified">Verified</option>
                      <option value="Not Verified">Not Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
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
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Separate with commas
                  </p>
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
          <div
            className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
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
                  <div
                    className={`h-16 w-16 rounded-full flex items-center justify-center mr-4 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}
                  >
                    <FaUserMd className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} text-2xl`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {currentDoctor.fullName}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentDoctor.registrationNumber || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Experience</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                      {currentDoctor.yearsOfExperience || 0} years
                    </p>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                      {currentDoctor.status || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>City</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                      {currentDoctor.address?.city || 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Specializations
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(currentDoctor.specializations || []).map((spec, idx) => (
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
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                      {currentDoctor.phone || 'N/A'}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentDoctor.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Consultation Fees
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                      In-Clinic: ₹{currentDoctor.consultationFees?.inClinic || 0}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : ''}`}>
                      Online: ₹{currentDoctor.consultationFees?.online || 0}
                    </p>
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
          <div
            className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
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
                      <option value="Verified">Verified</option>
                      <option value="Not Verified">Not Verified</option>
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
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