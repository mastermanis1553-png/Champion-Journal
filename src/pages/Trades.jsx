import React, { useState } from 'react';
import TradeLogs from '../components/TradeLogs';
import { Search, Filter } from 'lucide-react';

export default function Trades({ isDashboard, preProcessedData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Trades');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-[#494D5F]">
      {!isDashboard && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#8458B3] uppercase tracking-tight">Trade <span className="text-[#a28089]">History</span></h1>
            <p className="text-sm font-medium text-[#a28089] mt-1">Detailed log of all your executions and historical data.</p>
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
                type="text" placeholder="Search symbol..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#d0bdf4] rounded-xl text-sm outline-none focus:border-[#a0d2eb] text-[#494D5F] font-medium"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a28089]" size={16} />
              <select 
                className="pl-9 pr-8 py-2 bg-white border border-[#d0bdf4] rounded-xl text-sm outline-none focus:border-[#a0d2eb] text-[#8458B3] font-bold appearance-none cursor-pointer"
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
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
        <TradeLogs preProcessedData={preProcessedData} searchTerm={searchTerm} filterStatus={filterStatus} />
      </div>
    </div>
  );
}