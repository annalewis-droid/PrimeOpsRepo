"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Plus, Receipt, Calculator, CheckCircle2, ChevronRight, HardHat, Store, Tag, User, Calendar, Loader2 } from 'lucide-react';
import { createClient } from '../utils/supabase/client';

const Page = () => {
  const supabase = createClient();
  const [formData, setFormData] = useState({
    jobNumber: '',
    address: '',
    vendor: 'Home Depot',
    category: 'General Maintenance',
    purchaser: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    netCost: '',
    notes: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const markup = 0.15;
  const total = formData.netCost ? parseFloat(formData.netCost) * (1 + markup) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('material_purchase_logs')
        .insert([
          {
            job_number: formData.jobNumber,
            property_address: formData.address,
            vendor: formData.vendor,
            category: formData.category,
            purchaser: formData.purchaser,
            purchase_date: formData.purchaseDate,
            net_cost: parseFloat(formData.netCost) || 0,
            total_client_bill: total,
            notes: formData.notes
          }
        ]);

      if (supabaseError) throw supabaseError;

      setIsSubmitted(true);
      setFormData({
        jobNumber: '',
        address: '',
        vendor: 'Home Depot',
        category: 'General Maintenance',
        purchaser: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        netCost: '',
        notes: ''
      });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error('Error saving to Supabase:', err);
      setError('Failed to sync. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Premium Header */}
      <div className="bg-slate-900 text-white pt-10 pb-16 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <HardHat size={180} />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 p-1 overflow-hidden">
            <Image
              src="/Logo.png"
              alt="Prime Logo"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Prime Handyman Service</h1>
          <div className="flex items-center gap-2 mt-2 px-4 py-1 bg-blue-600/20 rounded-full border border-blue-500/30">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em]">Material Purchase System v2.0</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-6 -mt-10 relative z-20">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Job & Identity Card */}
          <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest">Job Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 ml-1 uppercase tracking-widest">Job Number</label>
                  <input 
                    type="text" 
                    value={formData.jobNumber}
                    onChange={(e) => handleInputChange('jobNumber', e.target.value)}
                    placeholder="2024-105" 
                    className="w-full bg-slate-50 border-slate-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 ml-1 uppercase tracking-widest">Purchase Date</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={formData.purchaseDate}
                      onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                      className="w-full bg-slate-50 border-slate-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 ml-1 uppercase tracking-widest">Property Address</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street Address..." 
                  className="w-full bg-slate-50 border-slate-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>
          </section>

          {/* Logistics & Vendor Card */}
          <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600">
                <Store size={20} />
              </div>
              <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest">Purchase Details</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 ml-1 uppercase tracking-widest">Vendor</label>
                  <select 
                    value={formData.vendor}
                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                  >
                    <option>Home Depot</option>
                    <option>Lowe&apos;s</option>
                    <option>Sherwin-Williams</option>
                    <option>Ferguson</option>
                    <option>Amazon</option>
                    <option>Other Store</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-1.5 ml-1 uppercase tracking-widest">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                  >
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Drywall/Paint</option>
                    <option>Lumber/Hardware</option>
                    <option>General Maint</option>
                    <option>Appliances</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 ml-1 uppercase tracking-widest">Purchased By</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.purchaser}
                    onChange={(e) => handleInputChange('purchaser', e.target.value)}
                    placeholder="Employee Name" 
                    className="w-full bg-slate-50 border-slate-100 rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Financial Calculation Card */}
          <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-50 p-2.5 rounded-xl text-green-600">
                <Calculator size={20} />
              </div>
              <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest">Financials</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 ml-1 uppercase tracking-widest">Receipt Net Total ($)</label>
                <input 
                  type="number" 
                  value={formData.netCost}
                  onChange={(e) => handleInputChange('netCost', e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-slate-50 border-slate-100 rounded-2xl p-6 text-3xl font-black text-slate-900 focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              <div className="bg-slate-900 rounded-[1.5rem] p-6 text-white shadow-2xl flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-1">Total Client Bill</p>
                  <p className="text-4xl font-black text-green-400 tabular-nums">${total.toFixed(2)}</p>
                </div>
                <div className="text-right relative z-10">
                  <div className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">+15% Markup</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          {/* Submit Action */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-6 rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 ${
              isSubmitted ? 'bg-green-500 text-white' : 
              isSubmitting ? 'bg-slate-400 text-white cursor-not-allowed' :
              'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/40'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span className="font-black text-lg uppercase tracking-[0.2em]">Syncing...</span>
              </>
            ) : isSubmitted ? (
              <>
                <CheckCircle2 size={24} />
                <span className="font-black text-lg uppercase tracking-[0.2em]">Log Recorded</span>
              </>
            ) : (
              <>
                <span className="font-black text-lg uppercase tracking-[0.2em]">Sync to Prime HQ</span>
                <ChevronRight size={24} />
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-slate-400 mt-8 font-black uppercase tracking-[0.4em]">
            Prime Handyman Service LLC • Glendale, AZ
          </p>
        </form>
      </main>
    </div>
  );
};

export default Page;
