'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  loading?: boolean;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems,
  rowsPerPage,
  onPageChange, 
  onRowsPerPageChange,
  loading = false 
}: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pb-12 text-slate-400 text-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span>Page</span>
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 1 && val <= totalPages) {
                onPageChange(val);
              }
            }}
            className="w-12 h-9 bg-slate-900/50 border border-slate-800 rounded-lg text-center text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            min={1}
            max={totalPages}
          />
          <span>of {totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="h-4 w-px bg-slate-800 hidden sm:block" />

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Total:</span>
          <span className="font-medium text-slate-300">{totalItems}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500">Rows:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
            className="bg-slate-900/50 border border-slate-800 rounded-lg h-9 px-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer pr-8 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
          >
            {[6, 12, 24, 48, 100].map((size) => (
              <option key={size} value={size} className="bg-slate-950">
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
