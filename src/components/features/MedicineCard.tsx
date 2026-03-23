'use client';

import { useState, useEffect } from 'react';
import { Package, Percent, Calculator, ChevronDown, ChevronUp, Pill, Droplets, Syringe, HelpCircle, Pencil, Trash2 } from 'lucide-react';

interface Medicine {
  _id: string;
  name: string;
  mrp: number;
  purchaseRate: number;
  type: string;
  createdAt: string;
}

interface MedicineCardProps {
  medicine: Medicine;
  onEdit?: (medicine: Medicine) => void;
  onDelete?: (medicine: Medicine) => void;
}

const typeConfig: Record<string, { icon: any, color: string, bg: string }> = {
  tablet: { icon: Pill, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  syrup: { icon: Droplets, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  injection: { icon: Syringe, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  other: { icon: HelpCircle, color: 'text-slate-400', bg: 'bg-slate-500/10' },
};

export default function MedicineCard({ medicine, onEdit, onDelete }: MedicineCardProps) {
  const [discount, setDiscount] = useState<string>('10');
  const [isExpanded, setIsExpanded] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [profit, setProfit] = useState(0);
  const [margin, setMargin] = useState(0);

  const config = typeConfig[medicine.type] || typeConfig.other;
  const TypeIcon = config.icon;

  useEffect(() => {
    const d = parseFloat(discount) || 0;
    const price = medicine.mrp - (medicine.mrp * d) / 100;
    const p = price - medicine.purchaseRate;
    const m = (p / medicine.purchaseRate) * 100;
    
    setDiscountedPrice(price);
    setProfit(p);
    setMargin(m);
  }, [discount, medicine.mrp, medicine.purchaseRate]);

  return (
    <div className="group bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-sm relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl -z-10 group-hover:bg-blue-600/10 transition-colors" />
      
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
        <button
          onClick={() => onEdit?.(medicine)}
          className="p-2 bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg border border-slate-700 hover:border-blue-500 transition-all shadow-lg"
          title="Edit Medicine"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this medicine?')) {
              onDelete?.(medicine);
            }
          }}
          className="p-2 bg-slate-800/80 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg border border-slate-700 hover:border-red-500 transition-all shadow-lg"
          title="Delete Medicine"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 pr-20">
            <div className={`h-10 w-10 ${config.bg} flex items-center justify-center rounded-xl border border-white/5 ${config.color}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors capitalize leading-tight">
                {medicine.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md ${config.bg} ${config.color} border border-white/5`}>
                  {medicine.type}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(medicine.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest pl-1 leading-none">MRP</p>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-sm font-medium">₹{medicine.mrp.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest pl-1 leading-none">Cost</p>
            <div className="flex items-center gap-1.5 text-slate-500 italic">
              <span className="text-sm font-medium">₹{medicine.purchaseRate.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`mt-auto border-t border-slate-800/50 transition-all duration-300 ${isExpanded ? 'bg-slate-800/30' : 'bg-transparent'}`}
      >
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            {isExpanded ? 'HIDE CALCULATOR' : 'CALCULATE DISCOUNT'}
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-4 animate-fadeIn">
            <div className="relative group">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="number"
                placeholder="Discount %"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            <div className="flex justify-between items-end bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <div>
                <p className="text-[10px] text-blue-500 uppercase font-bold tracking-widest pl-1 mb-1">Selling Price</p>
                <div className="text-xl font-black text-white flex items-baseline gap-1">
                  <span className="text-blue-400">₹</span>
                  {discountedPrice.toFixed(2)}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest pr-1 mb-1">Profit</p>
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {profit >= 0 ? '+' : ''}₹{profit.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">({margin.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
