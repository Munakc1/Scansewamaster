"use client";

import React, { useState, useEffect } from "react";
import { Download, Upload, Eye, Search, Filter, Edit, Trash2, MessageCircle, Clock, CheckCircle, AlertCircle, X, Check, Activity, Server, Database, Wifi, Users, Timer, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SupportTicket {
  id?: string;
  restaurant: string;
  subject: string;
  priority: string;
  status: string;
  category: string;
  date: string;
  lastUpdate: string;
  description?: string;
}

interface SystemStatus {
  uptime: number;
  apiStatus: 'operational' | 'degraded' | 'down';
  databaseStatus: 'connected' | 'slow' | 'disconnected';
  responseLatency: number;
  errorRate: number;
  lastUpdated: string;
}

interface UserActivity {
  id: string;
  name: string;
  email: string;
  loginTime: string;
  totalTimeSpent: number;
  currentPage: string;
  isActive: boolean;
  lastActivity: string;
}

const Support: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [supportData, setSupportData] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tickets' | 'status'>('tickets');
  const [editModal, setEditModal] = useState<{ isOpen: boolean; data: SupportTicket | null; index: number | null }>({
    isOpen: false,
    data: null,
    index: null
  });
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; data: SupportTicket | null; index: number | null }>({
    isOpen: false,
    data: null,
    index: null
  });
  const [editForm, setEditForm] = useState<SupportTicket>({
    restaurant: "",
    subject: "",
    priority: "",
    status: "",
    category: "",
    date: "",
    lastUpdate: "",
    description: ""
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: "",
    type: 'success'
  });

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    uptime: 99.9,
    apiStatus: 'operational',
    databaseStatus: 'connected',
    responseLatency: 125,
    errorRate: 0.02,
    lastUpdated: new Date().toISOString()
  });

  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [currentOnlineUsers, setCurrentOnlineUsers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setSupportData(data.support || []);
        setUserActivity(data.userActivity || []);
        setSystemStatus(data.systemStatus || systemStatus);
        setCurrentOnlineUsers(data.userActivity.filter((user: UserActivity) => user.isActive).length);
      } catch (error) {
        console.error('Error fetching data:', error);
        setToast({ show: true, message: 'Failed to load support data', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        responseLatency: Math.floor(Math.random() * 50) + 100,
        errorRate: Math.random() * 0.1,
        lastUpdated: new Date().toISOString()
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: 'success' }), 3000);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "In Progress":
        return "bg-[--chart-3]/20 text-[--chart-3] dark:bg-[--chart-3]/10 dark:text-[--chart-3]";
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Medium":
        return "bg-[--chart-3]/20 text-[--chart-3] dark:bg-[--chart-3]/10 dark:text-[--chart-3]";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <MessageCircle size={16} className="text-blue-600 dark:text-blue-400" />;
      case "In Progress":
        return <Clock size={16} className="text-[--chart-3] dark:text-[--chart-3]" />;
      case "Resolved":
        return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
      case "Closed":
        return <CheckCircle size={16} className="text-gray-600 dark:text-gray-400" />;
      default:
        return <AlertCircle size={16} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  const getSystemStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'connected':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'degraded':
      case 'slow':
        return 'text-[--chart-3] bg-[--chart-3]/20 dark:text-[--chart-3] dark:bg-[--chart-3]/10';
      case 'down':
      case 'disconnected':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  const filteredData = supportData.filter(ticket => {
    const matchesSearch = ticket.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === "All" || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleExport = () => {
    const csvContent = [
      ["Restaurant", "Subject", "Priority", "Status", "Category", "Date", "Last Update"],
      ...filteredData.map(ticket => [
        ticket.restaurant,
        ticket.subject,
        ticket.priority,
        ticket.status,
        ticket.category,
        ticket.date,
        ticket.lastUpdate
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "support-tickets.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Support tickets exported successfully', 'success');
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

  const handleEdit = (index: number) => {
    const ticketData = supportData[index];
    if (ticketData) {
      setEditForm({ ...ticketData });
      setViewModal({ isOpen: false, data: null, index: null });
      setEditModal({ isOpen: true, data: ticketData, index });
    }
  };

  const handleView = (index: number) => {
    const ticketData = supportData[index];
    if (ticketData) {
      setViewModal({ isOpen: true, data: ticketData, index });
    }
  };

  const handleDelete = (index: number) => {
    const ticketData = supportData[index];
    if (window.confirm(`Are you sure you want to delete the ticket "${ticketData.subject}"?`)) {
      setSupportData(prev => prev.filter((_, i) => i !== index));
      showToast('Support ticket deleted successfully', 'success');
    }
  };

  const handleSaveEdit = () => {
    if (editModal.index === null) return;
    const updatedTicket = {
      ...editForm,
      lastUpdate: new Date().toISOString()
    };
    setSupportData(prev =>
      prev.map((ticket, index) =>
        index === editModal.index ? updatedTicket : ticket
      )
    );
    setEditModal({ isOpen: false, data: null, index: null });
    showToast('Support ticket updated successfully', 'success');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card p-4 rounded-lg shadow-sm border border-border">
                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

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

      {viewModal.isOpen && viewModal.data && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Ticket Details</h2>
              <button 
                onClick={() => setViewModal({ isOpen: false, data: null, index: null })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-border pb-3">
                <h3 className="text-lg font-medium text-foreground">{viewModal.data.subject}</h3>
                <p className="text-sm text-muted-foreground mt-1">{viewModal.data.restaurant}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Priority</label>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 ${getPriorityColor(viewModal.data.priority)}`}>
                    {viewModal.data.priority}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                  <div className={`px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 ${getStatusColor(viewModal.data.status)}`}>
                    {getStatusIcon(viewModal.data.status)}
                    {viewModal.data.status}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                  <div className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-2 rounded-lg text-sm font-medium inline-block">
                    {viewModal.data.category}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Created</label>
                  <div className="text-sm text-muted-foreground">{new Date(viewModal.data.date).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Last Update</label>
                <div className="text-sm text-muted-foreground">{new Date(viewModal.data.lastUpdate).toLocaleDateString()}</div>
              </div>
              
              {viewModal.data.description && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                  <div className="p-4 bg-muted rounded-lg text-sm text-foreground">
                    {viewModal.data.description}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setViewModal({ isOpen: false, data: null, index: null })}
                className="flex-1 px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const index = viewModal.index;
                  if (index !== null) handleEdit(index);
                }}
                className="flex-1 px-4 py-2 bg-[--chart-3] text-white rounded-lg hover:bg-[--chart-3]/90 transition-colors"
              >
                Edit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal.isOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-foreground">Edit Support Ticket</h2>
              <button 
                onClick={() => setEditModal({ isOpen: false, data: null, index: null })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={editForm.restaurant}
                  onChange={(e) => setEditForm({ ...editForm, restaurant: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--chart-3] focus:border-transparent bg-background text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Subject</label>
                <input
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--chart-3] focus:border-transparent bg-background text-foreground"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--chart-3] focus:border-transparent bg-background text-foreground"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--chart-3] focus:border-transparent bg-background text-foreground"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--chart-3] focus:border-transparent bg-background text-foreground"
                >
                  <option value="Technical">Technical</option>
                  <option value="Billing">Billing</option>
                  <option value="Account">Account</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="General">General</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--chart-3] focus:border-transparent bg-background text-foreground"
                  placeholder="Enter ticket description..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditModal({ isOpen: false, data: null, index: null })}
                className="flex-1 px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-[--chart-3] text-white rounded-lg hover:bg-[--chart-3]/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Support & System Status</h1>
          <p className="text-muted-foreground mt-1">Manage support tickets and monitor system health</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="bg-card border border-border px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={handleImport}
            className="bg-[--chart-3] text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium hover:bg-[--chart-3]/90 transition-colors flex items-center gap-2"
          >
            <Upload size={16} />
            Import
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-1 inline-flex border border-border">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'tickets'
              ? 'bg-[--chart-3] text-white'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Support Tickets
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'status'
              ? 'bg-[--chart-3] text-white'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          System Status
        </button>
      </div>

      {activeTab === 'tickets' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Total Tickets</h3>
              <p className="text-2xl font-bold text-foreground">{supportData.length}</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Open Tickets</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {supportData.filter(ticket => ticket.status === "Open").length}
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
              <p className="text-2xl font-bold text-[--chart-3]">
                {supportData.filter(ticket => ticket.status === "In Progress").length}
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground">Resolved</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {supportData.filter(ticket => ticket.status === "Resolved").length}
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  placeholder="Search tickets or restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--chart-3] focus:border-transparent bg-background text-foreground"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--chart-3] focus:border-transparent appearance-none bg-background text-foreground"
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--chart-3] focus:border-transparent appearance-none bg-background text-foreground"
                >
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[--chart-3] focus:border-transparent appearance-none bg-background text-foreground"
                >
                  <option value="All">All Categories</option>
                  <option value="Technical">Technical</option>
                  <option value="Billing">Billing</option>
                  <option value="Account">Account</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Restaurant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredData.map((ticket, index) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{ticket.restaurant}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{ticket.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center gap-1 ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{ticket.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(ticket.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleView(index)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-[--chart-3] hover:text-[--chart-3]/80 dark:text-[--chart-3] dark:hover:text-[--chart-3]/70 mr-4"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'status' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Server size={16} /> System Uptime
              </h3>
              <p className="text-2xl font-bold text-foreground">{systemStatus.uptime}%</p>
              <p className="text-sm text-muted-foreground">Last updated: {new Date(systemStatus.lastUpdated).toLocaleString()}</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap size={16} /> API Status
              </h3>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSystemStatusColor(systemStatus.apiStatus)}`}>
                {systemStatus.apiStatus.charAt(0).toUpperCase() + systemStatus.apiStatus.slice(1)}
              </span>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Database size={16} /> Database Status
              </h3>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSystemStatusColor(systemStatus.databaseStatus)}`}>
                {systemStatus.databaseStatus.charAt(0).toUpperCase() + systemStatus.databaseStatus.slice(1)}
              </span>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Timer size={16} /> Response Latency
              </h3>
              <p className="text-2xl font-bold text-foreground">{systemStatus.responseLatency}ms</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle size={16} /> Error Rate
              </h3>
              <p className="text-2xl font-bold text-foreground">{(systemStatus.errorRate * 100).toFixed(2)}%</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users size={16} /> Online Users
              </h3>
              <p className="text-2xl font-bold text-foreground">{currentOnlineUsers}</p>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">User Activity</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Login Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {userActivity.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(user.loginTime).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDuration(user.totalTimeSpent)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.currentPage}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(user.lastActivity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;