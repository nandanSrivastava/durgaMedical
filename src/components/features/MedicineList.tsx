'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, PackageX, RefreshCw } from 'lucide-react';
import MedicineCard from './MedicineCard';
import Pagination from '../ui/Pagination';

interface Medicine {
  _id: string;
  name: string;
  mrp: number;
  purchaseRate: number;
  type: string;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface MedicineListProps {
  refreshKey: number;
  onRefresh: () => void;
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicine: Medicine) => void;
}

export default function MedicineList({ refreshKey, onRefresh, onEdit, onDelete }: MedicineListProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      
      const res = await fetch(`/api/medicines?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMedicines(data.medicines);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch medicines');
      }
    } catch (err) {
      setError('An error occurred while fetching medicines');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, limit]);

  useEffect(() => {
    fetchMedicines();
  }, [refreshKey, fetchMedicines]);

  const handleRowsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by medicine name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xl"
          />
        </div>
        
        <button 
          onClick={onRefresh}
          className="flex items-center gap-2 px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          Refresh data
        </button>
      </div>

      {/* Main Content */}
      {loading && medicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg font-medium animate-pulse">Searching through inventory...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl text-center text-red-400">
          {error}
        </div>
      ) : medicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem] text-slate-500 gap-4">
          <div className="h-20 w-20 bg-slate-900 flex items-center justify-center rounded-3xl border border-slate-800">
            <PackageX className="h-10 w-10 text-slate-700" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-slate-400">No medicines found</p>
            <p className="text-sm text-slate-600">Try adjusting your search or add a new medicine</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {medicines.map((medicine) => (
              <MedicineCard 
                key={medicine._id} 
                medicine={medicine} 
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          {pagination && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              rowsPerPage={limit}
              onPageChange={setPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              loading={loading}
            />
          )}
        </>
      )}
    </div>
  );
}
