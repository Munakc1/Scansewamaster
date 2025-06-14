'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaUserNurse, FaEdit, FaTrash, FaTimes, FaStar, FaEye } from 'react-icons/fa';
import { MdAdd, MdFileUpload, MdDownload, MdFilterList, MdLocationOn } from 'react-icons/md';

interface NurseApiResponse {
  _id?: string;
  nurseId?: string;
  patientId?: string;
  fullName?: string;
  profilePhoto?: string;
  experience?: number;
  ratePerHour?: number;
  specialty?: string;
  rating?: number;
  languagesSpoken?: string[];
  location?: {
    street?: string;
    city?: string;
    pinCode?: string;
  };
  availability?: {
    days?: string[];
    time?: string;
  };
  duration?: string;
  startDate?: string;
  status?: string;
  hiringId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface NurseCard {
  id: string;
  fullName: string;
  profilePhoto: string;
  experience: number;
  ratePerHour: number;
  specialty: string;
  rating: number;
  languagesSpoken: string[];
  location: string;
  availability: string;
  status: string;
  duration: string;
  hiringId: string;
}

const transformNurseData = (rows: NurseApiResponse[]): NurseCard[] =>
  rows.map((n, i) => ({
    id: n.nurseId || n._id || `missing-id-${i}`,
    fullName: n.fullName || '—',
    profilePhoto: n.profilePhoto || '/placeholder.jpg',
    experience: n.experience ?? 0,
    ratePerHour: n.ratePerHour ?? 0,
    specialty: n.specialty ?? '—',
    rating: n.rating ?? 0,
    languagesSpoken: n.languagesSpoken ?? [],
    location: n.location ? `${n.location.city}, ${n.location.pinCode}` : '—',
    availability: n.availability ? `${n.availability.days?.join(', ')} (${n.availability.time})` : '—',
    status: (n.status ?? 'Unknown').toLowerCase(),
    duration: n.duration ?? '—',
    hiringId: n.hiringId ?? '—',
  }));

// Dummy data
const dummyNurses: NurseApiResponse[] = [
  {
    nurseId: '1',
    fullName: 'Priya Sharma',
    experience: 5,
    ratePerHour: 450,
    specialty: 'Pediatric Care',
    rating: 4.5,
    languagesSpoken: ['Hindi', 'English', 'Marathi'],
    location: {
      city: 'Mumbai',
      pinCode: '400001'
    },
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '09:00-17:00'
    },
    duration: 'weekly',
    status: 'confirmed',
    hiringId: 'hire-001'
  },
  {
    nurseId: '2',
    fullName: 'Anjali Patel',
    experience: 8,
    ratePerHour: 600,
    specialty: 'Elderly Care',
    rating: 4.8,
    languagesSpoken: ['Gujarati', 'Hindi', 'English'],
    location: {
      city: 'Ahmedabad',
      pinCode: '380001'
    },
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      time: '10:00-18:00'
    },
    duration: 'monthly',
    status: 'pending',
    hiringId: 'hire-002'
  },
  {
    nurseId: '3',
    fullName: 'Suman Gupta',
    experience: 3,
    ratePerHour: 350,
    specialty: 'Post-Surgery Care',
    rating: 4.2,
    languagesSpoken: ['Hindi', 'English'],
    location: {
      city: 'Delhi',
      pinCode: '110001'
    },
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      time: '08:00-16:00'
    },
    duration: 'daily',
    status: 'unavailable',
    hiringId: 'hire-003'
  }
];

const NurseDetails = () => {
  const [nurses, setNurses] = useState<NurseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentNurse, setCurrentNurse] = useState<NurseCard | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    experience: '',
    ratePerHour: '',
    specialty: '',
    rating: '',
    languagesSpoken: '',
    city: '',
    pinCode: '',
    availabilityDays: '',
    availabilityTime: '',
    duration: 'weekly',
    status: 'pending'
  });

  useEffect(() => {
    const fetchNurses = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 800));
        setNurses(transformNurseData(dummyNurses));
      } catch (err) {
        console.error('Failed to load nurses', err);
        setError('Unable to load nurses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNurses();
  }, []);

  const handleExport = (type: 'csv' | 'json' | 'pdf') => {
    const dataToExport = visibleNurses.map(nurse => ({
      Name: nurse.fullName,
      Specialty: nurse.specialty,
      Experience: `${nurse.experience} years`,
      'Rate/Hour': `₹${nurse.ratePerHour}`,
      Rating: nurse.rating,
      Languages: nurse.languagesSpoken.join(', '),
      Location: nurse.location,
      Availability: nurse.availability,
      Duration: nurse.duration,
      Status: nurse.status,
      'Hiring ID': nurse.hiringId
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
      a.download = `nurses_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (type === 'json') {
      const json = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nurses_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (type === 'pdf') {
      console.log('PDF export would require additional library like jsPDF');
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
            } else if (file.name.endsWith('.csv')) {
              console.log('Imported CSV data:', content);
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

  const handleAddNurse = () => {
    if (!formData.fullName.trim()) {
      alert('Please enter a full name');
      return;
    }
    const newNurse: NurseCard = {
      id: `new-${Date.now()}`,
      fullName: formData.fullName,
      profilePhoto: '/placeholder.jpg',
      experience: parseInt(formData.experience) || 0,
      ratePerHour: parseInt(formData.ratePerHour) || 0,
      specialty: formData.specialty,
      rating: parseFloat(formData.rating) || 0,
      languagesSpoken: formData.languagesSpoken.split(',').map(s => s.trim()).filter(s => s),
      location: formData.city && formData.pinCode ? `${formData.city}, ${formData.pinCode}` : '—',
      availability: formData.availabilityDays && formData.availabilityTime ? `${formData.availabilityDays} (${formData.availabilityTime})` : '—',
      duration: formData.duration,
      status: formData.status,
      hiringId: `hiring-${Date.now()}`
    };
    
    setNurses([...nurses, newNurse]);
    setFormData({
      fullName: '',
      experience: '',
      ratePerHour: '',
      specialty: '',
      rating: '',
      languagesSpoken: '',
      city: '',
      pinCode: '',
      availabilityDays: '',
      availabilityTime: '',
      duration: 'weekly',
      status: 'pending'
    });
    setShowAddForm(false);
  };

  const handleEditNurse = () => {
    if (!currentNurse || !formData.fullName.trim()) {
      alert('Please enter a full name');
      return;
    }
    
    const updatedNurses = nurses.map(nurse => {
      if (nurse.id === currentNurse.id) {
        return {
          ...nurse,
          fullName: formData.fullName,
          experience: parseInt(formData.experience) || 0,
          ratePerHour: parseInt(formData.ratePerHour) || 0,
          specialty: formData.specialty,
          rating: parseFloat(formData.rating) || 0,
          languagesSpoken: formData.languagesSpoken.split(',').map(s => s.trim()).filter(s => s),
          location: formData.city && formData.pinCode ? `${formData.city}, ${formData.pinCode}` : '—',
          availability: formData.availabilityDays && formData.availabilityTime ? `${formData.availabilityDays} (${formData.availabilityTime})` : '—',
          duration: formData.duration,
          status: formData.status
        };
      }
      return nurse;
    });
    
    setNurses(updatedNurses);
    setShowEditModal(false);
    setCurrentNurse(null);
  };

  const handleDeleteNurse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this nurse?')) {
      setNurses(nurses.filter(nurse => nurse.id !== id));
    }
  };

  const handleViewNurse = (nurse: NurseCard) => {
    setCurrentNurse(nurse);
    setShowViewModal(true);
  };

  const handleEditClick = (nurse: NurseCard) => {
    setCurrentNurse(nurse);
    setFormData({
      fullName: nurse.fullName,
      experience: nurse.experience.toString(),
      ratePerHour: nurse.ratePerHour.toString(),
      specialty: nurse.specialty,
      rating: nurse.rating.toString(),
      languagesSpoken: nurse.languagesSpoken.join(', '),
      city: nurse.location.split(',')[0]?.trim() || '',
      pinCode: nurse.location.split(',')[1]?.trim() || '',
      availabilityDays: nurse.availability.split('(')[0]?.trim().replace(/,/g, '') || '',
      availabilityTime: nurse.availability.match(/\(([^)]+)\)/)?.[1] || '',
      duration: nurse.duration,
      status: nurse.status
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const visibleNurses = nurses.filter((nurse) => {
    const q = search.toLowerCase();
    const matchesSearch =
      nurse.fullName.toLowerCase().includes(q) ||
      nurse.specialty.toLowerCase().includes(q) ||
      nurse.languagesSpoken.some((lang) => lang.toLowerCase().includes(q)) ||
      nurse.location.toLowerCase().includes(q);
    const matchesSpec =
      specialtyFilter === 'all' ||
      nurse.specialty === specialtyFilter;
    return matchesSearch && matchesSpec;
  });

  const allSpecialties = Array.from(
    new Set(nurses.map((n) => n.specialty).filter(s => s !== '—'))
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-2 h-2 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-2 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Nurse Management</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Manage registered nurses</p>
          </div>
          <div className="flex flex-wrap gap-1">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm p-1 sm:p-2"
              size="sm"
            >
              <MdAdd className="mr-0 sm:mr-1" />
              <span className="hidden sm:inline">Add Nurse</span>
            </Button>
            <Button 
              onClick={handleImport}
              variant="outline"
              className="border-gray-300 text-xs sm:text-sm p-1 sm:p-2"
              size="sm"
            >
              <MdFileUpload className="mr-0 sm:mr-1" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button 
              onClick={() => handleExport('csv')}
              variant="outline"
              className="border-gray-300 text-xs sm:text-sm p-1 sm:p-2"
              size="sm"
            >
              <MdDownload className="mr-0 sm:mr-1" />
              <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button 
              onClick={() => handleExport('json')}
              variant="outline"
              className="border-gray-300 text-xs sm:text-sm p-1 sm:p-2"
              size="sm"
            >
              <MdDownload className="mr-0 sm:mr-1" />
              <span className="hidden sm:inline">JSON</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search nurses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-8"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8"
              >
                <option value="all">All Specialties</option>
                {allSpecialties.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
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
              <p className="mt-1 text-xs text-gray-600">Loading nurses...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nurse</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Specialty</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Exp.</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Rate</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Rating</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Languages</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Location</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Duration</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleNurses.map((nurse) => (
                    <tr key={nurse.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-2 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <FaUserNurse className="text-green-600 text-sm" />
                            </div>
                          </div>
                          <div className="ml-1">
                            <div className="font-medium text-gray-900 whitespace-nowrap truncate max-w-[100px]">{nurse.fullName}</div>
                            <div className="text-gray-500">{nurse.experience}y</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 truncate max-w-[80px]">
                          {nurse.specialty}
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-gray-900">
                        {nurse.experience}y
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-gray-900">
                        ₹{nurse.ratePerHour}
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        {nurse.rating > 0 ? renderStars(nurse.rating) : '—'}
                      </td>
                      <td className="px-2 py-2 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-0.5">
                          {nurse.languagesSpoken.length > 0 ? nurse.languagesSpoken.slice(0, 2).map((lang, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-1 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800"
                            >
                              {lang}
                            </span>
                          )) : '—'}
                          {nurse.languagesSpoken.length > 2 && (
                            <span className="text-[10px] text-gray-500">+{nurse.languagesSpoken.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-2 hidden sm:table-cell">
                        <div className="flex items-center">
                          <MdLocationOn className="text-gray-400 mr-0.5 text-xs" />
                          <span className="truncate max-w-[80px]">{nurse.location.split(',')[0]}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 hidden sm:table-cell">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800 capitalize">
                          {nurse.duration.charAt(0)}
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                          nurse.status === 'confirmed'
                            ? 'bg-green-100 text-green-800' 
                            : nurse.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {nurse.status.charAt(0)}
                        </span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleViewNurse(nurse)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                            title="View"
                          >
                            <FaEye className="text-xs" />
                          </button>
                          <button 
                            onClick={() => handleEditClick(nurse)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="text-xs" />
                          </button>
                          <button 
                            onClick={() => handleDeleteNurse(nurse.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleNurses.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-6 text-center text-gray-500 text-xs sm:text-sm">
                        No nurses found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 text-center text-xs text-gray-600">
          Showing {visibleNurses.length} of {nurses.length} nurses
        </div>
      </div>

      {/* Add Nurse Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-full w-full max-h-[95vh] overflow-y-auto mx-2">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add Nurse</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Experience</label>
                    <Input
                      name="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rate/Hour</label>
                    <Input
                      name="ratePerHour"
                      type="number"
                      min="0"
                      value={formData.ratePerHour}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Specialty</label>
                  <Input
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rating (0-5)</label>
                  <Input
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Languages Spoken</label>
                  <Input
                    name="languagesSpoken"
                    value={formData.languagesSpoken}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pin Code</label>
                    <Input
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Availability Days</label>
                  <Input
                    name="availabilityDays"
                    value={formData.availabilityDays}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Availability Time</label>
                  <Input
                    name="availabilityTime"
                    value={formData.availabilityTime}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 text-xs h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddNurse}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                  >
                    Add Nurse
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Nurse Modal */}
      {showViewModal && currentNurse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-full w-full max-h-[95vh] overflow-y-auto mx-2">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Nurse Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FaUserNurse className="text-green-600 text-lg" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{currentNurse.fullName}</h3>
                    <p className="text-xs text-gray-500">{currentNurse.experience}y exp.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Specialty</p>
                    <p className="text-xs font-medium text-gray-900">{currentNurse.specialty}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rate/Hour</p>
                    <p className="text-xs font-medium text-gray-900">₹{currentNurse.ratePerHour}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <div className="mt-1">
                      {currentNurse.rating > 0 ? (
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`w-2 h-2 ${
                                star <= currentNurse.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      ) : '—'}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-xs font-medium text-gray-900 capitalize">{currentNurse.status}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Languages Spoken</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentNurse.languagesSpoken.length > 0 ? currentNurse.languagesSpoken.map((lang, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-1 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800"
                      >
                        {lang}
                      </span>
                    )) : '—'}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <div className="flex items-center mt-1">
                    <MdLocationOn className="text-gray-400 mr-1 text-xs" />
                    <p className="text-xs font-medium text-gray-900">{currentNurse.location}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Availability</p>
                  <p className="text-xs font-medium text-gray-900">{currentNurse.availability}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-xs font-medium text-gray-900 capitalize">{currentNurse.duration}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Hiring ID</p>
                  <p className="text-xs font-medium text-gray-900">{currentNurse.hiringId}</p>
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowViewModal(false)}
                    className="w-full text-xs h-8"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Nurse Modal */}
      {showEditModal && currentNurse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-full w-full max-h-[95vh] overflow-y-auto mx-2">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Edit Nurse</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Experience</label>
                    <Input
                      name="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rate/Hour</label>
                    <Input
                      name="ratePerHour"
                      type="number"
                      min="0"
                      value={formData.ratePerHour}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Specialty</label>
                  <Input
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Rating (0-5)</label>
                  <Input
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Languages Spoken</label>
                  <Input
                    name="languagesSpoken"
                    value={formData.languagesSpoken}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pin Code</label>
                    <Input
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleFormChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Availability Days</label>
                  <Input
                    name="availabilityDays"
                    value={formData.availabilityDays}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Availability Time</label>
                  <Input
                    name="availabilityTime"
                    value={formData.availabilityTime}
                    onChange={handleFormChange}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-8"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:border-blue-500 focus:ring-blue-500 focus:outline-none h-8"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 text-xs h-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditNurse}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
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

export default NurseDetails;