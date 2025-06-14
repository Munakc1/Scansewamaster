'use client';

import React, { useState } from 'react';

const initialState = {
  contactNumber: '9800001122',
  about: '',
  address: 'Ring Road, Kathmandu',
  location: '',
  openingTime: '07:00',
  closingTime: '22:00',
  emergency: 'Available',
  fee: 500,
  radius: 5,
  services: [
    'General Medicine',
    'Emergency',
    'Pediatrics',
    'Orthopedics',
    'Cardiology',
    'Lab Tests',
    'Radiology',
    'Pharmacy',
  ],
};

const HospitalAccount = () => {
  const [form, setForm] = useState({ ...initialState });
  const [newService, setNewService] = useState('');

  const handleAddService = () => {
    const trimmed = newService.trim();
    if (trimmed && !form.services.includes(trimmed)) {
      setForm({ ...form, services: [...form.services, trimmed] });
      setNewService('');
    }
  };

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleCancel = () => {
    setForm({ ...initialState });
    setNewService('');
  };

  const handleSave = () => {
    console.log('Saved data:', form);
    alert('Changes saved successfully!');
    // Optionally, make an API call here
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-[#0077B6] mb-2">Hospital Profile</h1>
      <p className="text-gray-600 mb-8">Manage your hospital information and service settings.</p>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Hospital Name</label>
          <input type="text" value="Sunrise Hospital" className="input" disabled />

          <label className="block mt-4 mb-1 text-sm font-semibold text-gray-700">Contact Number</label>
          <input
            type="text"
            value={form.contactNumber}
            onChange={(e) => handleChange('contactNumber', e.target.value)}
            className="input"
          />

          <label className="block mt-4 mb-1 text-sm font-semibold text-gray-700">About</label>
          <textarea
            maxLength={300}
            placeholder="Brief description of your hospital"
            value={form.about}
            onChange={(e) => handleChange('about', e.target.value)}
            className="input h-24 resize-none"
          />

          <label className="block mt-4 mb-1 text-sm font-semibold text-gray-700">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="input"
          />

          <label className="block mt-4 mb-1 text-sm font-semibold text-gray-700">Location Coordinates</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Opening Time</label>
          <input
            type="time"
            value={form.openingTime}
            onChange={(e) => handleChange('openingTime', e.target.value)}
            className="input"
          />

          <label className="block mt-4 mb-1 text-sm font-semibold text-gray-700">Closing Time</label>
          <input
            type="time"
            value={form.closingTime}
            onChange={(e) => handleChange('closingTime', e.target.value)}
            className="input"
          />

          <label className="block mt-4 mb-1 text-sm font-semibold text-gray-700">Emergency Services</label>
          <select
            value={form.emergency}
            onChange={(e) => handleChange('emergency', e.target.value)}
            className="input"
          >
            <option>Available</option>
            <option>Not Available</option>
          </select>

          <label className="block mt-4 mb-1 text-sm font-semibold text-gray-700">Consultation Fee (avg)</label>
          <input
            type="number"
            value={form.fee}
            onChange={(e) => handleChange('fee', +e.target.value)}
            className="input"
          />

          <label className="block mt-4 mb-1 text-sm font-semibold text-gray-700">Service Radius (km)</label>
          <input
            type="number"
            value={form.radius}
            onChange={(e) => handleChange('radius', +e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Services */}
      <div className="mt-10">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Services</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.services.map((service) => (
            <span
              key={service}
              className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full shadow-sm"
            >
              {service}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add service (e.g., Dialysis)"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            className="input flex-1"
          />
          <button
            onClick={handleAddService}
            className="bg-[#0077B6] text-white px-4 py-2 rounded-lg hover:bg-[#005f91] transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Account Info (Read Only) */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Account Type</label>
          <input type="text" value="Hospital Partner" className="input" disabled />

          <label className="block mt-4 mb-1 text-sm font-semibold text-gray-700">Status</label>
          <input type="text" value="Active" className="input" disabled />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Member Since</label>
          <input type="text" value="January 1, 2024" className="input" disabled />

          <label className="block mt-4 mb-1 text-sm font-semibold text-gray-700">Next Renewal Date</label>
          <input type="text" value="January 1, 2025" className="input" disabled />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex justify-end gap-4">
        <button
          onClick={handleCancel}
          className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-[#0077B6] text-white rounded-lg hover:bg-[#005f91] transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default HospitalAccount;
