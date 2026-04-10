// Trades.jsx
import React, { useState } from 'react';
import TradeLogs from '../components/TradeLogs';
import { Search, Filter } from 'lucide-react';
import { useTrades } from '../context/TradeContext';
import { processTrade } from '../utils/math';

export default function Trades({ isDashboard, preProcessedData }) {
  const { trades, settings } = useTrades();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Trades');
  const [currentPage, setCurrentPage] = useState(1);

  const tradesPerPage = 30;

  const baseTrades = (preProcessedData && preProcessedData.length > 0)
    ? preProcessedData
    : trades.map(t => processTrade(t, settings?.rValue));

  const totalPages = Math.ceil(baseTrades.length / tradesPerPage);

  const startIndex = (currentPage - 1) * tradesPerPage;
  const paginatedTrades = baseTrades.slice(startIndex, startIndex + tradesPerPage);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-[#494D5F] w-full max-w-full">
      
      {!isDashboard && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 w-full max-w-full">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#8458B3] uppercase tracking-tight break-words">
              Trade <span className="text-[#a28089]">History</span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#a28089] mt-1 break-words">
              Detailed log of all your executions and historical data.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#d0bdf4] rounded-xl sm:rounded-2xl shadow-sm overflow-hidden w-full max-w-full">
        
        <div className="p-3 sm:p-4 md:p-5 border-b border-[#e5eaf5] bg-[#f8f9fc] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 w-full max-w-full">
          
          <h3 className="font-semibold text-[10px] sm:text-xs uppercase tracking-widest text-[#a28089] hidden sm:block">
            Execution Logs
          </h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            
            <div className="relative w-full sm:w-56 md:w-64 max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a28089]" size={14} />
              <input
                type="text"
                placeholder="Search symbol..."
                className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 bg-white border border-[#d0bdf4] rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:border-[#a0d2eb] text-[#494D5F] font-medium max-w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-auto max-w-full">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a28089]" size={14} />
              <select
                className="w-full sm:w-auto pl-8 sm:pl-9 pr-6 sm:pr-8 py-2 bg-white border border-[#d0bdf4] rounded-lg sm:rounded-xl text-xs sm:text-sm outline-none focus:border-[#a0d2eb] text-[#8458B3] font-bold appearance-none cursor-pointer max-w-full"
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

        <div className="w-full max-w-full overflow-x-auto">
          <TradeLogs
            preProcessedData={paginatedTrades}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            showExitDate={true}
            showPositionSize={true}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 p-3 sm:p-4 border-t border-[#e5eaf5] bg-[#f8f9fc] w-full max-w-full">
          
          <p className="text-xs sm:text-sm text-[#a28089] font-medium text-center sm:text-left break-words">
            Page {currentPage} of {totalPages || 1}
          </p>

          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-[#d0bdf4] text-xs sm:text-sm disabled:opacity-50"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            <button
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-[#d0bdf4] text-xs sm:text-sm disabled:opacity-50"
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