'use client';

import React, { useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import {
  Person as PersonIcon,
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
  PersonOutline as CustomerIcon
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
  IconButton
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
  role: 'admin' | 'manager' | 'staff' | 'customer';
}

const UserManagement = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const users: User[] = [
    {
      id: 'USR-001',
      name: 'Ramesh Shrestha',
      email: 'ramesh@example.com',
      phone: '+977 9841000001',
      joinDate: '2023-01-15',
      status: 'active',
      role: 'customer'
    },
    {
      id: 'USR-002',
      name: 'Sita Gurung',
      email: 'sita@example.com',
      phone: '+977 9841000002',
      joinDate: '2023-02-20',
      status: 'active',
      role: 'customer'
    },
    {
      id: 'USR-003',
      name: 'Admin User',
      email: 'admin@scansewa.com',
      phone: '+977 9841000003',
      joinDate: '2022-11-05',
      status: 'active',
      role: 'admin',
      avatar: '/admin-avatar.jpg'
    },
    {
      id: 'USR-004',
      name: 'Hari Bahadur',
      email: 'hari@example.com',
      phone: '+977 9841000004',
      joinDate: '2023-03-10',
      status: 'inactive',
      role: 'customer'
    },
    {
      id: 'USR-005',
      name: 'Gita Kumari',
      email: 'gita@example.com',
      phone: '+977 9841000005',
      joinDate: '2023-04-25',
      status: 'active',
      role: 'manager'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

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
          <h1 className="text-2xl font-bold">
            User Management
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage all registered users of ScanSewa
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant="outline"
            className={darkMode ? 'border-orange-500 text-orange-500 hover:bg-orange-900' : ''}
          >
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
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
                <h3 className="text-xl font-bold">{users.length}</h3>
              </div>
              <Avatar className={`${darkMode ? 'bg-orange-900' : 'bg-orange-100'}`}>
                <PersonIcon className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
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
                  {users.filter(u => u.status === 'active').length}
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
                  {users.filter(u => u.role === 'admin').length}
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
                  {users.filter(u => u.status === 'inactive').length}
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
                <TableCell>Contact</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  hover 
                  className={darkMode ? 'hover:bg-gray-900' : ''}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <EmailIcon className={`text-sm mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className={`text-sm mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.phone}
                        </span>
                      </div>
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
                    <IconButton className={darkMode ? 'text-orange-500 hover:bg-gray-900' : 'text-orange-500'}>
                      <MoreIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  );
};

export default UserManagement;