'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaUserNurse, FaEdit, FaTrash, FaTimes, FaStar, FaEye } from 'react-icons/fa';
import { MdAdd, MdFileUpload, MdDownload } from 'react-icons/md';
import { useTheme } from '../components/ThemeContext';
import { fetchNurses, createNurse, updateNurse, deleteNurse, Nurse } from '@/lib/api/nurses';

interface NurseCard {
  id: string;
  patientId: string;
  nurseId: string;
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
  startDate: string;
  hiringId: string;
}

const transformNurseData = (nurses: Nurse[]): NurseCard[] => {
  return nurses.map((nurse) => ({
    id: nurse._id,
    patientId: nurse.patientId || '—',
    nurseId: nurse.nurseId || '—',
    fullName: nurse.fullName || '—',
    profilePhoto: nurse.profilePhoto || '/placeholder.jpg',
    experience: nurse.experience || 0,
    ratePerHour: nurse.ratePerHour || 0,
    specialty: nurse.specialty || '—',
    rating: nurse.rating || 0,
    languagesSpoken: nurse.languagesSpoken || [],
    location: nurse.location ? `${nurse.location.street || ''}, ${nurse.location.city || ''}, ${nurse.location.pinCode || ''}` : '—',
    availability: nurse.availability ? `${nurse.availability.days?.join(', ') || ''} (${nurse.availability.time || ''})` : '—',
    status: nurse.status || 'pending',
    startDate: nurse.startDate || '—',
    hiringId: nurse.hiringId || '—'
  }));
};

const NurseManagement = () => {
  const { darkMode } = useTheme();
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
    street: '',
    city: '',
    pinCode: '',
    availabilityDays: '',
    availabilityTime: '',
    status: 'pending'
  });

  useEffect(() => {
    const loadNurses = async () => {
      try {
        setLoading(true);
        const data = await fetchNurses();
        setNurses(transformNurseData(data));
      } catch (err) {
        setError('Failed to load nurses');
        console.error('Error loading nurses:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNurses();
  }, []);

  const handleViewNurse = (nurse: NurseCard) => {
    setCurrentNurse(nurse);
    setShowViewModal(true);
  };

  const handleEditNurse = (nurse: NurseCard) => {
    setCurrentNurse(nurse);
    const locationParts = nurse.location.split(',').map(part => part.trim());
    setFormData({
      fullName: nurse.fullName,
      experience: nurse.experience.toString(),
      ratePerHour: nurse.ratePerHour.toString(),
      specialty: nurse.specialty,
      rating: nurse.rating.toString(),
      languagesSpoken: nurse.languagesSpoken.join(', '),
      street: locationParts.length > 0 ? locationParts[0] : '',
      city: locationParts.length > 1 ? locationParts[1] : '',
      pinCode: locationParts.length > 2 ? locationParts[2] : '',
      availabilityDays: nurse.availability.split('(')[0]?.trim().replace(/,/g, '') || '',
      availabilityTime: nurse.availability.match(/\(([^)]+)\)/)?.[1] || '',
      status: nurse.status
    });
    setShowEditModal(true);
  };

  const handleDeleteNurse = async (id: string) => {
    if (confirm('Are you sure you want to delete this nurse?')) {
      try {
        await deleteNurse(id);
        setNurses(nurses.filter(nurse => nurse.id !== id));
      } catch (err) {
        setError('Failed to delete nurse');
        console.error('Error deleting nurse:', err);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!currentNurse) return;
    
    try {
      const updatedNurse = await updateNurse(currentNurse.id, {
        fullName: formData.fullName,
        experience: parseInt(formData.experience) || 0,
        ratePerHour: parseInt(formData.ratePerHour) || 0,
        specialty: formData.specialty,
        rating: parseFloat(formData.rating) || 0,
        languagesSpoken: formData.languagesSpoken.split(',').map(s => s.trim()).filter(s => s),
        location: {
          street: formData.street,
          city: formData.city,
          pinCode: formData.pinCode
        },
        availability: {
          days: formData.availabilityDays.split(',').map(s => s.trim()).filter(s => s),
          time: formData.availabilityTime
        },
        status: formData.status
      });
      
      setNurses(nurses.map(nurse => 
        nurse.id === currentNurse.id ? transformNurseData([updatedNurse])[0] : nurse
      ));
      setShowEditModal(false);
    } catch (err) {
      setError('Failed to update nurse');
      console.error('Error updating nurse:', err);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNurse = async () => {
    try {
      const newNurse = await createNurse({
        patientId: '', // Provide a value or collect from form if needed
        nurseId: '',   // Provide a value or generate as needed
        fullName: formData.fullName,
        profilePhoto: '',
        experience: parseInt(formData.experience) || 0,
        ratePerHour: parseInt(formData.ratePerHour) || 0,
        specialty: formData.specialty,
        rating: parseFloat(formData.rating) || 0,
        languagesSpoken: formData.languagesSpoken.split(',').map(s => s.trim()).filter(s => s),
        location: {
          street: formData.street,
          city: formData.city,
          pinCode: formData.pinCode
        },
        availability: {
          days: formData.availabilityDays.split(',').map(s => s.trim()).filter(s => s),
          time: formData.availabilityTime
        },
        status: formData.status
      });

      setNurses([...nurses, transformNurseData([newNurse])[0]]);
      setShowAddForm(false);
      setFormData({
        fullName: '',
        experience: '',
        ratePerHour: '',
        specialty: '',
        rating: '',
        languagesSpoken: '',
        street: '',
        city: '',
        pinCode: '',
        availabilityDays: '',
        availabilityTime: '',
        status: 'pending'
      });
    } catch (err) {
      setError('Failed to add nurse');
      console.error('Error adding nurse:', err);
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    try {
      let data: string;
      if (format === 'csv') {
        const headers = [
          'ID', 'Patient ID', 'Nurse ID', 'Name', 'Specialty', 'Experience', 'Rate/Hour', 'Rating', 
          'Languages', 'Location', 'Availability', 'Status', 'Start Date', 'Hiring ID'
        ].join(',');
        
        const rows = nurses.map(nurse => 
          [
            nurse.id,
            nurse.patientId,
            nurse.nurseId,
            nurse.fullName,
            nurse.specialty,
            nurse.experience,
            nurse.ratePerHour,
            nurse.rating,
            nurse.languagesSpoken.join(', '),
            nurse.location,
            nurse.availability,
            nurse.status,
            nurse.startDate,
            nurse.hiringId
          ].map(value => `"${value}"`).join(',')
        ).join('\n');
        
        data = `${headers}\n${rows}`;
      } else {
        data = JSON.stringify(nurses, null, 2);
      }

      const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nurses_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to export data');
      console.error('Export error:', error);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let importedNurses: Nurse[] = [];

        if (file.name.endsWith('.json')) {
          importedNurses = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          importedNurses = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.split(',');
            const nurse: any = {};
            
            headers.forEach((header, index) => {
              let value = values[index]?.replace(/^"|"$/g, '').trim() || '';
              
              switch (header) {
                case 'languagesSpoken':
                  nurse[header] = value ? value.split(',').map(s => s.trim()).filter(s => s) : [];
                  break;
                case 'experience':
                case 'ratePerHour':
                case 'rating':
                  nurse[header] = parseFloat(value) || 0;
                  break;
                case '_id':
                case 'patientId':
                case 'nurseId':
                case 'fullName':
                case 'profilePhoto':
                case 'specialty':
                case 'status':
                case 'hiringId':
                case 'startDate':
                  nurse[header] = value;
                  break;
                case 'location':
                  const [street, city, pinCode] = value.split(',').map(s => s.trim());
                  nurse.location = { street, city, pinCode };
                  break;
                case 'availability':
                  const [daysStr, time] = value.split('(').map(s => s.trim());
                  const days = daysStr.split(',').map(s => s.trim()).filter(s => s);
                  nurse.availability = { days, time: time?.replace(')', '').trim() || '' };
                  break;
                default:
                  break;
              }
            });
            
            return nurse as Nurse;
          });
        }

        if (Array.isArray(importedNurses) && importedNurses.length > 0) {
          setNurses(transformNurseData(importedNurses));
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

  const visibleNurses = nurses.filter((nurse) => {
    const q = search.toLowerCase();
    const matchesSearch =
      nurse.fullName.toLowerCase().includes(q) ||
      nurse.specialty.toLowerCase().includes(q) ||
      nurse.languagesSpoken.some(lang => lang.toLowerCase().includes(q)) ||
      nurse.location.toLowerCase().includes(q);
    const matchesSpecialty =
      specialtyFilter === 'all' ||
      nurse.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const allSpecialties = Array.from(
    new Set(nurses.map(n => n.specialty).filter(s => s && s !== '—')
  ));

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800';
      case 'pending':
        return darkMode ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800';
      default:
        return darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'text-yellow-400' : darkMode ? 'text-gray-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '—') return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return '—';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Nurse Management</h1>
            <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage and view all nurse records
            </p>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm p-1 sm:p-2"
              size="sm"
            >
              <MdAdd className="mr-1" /> Add Nurse
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

        {/* Filters */}
        <div className={`rounded-lg shadow-sm border p-3 sm:p-4 mb-4 mx-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search nurses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
              />
            </div>
            <div className="sm:w-48">
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className={`w-full rounded-md px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm focus:outline-none h-8 sm:h-10 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' 
                    : 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              >
                <option value="all">All Specialties</option>
                {allSpecialties.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className={`rounded-lg shadow-sm border overflow-hidden mx-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-2 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Loading nurses...
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
                      Nurse
                    </th>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Specialty
                    </th>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Experience
                    </th>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Rate/Hour
                    </th>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Rating
                    </th>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Status
                    </th>
                    <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                  {visibleNurses.map((nurse) => (
                    <tr key={nurse.id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-600'
                            }`}>
                              <FaUserNurse className="text-sm" />
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className={`text-xs sm:text-sm font-medium truncate max-w-[120px] ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {nurse.fullName}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              ID: {nurse.nurseId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {nurse.specialty}
                        </span>
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap text-xs sm:text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        {nurse.experience} yrs
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap text-xs sm:text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        ₹{nurse.ratePerHour}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {nurse.rating > 0 ? renderStars(nurse.rating) : '—'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusColor(nurse.status)}`}>
                          {nurse.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleViewNurse(nurse)}
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
                            onClick={() => handleEditNurse(nurse)}
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
                            onClick={() => handleDeleteNurse(nurse.id)}
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
                  {visibleNurses.length === 0 && (
                    <tr>
                      <td colSpan={7} className={`px-3 py-4 text-center text-xs sm:text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
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
        <div className={`mt-4 text-center text-xs sm:text-sm mx-4 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Showing {visibleNurses.length} of {nurses.length} nurses
        </div>
      </div>

      {/* Add Nurse Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-[60]">
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Add New Nurse</h2>
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
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="Jane Smith"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Experience (years)
                    </label>
                    <Input
                      name="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Rate/Hour (₹)
                    </label>
                    <Input
                      name="ratePerHour"
                      type="number"
                      min="0"
                      value={formData.ratePerHour}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="500"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Specialty
                  </label>
                  <Input
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="Cardiac Care"
                  />
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Rating (0-5)
                  </label>
                  <Input
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="4.5"
                  />
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Languages Spoken
                  </label>
                  <Input
                    name="languagesSpoken"
                    value={formData.languagesSpoken}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="English, Hindi, Spanish"
                  />
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Street Address
                  </label>
                  <Input
                    name="street"
                    value={formData.street}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="123 MG Road"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
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
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Pin Code
                    </label>
                    <Input
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="400001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Availability Days
                    </label>
                    <Input
                      name="availabilityDays"
                      value={formData.availabilityDays}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="Mon, Wed, Fri"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Availability Time
                    </label>
                    <Input
                      name="availabilityTime"
                      value={formData.availabilityTime}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="9am-5pm"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className={`w-full rounded-md px-2 py-1 text-xs sm:text-sm focus:outline-none h-8 sm:h-10 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' 
                        : 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
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
                    className={`flex-1 h-8 sm:h-10 text-xs sm:text-sm ${
                      darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddNurse}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8 sm:h-10 text-xs sm:text-sm"
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
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Nurse Details</h2>
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
                    darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-600'
                  }`}>
                    <FaUserNurse className="text-xl" />
                  </div>
                  <div>
                    <h3 className={`text-sm sm:text-base font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{currentNurse.fullName}</h3>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>ID: {currentNurse.nurseId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Experience</h4>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>{currentNurse.experience} years</p>
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Rate/Hour</h4>
                    <p className={`text-xs sm:text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>₹{currentNurse.ratePerHour}</p>
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Rating</h4>
                    <div className="mt-1">
                      {currentNurse.rating > 0 ? renderStars(currentNurse.rating) : '—'}
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Status</h4>
                    <p className={`text-xs sm:text-sm capitalize ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>{currentNurse.status}</p>
                  </div>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Specialty</h4>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>{currentNurse.specialty}</p>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Languages Spoken</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentNurse.languagesSpoken.length > 0 ? (
                      currentNurse.languagesSpoken.map((language, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {language}
                        </span>
                      ))
                    ) : (
                      <span className={`text-xs sm:text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>None</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Location</h4>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>{currentNurse.location}</p>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Availability</h4>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>{currentNurse.availability}</p>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Start Date</h4>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>{formatDate(currentNurse.startDate)}</p>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Hiring ID</h4>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>{currentNurse.hiringId}</p>
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Patient ID</h4>
                  <p className={`text-xs sm:text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>{currentNurse.patientId}</p>
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

      {/* Edit Nurse Modal */}
      {showEditModal && currentNurse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-2 z-[60]">
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Edit Nurse</h2>
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
                    name="fullName"
                    value={formData.fullName}
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
                      Experience (years)
                    </label>
                    <Input
                      name="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Rate/Hour (₹)
                    </label>
                    <Input
                      name="ratePerHour"
                      type="number"
                      min="0"
                      value={formData.ratePerHour}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Specialty
                  </label>
                  <Input
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                  />
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Rating (0-5)
                  </label>
                  <Input
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                  />
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Languages Spoken
                  </label>
                  <Input
                    name="languagesSpoken"
                    value={formData.languagesSpoken}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                    placeholder="Separate with commas"
                  />
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Street Address
                  </label>
                  <Input
                    name="street"
                    value={formData.street}
                    onChange={handleFormChange}
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
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
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Pin Code
                    </label>
                    <Input
                      name="pinCode"
                      value={formData.pinCode}
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
                      Availability Days
                    </label>
                    <Input
                      name="availabilityDays"
                      value={formData.availabilityDays}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="Mon, Wed, Fri"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Availability Time
                    </label>
                    <Input
                      name="availabilityTime"
                      value={formData.availabilityTime}
                      onChange={handleFormChange}
                      className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} text-xs sm:text-sm h-8 sm:h-10`}
                      placeholder="9am-5pm"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className={`w-full rounded-md px-2 py-1 text-xs sm:text-sm focus:outline-none h-8 sm:h-10 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500' 
                        : 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
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

export default NurseManagement;