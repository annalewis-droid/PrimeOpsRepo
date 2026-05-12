"use client";

import React, { useState } from 'react';
import { Camera, Plus, Receipt, Calculator, CheckCircle2, ChevronRight, HardHat } from 'lucide-react';

const Page = () => {
  const [netCost, setNetCost] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const markup = 0.15;
  const total = netCost ? parseFloat(netCost) * (1 + markup) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Premium Header */}
      <div className="bg-slate-900 text-white pt-8 pb-12 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <HardHat size={120} />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 p-2">
             <img 
              src="https://api.typedream.com/v0/document/public/1jK7CMdUhrbNqclSn5FPuzBikFs_nC0xe_Prime_Handyman_Service_Logo_10_26_2025.jpg" 
              alt="Prime Logo" 
              className="w-full h-auto object-contain"
              onError={(e) => e.target.src = "https://placeholder.com/100x100?text=PHS"}
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase">Prime Handyman Service</h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest italic">Material Purchase Log</p>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-6 -mt-8 relative z-20">
        
        {/* Job Identity Card */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <CheckCircle2 size={20} />
            </div>
            <h2 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Job Identity</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase">Job Number</label>
              <input type="text" placeholder="e.g. 2024-105" className="w-full bg-slate-50 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase">Property Address</label>
              <input type="text" placeholder="6434 W Cavalier Dr..." className="w-full bg-slate-50 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </section>

        {/* Financial Calculation Card */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-50 p-2 rounded-lg text-green-600">
              <Calculator size={20} />
            </div>
            <h2 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Financial Log</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 ml-1 uppercase">Receipt Net Total ($)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={netCost}
                  onChange={(e) => setNetCost(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-slate-50 border-0 rounded-xl p-4 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-green-500" 
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-inner flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Billed to Client</p>
                <p className="text-2xl font-black text-green-400">${total.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Prime Markup</p>
                <p className="text-sm font-bold">+15.0%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Media & Receipt Upload */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
           <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
              <Receipt size={20} />
            </div>
            <h2 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Proof of Purchase</h2>
          </div>

          <button className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-2 hover:bg-slate-50 hover:border-blue-300 transition-colors">
            <div className="bg-blue-600 p-3 rounded-full text-white shadow-lg shadow-blue-200">
              <Camera size={24} />
            </div>
            <p className="text-sm font-bold text-slate-600 mt-2">Upload Receipt Photo</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest italic">JPG or PNG only</p>
          </button>
        </section>

        {/* Submit Action */}
        <button 
          onClick={handleSubmit}
          className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
            isSubmitted ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitted ? (
            <>
              <CheckCircle2 size={24} />
              <span className="font-bold text-lg uppercase tracking-wider">Log Recorded</span>
            </>
          ) : (
            <>
              <span className="font-bold text-lg uppercase tracking-wider">Sync to Prime HQ</span>
              <ChevronRight size={20} />
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-slate-400 mt-8 font-medium uppercase tracking-[.2em]">
          Prime Handyman Service LLC • Glendale, AZ
        </p>
      </main>
    </div>
  );
};

export default Page;
