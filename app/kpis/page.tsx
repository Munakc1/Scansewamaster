'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Package, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, Calendar, Download, Filter, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';


export default function KPIsPage() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Key Performance Indicators</h1>
            <p className="text-muted-foreground">Track and analyze your business performance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
  
        <Tabs defaultValue="orders" className="space-y-6 ">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className='cursor-pointer' value="orders">Orders</TabsTrigger>
            <TabsTrigger className='cursor-pointer' value="products">Products</TabsTrigger>
          </TabsList>
  
  
          <TabsContent value="orders" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Orders</h2>
              <p className="text-muted-foreground">Manage and track customer orders</p>
            </div>
  
            {/* Search and Filters */}
            <div className="flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search orders (ID, Customer, Phone)" className="pl-8" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
  
            {/* Orders Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">
                          <div className="flex items-center gap-2">
                            Order ID
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium">
                          <div className="flex items-center gap-2">
                            Customer
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium">
                          <div className="flex items-center gap-2">
                            Date
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">
                          <div className="flex items-center gap-2">
                            Total
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium">Items</th>
                        <th className="text-left p-4 font-medium">Payment</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          No orders found. Try adjusting your filters.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
  
          <TabsContent value="products" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Products</h2>
            <p className="text-muted-foreground">Manage and track all your products</p>
          </div>

          {/* Product Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">284</div>
                <div className="text-xs text-muted-foreground">Across all categories</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">267</div>
                <div className="text-xs text-muted-foreground">Currently available</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">12</div>
                <div className="text-xs text-muted-foreground">Need restocking</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">5</div>
                <div className="text-xs text-muted-foreground">Below threshold</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products (Name, SKU, Category)" className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Category
              </Button>
              <Button variant="outline">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">
                        <div className="flex items-center gap-2">
                          Product
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <div className="flex items-center gap-2">
                          SKU
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <div className="flex items-center gap-2">
                          Category
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 font-medium">
                        <div className="flex items-center gap-2">
                          Price
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="text-left p-4 font-medium">Stock</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Restaurant</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Margherita Pizza",
                        sku: "PIZZA001",
                        category: "Pizza",
                        price: 12.99,
                        stock: 45,
                        status: "active",
                        restaurant: "Store 1",
                  
                      },
                      {
                        name: "Chicken Caesar Salad",
                        sku: "SALAD001",
                        category: "Salads",
                        price: 9.99,
                        stock: 23,
                        status: "active",
                        restaurant: "Store 2",
                        // image: "/placeholder.svg?height=40&width=40",
                      },
                      {
                        name: "Beef Burger Deluxe",
                        sku: "BURGER001",
                        category: "Burgers",
                        price: 15.99,
                        stock: 0,
                        status: "out_of_stock",
                        restaurant: "Store 1",
                        // image: "/placeholder.svg?height=40&width=40",
                      },
                      {
                        name: "Spaghetti Carbonara",
                        sku: "PASTA001",
                        category: "Pasta",
                        price: 13.99,
                        stock: 18,
                        status: "active",
                        restaurant: "Store 3",
                        // image: "/placeholder.svg?height=40&width=40",
                      },
                      {
                        name: "Chocolate Brownie",
                        sku: "DESSERT001",
                        category: "Desserts",
                        price: 6.99,
                        stock: 8,
                        status: "low_stock",
                        restaurant: "Store 2",
                        // image: "/placeholder.svg?height=40&width=40",
                      },
                      {
                        name: "Fish & Chips",
                        sku: "FISH001",
                        category: "Seafood",
                        price: 16.99,
                        stock: 32,
                        status: "active",
                        restaurant: "Store 1",
                        // image: "/placeholder.svg?height=40&width=40",
                      },
                      {
                        name: "Vegetable Stir Fry",
                        sku: "VEG001",
                        category: "Vegetarian",
                        price: 11.99,
                        stock: 15,
                        status: "active",
                        restaurant: "Store 3",
                        // image: "/placeholder.svg?height=40&width=40",
                      },
                      {
                        name: "BBQ Chicken Wings",
                        sku: "WINGS001",
                        category: "Appetizers",
                        price: 8.99,
                        stock: 0,
                        status: "out_of_stock",
                        restaurant: "Store 2",
                        // image: "/placeholder.svg?height=40&width=40",
                      },
                      {
                        name: "Greek Salad",
                        sku: "SALAD002",
                        category: "Salads",
                        price: 10.99,
                        stock: 27,
                        status: "active",
                        restaurant: "Store 1",
                        // image: "/placeholder.svg?height=40&width=40",
                      },
                      {
                        name: "Pepperoni Pizza",
                        sku: "PIZZA002",
                        category: "Pizza",
                        price: 14.99,
                        stock: 3,
                        status: "low_stock",
                        restaurant: "Store 3",
                        // image: "/placeholder.svg?height=40&width=40",
                      },
                    ].map((product, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {/* `<img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />` */}
                            <div>
                              <div className="font-medium">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{product.sku}</td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4 font-medium">${product.price}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span>{product.stock}</span>
                            <Progress
                              value={product.stock > 20 ? 80 : product.stock > 10 ? 40 : product.stock > 0 ? 20 : 0}
                              className="w-16"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              product.status === "active"
                                ? "default"
                                : product.status === "low_stock"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {product.status === "active"
                              ? "Active"
                              : product.status === "low_stock"
                                ? "Low Stock"
                                : "Out of Stock"}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{product.restaurant}</td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Showing 1-10 of 284 products</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
        </Tabs>
      </div>
    )
  }