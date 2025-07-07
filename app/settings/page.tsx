"use client";

import React, { useState } from "react";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';

const SettingsPage = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantActive, setRestaurantActive] = useState(true);
  const [newOrders, setNewOrders] = useState(true);
  const [lowStock, setLowStock] = useState(true);
  const [timeZone, setTimeZone] = useState("IST");
  const [currency, setCurrency] = useState("INR");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: "",
    type: 'success'
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: 'success' }), 3000);
  };

  const handleSaveSettings = (section: string) => {
    //  make an API call to save the settings
    showToast(`${section} settings saved successfully`, 'success');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className={`w-80 ${toast.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {toast.type === 'success' ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={toast.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {toast.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Restaurant Settings</h1>
        <p className="text-gray-600 mt-1">Manage your restaurant preferences and system settings</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Info className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Restaurant Information</h2>
          </div>
          <p className="text-gray-600 text-sm">Configure your restaurant's operational settings</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Enter restaurant name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Status</label>
              <p className="text-sm text-gray-500">Set your restaurant as active or inactive</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={restaurantActive}
                onChange={() => setRestaurantActive(!restaurantActive)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button 
            onClick={() => handleSaveSettings("Restaurant")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-4 transition-colors"
          >
            Save Restaurant Settings
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Info className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>
          <p className="text-gray-600 text-sm">Configure how you want to receive notifications</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="block text-sm font-medium text-gray-900">New Orders</span>
                <span className="block text-xs text-gray-500">Receive notifications for new orders</span>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newOrders}
                  onChange={() => setNewOrders(!newOrders)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="block text-sm font-medium text-gray-900">Low Stock Alerts</span>
                <span className="block text-xs text-gray-500">Get notified when inventory is low</span>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowStock}
                  onChange={() => setLowStock(!lowStock)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <button 
            onClick={() => handleSaveSettings("Notification")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-2 transition-colors"
          >
            Save Notification Settings
          </button>
        </div>

        {/* Regional Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Info className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Regional Settings</h2>
          </div>
          <p className="text-gray-600 text-sm">Configure your restaurant's regional preferences</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="IST">India Standard Time (IST)</option>
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time (EST)</option>
              <option value="PST">Pacific Time (PST)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <button 
            onClick={() => handleSaveSettings("Regional")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-2 transition-colors"
          >
            Save Regional Settings
          </button>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Info className="text-blue-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
          </div>
          <p className="text-gray-600 text-sm">Manage your account security settings</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>

          <button 
            onClick={() => handleSaveSettings("Security")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-2 transition-colors"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;