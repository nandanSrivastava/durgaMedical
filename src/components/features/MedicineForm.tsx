'use client';

import { useState, useEffect } from 'react';
import { Plus, Calculator, DollarSign, Package, Pill, Droplets, Syringe, HelpCircle, Save, X } from 'lucide-react';

interface Medicine {
  _id: string;
  name: string;
  mrp: number;
  purchaseRate: number;
  type: string;
}

interface MedicineFormProps {
  onSuccess: () => void;
  initialData?: Medicine | null;
  onCancel?: () => void;
  isModal?: boolean;
}

const medicineTypes = [
  { id: 'tablet', label: 'Tablet', icon: Pill, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'syrup', label: 'Syrup', icon: Droplets, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'injection', label: 'Injection', icon: Syringe, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'other', label: 'Other', icon: HelpCircle, color: 'text-slate-400', bg: 'bg-slate-500/10' },
];

export default function MedicineForm({ onSuccess, initialData, onCancel, isModal }: MedicineFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    mrp: '',
    purchaseRate: '',
    type: 'tablet',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        mrp: initialData.mrp.toString(),
        purchaseRate: initialData.purchaseRate.toString(),
        type: initialData.type,
      });
    } else {
      setFormData({ name: '', mrp: '', purchaseRate: '', type: 'tablet' });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = '/api/medicines';
      const method = isEditing ? 'PUT' : 'POST';
      const body = {
        ...(isEditing ? { _id: initialData._id } : {}),
        name: formData.name,
        mrp: parseFloat(formData.mrp),
        purchaseRate: parseFloat(formData.purchaseRate),
        type: formData.type,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (!isEditing) {
          setFormData({ name: '', mrp: '', purchaseRate: '', type: 'tablet' });
        }
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.message || `Failed to ${isEditing ? 'update' : 'add'} medicine`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isModal ? 'bg-slate-900 border-none px-6 py-6 sm:p-8' : 'bg-slate-900/50 border border-slate-800 p-8 backdrop-blur-xl shadow-2xl'} ${isEditing ? 'border-blue-500/30 ring-1 ring-blue-500/20' : ''} rounded-3xl transition-all`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 md:h-12 md:w-12 ${isEditing ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-400'} flex items-center justify-center rounded-xl md:rounded-2xl border border-blue-500/20`}>
            {isEditing ? <Save className="h-5 w-5 md:h-6 md:w-6" /> : <Plus className="h-5 w-5 md:h-6 md:w-6" />}
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white">{isEditing ? 'Edit Medicine' : 'Add New Medicine'}</h2>
            <p className="text-slate-400 text-[10px] md:text-sm">{isEditing ? 'Update the details below' : 'Enter the product details below'}</p>
          </div>
        </div>
        {(isEditing || isModal) && onCancel && (
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors border border-slate-800 lg:border-none"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Medicine Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-2">Medicine Name</label>
            <div className="relative group">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                required
                placeholder="e.g. Paracetamol 500mg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Medicine Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-2">Medicine Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {medicineTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.id })}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                      isSelected 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-[1.05]' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : type.color}`} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* MRP */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-2">MRP (₹)</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Purchase Rate */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-2">Purchase Rate (₹)</label>
              <div className="relative group">
                <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.purchaseRate}
                  onChange={(e) => setFormData({ ...formData, purchaseRate: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`${isEditing ? 'flex-[2]' : 'w-full'} py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? (isEditing ? 'Updating...' : 'Adding...') : (
              <>
                {isEditing ? <Save className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {isEditing ? 'Update Medicine' : 'Add Medicine'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
