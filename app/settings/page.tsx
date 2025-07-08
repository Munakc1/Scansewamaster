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
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-background text-foreground' : 'bg-background text-foreground'}`}>
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className={`w-80 ${toast.type === 'success' ? 
            'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800' : 
            'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800'}`}>
            {toast.type === 'success' ? (
              <Check className={`h-4 w-4 text-green-600 dark:text-green-400`} />
            ) : (
              <AlertTriangle className={`h-4 w-4 text-red-600 dark:text-red-400`} />
            )}
            <AlertDescription className={toast.type === 'success' ? 
              'text-green-800 dark:text-green-200' : 
              'text-red-800 dark:text-red-200'}>
              {toast.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Restaurant Settings</h1>
        <p className={`text-sm text-muted-foreground`}>
          Manage your restaurant preferences and system settings
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Settings */}
        <div className={`rounded-xl shadow-lg p-6 space-y-4 bg-card border border-border`}>
          <div className="flex items-center gap-2">
            <Info className="text-blue-500" size={20} />
            <h2 className={`text-xl font-semibold text-foreground`}>Restaurant Information</h2>
          </div>
          <p className={`text-muted-foreground text-sm`}>Configure your restaurant's operational settings</p>

          <div>
            <label className={`block text-sm font-medium mb-1 text-muted-foreground`}>Restaurant Name</label>
            <Input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Enter restaurant name"
              className={`bg-background text-foreground border-border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label className={`block text-sm font-medium mb-1 text-muted-foreground`}>Restaurant Status</label>
              <p className={`text-sm text-muted-foreground`}>Set your restaurant as active or inactive</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={restaurantActive}
                onChange={() => setRestaurantActive(!restaurantActive)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 after:border-gray-300' : 'bg-gray-200 after:border-gray-300'
              }`}></div>
            </label>
          </div>

          <Button 
            onClick={() => handleSaveSettings("Restaurant")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-4 transition-colors"
          >
            Save Restaurant Settings
          </Button>
        </div>

        {/* Notifications */}
        <div className={`rounded-xl shadow-lg p-6 space-y-4 bg-card border border-border`}>
          <div className="flex items-center gap-2">
            <Info className="text-blue-500" size={20} />
            <h2 className={`text-xl font-semibold text-foreground`}>Notifications</h2>
          </div>
          <p className={`text-muted-foreground text-sm`}>Configure how you want to receive notifications</p>

          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg bg-muted`}>
              <div>
                <span className={`block text-sm font-medium text-foreground`}>New Orders</span>
                <span className={`block text-xs text-muted-foreground`}>Receive notifications for new orders</span>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newOrders}
                  onChange={() => setNewOrders(!newOrders)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 after:border-gray-300' : 'bg-gray-200 after:border-gray-300'
                }`}></div>
              </label>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg bg-muted`}>
              <div>
                <span className={`block text-sm font-medium text-foreground`}>Low Stock Alerts</span>
                <span className={`block text-xs text-muted-foreground`}>Get notified when inventory is low</span>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowStock}
                  onChange={() => setLowStock(!lowStock)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 after:border-gray-300' : 'bg-gray-200 after:border-gray-300'
                }`}></div>
              </label>
            </div>
          </div>

          <Button 
            onClick={() => handleSaveSettings("Notification")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-2 transition-colors"
          >
            Save Notification Settings
          </Button>
        </div>

        {/* Regional Settings */}
        <div className={`rounded-xl shadow-lg p-6 space-y-4 bg-card border border-border`}>
          <div className="flex items-center gap-2">
            <Info className="text-blue-500" size={20} />
            <h2 className={`text-xl font-semibold text-foreground`}>Regional Settings</h2>
          </div>
          <p className={`text-muted-foreground text-sm`}>Configure your restaurant's regional preferences</p>

          <div>
            <label className={`block text-sm font-medium mb-1 text-muted-foreground`}>Time Zone</label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground border-border`}
            >
              <option value="IST">India Standard Time (IST)</option>
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time (EST)</option>
              <option value="PST">Pacific Time (PST)</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 text-muted-foreground`}>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground border-border`}
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <Button 
            onClick={() => handleSaveSettings("Regional")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-2 transition-colors"
          >
            Save Regional Settings
          </Button>
        </div>

        {/* Security */}
        <div className={`rounded-xl shadow-lg p-6 space-y-4 bg-card border border-border`}>
          <div className="flex items-center gap-2">
            <Info className="text-blue-500" size={20} />
            <h2 className={`text-xl font-semibold text-foreground`}>Security</h2>
          </div>
          <p className={`text-muted-foreground text-sm`}>Manage your account security settings</p>

          <div>
            <label className={`block text-sm font-medium mb-1 text-muted-foreground`}>New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`bg-background text-foreground border-border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 text-muted-foreground`}>Confirm Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`bg-background text-foreground border-border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Confirm new password"
            />
          </div>

          <Button 
            onClick={() => handleSaveSettings("Security")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium mt-2 transition-colors"
          >
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;