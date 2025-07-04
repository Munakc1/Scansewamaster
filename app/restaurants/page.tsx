'use client';

import React, { useState } from 'react';
import { useTheme } from '../components/ThemeContext';
import {
  Star as StarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  ArrowDropDown as ArrowDropDownIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  WatchLater as PendingIcon
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
  useMediaQuery
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  cuisine: string;
  location: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
}

const RestaurantManagement = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 5;
  const isMobile = useMediaQuery('(max-width:600px)');

  // Sample restaurant data - EXACTLY THE SAME AS YOUR SECOND EXAMPLE
  const restaurants: Restaurant[] = [
    {
      id: 1,
      name: 'The Gourmet Kitchen',
      image: '/restaurant1.jpg',
      rating: 4.5,
      cuisine: 'Italian, Mediterranean',
      location: '123 Main St, Cityville',
      phone: '+1 555-123-4567',
      email: 'contact@gourmetkitchen.com',
      status: 'active'
    },
    {
      id: 2,
      name: 'Spice Paradise',
      image: '/restaurant2.jpg',
      rating: 4.2,
      cuisine: 'Indian, Asian',
      location: '456 Oak Ave, Townsville',
      phone: '+1 555-987-6543',
      email: 'info@spiceparadise.com',
      status: 'active'
    },
    {
      id: 3,
      name: 'Burger Barn',
      image: '/restaurant3.jpg',
      rating: 3.8,
      cuisine: 'American, Fast Food',
      location: '789 Elm Blvd, Villageton',
      phone: '+1 555-456-7890',
      email: 'hello@burgerbarn.com',
      status: 'pending'
    },
    {
      id: 4,
      name: 'Sushi Heaven',
      image: '/restaurant4.jpg',
      rating: 4.7,
      cuisine: 'Japanese, Sushi',
      location: '321 Pine Rd, Hamlet City',
      phone: '+1 555-789-0123',
      email: 'reservations@sushiheaven.com',
      status: 'active'
    },
    {
      id: 5,
      name: 'Taco Fiesta',
      image: '/restaurant5.jpg',
      rating: 4.0,
      cuisine: 'Mexican, Latin',
      location: '654 Maple Ln, Boroughburg',
      phone: '+1 555-234-5678',
      email: 'hola@tacofiesta.com',
      status: 'inactive'
    }
  ];

  // Same filtering logic
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Same pagination logic
  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);
  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  // Same status color logic
  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  // Same status icon logic
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <ActiveIcon fontSize="small" />;
      case 'inactive': return <InactiveIcon fontSize="small" />;
      case 'pending': return <PendingIcon fontSize="small" />;
      default: return <StarIcon fontSize="small" />;
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header and Actions - with UI from first example */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Restaurant Management
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage all your restaurant partners in one place
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
            Add Restaurant
          </Button>
        </div>
      </div>

      {/* Search Input - with UI from first example */}
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

      {/* Stats Cards - with UI from first example */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {/* Total Restaurants */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Total Restaurants</p>
                <h3 className="text-xl font-bold">{restaurants.length}</h3>
              </div>
              <Avatar className={`${darkMode ? 'bg-orange-900' : 'bg-orange-100'}`}>
                <StarIcon className={`${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              </Avatar>
            </div>
            <div className="mt-2 flex items-center">
              <ArrowDropDownIcon className="text-green-500 rotate-180" />
              <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-500'} ml-1`}>12% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Restaurants */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Active Restaurants</p>
                <h3 className="text-xl font-bold">
                  {restaurants.filter(r => r.status === 'active').length}
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

        {/* Pending Approval */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Pending Approval</p>
                <h3 className="text-xl font-bold">
                  {restaurants.filter(r => r.status === 'pending').length}
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

        {/* Inactive Restaurants */}
        <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'}`}>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Inactive Restaurants</p>
                <h3 className="text-xl font-bold">
                  {restaurants.filter(r => r.status === 'inactive').length}
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

      {/* Restaurant Table - with UI from first example */}
      <Card className={`shadow-lg ${darkMode ? '!bg-black' : 'bg-white'} mb-8`}>
        <TableContainer component={Paper} className={darkMode ? '!bg-black' : ''}>
          <Table>
            <TableHead className={darkMode ? '!bg-gray-900' : 'bg-gray-50'}>
              <TableRow>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRestaurants.map((restaurant) => (
                <TableRow 
                  key={restaurant.id} 
                  hover 
                  className={darkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <LocationIcon className={`text-sm mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {restaurant.location}
                        </span>
                      </div>
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

      {/* Pagination - with UI from first example */}
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
    </div>
  );
};

export default RestaurantManagement;