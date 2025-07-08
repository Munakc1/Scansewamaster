"use client";

import React, { useState } from "react";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from '../components/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SettingsPage = () => {
  const { darkMode } = useTheme();
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
    // make an API call to save the settings
    showToast(`${section} settings saved successfully`, 'success');
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className={`w-80 ${toast.type === 'success' ? 
            (darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200') : 
            (darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200')}`}>
            {toast.type === 'success' ? (
              <Check className={`h-4 w-4 ${darkMode ? 'text-green-300' : 'text-green-600'}`} />
            ) : (
              <AlertTriangle className={`h-4 w-4 ${darkMode ? 'text-red-300' : 'text-red-600'}`} />
            )}
            <AlertDescription className={toast.type === 'success' ? 
              (darkMode ? 'text-green-200' : 'text-green-800') : 
              (darkMode ? 'text-red-200' : 'text-red-800')}>
              {toast.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Restaurant Settings</h1>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage your restaurant preferences and system settings
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Settings */}
        <div className={`rounded-xl shadow-lg p-6 space-y-4 ${darkMode ? 'bg-black' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            <Info className={darkMode ? "text-orange-400" : "text-orange-600"} size={20} />
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Restaurant Information</h2>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Configure your restaurant's operational settings</p>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Restaurant Name</label>
            <Input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Enter restaurant name"
              className={`${darkMode ? 'bg-gray-900 text-white border-gray-700 focus:border-orange-500' : 'border-gray-200'}`}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Restaurant Status</label>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Set your restaurant as active or inactive</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={restaurantActive}
                onChange={() => setRestaurantActive(!restaurantActive)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 ${
                darkMode ? 'bg-gray-700 border-gray-600 after:border-gray-300' : 'bg-gray-200 after:border-gray-300'
              }`}></div>
            </label>
          </div>

          <Button 
            onClick={() => handleSaveSettings("Restaurant")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium mt-4 transition-colors"
          >
            Save Restaurant Settings
          </Button>
        </div>

        {/* Notifications */}
        <div className={`rounded-xl shadow-lg p-6 space-y-4 ${darkMode ? 'bg-black' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            <Info className={darkMode ? "text-orange-400" : "text-orange-600"} size={20} />
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h2>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Configure how you want to receive notifications</p>

          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div>
                <span className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Orders</span>
                <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive notifications for new orders</span>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newOrders}
                  onChange={() => setNewOrders(!newOrders)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 ${
                  darkMode ? 'bg-gray-700 border-gray-600 after:border-gray-300' : 'bg-gray-200 after:border-gray-300'
                }`}></div>
              </label>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div>
                <span className={`block text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Low Stock Alerts</span>
                <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get notified when inventory is low</span>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowStock}
                  onChange={() => setLowStock(!lowStock)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 ${
                  darkMode ? 'bg-gray-700 border-gray-600 after:border-gray-300' : 'bg-gray-200 after:border-gray-300'
                }`}></div>
              </label>
            </div>
          </div>

          <Button 
            onClick={() => handleSaveSettings("Notification")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium mt-2 transition-colors"
          >
            Save Notification Settings
          </Button>
        </div>

        {/* Regional Settings */}
        <div className={`rounded-xl shadow-lg p-6 space-y-4 ${darkMode ? 'bg-black' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            <Info className={darkMode ? "text-orange-400" : "text-orange-600"} size={20} />
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Regional Settings</h2>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Configure your restaurant's regional preferences</p>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Zone</label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'border-gray-200'
              }`}
            >
              <option value="IST">India Standard Time (IST)</option>
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time (EST)</option>
              <option value="PST">Pacific Time (PST)</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'border-gray-200'
              }`}
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <Button 
            onClick={() => handleSaveSettings("Regional")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium mt-2 transition-colors"
          >
            Save Regional Settings
          </Button>
        </div>

        {/* Security */}
        <div className={`rounded-xl shadow-lg p-6 space-y-4 ${darkMode ? 'bg-black' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            <Info className={darkMode ? "text-orange-400" : "text-orange-600"} size={20} />
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Security</h2>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Manage your account security settings</p>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${darkMode ? 'bg-gray-900 text-white border-gray-700 focus:border-orange-500' : 'border-gray-200'}`}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${darkMode ? 'bg-gray-900 text-white border-gray-700 focus:border-orange-500' : 'border-gray-200'}`}
              placeholder="Confirm new password"
            />
          </div>

          <Button 
            onClick={() => handleSaveSettings("Security")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium mt-2 transition-colors"
          >
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;