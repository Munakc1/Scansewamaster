'use client';

import React, { useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AdminPanelSettings as AdminIcon,
  Engineering as ManagerIcon,
  Groups as StaffIcon,
  PersonOutline as CustomerIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Menu
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const usersPerPage = 5;

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleViewUser = () => {
    if (selectedUser) {
      setIsViewUserOpen(true);
    }
    handleMenuClose();
  };

  const handleEditUser = () => {
    if (selectedUser) {
      setEditUser({...selectedUser});
      setIsEditUserOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      // Check if the user is in newly added users
      const userIndex = newlyAddedUsers.findIndex(u => u.id === selectedUser.id);
      
      if (userIndex !== -1) {
        // Remove from newly added users
        const updatedNewUsers = [...newlyAddedUsers];
        updatedNewUsers.splice(userIndex, 1);
        setNewlyAddedUsers(updatedNewUsers);
      } else {
        // Remove from initial users (just filter from display)
        const updatedInitialUsers = initialUsers.filter(user => user.id !== selectedUser.id);
        // Note: Since initialUsers is const, you might want to use state for this if you need to modify it
      }
      
      setCurrentPage(1); // Reset to first page after deletion
    }
    handleMenuClose();
  };

  const handleAddUser = () => {
    const newId = `USR-${String(initialUsers.length + newlyAddedUsers.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    
    const userToAdd: User = {
      ...newUser,
      id: newId,
      joinDate: today
    };
    
    // Add new user to the beginning of the array
    setNewlyAddedUsers([userToAdd, ...newlyAddedUsers]);
    
    setIsAddUserOpen(false);
    setNewUser({
      email: '',
      phone: '',
      status: 'active',
      role: 'customer'
    });
    setCurrentPage(1); // Reset to first page to see the new user
  };

  const handleUpdateUser = () => {
    if (editUser) {
      // Check if the user is in newly added users
      const userIndex = newlyAddedUsers.findIndex(u => u.id === editUser.id);
      
      if (userIndex !== -1) {
        // Update in newly added users
        const updatedNewUsers = [...newlyAddedUsers];
        updatedNewUsers[userIndex] = editUser;
        setNewlyAddedUsers(updatedNewUsers);
      } else {
        // Update in initial users (would need state management if you want to persist changes)
        // For now, we'll just update the display
      }
      
      setIsEditUserOpen(false);
      setEditUser(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <AdminIcon fontSize="small" />;
      case 'manager': return <ManagerIcon fontSize="small" />;
      case 'staff': return <StaffIcon fontSize="small" />;
      default: return <CustomerIcon fontSize="small" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'primary';
      case 'manager': return 'secondary';
      case 'staff': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage all registered users of ScanSewa
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant="outline"
            className={darkMode ? 'border-orange-500 text-orange-500 hover:bg-orange-900' : ''}
            onClick={() => setIsFilterOpen(true)}
          >
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setIsAddUserOpen(true)}
          >
            <AddIcon className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative w-full md:w-64">
          <div className="relative flex items-center">
            <span className={`absolute left-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <SearchIcon className="h-4 w-4" />
            </span>
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${darkMode ? 'bg-black text-white border-gray-700 focus:border-orange-500' : 'bg-white text-black border-gray-300 focus:border-orange-500'}`}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {/* Total Users */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Users</p>
                <h3 className="text-xl font-bold">{allUsers.length}</h3>
              </div>
              <Avatar className={`${darkMode ? 'bg-orange-900' : 'bg-orange-100'}`}>
                <CustomerIcon className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              </Avatar>
            </div>
            <div className="mt-2 flex items-center">
              <ArrowDropDownIcon className="text-green-500 rotate-180" />
              <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-500'} ml-1`}>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Active Users</p>
                <h3 className="text-xl font-bold">
                  {allUsers.filter(u => u.status === 'active').length}
                </h3>
              </div>
              <Avatar className={`${darkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <ActiveIcon className={`${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </Avatar>
            </div>
            <div className="mt-2 flex items-center">
              <ArrowDropDownIcon className="text-green-500 rotate-180" />
              <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-500'} ml-1`}>8% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Admin Users */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Admin Users</p>
                <h3 className="text-xl font-bold">
                  {allUsers.filter(u => u.role === 'admin').length}
                </h3>
              </div>
              <Avatar className={`${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <AdminIcon className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </Avatar>
            </div>
            <div className="mt-2 flex items-center">
              <ArrowDropDownIcon className="text-red-500" />
              <span className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} ml-1`}>2% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Inactive Users */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Inactive Users</p>
                <h3 className="text-xl font-bold">
                  {allUsers.filter(u => u.status === 'inactive').length}
                </h3>
              </div>
              <Avatar className={`${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                <InactiveIcon className={`${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </Avatar>
            </div>
            <div className="mt-2 flex items-center">
              <ArrowDropDownIcon className="text-green-500 rotate-180" />
              <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-500'} ml-1`}>5% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'} mb-8`}>
        <TableContainer component={Paper} className={darkMode ? '!bg-black' : ''}>
          <Table>
            <TableHead className={darkMode ? '!bg-gray-900' : 'bg-gray-50'}>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    hover 
                    className={darkMode ? 'hover:bg-gray-900' : ''}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <EmailIcon className={`text-sm mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <PhoneIcon className={`text-sm mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className={`text-sm mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(user.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        color={getStatusColor(user.status)}
                        icon={user.status === 'active' ? <ActiveIcon fontSize="small" /> : <InactiveIcon fontSize="small" />}
                        size="small"
                        className={darkMode ? 'text-white' : ''}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        icon={getRoleIcon(user.role)}
                        size="small"
                        className={darkMode ? 'text-white' : ''}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        className={darkMode ? 'text-orange-500 hover:bg-gray-900' : 'text-orange-500'}
                        onClick={(e) => handleMenuOpen(e, user)}
                      >
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 px-2">
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
        </span>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className={darkMode ? 'border-gray-700 text-gray-300' : ''}
          >
            Previous
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            className={darkMode ? 'bg-orange-900 text-white' : ''}
          >
            {currentPage}
          </Button>
          {totalPages > 1 && (
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(2)}
              className={darkMode ? 'border-gray-700 text-gray-300' : ''}
            >
              2
            </Button>
          )}
          <Button 
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className={darkMode ? 'border-gray-700 text-gray-300' : ''}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          className: darkMode ? 'bg-gray-800 text-white' : ''
        }}
      >
        <MenuItem onClick={handleViewUser} className={darkMode ? 'hover:bg-gray-700' : ''}>
          <ViewIcon className="mr-2" fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditUser} className={darkMode ? 'hover:bg-gray-700' : ''}>
          <EditIcon className="mr-2" fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteUser} 
          className={darkMode ? 'hover:bg-gray-700 text-red-400' : 'text-red-500'}
        >
          <DeleteIcon className="mr-2" fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* Add User Dialog */}
      <Dialog 
        open={isAddUserOpen} 
        onClose={() => setIsAddUserOpen(false)}
        PaperProps={{
          className: darkMode ? 'bg-gray-800 text-white' : ''
        }}
      >
        <DialogTitle className={darkMode ? 'bg-gray-900 text-white' : ''}>
          Add New User
          <IconButton 
            aria-label="close" 
            onClick={() => setIsAddUserOpen(false)}
            className="absolute right-4 top-4"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="pt-6">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                className: darkMode ? 'text-gray-300' : ''
              }}
              InputProps={{
                className: darkMode ? 'text-white' : ''
              }}
            />
            <TextField
              label="Phone Number"
              value={newUser.phone}
              onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                className: darkMode ? 'text-gray-300' : ''
              }}
              InputProps={{
                className: darkMode ? 'text-white' : ''
              }}
            />
            <FormControl fullWidth>
              <InputLabel className={darkMode ? 'text-gray-300' : ''}>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                label="Role"
                className={darkMode ? 'text-white' : ''}
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel className={darkMode ? 'text-gray-300' : ''}>Status</InputLabel>
              <Select
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value as any})}
                label="Status"
                className={darkMode ? 'text-white' : ''}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions className={darkMode ? 'bg-gray-900' : ''}>
          <Button 
            variant="outline"
            onClick={() => setIsAddUserOpen(false)}
            className={darkMode ? 'text-white border-gray-600 hover:bg-gray-800' : ''}
          >
            Cancel
          </Button>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleAddUser}
            disabled={!newUser.email || !newUser.phone}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog 
        open={isEditUserOpen} 
        onClose={() => setIsEditUserOpen(false)}
        PaperProps={{
          className: darkMode ? 'bg-gray-800 text-white' : ''
        }}
      >
        <DialogTitle className={darkMode ? 'bg-gray-900 text-white' : ''}>
          Edit User
          <IconButton 
            aria-label="close" 
            onClick={() => setIsEditUserOpen(false)}
            className="absolute right-4 top-4"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="pt-6">
          {editUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Email"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  className: darkMode ? 'text-gray-300' : ''
                }}
                InputProps={{
                  className: darkMode ? 'text-white' : ''
                }}
              />
              <TextField
                label="Phone Number"
                value={editUser.phone}
                onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  className: darkMode ? 'text-gray-300' : ''
                }}
                InputProps={{
                  className: darkMode ? 'text-white' : ''
                }}
              />
              <FormControl fullWidth>
                <InputLabel className={darkMode ? 'text-gray-300' : ''}>Role</InputLabel>
                <Select
                  value={editUser.role}
                  onChange={(e) => setEditUser({...editUser, role: e.target.value as any})}
                  label="Role"
                  className={darkMode ? 'text-white' : ''}
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel className={darkMode ? 'text-gray-300' : ''}>Status</InputLabel>
                <Select
                  value={editUser.status}
                  onChange={(e) => setEditUser({...editUser, status: e.target.value as any})}
                  label="Status"
                  className={darkMode ? 'text-white' : ''}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions className={darkMode ? 'bg-gray-900' : ''}>
          <Button 
            variant="outline"
            onClick={() => setIsEditUserOpen(false)}
            className={darkMode ? 'text-white border-gray-600 hover:bg-gray-800' : ''}
          >
            Cancel
          </Button>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleUpdateUser}
            disabled={!editUser?.email || !editUser?.phone}
          >
            Update User
          </Button>
        </DialogActions>
      </Dialog>

      {/* View User Dialog */}
      <Dialog 
        open={isViewUserOpen} 
        onClose={() => setIsViewUserOpen(false)}
        PaperProps={{
          className: darkMode ? 'bg-gray-800 text-white' : ''
        }}
      >
        <DialogTitle className={darkMode ? 'bg-gray-900 text-white' : ''}>
          User Details
          <IconButton 
            aria-label="close" 
            onClick={() => setIsViewUserOpen(false)}
            className="absolute right-4 top-4"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="pt-6">
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div className="flex items-center">
                <EmailIcon className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <Typography>Email: {selectedUser.email}</Typography>
              </div>
              <div className="flex items-center">
                <PhoneIcon className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <Typography>Phone: {selectedUser.phone}</Typography>
              </div>
              <div className="flex items-center">
                <CalendarIcon className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <Typography>
                  Join Date: {new Date(selectedUser.joinDate).toLocaleDateString()}
                </Typography>
              </div>
              <div className="flex items-center">
                <Typography component="span" className="mr-2">Status:</Typography>
                <Chip
                  label={selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  color={getStatusColor(selectedUser.status)}
                  icon={selectedUser.status === 'active' ? <ActiveIcon fontSize="small" /> : <InactiveIcon fontSize="small" />}
                  size="small"
                  className={darkMode ? 'text-white' : ''}
                />
              </div>
              <div className="flex items-center">
                <Typography component="span" className="mr-2">Role:</Typography>
                <Chip
                  label={selectedUser.role}
                  color={getRoleColor(selectedUser.role)}
                  icon={getRoleIcon(selectedUser.role)}
                  size="small"
                  className={darkMode ? 'text-white' : ''}
                />
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions className={darkMode ? 'bg-gray-900' : ''}>
          <Button 
            variant="outline"
            onClick={() => setIsViewUserOpen(false)}
            className={darkMode ? 'text-white border-gray-600 hover:bg-gray-800' : ''}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog 
        open={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        PaperProps={{
          className: darkMode ? 'bg-gray-800 text-white' : ''
        }}
      >
        <DialogTitle className={darkMode ? 'bg-gray-900 text-white' : ''}>
          Filter Users
          <IconButton 
            aria-label="close" 
            onClick={() => setIsFilterOpen(false)}
            className="absolute right-4 top-4"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="pt-6">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel className={darkMode ? 'text-gray-300' : ''}>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                label="Status"
                className={darkMode ? 'text-white' : ''}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel className={darkMode ? 'text-gray-300' : ''}>Role</InputLabel>
              <Select
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
                label="Role"
                className={darkMode ? 'text-white' : ''}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="subtitle1" className={darkMode ? 'text-gray-300' : ''}>
              Join Date Range
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="From"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  className: darkMode ? 'text-gray-300' : ''
                }}
                InputProps={{
                  className: darkMode ? 'text-white' : ''
                }}
              />
              <TextField
                label="To"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  className: darkMode ? 'text-gray-300' : ''
                }}
                InputProps={{
                  className: darkMode ? 'text-white' : ''
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions className={darkMode ? 'bg-gray-900' : ''}>
          <Button 
            variant="outline"
            onClick={handleFilterReset}
            className={darkMode ? 'text-white border-gray-600 hover:bg-gray-800' : ''}
          >
            Reset
          </Button>
          <Button 
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleFilterApply}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;