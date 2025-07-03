'use client'
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
          </TabsList>
  
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.3s</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>15% faster than last week</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.8%</div>
                  <Progress value={99.8} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.2%</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingDown className="h-3 w-3" />
                    <span>50% reduction</span>
                  </div>
                </CardContent>
              </Card>
            </div>
  
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-1">
                  {Array.from({ length: 30 }, (_, i) => Math.random() * 100).map((value, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-gradient-to-t from-green-500 to-green-300 w-3 rounded-t"
                        style={{ height: `${(value / 100) * 200}px` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
  
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
  
          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,456</div>
                  <div className="text-xs text-muted-foreground">This month</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Cost per Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8.45</div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingDown className="h-3 w-3" />
                    <span>5% reduction</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23.5%</div>
                  <Progress value={23.5} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }