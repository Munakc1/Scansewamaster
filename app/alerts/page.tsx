'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Filter, Eye, XCircle, CheckCircle } from 'lucide-react';

export default function AlertsPage() {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Alerts & Logs</h1>
            <p className="text-muted-foreground">Monitor system alerts and activity logs</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
  
        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-xs text-muted-foreground">Requires immediate action</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Warning Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-xs text-muted-foreground">Monitor closely</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Info Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-xs text-muted-foreground">For your information</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-xs text-muted-foreground">Successfully resolved</div>
            </CardContent>
          </Card>
        </div>
  
        {/* Alerts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: "critical",
                  message: "Payment gateway connection failed",
                  location: "Store 3",
                  time: "2 minutes ago",
                  status: "active",
                },
                {
                  type: "warning",
                  message: "High CPU usage detected",
                  location: "Server 1",
                  time: "5 minutes ago",
                  status: "active",
                },
                {
                  type: "critical",
                  message: "POS system disconnected",
                  location: "Store 2",
                  time: "8 minutes ago",
                  status: "resolved",
                },
                {
                  type: "info",
                  message: "Daily backup completed",
                  location: "System",
                  time: "1 hour ago",
                  status: "resolved",
                },
                {
                  type: "warning",
                  message: "Low disk space warning",
                  location: "Server 2",
                  time: "2 hours ago",
                  status: "active",
                },
              ].map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        alert.type === "critical"
                          ? "bg-red-500"
                          : alert.type === "warning"
                            ? "bg-orange-500"
                            : "bg-blue-500"
                      }`}
                    ></div>
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-muted-foreground">
                        {alert.location} • {alert.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.status === "active" ? "destructive" : "default"}>
                      {alert.status === "active" ? (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </>
                      )}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }