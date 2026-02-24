'use client';

import React, { useState, useEffect } from 'react';
import { Save, Eye, Edit2, Loader2, RefreshCw, AlertCircle, CheckCircle, MapPin, Phone, Mail, Clock, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../layout/layout';
import axios from 'axios';
import ContactPage, { ContactData } from '../../../app/services/ContactPage'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function ContactAdminPage() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const [data, setData] = useState<ContactData>({
    title: "", subtitle: "", email: "", phone: "", address: "",
    hoursWeekday: "", hoursSaturday: "", hoursSunday: ""
  });

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', action: () => {} });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/contact`);
      if (res.data.success && res.data.data) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) return setSaveStatus({ type: 'error', message: 'Login required' });
    try {
      setIsSaving(true);
      const res = await axiosInstance.put('/contact', data);
      if (res.data.success) {
        setSaveStatus({ type: 'success', message: 'Saved successfully!' });
        setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save' });
    } finally {
      setIsSaving(false);
    }
  };

  const executeReset = async () => {
    try {
      setIsResetting(true);
      const res = await axiosInstance.post('/contact/reset');
      if (res.data.success) {
        setData(res.data.data);
        setSaveStatus({ type: 'success', message: 'Reset successfully!' });
        setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to reset' });
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetClick = () => {
    if (!isAuthenticated) return setSaveStatus({ type: 'error', message: 'Login required' });
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Configuration',
      message: 'Are you sure you want to restore the default contact settings? This will overwrite your current changes.',
      action: executeReset
    });
  };

  const handleChange = (field: keyof ContactData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <Layout><div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-yellow-500" size={40}/></div></Layout>;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
        
        {/* CUSTOM CONFIRMATION MODAL */}
        <AnimatePresence>
          {confirmDialog.isOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[9998]" onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} />
              <motion.div initial={{ opacity: 0, scale: 0.95, top: '50%', left: '50%', x: '-50%', y: '-50%' }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed z-[9999] bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-sm overflow-hidden border border-gray-100">
                <div className="flex items-center gap-3 mb-4 text-red-600">
                  <AlertCircle size={24} />
                  <h3 className="text-xl font-bold text-gray-900">{confirmDialog.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{confirmDialog.message}</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm">Cancel</button>
                  <button onClick={() => { confirmDialog.action(); setConfirmDialog({ ...confirmDialog, isOpen: false }); }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm shadow-md shadow-red-600/20">Confirm</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Page Manager</h1>
            <p className="text-gray-500 text-sm">Manage business info and modal text</p>
          </div>
          <div className="flex gap-3">
            <select value={theme} onChange={(e) => setTheme(e.target.value as 'dark'|'light')} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none">
              <option value="dark">Dark Theme</option>
              <option value="light">Light Theme</option>
            </select>
            <div className="flex bg-gray-200 rounded-lg p-1 mr-2">
              <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-lg text-sm font-medium flex gap-2 ${activeTab === 'edit' ? 'bg-white shadow' : 'text-gray-600'}`}><Edit2 size={16}/> Edit</button>
              <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-lg text-sm font-medium flex gap-2 ${activeTab === 'preview' ? 'bg-white shadow' : 'text-gray-600'}`}><Eye size={16}/> Preview</button>
            </div>
            {isAuthenticated && (
              <>
                <button onClick={handleResetClick} disabled={isSaving || isResetting} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium flex gap-2">
                  {isResetting ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16}/>} Reset
                </button>
                <button onClick={handleSave} disabled={isSaving || isResetting} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex gap-2">
                  {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {saveStatus.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${saveStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {saveStatus.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
            <span className="font-medium text-sm">{saveStatus.message}</span>
          </div>
        )}

        {activeTab === 'preview' ? (
          <div className={`rounded-xl shadow-sm border border-gray-100 p-8 flex justify-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
             <div className="w-full max-w-5xl">
               <ContactPage isOpen={true} onClose={() => {}} isDarkMode={theme === 'dark'} isPreview={true} previewData={data} />
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Basic Info */}
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2"><Type size={18} className="text-blue-500"/> Header Text</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
                    <input type="text" value={data.title} onChange={e => handleChange('title', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Subtitle</label>
                    <input type="text" value={data.subtitle} onChange={e => handleChange('subtitle', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2 mt-8"><Mail size={18} className="text-blue-500"/> Contact Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <input type="email" value={data.email} onChange={e => handleChange('email', e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
                      <input type="text" value={data.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Hours */}
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2"><MapPin size={18} className="text-blue-500"/> Location</h3>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Physical Address</label>
                  <textarea value={data.address} onChange={e => handleChange('address', e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </div>

                <h3 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2 mt-8"><Clock size={18} className="text-blue-500"/> Business Hours</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Monday - Friday</label>
                    <input type="text" value={data.hoursWeekday} onChange={e => handleChange('hoursWeekday', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="9:00 AM - 8:00 PM" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Saturday</label>
                    <input type="text" value={data.hoursSaturday} onChange={e => handleChange('hoursSaturday', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="10:00 AM - 6:00 PM" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Sunday</label>
                    <input type="text" value={data.hoursSunday} onChange={e => handleChange('hoursSunday', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Closed" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}