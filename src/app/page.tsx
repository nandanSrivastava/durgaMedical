'use client';

import { useState, useEffect } from 'react';
import MedicineForm from '@/components/features/MedicineForm';
import MedicineList from '@/components/features/MedicineList';
import { Package, LayoutDashboard, Database, TrendingUp, Loader2, Plus } from 'lucide-react';

interface Medicine {
  _id: string;
  name: string;
  mrp: number;
  purchaseRate: number;
  type: string;
  createdAt: string;
}

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalMedicines, setTotalMedicines] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setTotalMedicines(data.total);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleMedicineAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setEditingMedicine(null); // Clear editing state after success
    setIsFormOpen(false); // Close form on mobile after success
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setIsFormOpen(true); // Open form on mobile
    // Scroll to form on mobile if it was inline (not in modal), but now it's in modal
    if (window.innerWidth < 1024) {
      // In mobile view
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingMedicine(null);
    setIsFormOpen(false);
  };

  const handleDelete = async (medicine: Medicine) => {
    try {
      const res = await fetch(`/api/medicines/${medicine._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        handleMedicineAdded(); // Refresh stats and list
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete medicine');
      }
    } catch (err) {
      alert('An error occurred while deleting');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar/Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Package className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter">
              DURGA<span className="text-blue-500">MEDICAL</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Sync</span>
            </div>
            <div className="h-9 w-9 md:h-10 md:w-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
              <LayoutDashboard className="h-4 w-4 md:h-5 md:w-5" />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 md:pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left: Stats & Form (Desktop Sidebar) */}
          <aside className="lg:w-1/3 flex flex-col gap-6 lg:gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -z-10 group-hover:bg-blue-600/20 transition-all duration-500" />
                <div className="flex items-center justify-between">
                  <div>
                    <Database className="h-5 w-5 md:h-6 md:w-6 text-blue-400 mb-3 md:mb-4" />
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Inventory Items</p>
                    <div className="flex items-baseline gap-2">
                      {loadingStats ? (
                        <Loader2 className="h-6 w-6 md:h-8 md:w-8 text-blue-500 animate-spin" />
                      ) : (
                        <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                          {totalMedicines || 0}
                        </span>
                      )}
                      <span className="text-xs md:text-sm font-bold text-slate-500">Medicines</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 md:h-16 md:w-16 bg-blue-500/10 rounded-2xl md:rounded-3xl flex items-center justify-center border border-blue-500/20">
                    <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Form - Visible as sidebar on Desktop, Modal on Mobile */}
            <div className="hidden lg:block sticky top-32">
              <MedicineForm 
                onSuccess={handleMedicineAdded} 
                initialData={editingMedicine}
                onCancel={handleCancelEdit}
              />
            </div>
          </aside>

          {/* Right: List & Search */}
          <section className="lg:w-2/3">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Medicine Inventory</h2>
              <div className="h-px flex-grow bg-slate-800" />
            </div>
            
            <MedicineList 
              refreshKey={refreshKey} 
              onRefresh={() => setRefreshKey((prev) => prev + 1)} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={() => {
          setEditingMedicine(null);
          setIsFormOpen(true);
        }}
        className="lg:hidden fixed bottom-8 right-6 h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 border border-blue-400/20 active:scale-90 transition-all z-40"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Mobile Form Modal */}
      {isFormOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={handleCancelEdit}
          />
          <div className="relative w-full max-w-lg bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden animate-fadeIn pb-4 max-h-[90vh] overflow-y-auto">
            <MedicineForm 
              onSuccess={handleMedicineAdded} 
              initialData={editingMedicine}
              onCancel={handleCancelEdit}
              // @ts-ignore - Added for mobile view
              isModal={true}
            />
          </div>
        </div>
      )}
    </main>
  );
}
