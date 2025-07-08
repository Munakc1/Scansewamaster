'use client';

import React, { useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import {
  Utensils as RestaurantIcon,
  Phone as PhoneIcon,
  Mail as EmailIcon,
  Plus as AddIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  MoreVertical as MoreIcon,
  ChevronDown as ArrowDropDownIcon,
  CheckCircle2 as ActiveIcon,
  XCircle as InactiveIcon,
  Clock as PendingIcon,
  X as CloseIcon,
  Edit as EditIcon,
  Eye as ViewIcon,
  Trash2 as DeleteIcon,
  Download,
  Upload,
  Activity,
  Server,
  Database,
  Users,
  Timer,
  AlertTriangle,
  Zap,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';

interface Restaurant {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
}

const RestaurantManagement = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);
  const [isEditRestaurantOpen, setIsEditRestaurantOpen] = useState(false);
  const [isViewRestaurantOpen, setIsViewRestaurantOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const restaurantsPerPage = 5;
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: "",
    type: 'success'
  });

  const [newRestaurant, setNewRestaurant] = useState<Omit<Restaurant, 'id'>>({
    name: '',
    phone: '',
    email: '',
    status: 'pending'
  });

  const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);

  // Initial restaurants data
  const initialRestaurants: Restaurant[] = [
    {
      id: 'REST-001',
      name: 'Tasty Bistro',
      phone: '+977 9841000001',
      email: 'tasty@example.com',
      status: 'active'
    },
    {
      id: 'REST-002',
      name: 'Spicy Grill',
      phone: '+977 9841000002',
      email: 'spicy@example.com',
      status: 'active'
    },
    {
      id: 'REST-003',
      name: 'Savor Cafe',
      phone: '+977 9841000003',
      email: 'savor@example.com',
      status: 'pending'
    },
    {
      id: 'REST-004',
      name: 'Fresh Diner',
      phone: '+977 9841000004',
      email: 'fresh@example.com',
      status: 'inactive'
    },
    {
      id: 'REST-005',
      name: 'Gourmet Kitchen',
      phone: '+977 9841000005',
      email: 'gourmet@example.com',
      status: 'active'
    },
    {
      id: 'REST-006',
      name: 'Urban Eats',
      phone: '+977 9841000006',
      email: 'urban@example.com',
      status: 'active'
    },
    {
      id: 'REST-007',
      name: 'Cozy Corner',
      phone: '+977 9841000007',
      email: 'cozy@example.com',
      status: 'pending'
    }
  ];

  // State for newly added restaurants
  const [newlyAddedRestaurants, setNewlyAddedRestaurants] = useState<Restaurant[]>([]);

  // Combine initial and new restaurants
  const allRestaurants = [...newlyAddedRestaurants, ...initialRestaurants];

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: 'success' }), 3000);
  };

  const handleViewRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsViewRestaurantOpen(true);
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditRestaurant({ ...restaurant });
    setIsEditRestaurantOpen(true);
  };

  const handleDeleteRestaurant = (restaurant: Restaurant) => {
    const restaurantIndex = newlyAddedRestaurants.findIndex(r => r.id === restaurant.id);
    if (restaurantIndex !== -1) {
      const updatedNewRestaurants = [...newlyAddedRestaurants];
      updatedNewRestaurants.splice(restaurantIndex, 1);
      setNewlyAddedRestaurants(updatedNewRestaurants);
      showToast('Restaurant deleted successfully', 'success');
    }
    setCurrentPage(1);
  };

  const handleAddRestaurant = () => {
    if (!newRestaurant.name || !newRestaurant.phone || !newRestaurant.email) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    const newId = `REST-${String(allRestaurants.length + 1).padStart(3, '0')}`;
    const restaurantToAdd: Restaurant = {
      ...newRestaurant,
      id: newId
    };
    setNewlyAddedRestaurants([restaurantToAdd, ...newlyAddedRestaurants]);
    setIsAddRestaurantOpen(false);
    resetNewRestaurant();
    setCurrentPage(1);
    showToast('Restaurant added successfully', 'success');
  };

  const handleUpdateRestaurant = () => {
    if (editRestaurant) {
      const restaurantIndex = newlyAddedRestaurants.findIndex(r => r.id === editRestaurant.id);
      if (restaurantIndex !== -1) {
        const updatedNewRestaurants = [...newlyAddedRestaurants];
        updatedNewRestaurants[restaurantIndex] = editRestaurant;
        setNewlyAddedRestaurants(updatedNewRestaurants);
      } else {
        setNewlyAddedRestaurants([editRestaurant, ...newlyAddedRestaurants]);
      }
      setIsEditRestaurantOpen(false);
      setEditRestaurant(null);
      showToast('Restaurant updated successfully', 'success');
    }
  };

  const resetNewRestaurant = () => {
    setNewRestaurant({
      name: '',
      phone: '',
      email: '',
      status: 'pending'
    });
  };

  const handleFilterApply = () => {
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    setFilters({ status: '' });
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const filteredRestaurants = allRestaurants.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.phone.includes(searchQuery) ||
      restaurant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status ? restaurant.status === filters.status : true;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  const statusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <ActiveIcon className="h-4 w-4" />;
      case 'inactive': return <InactiveIcon className="h-4 w-4" />;
      case 'pending': return <PendingIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  // Calculate stats for cards
  const stats = {
    total: allRestaurants.length,
    active: allRestaurants.filter(r => r.status === 'active').length,
    inactive: allRestaurants.filter(r => r.status === 'inactive').length,
    pending: allRestaurants.filter(r => r.status === 'pending').length,
  };

  const handleExport = () => {
    const csvContent = [
      ["ID", "Name", "Phone", "Email", "Status"],
      ...allRestaurants.map(restaurant => [
        restaurant.id,
        restaurant.name,
        restaurant.phone,
        restaurant.email,
        restaurant.status
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "restaurants.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Restaurants exported successfully', 'success');
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        showToast(`Import functionality would process: ${file.name}`, 'success');
      }
    };
    input.click();
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen relative">
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className={`w-80 ${toast.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800'}`}>
            <Check className={`h-4 w-4 ${toast.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
            <AlertDescription className={toast.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
              {toast.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Restaurant Management</h1>
          <p className="text-muted-foreground mt-1">Manage all restaurants in your network</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="bg-card border border-border px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2"
          >
            <FilterIcon className="h-4 w-4" />
            Filters
          </button>
          <button 
            onClick={handleExport}
            className="bg-card border border-border px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={handleImport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Upload size={16} />
            Import
          </button>
          <button
            onClick={() => setIsAddRestaurantOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <AddIcon className="h-4 w-4" />
            Add Restaurant
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <RestaurantIcon size={16} /> Total Restaurants
          </h3>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">+5% from last month</p>
        </div>

        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ActiveIcon size={16} /> Active Restaurants
          </h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${(stats.active / stats.total) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <InactiveIcon size={16} /> Inactive Restaurants
          </h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.inactive}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-2">
            <div 
              className="bg-red-600 h-2 rounded-full" 
              style={{ width: `${(stats.inactive / stats.total) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <PendingIcon size={16} /> Pending Restaurants
          </h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mt-2">
            <div 
              className="bg-yellow-600 h-2 rounded-full" 
              style={{ width: `${(stats.pending / stats.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
            />
          </div>
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="pl-10 pr-8 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-background text-foreground"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurants Table */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {currentRestaurants.length > 0 ? (
                currentRestaurants.map((restaurant) => (
                  <tr key={restaurant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-foreground">{restaurant.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">{restaurant.name}</div>
                          <div className="text-sm text-muted-foreground">{restaurant.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground flex items-center gap-2">
                        <PhoneIcon size={16} className="text-muted-foreground" />
                        {restaurant.phone}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <EmailIcon size={16} className="text-muted-foreground" />
                        {restaurant.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${statusVariant(restaurant.status)}`}>
                        {getStatusIcon(restaurant.status)}
                        {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewRestaurant(restaurant)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        <ViewIcon size={16} />
                      </button>
                      <button
                        onClick={() => handleEditRestaurant(restaurant)}
                        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 mr-4"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteRestaurant(restaurant)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <DeleteIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted-foreground">
                    No restaurants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-muted-foreground">
          Showing {indexOfFirstRestaurant + 1} to {Math.min(indexOfLastRestaurant, filteredRestaurants.length)} of {filteredRestaurants.length} entries
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-card hover:bg-muted"
          >
            {currentPage}
          </button>
          {totalPages > 1 && (
            <button
              onClick={() => setCurrentPage(2)}
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-card hover:bg-muted"
            >
              2
            </button>
          )}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Restaurant Dialog */}
      {isAddRestaurantOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Add New Restaurant</h2>
              <button 
                onClick={() => setIsAddRestaurantOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                <input
                  type="text"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Restaurant Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                <input
                  type="text"
                  value={newRestaurant.phone}
                  onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Phone Number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={newRestaurant.email}
                  onChange={(e) => setNewRestaurant({...newRestaurant, email: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Email Address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                <select
                  value={newRestaurant.status}
                  onChange={(e) => setNewRestaurant({...newRestaurant, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddRestaurantOpen(false)}
                className="flex-1 px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRestaurant}
                disabled={!newRestaurant.name || !newRestaurant.phone || !newRestaurant.email}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Restaurant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Restaurant Dialog */}
      {isEditRestaurantOpen && editRestaurant && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Edit Restaurant</h2>
              <button 
                onClick={() => setIsEditRestaurantOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                <input
                  type="text"
                  value={editRestaurant.name}
                  onChange={(e) => setEditRestaurant({...editRestaurant, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                <input
                  type="text"
                  value={editRestaurant.phone}
                  onChange={(e) => setEditRestaurant({...editRestaurant, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={editRestaurant.email}
                  onChange={(e) => setEditRestaurant({...editRestaurant, email: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                <select
                  value={editRestaurant.status}
                  onChange={(e) => setEditRestaurant({...editRestaurant, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditRestaurantOpen(false)}
                className="flex-1 px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRestaurant}
                disabled={!editRestaurant.name || !editRestaurant.phone || !editRestaurant.email}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Restaurant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Restaurant Dialog */}
      {isViewRestaurantOpen && selectedRestaurant && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Restaurant Details</h2>
              <button 
                onClick={() => setIsViewRestaurantOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-foreground">{selectedRestaurant.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{selectedRestaurant.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{selectedRestaurant.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <EmailIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{selectedRestaurant.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-5 w-5 flex items-center justify-center">
                  {getStatusIcon(selectedRestaurant.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground">
                    {selectedRestaurant.status.charAt(0).toUpperCase() + selectedRestaurant.status.slice(1)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Restaurant ID</p>
                <p className="font-medium text-foreground">{selectedRestaurant.id}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsViewRestaurantOpen(false)}
                className="flex-1 px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsViewRestaurantOpen(false);
                  handleEditRestaurant(selectedRestaurant);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Restaurant
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Dialog */}
      {isFilterOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Filter Restaurants</h2>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleFilterReset}
                className="flex-1 px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleFilterApply}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;