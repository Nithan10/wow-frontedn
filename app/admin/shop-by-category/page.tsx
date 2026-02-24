'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, Edit2, Loader2, RefreshCw, AlertCircle, CheckCircle, Image as ImageIcon, Type, Link, Layers } from 'lucide-react';
import Layout from '../layout/layout';
import axios from 'axios';
// Updated import path to match your structure
import ShopByCategorySection, { CategoryItem } from '../../components-sections/ShopByCategorySection'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const ICON_OPTIONS = ["CarFront", "Trophy", "Gift", "Brain", "Palette", "Gamepad2", "Sparkles", "Zap"];
const GRADIENT_OPTIONS = [
  "from-red-600 to-rose-900", "from-purple-600 to-indigo-900", 
  "from-amber-500 to-orange-800", "from-emerald-500 to-green-800", 
  "from-pink-500 to-rose-700", "from-blue-500 to-cyan-700"
];
const ACCENT_OPTIONS = [
  "text-red-500", "text-purple-500", "text-amber-500", 
  "text-emerald-500", "text-pink-500", "text-blue-500"
];

export default function ShopByCategoryAdminPage() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [items, setItems] = useState<CategoryItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false); // Make sure we track reset state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  // Form States
  const [newId, setNewId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newCount, setNewCount] = useState(0);
  const [newIcon, setNewIcon] = useState(ICON_OPTIONS[0]);
  const [newColor, setNewColor] = useState(GRADIENT_OPTIONS[0]);
  const [newAccent, setNewAccent] = useState(ACCENT_OPTIONS[0]);

  useEffect(() => {
    checkAuth();
    fetchConfig();
  }, []);

  const checkAuth = () => setIsAuthenticated(!!localStorage.getItem('token'));

  const fetchConfig = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/shopbycategory`);
      if (res.data.success) setItems(res.data.data);
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
      const res = await axiosInstance.put('/shopbycategory', { items });
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

  const handleReset = async () => {
    if (!confirm('Are you sure you want to restore the default categories? This will overwrite your current changes.')) return;
    try {
      setIsResetting(true);
      const res = await axiosInstance.post('/shopbycategory/reset');
      if (res.data.success) {
        setItems(res.data.data);
        setSaveStatus({ type: 'success', message: 'Reset to defaults successfully!' });
        setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      console.error(error);
      setSaveStatus({ type: 'error', message: 'Failed to reset' });
    } finally {
      setIsResetting(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newTitle || !newImgUrl) return;
    
    setItems(prev => [...prev, { 
      id: newId.toLowerCase().replace(/\s+/g, '-'), 
      title: newTitle, img: newImgUrl, description: newDesc, badge: newBadge, 
      count: Number(newCount), icon: newIcon, color: newColor, accent: newAccent
    }]);
    
    setNewId(''); setNewTitle(''); setNewImgUrl(''); setNewDesc(''); setNewBadge(''); setNewCount(0);
  };

  const handleDeleteItem = (id: string) => {
    // Note: This removes it locally. You must click 'Save Changes' to update the database!
    setItems(prev => prev.filter(item => item.id !== id));
  };

  if (isLoading) return <Layout><div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-[#D4AF37]" size={40}/></div></Layout>;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shop By Category Manager</h1>
            <p className="text-gray-500 text-sm">Manage the 3D rotating carousel</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <select value={theme} onChange={(e) => setTheme(e.target.value as 'dark'|'light')} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none">
              <option value="dark">Dark Theme</option>
              <option value="light">Light Theme</option>
            </select>
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 rounded-lg text-sm font-medium flex gap-2 ${activeTab === 'edit' ? 'bg-white shadow' : 'text-gray-600'}`}><Edit2 size={16}/> Edit</button>
              <button onClick={() => setActiveTab('preview')} className={`px-4 py-2 rounded-lg text-sm font-medium flex gap-2 ${activeTab === 'preview' ? 'bg-white shadow' : 'text-gray-600'}`}><Eye size={16}/> Preview</button>
            </div>
            
            {isAuthenticated && (
              <>
                {/* Fixed: Re-added the Reset button here */}
                <button 
                  onClick={handleReset} 
                  disabled={isSaving || isResetting} 
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isResetting ? <Loader2 size={16} className="animate-spin"/> : <RefreshCw size={16}/>} 
                  Reset
                </button>
                
                <button 
                  onClick={handleSave} 
                  disabled={isSaving || isResetting} 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} 
                  Save Changes
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <ShopByCategorySection theme={theme} isPreview={true} previewData={items} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2"><Plus size={18} className="text-[#D4AF37]" /> Add Category</h3>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 flex items-center gap-1"><Link size={14}/> URL ID</label>
                      <input type="text" value={newId} onChange={e => setNewId(e.target.value)} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="e.g. vehicles" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 flex items-center gap-1"><Layers size={14}/> Item Count</label>
                      <input type="number" value={newCount} onChange={e => setNewCount(Number(e.target.value))} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 flex items-center gap-1"><Type size={14}/> Title</label>
                    <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="Vehicles & Tracksets" />
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600 mb-1">Description</label>
                    <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="Remote control models" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-1">Badge</label>
                      <input type="text" value={newBadge} onChange={e => setNewBadge(e.target.value)} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="Trending" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1">Icon</label>
                      <select value={newIcon} onChange={e => setNewIcon(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]">
                        {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-1">Theme Gradient</label>
                      <select value={newColor} onChange={e => setNewColor(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]">
                        {GRADIENT_OPTIONS.map(g => <option key={g} value={g}>{g.split('-')[1]}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1">Theme Accent</label>
                      <select value={newAccent} onChange={e => setNewAccent(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]">
                        {ACCENT_OPTIONS.map(a => <option key={a} value={a}>{a.split('-')[1]}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-1 flex items-center gap-1"><ImageIcon size={14}/> Image URL</label>
                    <input type="text" value={newImgUrl} onChange={e => setNewImgUrl(e.target.value)} required className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder="/chars/car3.png" />
                  </div>

                  <button type="submit" disabled={!isAuthenticated} className="w-full mt-2 py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b08d2c] transition-colors disabled:opacity-50">
                    Add Category
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center">
                  <div className={`w-20 h-24 rounded-lg flex-shrink-0 relative overflow-hidden bg-gradient-to-br ${item.color}`}>
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-80" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex gap-2 mb-1">
                      <span className={`bg-gray-100 ${item.accent} text-xs font-bold px-2 py-1 rounded`}>{item.icon}</span>
                      <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded">{item.count} items</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">ID: {item.id}</p>
                  </div>

                  <button 
                    onClick={() => handleDeleteItem(item.id)} 
                    disabled={!isAuthenticated} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete item (Remember to save changes!)"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="py-12 text-center text-gray-400 border-2 border-dashed rounded-xl">
                  No categories added yet. Add a category and click "Save Changes".
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}