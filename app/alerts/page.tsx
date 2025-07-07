
"use client";

import React, { useState, useEffect } from "react";
import { Download, Upload, Eye, Search, Filter, Edit, Trash2, AlertTriangle, Info, CheckCircle, XCircle, Clock, X, Check, Send, MessageCircle } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AlertRow {
  id?: string;
  type: string;
  severity: string;
  message: string;
  restaurant: string;
  timestamp: string;
  status: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionMessage?: string;
}

interface LogRow {
  id?: string;
  level: string;
  action: string;
  user: string;
  details: string;
  timestamp: string;
  ip: string;
}

interface ResolutionModal {
  isOpen: boolean;
  alertIndex: number | null;
  alert: AlertRow | null;
}

const AlertsLogs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'logs'>('alerts');
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [alertsData, setAlertsData] = useState<AlertRow[]>([]);
  const [logsData, setLogsData] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; data: AlertRow | LogRow | null; type: 'alert' | 'log' | null }>({
    isOpen: false,
    data: null,
    type: null
  });
  const [resolutionModal, setResolutionModal] = useState<ResolutionModal>({
    isOpen: false,
    alertIndex: null,
    alert: null
  });
  const [resolutionMessage, setResolutionMessage] = useState("");
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: "",
    type: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setAlertsData([
          {
            id: "1",
            type: "System",
            severity: "Critical",
            message: "Database connection timeout",
            restaurant: "Gourmet Kitchen",
            timestamp: "2024-01-15T10:30:00Z",
            status: "Unread"
          },
          {
            id: "2",
            type: "Security",
            severity: "High",
            message: "Multiple failed login attempts",
            restaurant: "Spice Paradise",
            timestamp: "2024-01-15T09:15:00Z",
            status: "Read"
          },
          {
            id: "3",
            type: "Performance",
            severity: "Medium",
            message: "API response time exceeded threshold",
            restaurant: "Burger Barn",
            timestamp: "2024-01-15T08:45:00Z",
            status: "Resolved",
            resolvedBy: "Admin",
            resolvedAt: "2024-01-15T09:00:00Z",
            resolutionMessage: "Server resources optimized"
          }
        ]);

        setLogsData([
          {
            id: "1",
            level: "Info",
            action: "User Login",
            user: "john.doe@example.com",
            details: "User successfully logged in",
            timestamp: "2024-01-15T11:00:00Z",
            ip: "192.168.1.100"
          },
          {
            id: "2",
            level: "Warning",
            action: "Password Change",
            user: "admin@example.com",
            details: "User changed password",
            timestamp: "2024-01-15T10:45:00Z",
            ip: "192.168.1.101"
          },
          {
            id: "3",
            level: "Error",
            action: "API Call Failed",
            user: "system",
            details: "External API call failed with timeout",
            timestamp: "2024-01-15T10:30:00Z",
            ip: "192.168.1.102"
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: 'success' }), 3000);
  };

  const sendNotificationToUser = async (restaurant: string, message: string) => {
    console.log(`Sending notification to ${restaurant}: ${message}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  const filteredAlerts = alertsData.filter(row => {
    const matchesSearch = row.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         row.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "All" || row.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const filteredLogs = logsData.filter(row => {
    const matchesSearch = row.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         row.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         row.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "All" || row.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleExport = () => {
    const dataToExport = activeTab === 'alerts' ? filteredAlerts : filteredLogs;
    const headers = activeTab === 'alerts' 
      ? ["Type", "Severity", "Message", "Restaurant", "Timestamp", "Status", "Resolved By", "Resolved At", "Resolution Message"]
      : ["Level", "Action", "User", "Details", "Timestamp", "IP"];
    
    const csvContent = [
      headers,
      ...dataToExport.map(row => 
        activeTab === 'alerts' 
          ? [
              (row as AlertRow).type,
              (row as AlertRow).severity,
              (row as AlertRow).message,
              (row as AlertRow).restaurant,
              (row as AlertRow).timestamp,
              (row as AlertRow).status,
              (row as AlertRow).resolvedBy || '',
              (row as AlertRow).resolvedAt || '',
              (row as AlertRow).resolutionMessage || ''
            ]
          : [
              (row as LogRow).level,
              (row as LogRow).action,
              (row as LogRow).user,
              (row as LogRow).details,
              (row as LogRow).timestamp,
              (row as LogRow).ip
            ]
      )
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}-data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${activeTab === 'alerts' ? 'Alerts' : 'Logs'} data exported successfully`, 'success');
  };

  const handleView = (data: AlertRow | LogRow, type: 'alert' | 'log') => {
    setViewModal({ isOpen: true, data, type });
  };

  const handleDeleteAlert = (index: number) => {
    const alertData = alertsData[index];
    if (window.confirm(`Are you sure you want to delete the alert "${alertData.message}"?`)) {
      setAlertsData(prev => prev.filter((_, i) => i !== index));
      showToast('Alert deleted successfully', 'success');
    }
  };

  const handleMarkAsRead = (index: number) => {
    setAlertsData(prev =>
      prev.map((alert, i) =>
        i === index ? { ...alert, status: 'Read' } : alert
      )
    );
    showToast('Alert marked as read', 'success');
  };

  const handleResolveAlert = (index: number) => {
    const alert = alertsData[index];
    setResolutionModal({
      isOpen: true,
      alertIndex: index,
      alert: alert
    });
  };

  const handleResolutionSubmit = async () => {
    if (resolutionModal.alertIndex === null || !resolutionModal.alert) return;

    const currentTime = new Date().toISOString();
    const adminName = "Admin";

    try {
      await sendNotificationToUser(
        resolutionModal.alert.restaurant,
        `Alert Resolved: ${resolutionMessage || 'Your issue has been resolved.'}`
      );

      setAlertsData(prev =>
        prev.map((alert, i) =>
          i === resolutionModal.alertIndex ? {
            ...alert,
            status: 'Resolved',
            resolvedBy: adminName,
            resolvedAt: currentTime,
            resolutionMessage: resolutionMessage || 'Alert resolved by admin'
          } : alert
        )
      );

      const newLogEntry: LogRow = {
        id: `log-${Date.now()}`,
        level: "Info",
        action: "Alert Resolved",
        user: adminName,
        details: `Resolved alert: "${resolutionModal.alert.message}" for ${resolutionModal.alert.restaurant}. Message: "${resolutionMessage || 'Alert resolved'}"`,
        timestamp: currentTime,
        ip: "127.0.0.1"
      };

      setLogsData(prev => [newLogEntry, ...prev]);

      setResolutionModal({ isOpen: false, alertIndex: null, alert: null });
      setResolutionMessage("");
      
      showToast('Alert resolved and notification sent to user', 'success');
    } catch (error) {
      console.error('Error resolving alert:', error);
      setToast({ show: true, message: 'Failed to resolve alert', type: 'error' });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-destructive text-destructive-foreground border-destructive/20";
      case "High":
        return "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-700";
      case "Medium":
        return "bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100 border-orange-200 dark:border-orange-700";
      case "Low":
        return "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-700";
      default:
        return "bg-muted text-muted-foreground border-muted/20";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Error":
        return "bg-destructive text-destructive-foreground border-destructive/20";
      case "Warning":
        return "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-700";
      case "Info":
        return "bg-primary text-primary-foreground border-primary/20";
      case "Debug":
        return "bg-muted text-muted-foreground border-muted/20";
      default:
        return "bg-muted text-muted-foreground border-muted/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "System":
        return <Info size={16} className="text-blue-600 dark:text-blue-400" />;
      case "Security":
        return <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />;
      case "Performance":
        return <Clock size={16} className="text-orange-600 dark:text-orange-400" />;
      case "Order":
        return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
      default:
        return <Info size={16} className="text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Read":
        return "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-700";
      case "Unread":
        return "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-700";
      case "Resolved":
        return "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-700";
      default:
        return "bg-muted text-muted-foreground border-muted/20";
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card p-4 rounded-lg border border-border">
                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen relative text-foreground">
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className={`w-80 ${toast.type === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700' : 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700'}`}>
            <Check className={`h-4 w-4 ${toast.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
            <AlertDescription className={toast.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
              {toast.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {resolutionModal.isOpen && resolutionModal.alert && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4 border border-border shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Resolve Alert</h2>
              <button 
                onClick={() => setResolutionModal({ isOpen: false, alertIndex: null, alert: null })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Alert Details:</p>
                <p className="font-medium text-foreground">{resolutionModal.alert.message}</p>
                <p className="text-sm text-muted-foreground mt-1">Restaurant: {resolutionModal.alert.restaurant}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Resolution Message (will be sent to user)
                </label>
                <textarea
                  value={resolutionMessage}
                  onChange={(e) => setResolutionMessage(e.target.value)}
                  placeholder="Enter a message to send to the user about how this issue was resolved..."
                  className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setResolutionModal({ isOpen: false, alertIndex: null, alert: null })}
                  className="flex-1 px-4 py-2 text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors border border-border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolutionSubmit}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors border border-primary/50 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Resolve & Notify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewModal.isOpen && viewModal.data && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 border border-border shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {viewModal.type === 'alert' ? 'Alert Details' : 'Log Details'}
              </h2>
              <button 
                onClick={() => setViewModal({ isOpen: false, data: null, type: null })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              {viewModal.type === 'alert' ? (
                <div>
                  <div className="border-b border-border pb-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon((viewModal.data as AlertRow).type)}
                      <h3 className="text-lg font-medium text-foreground">{(viewModal.data as AlertRow).type} Alert</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">Alert Information</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Severity</label>
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium inline-block border ${getSeverityColor((viewModal.data as AlertRow).severity)}`}>
                        {(viewModal.data as AlertRow).severity}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium inline-block border ${getStatusColor((viewModal.data as AlertRow).status)}`}>
                        {(viewModal.data as AlertRow).status}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Restaurant</label>
                      <div className="text-sm text-foreground font-medium">{(viewModal.data as AlertRow).restaurant}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Timestamp</label>
                      <div className="text-sm text-muted-foreground">{new Date((viewModal.data as AlertRow).timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Message</label>
                    <div className="p-3 bg-muted rounded-lg text-sm text-foreground">
                      {(viewModal.data as AlertRow).message}
                    </div>
                  </div>

                  {(viewModal.data as AlertRow).status === 'Resolved' && (
                    <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent">
                      <h4 className="font-medium text-accent-foreground mb-2 flex items-center gap-2">
                        <MessageCircle size={16} />
                        Resolution Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-accent-foreground font-medium">Resolved By:</span>
                          <span className="ml-2 text-foreground">{(viewModal.data as AlertRow).resolvedBy || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-accent-foreground font-medium">Resolved At:</span>
                          <span className="ml-2 text-muted-foreground">
                            {(viewModal.data as AlertRow).resolvedAt ? new Date((viewModal.data as AlertRow).resolvedAt!).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                      {(viewModal.data as AlertRow).resolutionMessage && (
                        <div className="mt-3">
                          <span className="text-accent-foreground font-medium">Resolution Message:</span>
                          <div className="mt-1 p-2 bg-card rounded text-foreground text-sm">
                            {(viewModal.data as AlertRow).resolutionMessage}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="border-b border-border pb-3 mb-4">
                    <h3 className="text-lg font-medium text-foreground">{(viewModal.data as LogRow).action}</h3>
                    <p className="text-sm text-muted-foreground">System Log Entry</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Level</label>
                      <div className={`px-3 py-1 rounded-lg text-sm font-medium inline-block border ${getLevelColor((viewModal.data as LogRow).level)}`}>
                        {(viewModal.data as LogRow).level}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">User</label>
                      <div className="text-sm text-foreground font-medium">{(viewModal.data as LogRow).user}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">IP Address</label>
                      <div className="text-sm text-muted-foreground">{(viewModal.data as LogRow).ip}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Timestamp</label>
                      <div className="text-sm text-muted-foreground">{new Date((viewModal.data as LogRow).timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Details</label>
                    <div className="p-3 bg-muted rounded-lg text-sm text-foreground">
                      {(viewModal.data as LogRow).details}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setViewModal({ isOpen: false, data: null, type: null })}
                className="flex-1 px-4 py-2 text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors border border-border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Logs</h1>
          <p className="text-muted-foreground mt-1">Monitor system alerts and activity logs</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="bg-card border border-border px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent/20 hover:text-accent-foreground transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
          <button 
            className="bg-card border border-border px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent/20 hover:text-accent-foreground transition-colors flex items-center gap-2"
          >
            <Upload size={16} />
            Import
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <div className="border-b border-border">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'alerts'
                  ? 'border-primary text-primary-foreground bg-primary/10'
                  : 'border-transparent text-foreground hover:bg-muted/50'
              }`}
            >
              Alerts ({alertsData.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'logs'
                  ? 'border-primary text-primary-foreground bg-primary/10'
                  : 'border-transparent text-foreground hover:bg-muted/50'
              }`}
            >
              Logs ({logsData.length})
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activeTab === 'alerts' ? (
          <>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Total Alerts</h3>
              <p className="text-2xl font-bold text-foreground">{alertsData.length}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Critical</h3>
              <p className="text-2xl font-bold text-destructive">
                {alertsData.filter(alert => alert.severity === "Critical").length}
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Unread</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {alertsData.filter(alert => alert.status === "Unread").length}
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Resolved</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {alertsData.filter(alert => alert.status === "Resolved").length}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Total Logs</h3>
              <p className="text-2xl font-bold text-foreground">{logsData.length}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Errors</h3>
              <p className="text-2xl font-bold text-destructive">
                {logsData.filter(log => log.level === "Error").length}
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Warnings</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {logsData.filter(log => log.level === "Warning").length}
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Info</h3>
              <p className="text-2xl font-bold text-primary-foreground">
                {logsData.filter(log => log.level === "Info").length}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder={activeTab === 'alerts' ? "Search alerts or restaurants..." : "Search logs by action, user, or details..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          {activeTab === 'alerts' ? (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          ) : (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              >
                <option value="All">All Levels</option>
                <option value="Error">Error</option>
                <option value="Warning">Warning</option>
                <option value="Info">Info</option>
                <option value="Debug">Debug</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {activeTab === 'alerts' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Restaurant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredAlerts.map((alert, index) => (
                  <tr key={alert.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(alert.type)}
                        <span className="text-sm text-foreground">{alert.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{alert.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{alert.restaurant}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleView(alert, 'alert')}
                        className="text-primary-foreground hover:text-primary mr-4"
                      >
                        <Eye size={16} />
                      </button>
                      {alert.status !== 'Resolved' && (
                        <>
                          <button
                            onClick={() => handleMarkAsRead(index)}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 mr-4"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleResolveAlert(index)}
                            className="text-primary-foreground hover:text-primary mr-4"
                          >
                            <Check size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteAlert(index)}
                        className="text-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">IP</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredLogs.map((log, index) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.details}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{log.ip}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleView(log, 'log')}
                        className="text-primary-foreground hover:text-primary"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsLogs;
