import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, RefreshCw, Package } from "lucide-react";
import React from "react";
export default function InventoryPage() {
    return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Inventory</h1>
              <p className="text-muted-foreground">Manage and track your inventory items</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
    
          {/* Inventory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-xs text-muted-foreground">Across all locations</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">14</div>
                <div className="text-xs text-muted-foreground">Needs reorder</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <div className="text-xs text-muted-foreground">Immediate attention</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expired Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">2</div>
                <div className="text-xs text-muted-foreground">Remove from stock</div>
              </CardContent>
            </Card>
          </div>
    
          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Inventory Items</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search items..." className="pl-8 w-64" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Item Name</th>
                      <th className="text-left p-2">SKU</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Stock Level</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Tomatoes",
                        sku: "VEG001",
                        category: "Vegetables",
                        stock: 45,
                        location: "Store 1",
                        status: "good",
                      },
                      {
                        name: "Chicken Breast",
                        sku: "MEAT001",
                        category: "Meat",
                        stock: 8,
                        location: "Store 2",
                        status: "low",
                      },
                      {
                        name: "Olive Oil",
                        sku: "OIL001",
                        category: "Condiments",
                        stock: 0,
                        location: "Store 3",
                        status: "out",
                      },
                      { name: "Pasta", sku: "CARB001", category: "Carbs", stock: 23, location: "Store 1", status: "good" },
                      { name: "Milk", sku: "DAIRY001", category: "Dairy", stock: 12, location: "Store 2", status: "good" },
                    ].map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-muted-foreground">{item.sku}</td>
                        <td className="p-2">{item.category}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span>{item.stock}</span>
                            <Progress value={item.stock > 20 ? 80 : item.stock > 10 ? 40 : 10} className="w-16" />
                          </div>
                        </td>
                        <td className="p-2">{item.location}</td>
                        <td className="p-2">
                          <Badge
                            variant={
                              item.status === "good" ? "default" : item.status === "low" ? "secondary" : "destructive"
                            }
                          >
                            {item.status === "good" ? "In Stock" : item.status === "low" ? "Low Stock" : "Out of Stock"}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )
}