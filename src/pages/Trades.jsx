import React, { useState } from 'react';
import TradeLogs from '../components/TradeLogs';
import { Search, Filter } from 'lucide-react';
import { useTrades } from '../context/TradeContext';

export default function Trades({ isDashboard, preProcessedData }) {
  const { trades } = useTrades(); // ✅ fallback source
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Trades');
  const [currentPage, setCurrentPage] = useState(1);

  const tradesPerPage = 30;

  // ✅ FIX: fallback to trades if preProcessedData not available
  const filteredTrades = (preProcessedData && preProcessedData.length > 0) ? preProcessedData : trades;

  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);

  const startIndex = (currentPage - 1) * tradesPerPage;
  const paginatedTrades = filteredTrades.slice(startIndex, startIndex + tradesPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-[#494D5F]">
      {!isDashboard && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#8458B3] uppercase tracking-tight">
              Trade <span className="text-[#a28089]">History</span>
            </h1>
            <p className="text-sm font-medium text-[#a28089] mt-1">
              Detailed log of all your executions and historical data.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#d0bdf4] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#e5eaf5] bg-[#f8f9fc] flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="font-semibold text-xs uppercase tracking-widest text-[#a28089] hidden sm:block">
            Execution Logs
          </h3>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a28089]" size={16} />
              <input
                type="text"
                placeholder="Search symbol..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#d0bdf4] rounded-xl text-sm outline-none focus:border-[#a0d2eb] text-[#494D5F] font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a28089]" size={16} />
              <select
                className="pl-9 pr-8 py-2 bg-white border border-[#d0bdf4] rounded-xl text-sm outline-none focus:border-[#a0d2eb] text-[#8458B3] font-bold appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All Trades">All Trades</option>
                <option value="Open">Open</option>
                <option value="Win">Winners</option>
                <option value="Loss">Losers</option>
                <option value="BE">Breakeven</option>
              </select>
            </div>
          </div>
        </div>

        <TradeLogs
          preProcessedData={paginatedTrades}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          showExitDate={true}
          showPositionSize={true}
        />

        <div className="flex justify-between items-center p-4 border-t border-[#e5eaf5] bg-[#f8f9fc]">
          <p className="text-sm text-[#a28089] font-medium">
            Page {currentPage} of {totalPages || 1}
          </p>

          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded-lg border border-[#d0bdf4] text-sm disabled:opacity-50"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            <button
              className="px-3 py-1 rounded-lg border border-[#d0bdf4] text-sm disabled:opacity-50"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}