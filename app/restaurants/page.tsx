'use client';

import React, { useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import {
  Restaurant as RestaurantIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  ArrowDropDown as ArrowDropDownIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  WatchLater as PendingIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const restaurantsPerPage = 5;

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
    }
  ];

  // State for newly added restaurants
  const [newlyAddedRestaurants, setNewlyAddedRestaurants] = useState<Restaurant[]>([]);

  // Combine initial and new restaurants
  const allRestaurants = [...newlyAddedRestaurants, ...initialRestaurants];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, restaurant: Restaurant) => {
    setAnchorEl(event.currentTarget);
    setSelectedRestaurant(restaurant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRestaurant(null);
  };

  const handleViewRestaurant = () => {
    if (selectedRestaurant) {
      setIsViewRestaurantOpen(true);
    }
    handleMenuClose();
  };

  const handleEditRestaurant = () => {
    if (selectedRestaurant) {
      setEditRestaurant({ ...selectedRestaurant });
      setIsEditRestaurantOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteRestaurant = () => {
    if (selectedRestaurant) {
      const restaurantIndex = newlyAddedRestaurants.findIndex(r => r.id === selectedRestaurant.id);
      if (restaurantIndex !== -1) {
        // Remove from newly added restaurants
        const updatedNewRestaurants = [...newlyAddedRestaurants];
        updatedNewRestaurants.splice(restaurantIndex, 1);
        setNewlyAddedRestaurants(updatedNewRestaurants);
      } else {
        // Filter from initial restaurants (for display purposes)
        // Note: initialRestaurants is const, so changes are not persisted
      }
      setCurrentPage(1);
    }
    handleMenuClose();
  };

  const handleAddRestaurant = () => {
    if (!newRestaurant.name || !newRestaurant.phone || !newRestaurant.email) {
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
  };

  const handleUpdateRestaurant = () => {
    if (editRestaurant) {
      const restaurantIndex = newlyAddedRestaurants.findIndex(r => r.id === editRestaurant.id);
      if (restaurantIndex !== -1) {
        // Update in newly added restaurants
        const updatedNewRestaurants = [...newlyAddedRestaurants];
        updatedNewRestaurants[restaurantIndex] = editRestaurant;
        setNewlyAddedRestaurants(updatedNewRestaurants);
      } else {
        // Add to newly added restaurants if updating an initial restaurant
        setNewlyAddedRestaurants([editRestaurant, ...newlyAddedRestaurants]);
      }
      setIsEditRestaurantOpen(false);
      setEditRestaurant(null);
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

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <ActiveIcon fontSize="small" />;
      case 'inactive': return <InactiveIcon fontSize="small" />;
      case 'pending': return <PendingIcon fontSize="small" />;
      default: return <span />; // Return an empty span instead of null
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Restaurant Management</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage all restaurants in one place
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
            onClick={() => setIsAddRestaurantOpen(true)}
          >
            <AddIcon className="mr-2 h-4 w-4" />
            Add Restaurant
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
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${darkMode ? 'bg-black text-white border-gray-700 focus:border-orange-500' : 'bg-white text-black border-gray-300 focus:border-orange-500'}`}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Restaurants</p>
                <h3 className="text-xl font-bold">{allRestaurants.length}</h3>
              </div>
              <Avatar className={`${darkMode ? 'bg-orange-900' : 'bg-orange-100'}`}>
                <RestaurantIcon className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              </Avatar>
            </div>
            <div className="mt-2 flex items-center">
              <ArrowDropDownIcon className="text-green-500 rotate-180" />
              <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-500'} ml-1`}>10% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Active Restaurants</p>
                <h3 className="text-xl font-bold">
                  {allRestaurants.filter(r => r.status === 'active').length}
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

        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Pending Restaurants</p>
                <h3 className="text-xl font-bold">
                  {allRestaurants.filter(r => r.status === 'pending').length}
                </h3>
              </div>
              <Avatar className={`${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
                <PendingIcon className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </Avatar>
            </div>
            <div className="mt-2 flex items-center">
              <ArrowDropDownIcon className="text-red-500" />
              <span className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-500'} ml-1`}>2% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restaurants Table */}
      <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'} mb-8`}>
        <TableContainer component={Paper} className={darkMode ? '!bg-black' : ''}>
          <Table>
            <TableHead className={darkMode ? '!bg-gray-900' : 'bg-gray-50'}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRestaurants.length > 0 ? (
                currentRestaurants.map((restaurant) => (
                  <TableRow
                    key={restaurant.id}
                    hover
                    className={darkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="mr-3">
                          {restaurant.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body1" className="font-medium">
                          {restaurant.name}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center mb-1">
                          <PhoneIcon className={`text-sm mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {restaurant.phone}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <EmailIcon className={`text-sm mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {restaurant.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                        color={statusColor(restaurant.status)}
                        icon={getStatusIcon(restaurant.status)}
                        size="small"
                        className={darkMode ? 'text-white' : ''}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, restaurant)}
                        className={darkMode ? 'text-orange-500 hover:bg-gray-900' : 'text-orange-500'}
                      >
                        <MoreIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    No restaurants found
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
          Showing {indexOfFirstRestaurant + 1} to {Math.min(indexOfLastRestaurant, filteredRestaurants.length)} of {filteredRestaurants.length} entries
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          className: darkMode ? 'bg-gray-800 text-white' : ''
        }}
      >
        <MenuItem onClick={handleViewRestaurant} className={darkMode ? 'hover:bg-gray-700' : ''}>
          <ViewIcon className="mr-2" fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditRestaurant} className={darkMode ? 'hover:bg-gray-700' : ''}>
          <EditIcon className="mr-2" fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleDeleteRestaurant}
          className={darkMode ? 'hover:bg-gray-700 text-red-400' : 'text-red-500'}
        >
          <DeleteIcon className="mr-2" fontSize="small" />
          Delete
        </MenuItem>
      </Menu>

      {/* View Restaurant Dialog */}
      <Dialog
        open={isViewRestaurantOpen}
        onClose={() => setIsViewRestaurantOpen(false)}
        PaperProps={{
          className: darkMode ? 'bg-gray-800 text-white' : ''
        }}
      >
        <DialogTitle className={darkMode ? 'bg-gray-900 text-white' : ''}>
          Restaurant Details
          <IconButton
            aria-label="close"
            onClick={() => setIsViewRestaurantOpen(false)}
            className="absolute right-4 top-4"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="pt-6">
          {selectedRestaurant && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div className="flex items-center">
                <RestaurantIcon className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <Typography>Name: {selectedRestaurant.name}</Typography>
              </div>
              <div className="flex items-center">
                <PhoneIcon className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <Typography>Phone: {selectedRestaurant.phone}</Typography>
              </div>
              <div className="flex items-center">
                <EmailIcon className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <Typography>Email: {selectedRestaurant.email}</Typography>
              </div>
              <div className="flex items-center">
                <Typography component="span" className="mr-2">Status:</Typography>
                <Chip
                  label={selectedRestaurant.status.charAt(0).toUpperCase() + selectedRestaurant.status.slice(1)}
                  color={statusColor(selectedRestaurant.status)}
                  icon={getStatusIcon(selectedRestaurant.status)}
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
            onClick={() => setIsViewRestaurantOpen(false)}
            className={darkMode ? 'text-white border-gray-600 hover:bg-gray-800' : ''}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Restaurant Dialog */}
      <Dialog
        open={isAddRestaurantOpen}
        onClose={() => setIsAddRestaurantOpen(false)}
        PaperProps={{
          className: darkMode ? 'bg-gray-800 text-white' : ''
        }}
      >
        <DialogTitle className={darkMode ? 'bg-gray-900 text-white' : ''}>
          Add New Restaurant
          <IconButton
            aria-label="close"
            onClick={() => setIsAddRestaurantOpen(false)}
            className="absolute right-4 top-4"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="pt-6">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Restaurant Name"
              value={newRestaurant.name}
              onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{
                className: darkMode ? 'text-gray-300' : ''
              }}
              InputProps={{
                className: darkMode ? 'text-white' : ''
              }}
            />
            <TextField
              label="Phone Number"
              value={newRestaurant.phone}
              onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{
                className: darkMode ? 'text-gray-300' : ''
              }}
              InputProps={{
                className: darkMode ? 'text-white' : ''
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={newRestaurant.email}
              onChange={(e) => setNewRestaurant({...newRestaurant, email: e.target.value})}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{
                className: darkMode ? 'text-gray-300' : ''
              }}
              InputProps={{
                className: darkMode ? 'text-white' : ''
              }}
            />
            <FormControl fullWidth>
              <InputLabel className={darkMode ? 'text-gray-300' : ''}>Status</InputLabel>
              <Select
                value={newRestaurant.status}
                onChange={(e) => setNewRestaurant({...newRestaurant, status: e.target.value as any})}
                label="Status"
                className={darkMode ? 'text-white' : ''}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions className={darkMode ? 'bg-gray-900' : ''}>
          <Button
            variant="outline"
            onClick={() => setIsAddRestaurantOpen(false)}
            className={darkMode ? 'text-white border-gray-600 hover:bg-gray-800' : ''}
          >
            Cancel
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleAddRestaurant}
            disabled={!newRestaurant.name || !newRestaurant.phone || !newRestaurant.email}
          >
            Add Restaurant
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Restaurant Dialog */}
      <Dialog
        open={isEditRestaurantOpen}
        onClose={() => setIsEditRestaurantOpen(false)}
        PaperProps={{
          className: darkMode ? 'bg-gray-800 text-white' : ''
        }}
      >
        <DialogTitle className={darkMode ? 'bg-gray-900 text-white' : ''}>
          Edit Restaurant
          <IconButton
            aria-label="close"
            onClick={() => setIsEditRestaurantOpen(false)}
            className="absolute right-4 top-4"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="pt-6">
          {editRestaurant && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Restaurant Name"
                value={editRestaurant.name}
                onChange={(e) => setEditRestaurant({...editRestaurant, name: e.target.value})}
                fullWidth
                variant="outlined"
                required
                InputLabelProps={{
                  className: darkMode ? 'text-gray-300' : ''
                }}
                InputProps={{
                  className: darkMode ? 'text-white' : ''
                }}
              />
              <TextField
                label="Phone Number"
                value={editRestaurant.phone}
                onChange={(e) => setEditRestaurant({...editRestaurant, phone: e.target.value})}
                fullWidth
                variant="outlined"
                required
                InputLabelProps={{
                  className: darkMode ? 'text-gray-300' : ''
                }}
                InputProps={{
                  className: darkMode ? 'text-white' : ''
                }}
              />
              <TextField
                label="Email"
                type="email"
                value={editRestaurant.email}
                onChange={(e) => setEditRestaurant({...editRestaurant, email: e.target.value})}
                fullWidth
                variant="outlined"
                required
                InputLabelProps={{
                  className: darkMode ? 'text-gray-300' : ''
                }}
                InputProps={{
                  className: darkMode ? 'text-white' : ''
                }}
              />
              <FormControl fullWidth>
                <InputLabel className={darkMode ? 'text-gray-300' : ''}>Status</InputLabel>
                <Select
                  value={editRestaurant.status}
                  onChange={(e) => setEditRestaurant({...editRestaurant, status: e.target.value as any})}
                  label="Status"
                  className={darkMode ? 'text-white' : ''}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions className={darkMode ? 'bg-gray-900' : ''}>
          <Button
            variant="outline"
            onClick={() => setIsEditRestaurantOpen(false)}
            className={darkMode ? 'text-white border-gray-600 hover:bg-gray-800' : ''}
          >
            Cancel
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleUpdateRestaurant}
            disabled={!editRestaurant?.name || !editRestaurant?.phone || !editRestaurant?.email}
          >
            Update Restaurant
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
          Filter Restaurants
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
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
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

export default RestaurantManagement;