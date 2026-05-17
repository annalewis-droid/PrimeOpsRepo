"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Store, Plus, Shield, Globe, Phone, Mail, ChevronRight, Loader2, Search, ExternalLink, Lock, AlertCircle } from 'lucide-react';
import { createClient } from '../../utils/supabase/client';

const VendorPage = () => {
  const supabase = createClient();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [vendorForm, setVendorForm] = useState({
    name: '',
    website: '',
    category: 'General',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setVendors(data || []);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Could not load vendors. Make sure the tables are created!');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Defer the initial fetch to the next tick to avoid synchronous setState in effect
  useEffect(() => {
    const t = setTimeout(() => {
      fetchVendors();
    }, 0);
    return () => clearTimeout(t);
  }, [fetchVendors]);

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setVendorForm(prev => ({ ...prev, [field]: value }));
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMessage(null);

    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendorForm])
        .select();

      if (error) throw error;
      setVendors(prev => [...prev, ...(data || [])]);
      setVendorForm({ name: '', website: '', category: 'General' });
      setSubmitMessage({ type: 'success', text: 'Vendor added successfully.' });
    } catch (err) {
      console.error('Error adding vendor:', err);
      setSubmitMessage({ type: 'error', text: err.message || 'Failed to add vendor.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Premium Header */}
      <div className="bg-slate-900 text-white pt-10 pb-16 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Store size={180} />
        </div>
        <div className="relative z-10 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1 overflow-hidden">
                 <Image src="/Logo.png" alt="Logo" width={48} height={48} className="object-contain" />
               </div>
             <div className="bg-purple-600/20 px-4 py-1 rounded-full border border-purple-500/30">
               <p className="text-purple-300 text-[10px] font-bold uppercase tracking-widest">Vendor Vault v1.0</p>
             </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight uppercase mb-2">PHS Vendor Manager</h1>
          <p className="text-slate-400 text-sm font-medium">Secure tracking for our partners & suppliers.</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 -mt-8 relative z-20">
        
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-2 shadow-xl shadow-slate-200/50 mb-6 flex items-center gap-2 border border-slate-100">
          <div className="pl-4 text-slate-400">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search vendors..." 
            className="w-full py-3 pr-4 text-sm font-bold outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors">
            <Plus size={20} />
          </button>
        </div>

        {/* Add Vendor Form */}
        <section className="bg-white rounded-3xl p-6 mb-6 shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-4">Add a New Vendor</h2>
          <form onSubmit={handleVendorSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Vendor Name</label>
              <input
                value={vendorForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Vendor name"
                className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Website</label>
              <input
                value={vendorForm.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://vendor.com"
                className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Category</label>
              <input
                value={vendorForm.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="General"
                className="w-full bg-slate-50 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            {submitMessage && (
              <p className={`text-sm font-bold ${submitMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {submitMessage.text}
              </p>
            )}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-purple-600 text-white rounded-2xl py-4 font-black uppercase tracking-[0.2em] hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {submitLoading ? 'Saving...' : 'Add Vendor'}
            </button>
          </form>
        </section>

        {/* Status Messages */}
        {error && (
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl mb-6 flex flex-col items-center text-center gap-3">
            <AlertCircle className="text-amber-500" size={32} />
            <p className="text-sm font-bold text-amber-900">{error}</p>
            <p className="text-[10px] text-amber-700 uppercase font-black tracking-widest">Tip: Run npx supabase db push</p>
          </div>
        )}

        {/* Vendor List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Loading Partners...</p>
            </div>
          ) : filteredVendors.length > 0 ? (
            filteredVendors.map(vendor => (
              <section key={vendor.id} className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-200/40 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-blue-50 transition-colors">
                      <Store className="text-slate-400 group-hover:text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">{vendor.name}</h3>
                      <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{vendor.category || 'General'}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {vendor.website && (
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2">
                      <Globe size={14} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600 truncate">Website</span>
                    </div>
                  )}
                  <div className="bg-purple-50 rounded-xl p-3 flex items-center gap-2 border border-purple-100">
                    <Lock size={14} className="text-purple-600" />
                    <span className="text-[10px] font-black text-purple-700 uppercase tracking-tighter">View Logins</span>
                  </div>
                </div>
              </section>
            ))
          ) : !error && (
            <div className="text-center py-20">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="text-slate-300" size={32} />
              </div>
              <h3 className="font-bold text-slate-400">No vendors found</h3>
              <p className="text-xs text-slate-300 mt-1">Add your first supplier to get started.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-400 mt-12 font-black uppercase tracking-[0.4em]">
          Prime Handyman Service LLC • Secure Access
        </p>
      </main>
    </div>
  );
};

export default VendorPage;
