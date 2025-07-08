'use client';

import React, { useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import {
  Mail as EmailIcon,
  Phone as PhoneIcon,
  Calendar as CalendarIcon,
  CheckCircle2 as ActiveIcon,
  XCircle as InactiveIcon,
  Plus as AddIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  MoreVertical as MoreIcon,
  ChevronDown as ArrowDropDownIcon,
  Shield as AdminIcon,
  UserCog as ManagerIcon,
  Users as StaffIcon,
  User as CustomerIcon,
  X as CloseIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Eye as ViewIcon,
  Download,
  Upload,
  AlertTriangle,
  Check,
  AlertCircle,
  Users
} from 'lucide-react';
import {
  Alert,
  AlertDescription
} from '@/components/ui/alert';

interface User {
  id: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'manager' | 'staff' | 'customer';
}

const UserManagement = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    dateFrom: '',
    dateTo: ''
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const usersPerPage = 5;
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: "",
    type: 'success'
  });

  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'joinDate'>>({
    email: '',
    phone: '',
    status: 'active',
    role: 'customer'
  });

  const [editUser, setEditUser] = useState<User | null>(null);

  // Initial users data
  const initialUsers: User[] = [
    {
      id: 'USR-001',
      email: 'ramesh@example.com',
      phone: '+977 9841000001',
      joinDate: '2023-01-15',
      status: 'active',
      role: 'customer'
    },
    {
      id: 'USR-002',
      email: 'sita@example.com',
      phone: '+977 9841000002',
      joinDate: '2023-02-20',
      status: 'active',
      role: 'customer'
    },
    {
      id: 'USR-003',
      email: 'admin@scansewa.com',
      phone: '+977 9841000003',
      joinDate: '2022-11-05',
      status: 'active',
      role: 'admin'
    },
    {
      id: 'USR-004',
      email: 'hari@example.com',
      phone: '+977 9841000004',
      joinDate: '2023-03-10',
      status: 'inactive',
      role: 'customer'
    },
    {
      id: 'USR-005',
      email: 'gita@example.com',
      phone: '+977 9841000005',
      joinDate: '2023-04-25',
      status: 'active',
      role: 'manager'
    }
  ];

  // State for newly added users
  const [newlyAddedUsers, setNewlyAddedUsers] = useState<User[]>([]);

  // Combine users with new ones first
  const allUsers = [...newlyAddedUsers, ...initialUsers];

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: 'success' }), 3000);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewUserOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditUser({ ...user });
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    const userIndex = newlyAddedUsers.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      const updatedNewUsers = [...newlyAddedUsers];
      updatedNewUsers.splice(userIndex, 1);
      setNewlyAddedUsers(updatedNewUsers);
      showToast('User deleted successfully', 'success');
    }
    setCurrentPage(1);
  };

  const handleAddUser = () => {
    if (!newUser.email || !newUser.phone) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    
    const newId = `USR-${String(allUsers.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    
    const userToAdd: User = {
      ...newUser,
      id: newId,
      joinDate: today
    };
    
    setNewlyAddedUsers([userToAdd, ...newlyAddedUsers]);
    setIsAddUserOpen(false);
    setNewUser({
      email: '',
      phone: '',
      status: 'active',
      role: 'customer'
    });
    setCurrentPage(1);
    showToast('User added successfully', 'success');
  };

  const handleUpdateUser = () => {
    if (editUser) {
      const userIndex = newlyAddedUsers.findIndex(u => u.id === editUser.id);
      
      if (userIndex !== -1) {
        const updatedNewUsers = [...newlyAddedUsers];
        updatedNewUsers[userIndex] = editUser;
        setNewlyAddedUsers(updatedNewUsers);
      } else {
        setNewlyAddedUsers([editUser, ...newlyAddedUsers]);
      }
      
      setIsEditUserOpen(false);
      setEditUser(null);
      showToast('User updated successfully', 'success');
    }
  };

  const handleFilterApply = () => {
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleFilterReset = () => {
    setFilters({
      status: '',
      role: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    
    const matchesStatus = filters.status ? user.status === filters.status : true;
    const matchesRole = filters.role ? user.role === filters.role : true;
    
    const joinDate = new Date(user.joinDate);
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;
    
    let matchesDate = true;
    if (fromDate && toDate) {
      matchesDate = joinDate >= fromDate && joinDate <= toDate;
    } else if (fromDate) {
      matchesDate = joinDate >= fromDate;
    } else if (toDate) {
      matchesDate = joinDate <= toDate;
    }
    
    return matchesSearch && matchesStatus && matchesRole && matchesDate;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const statusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const roleVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'manager': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'staff': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <AdminIcon className="h-4 w-4" />;
      case 'manager': return <ManagerIcon className="h-4 w-4" />;
      case 'staff': return <StaffIcon className="h-4 w-4" />;
      default: return <CustomerIcon className="h-4 w-4" />;
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["ID", "Email", "Phone", "Join Date", "Status", "Role"],
      ...allUsers.map(user => [
        user.id,
        user.email,
        user.phone,
        user.joinDate,
        user.status,
        user.role
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Users exported successfully', 'success');
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

  // Calculate stats for cards
  const stats = {
    total: allUsers.length,
    active: allUsers.filter(u => u.status === 'active').length,
    inactive: allUsers.filter(u => u.status === 'inactive').length,
    admin: allUsers.filter(u => u.role === 'admin').length,
    manager: allUsers.filter(u => u.role === 'manager').length,
    staff: allUsers.filter(u => u.role === 'staff').length,
    customer: allUsers.filter(u => u.role === 'customer').length,
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
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage all registered users of ScanSewa</p>
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
            onClick={() => setIsAddUserOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <AddIcon className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users size={16} /> Total Users
          </h3>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </div>

        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ActiveIcon size={16} /> Active Users
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
            <InactiveIcon size={16} /> Inactive Users
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
            <AdminIcon size={16} /> Admin Users
          </h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.admin}</p>
          <p className="text-sm text-muted-foreground">-2% from last month</p>
        </div>

        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ManagerIcon size={16} /> Managers
          </h3>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.manager}</p>
          <p className="text-sm text-muted-foreground">+5% from last month</p>
        </div>

        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <StaffIcon size={16} /> Staff
          </h3>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.staff}</p>
          <p className="text-sm text-muted-foreground">+8% from last month</p>
        </div>

        <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CustomerIcon size={16} /> Customers
          </h3>
          <p className="text-2xl font-bold text-foreground">{stats.customer}</p>
          <p className="text-sm text-muted-foreground">+15% from last month</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search users..."
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
            </select>
          </div>
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <select
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="pl-10 pr-8 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-background text-foreground"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <EmailIcon size={16} className="text-muted-foreground" />
                        <span className="text-foreground">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <PhoneIcon size={16} className="text-muted-foreground" />
                        <span className="text-foreground">{user.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-muted-foreground" />
                        <span className="text-foreground">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${statusVariant(user.status)}`}>
                        {user.status === 'active' ? <ActiveIcon className="h-4 w-4" /> : <InactiveIcon className="h-4 w-4" />}
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${roleVariant(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        <ViewIcon size={16} />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 mr-4"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <DeleteIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-muted-foreground">
                    No users found
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
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
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

      {/* Add User Dialog */}
      {isAddUserOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Add New User</h2>
              <button 
                onClick={() => setIsAddUserOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Email Address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                <input
                  type="text"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Phone Number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="flex-1 px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={!newUser.email || !newUser.phone}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Dialog */}
      {isEditUserOpen && editUser && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Edit User</h2>
              <button 
                onClick={() => setIsEditUserOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                <input
                  type="text"
                  value={editUser.phone}
                  onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({...editUser, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                <select
                  value={editUser.status}
                  onChange={(e) => setEditUser({...editUser, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditUserOpen(false)}
                className="flex-1 px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={!editUser.email || !editUser.phone}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View User Dialog */}
      {isViewUserOpen && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">User Details</h2>
              <button 
                onClick={() => setIsViewUserOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-foreground">{selectedUser.email.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <PhoneIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{selectedUser.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedUser.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-5 w-5 flex items-center justify-center">
                  {selectedUser.status === 'active' ? <ActiveIcon className="h-5 w-5 text-green-500" /> : <InactiveIcon className="h-5 w-5 text-red-500" />}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground">
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-5 w-5 flex items-center justify-center">
                  {getRoleIcon(selectedUser.role)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium text-foreground">
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-medium text-foreground">{selectedUser.id}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsViewUserOpen(false)}
                className="flex-1 px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsViewUserOpen(false);
                  handleEditUser(selectedUser);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit User
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
              <h2 className="text-xl font-semibold text-foreground">Filter Users</h2>
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
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Join Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">From</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">To</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                </div>
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

export default UserManagement;