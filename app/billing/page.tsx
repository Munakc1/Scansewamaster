"use client";

import React, { useState, useEffect } from "react";
import { Download, Upload, Eye, Search, Filter, Edit, Trash2, MoreHorizontal, X, Check } from "lucide-react";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BillingRow {
  id?: string;
  name: string;
  type: 'Restaurant' | 'Customer';
  plan: string;
  status: string;
  amount: number;
  date: string;
}

const Billing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [billingData, setBillingData] = useState<BillingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; data: BillingRow | null; index: number | null }>({
    isOpen: false,
    data: null,
    index: null
  });
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; data: BillingRow | null; index: number | null }>({
    isOpen: false,
    data: null,
    index: null
  });
  const [editForm, setEditForm] = useState<BillingRow>({
    name: "",
    type: "Restaurant",
    plan: "",
    status: "",
    amount: 0,
    date: ""
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: "",
    type: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setBillingData(data.billing);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching billing data:", error);
        setLoading(false);
        showToast('Failed to load billing data', 'error');
      }
    };

    fetchData();
  }, []);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: 'success' }), 3000);
  };

  const filteredData = billingData.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const matchesType = typeFilter === "All" || row.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExport = () => {
    const csvContent = [
      ["Name", "Type", "Plan", "Status", "Amount", "Date"],
      ...filteredData.map(row => [row.name, row.type, row.plan, row.status, row.amount.toString(), row.date])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "billing-data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Billing data exported successfully', 'success');
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
    const rowData = billingData[index];
    if (rowData) {
      setEditForm({ ...rowData });
      setViewModal({ isOpen: false, data: null, index: null });
      setEditModal({ isOpen: true, data: rowData, index });
    }
  };

  const handleView = (index: number) => {
    const rowData = billingData[index];
    if (rowData) {
      setViewModal({ isOpen: true, data: rowData, index });
    }
  };

  const handleDelete = (index: number) => {
    const rowData = billingData[index];
    if (window.confirm(`Are you sure you want to delete billing for ${rowData.name}?`)) {
      setBillingData(prev => prev.filter((_, i) => i !== index));
      showToast('Billing record deleted successfully', 'success');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return {
          background: 'oklch(0.769 0.188 70.08)', // --chart-3 (light), aligns with green
          color: 'oklch(0.145 0 0)', // --foreground (light)
          darkBackground: 'oklch(0.769 0.188 70.08)', // --chart-3 (dark)
          darkColor: 'oklch(0.985 0 0)' // --foreground (dark)
        };
      case "Unpaid":
        return {
          background: 'oklch(0.828 0.189 84.429)', // --chart-4 (light), aligns with yellow
          color: 'oklch(0.145 0 0)', // --foreground (light)
          darkBackground: 'oklch(0.645 0.246 16.439)', // --chart-5 (dark)
          darkColor: 'oklch(0.985 0 0)' // --foreground (dark)
        };
      case "Overdue":
        return {
          background: 'oklch(0.577 0.245 27.325)', // --destructive (light)
          color: 'oklch(0.985 0 0)', // --primary-foreground (light)
          darkBackground: 'oklch(0.704 0.191 22.216)', // --destructive (dark)
          darkColor: 'oklch(0.985 0 0)' // --foreground (dark)
        };
      default:
        return {
          background: 'oklch(0.97 0 0)', // --muted (light)
          color: 'oklch(0.145 0 0)', // --foreground (light)
          darkBackground: 'oklch(0.269 0 0)', // --muted (dark)
          darkColor: 'oklch(0.985 0 0)' // --foreground (dark)
        };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Restaurant":
        return {
          background: 'oklch(0.646 0.222 41.116)', // --chart-1 (light), aligns with purple
          color: 'oklch(0.145 0 0)', // --foreground (light)
          darkBackground: 'oklch(0.488 0.243 264.376)', // --chart-1 (dark)
          darkColor: 'oklch(0.985 0 0)' // --foreground (dark)
        };
      case "Customer":
        return {
          background: 'oklch(0.6 0.118 184.704)', // --chart-2 (light), aligns with blue
          color: 'oklch(0.145 0 0)', // --foreground (light)
          darkBackground: 'oklch(0.696 0.17 162.48)', // --chart-2 (dark)
          darkColor: 'oklch(0.985 0 0)' // --foreground (dark)
        };
      default:
        return {
          background: 'oklch(0.97 0 0)', // --muted (light)
          color: 'oklch(0.145 0 0)', // --foreground (light)
          darkBackground: 'oklch(0.269 0 0)', // --muted (dark)
          darkColor: 'oklch(0.985 0 0)' // --foreground (dark)
        };
    }
  };

  const getTotalAmount = () => {
    return filteredData.reduce((sum, row) => sum + row.amount, 0);
  };

  const handleSaveEdit = () => {
    if (editModal.index === null) return;
    setBillingData(prev =>
      prev.map((row, index) =>
        index === editModal.index ? { ...editForm } : row
      )
    );
    setEditModal({ isOpen: false, data: null, index: null });
    showToast('Billing record updated successfully', 'success');
  };

  if (loading) {
    return (
      <div style={{ padding: '1.5rem', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
        <div className="animate-pulse">
          <div style={{ height: '2rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)', width: '12rem', marginBottom: '1rem' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ backgroundColor: 'var(--card)', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ height: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-sm)', width: '5rem', marginBottom: '0.5rem' }}></div>
                <div style={{ height: '2rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-sm)', width: '4rem' }}></div>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ height: '16rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--background)', minHeight: '100vh', position: 'relative' }}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
          <Alert style={{ width: '20rem', backgroundColor: toast.type === 'success' ? 'oklch(0.769 0.188 70.08)' : 'oklch(0.577 0.245 27.325)', borderColor: toast.type === 'success' ? 'oklch(0.769 0.188 70.08 / 0.5)' : 'oklch(0.577 0.245 27.325 / 0.5)', borderRadius: 'var(--radius)' }}>
            <Check style={{ height: '1rem', width: '1rem', color: toast.type === 'success' ? 'oklch(0.145 0 0)' : 'oklch(0.985 0 0)' }} />
            <AlertDescription style={{ color: toast.type === 'success' ? 'oklch(0.145 0 0)' : 'oklch(0.985 0 0)' }}>
              {toast.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* View Modal */}
      {viewModal.isOpen && viewModal.data && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40 }}>
          <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', padding: '1.5rem', width: '100%', maxWidth: '28rem', margin: '0 1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--card-foreground)' }}>
                {viewModal.data.type === 'Restaurant' ? 'Restaurant' : 'Customer'} Details
              </h2>
              <button 
                onClick={() => setViewModal({ isOpen: false, data: null, index: null })}
                style={{ color: 'var(--muted-foreground)', transition: 'color 0.2s ease' }}
                className="hover:[&:not(.dark)]:color-[oklch(0.556,0,0)] dark:hover:color-[oklch(0.708,0,0)]"
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--card-foreground)' }}>{viewModal.data.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
                  {viewModal.data.type === 'Restaurant' ? 'Restaurant Information' : 'Customer Information'}
                </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Type</label>
                  <div style={{ 
                    padding: '0.5rem 0.75rem', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    display: 'inline-block',
                    backgroundColor: getTypeColor(viewModal.data.type).background,
                    color: getTypeColor(viewModal.data.type).color
                  }} className="dark:background-[getTypeColor(viewModal.data.type).darkBackground] dark:color-[getTypeColor(viewModal.data.type).darkColor]">
                    {viewModal.data.type}
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Plan</label>
                  <div style={{ 
                    backgroundColor: 'oklch(0.6 0.118 184.704)', // --chart-2 (light), aligns with indigo
                    color: 'oklch(0.145 0 0)', // --foreground (light)
                    padding: '0.5rem 0.75rem', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    display: 'inline-block' 
                  }} className="dark:background-[oklch(0.696,0.17,162.48)] dark:color-[oklch(0.985,0,0)]">
                    {viewModal.data.plan}
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Status</label>
                  <div style={{ 
                    padding: '0.5rem 0.75rem', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    display: 'inline-block',
                    backgroundColor: getStatusColor(viewModal.data.status).background,
                    color: getStatusColor(viewModal.data.status).color
                  }} className="dark:background-[getStatusColor(viewModal.data.status).darkBackground] dark:color-[getStatusColor(viewModal.data.status).darkColor]">
                    {viewModal.data.status}
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Amount</label>
                  <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--card-foreground)' }}>${viewModal.data.amount.toFixed(2)}</div>
                </div>
                
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Date</label>
                  <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{new Date(viewModal.data.date).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div style={{ marginTop: '1. opium5rem', padding: '1rem', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                <h4 style={{ fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.5rem' }}>Additional Information</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                  This billing record was last updated on {new Date(viewModal.data.date).toLocaleDateString()}. 
                  {viewModal.data.status === 'Overdue' && ' Please follow up for payment.'}
                  {viewModal.data.status === 'Paid' && ' Payment has been received and processed.'}
                  {viewModal.data.status === 'Unpaid' && ' Payment is pending.'}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setViewModal({ isOpen: false, data: null, index: null })}
                style={{ flex: 1, padding: '0.5rem 1rem', color: 'var(--foreground)', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)', transition: 'background-color 0.2s ease' }}
                className="hover:[&:not(.dark)]:background-[oklch(0.922,0,0)] dark:hover:background-[oklch(0.269,0,0)]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const index = viewModal.index;
                  if (index !== null) handleEdit(index);
                }}
                style={{ flex: 1, padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderRadius: 'var(--radius)', transition: 'background-color 0.2s ease' }}
                className="hover:[&:not(.dark)]:background-[oklch(0.708,0,0)] dark:hover:background-[oklch(0.556,0,0)]"
              >
                Edit Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', padding: '1.5rem', width: '100%', maxWidth: '28rem', margin: '0 1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--card-foreground)' }}>Edit Record</h2>
              <button 
                onClick={() => setEditModal({ isOpen: false, data: null, index: null })}
                style={{ color: 'var(--muted-foreground)', transition: 'color 0.2s ease' }}
                className="hover:[&:not(.dark)]:color-[oklch(0.556,0,0)] dark:hover:color-[oklch(0.708,0,0)]"
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                  className="focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Type</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value as 'Restaurant' | 'Customer' })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease', backgroundColor: 'var(--card)' }}
                  className="focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Plan</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease', backgroundColor: 'var(--card)' }}
                  className="focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease', backgroundColor: 'var(--card)' }}
                  className="focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                  className="focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--card-foreground)', marginBottom: '0.25rem' }}>Date</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                  className="focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setEditModal({ isOpen: false, data: null, index: null })}
                style={{ flex: 1, padding: '0.5rem 1rem', color: 'var(--foreground)', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius)', transition: 'background-color 0.2s ease' }}
                className="hover:[&:not(.dark)]:background-[oklch(0.922,0,0)] dark:hover:background-[oklch(0.269,0,0)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{ flex: 1, padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderRadius: 'var(--radius)', transition: 'background-color 0.2s ease' }}
                className="hover:[&:not(.dark)]:background-[oklch(0.708,0,0)] dark:hover:background-[oklch(0.556,0,0)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }} className="sm:flex-row sm:items-center">
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--foreground)' }}>Billing</h1>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>Manage restaurant and customer billing</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handleExport}
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)', transition: 'background-color 0.2s ease, border-color 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            className="hover:[&:not(.dark)]:background-[oklch(0.97,0,0)] hover:[&:not(.dark)]:border-[oklch(0.922,0,0)] dark:hover:background-[oklch(0.269,0,0)] dark:hover:border-[oklch(1,0,0,0.1)]"
          >
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={handleImport}
            style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.875rem', fontWeight: 500, transition: 'background-color 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            className="hover:[&:not(.dark)]:background-[oklch(0.708,0,0)] dark:hover:background-[oklch(0.556,0,0)]"
          >
            <Upload size={16} />
            Import
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--card)', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>Total Revenue</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--card-foreground)' }}>${getTotalAmount().toFixed(2)}</p>
        </div>
        <div style={{ backgroundColor: 'var(--card)', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>Restaurants</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'oklch(0.646 0.222 41.116)' }} className="dark:color-[oklch(0.488,0.243,264.376)]">
            {billingData.filter(row => row.type === "Restaurant").length}
          </p>
        </div>
        <div style={{ backgroundColor: 'var(--card)', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>Customers</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'oklch(0.6 0.118 184.704)' }} className="dark:color-[oklch(0.696,0.17,162.48)]">
            {billingData.filter(row => row.type === "Customer").length}
          </p>
        </div>
        <div style={{ backgroundColor: 'var(--card)', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>Paid</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'oklch(0.769 0.188 70.08)' }} className="dark:color-[oklch(0.769,0.188,70.08)]">
            {billingData.filter(row => row.status === "Paid").length}
          </p>
        </div>
        <div style={{ backgroundColor: 'var(--card)', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>Overdue</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'oklch(0.577 0.245 27.325)' }} className="dark:color-[oklch(0.704,0.191,22.216)]">
            {billingData.filter(row => row.status === "Overdue").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: 'var(--card)', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <span style={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', width: '1.25rem', height: '1.25rem' }} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
              className="focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
            />
          </div>
          <div style={{ position: 'relative', minWidth: '150px' }}>
            <Filter style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', width: '1.25rem', height: '1.25rem' }} />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 2rem 0.5rem 2.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease', backgroundColor: 'var(--card)', appearance: 'none' }}
              className="focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
          <div style={{ position: 'relative', minWidth: '150px' }}>
            <Filter style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', width: '1.25rem', height: '1.25rem' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 2rem 0.5rem 2.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease', backgroundColor: 'var(--card)', appearance: 'none' }}
              className="focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </span>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{ backgroundColor: 'var(--muted)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--card-foreground)' }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--card-foreground)' }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--card-foreground)' }}>Plan</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--card-foreground)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--card-foreground)' }}>Amount</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--card-foreground)' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--card-foreground)' }}>Actions</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid var(--border)' }}>
              {filteredData.map((row: BillingRow, index: number) => (
                <tr key={row.id || index} style={{ transition: 'background-color 0.2s ease' }} className="hover:[&:not(.dark)]:background-[oklch(0.97,0,0)] dark:hover:background-[oklch(0.269,0,0)]">
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 500, color: 'var(--card-foreground)' }}>{row.name}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 500,
                      backgroundColor: getTypeColor(row.type).background,
                      color: getTypeColor(row.type).color
                    }} className="dark:background-[getTypeColor(row.type).darkBackground] dark:color-[getTypeColor(row.type).darkColor]">
                      {row.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      backgroundColor: 'oklch(0.6 0.118 184.704)', // --chart-2 (light)
                      color: 'oklch(0.145 0 0)', // --foreground (light)
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 500 
                    }} className="dark:background-[oklch(0.696,0.17,162.48)] dark:color-[oklch(0.985,0,0)]">
                      {row.plan}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 500,
                      backgroundColor: getStatusColor(row.status).background,
                      color: getStatusColor(row.status).color
                    }} className="dark:background-[getStatusColor(row.status).darkBackground] dark:color-[getStatusColor(row.status).darkColor]">
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--card-foreground)' }}>${row.amount.toFixed(2)}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--muted-foreground)' }}>
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleView(index)}
                        style={{ color: 'oklch(0.6 0.118 184.704)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', transition: 'color 0.2s ease, background-color 0.2s ease' }}
                        className="hover:[&:not(.dark)]:color-[oklch(0.708,0,0)] hover:[&:not(.dark)]:background-[oklch(0.97,0,0)] dark:hover:color-[oklch(0.556,0,0)] dark:hover:background-[oklch(0.269,0,0)]"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEdit(index)}
                        style={{ color: 'oklch(0.769 0.188 70.08)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', transition: 'color 0.2s ease, background-color 0.2s ease' }}
                        className="hover:[&:not(.dark)]:color-[oklch(0.828,0.189,84.429)] hover:[&:not(.dark)]:background-[oklch(0.97,0,0)] dark:hover:color-[oklch(0.769,0.188,70.08)] dark:hover:background-[oklch(0.269,0,0)]"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(index)}
                        style={{ color: 'oklch(0.577 0.245 27.325)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', transition: 'color 0.2s ease, background-color 0.2s ease' }}
                        className="hover:[&:not(.dark)]:color-[oklch(0.704,0.191,22.216)] hover:[&:not(.dark)]:background-[oklch(0.97,0,0)] dark:hover:color-[oklch(0.704,0.191,22.216)] dark:hover:background-[oklch(0.269,0,0)]"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: 'var(--muted-foreground)' }}>No billing records found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{ backgroundColor: 'var(--card)', padding: '1rem', borderRadius: 'var(--radius)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--muted-foreground)' }}>Showing {filteredData.length} of {billingData.length} records</span>
          <span style={{ fontWeight: 600, color: 'var(--card-foreground)' }}>
            Total: ${getTotalAmount().toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Billing;