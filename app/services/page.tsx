'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components-main/NavbarHome';
import FooterComponent from '../components-sections/Footer';
import ContactPage from './ContactPage'; 
import { ShoppingBag, Building2, CheckCircle, ArrowRight, Package, TrendingUp, Sparkles, Gift, Crown, Truck, Shield, Headphones, Users, Clock, Zap, Phone, Loader2 } from 'lucide-react';

const DEFAULT_RETAIL_OFFER = {
  badgeText: "EXCLUSIVE OFFER", discountPercentage: "25", title: "OFF FOR RETAIL CUSTOMERS",
  description: "Special discount on all retail purchases",
  perk1: { title: "Minimum Purchase", desc: "₹5,000" }, perk2: { title: "Valid Until", desc: "Dec 31, 2024" }, perk3: { title: "Free Gift", desc: "Premium Wrapping Included" },
  buttonText: "APPLY 25% DISCOUNT", terms: "*Terms & Conditions apply. Valid on select products."
};

const DEFAULT_WHOLESALE_OFFER = {
  badgeText: "VOLUME DISCOUNT", discountPercentage: "50", title: "OFF FOR BUSINESS PARTNERS",
  description: "Maximum discount on bulk purchases",
  perk1: { title: "Minimum Order", desc: "200+ Units" }, perk2: { title: "Free Shipping", desc: "Pan India Delivery" }, perk3: { title: "Dedicated Support", desc: "Account Manager Included" },
  buttonText: "APPLY 50% DISCOUNT", terms: "*Valid on orders above ₹5,00,000. Limited time offer."
};

// Use 'any' to bypass Next.js strict page prop validation while allowing Admin preview props
export default function ServicesPage(props: any) {
  const isPreview = props.isPreview || false;
  const previewData = props.previewData || null;

  const [viewMode, setViewMode] = useState<'retail' | 'wholesale'>('retail');
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showContact, setShowContact] = useState(false);

  const [retailProducts, setRetailProducts] = useState<any[]>([]);
  const [wholesaleProducts, setWholesaleProducts] = useState<any[]>([]);
  const [retailOffer, setRetailOffer] = useState(DEFAULT_RETAIL_OFFER);
  const [wholesaleOffer, setWholesaleOffer] = useState(DEFAULT_WHOLESALE_OFFER);
  const [isLoading, setIsLoading] = useState(!isPreview);

  const isDarkMode = theme === 'dark';
  const currentProducts = viewMode === 'retail' ? retailProducts : wholesaleProducts;
  const currentOffer = viewMode === 'retail' ? retailOffer : wholesaleOffer;

  useEffect(() => {
    if (isPreview && previewData) {
      setRetailProducts(previewData.retailProducts || []);
      setWholesaleProducts(previewData.wholesaleProducts || []);
      if (previewData.retailOffer) setRetailOffer(previewData.retailOffer);
      if (previewData.wholesaleOffer) setWholesaleOffer(previewData.wholesaleOffer);
      return;
    }

    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/services`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setRetailProducts(result.data.retailProducts || []);
          setWholesaleProducts(result.data.wholesaleProducts || []);
          if (result.data.retailOffer) setRetailOffer(result.data.retailOffer);
          if (result.data.wholesaleOffer) setWholesaleOffer(result.data.wholesaleOffer);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isPreview, previewData]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);
    const handleThemeChange = (e: CustomEvent) => { if (e.detail?.theme) setTheme(e.detail.theme); };
    window.addEventListener('themeChange' as any, handleThemeChange);
    return () => window.removeEventListener('themeChange' as any, handleThemeChange);
  }, []);

  useEffect(() => {
    if (showContact) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showContact]);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${isDarkMode ? 'bg-slate-900' : 'bg-amber-50'}`}>
        <Loader2 className="animate-spin text-yellow-500 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden ${
      isDarkMode ? 'bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white' : 'bg-gradient-to-br from-amber-50 via-white to-yellow-50 text-slate-900'
    }`}>
      
      {!isPreview && <Navbar theme={theme} toggleTheme={toggleTheme} />}

      <div className={`flex-grow ${isPreview ? 'py-12' : 'pt-24 pb-12'} px-4 md:px-8`}>
        <div className="max-w-7xl mx-auto mb-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="space-y-4">
              <div className="relative">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2 relative">
                  <span className="relative z-10">
                    <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>WOW</span>
                    <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent animate-gradient ml-3">LIFESTYLE</span>
                  </span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 animate-pulse" />
                  <p className={`text-lg md:text-xl font-medium italic ${isDarkMode ? 'text-yellow-400' : 'text-amber-600'}`}>
                    Just Looking Like a "WOW"
                  </p>
                </div>
              </div>
              <p className={`text-lg max-w-2xl ${isDarkMode ? 'text-yellow-400/80' : 'text-amber-700/80'}`}>
                {viewMode === 'retail' ? "Premium toys for families and collectors" : "Bulk products for businesses and resellers"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {viewMode === 'retail' && !isPreview && (
                <button onClick={() => setShowContact(true)} className={`px-6 py-3.5 rounded-lg font-bold transition-all flex items-center gap-3 shadow-lg hover:scale-105 group ${
                  isDarkMode ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 shadow-yellow-500/30' : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-amber-500/30'
                }`}>
                  <Phone size={18} className="group-hover:animate-pulse" /> 
                  <span>CONTACT US</span>
                </button>
              )}

              <div className={`inline-flex p-1 backdrop-blur-sm rounded-xl shadow-lg ${
                isDarkMode ? 'bg-slate-800/90 border border-yellow-500/30 shadow-yellow-500/20' : 'bg-white/90 border border-amber-300 shadow-amber-500/20'
              }`}>
                <button onClick={() => { setViewMode('retail'); setSelectedProduct(0); }} className={`relative px-8 py-3.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-3 ${viewMode === 'retail' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/50' : isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-amber-700 hover:text-amber-900'}`}>
                  <ShoppingBag size={18} /> <span className="font-black tracking-wide">RETAIL</span>
                </button>
                <button onClick={() => { setViewMode('wholesale'); setSelectedProduct(0); }} className={`relative px-8 py-3.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-3 ${viewMode === 'wholesale' ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/50' : isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-amber-700 hover:text-amber-900'}`}>
                  <Building2 size={18} /> <span className="font-black tracking-wide">WHOLESALE</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={`backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-900/95 shadow-yellow-500/10 border border-yellow-500/20' : 'bg-white/95 shadow-amber-500/10 border border-amber-200'}`}>
                <div className={`p-8 border-b ${isDarkMode ? viewMode === 'retail' ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-yellow-500/20' : 'bg-gradient-to-r from-slate-900 to-slate-800 border-yellow-500/20' : viewMode === 'retail' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-8 rounded-full ${viewMode === 'retail' ? 'bg-yellow-400' : 'bg-amber-500'}`} />
                        <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {viewMode === 'retail' ? 'RETAIL PRODUCTS' : 'WHOLESALE PRODUCTS'}
                        </h2>
                      </div>
                      <p className={`text-sm pl-6 ${isDarkMode ? 'text-yellow-400/80' : 'text-amber-700/80'}`}>
                        {viewMode === 'retail' ? 'List of available products with exclusive pricing' : 'Bulk products with maximum profit margins'}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDarkMode ? 'bg-slate-800 border border-yellow-500/30' : 'bg-white border border-amber-300'}`}>
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-yellow-400' : 'text-amber-700'}`}>{currentProducts.length} PRODUCTS</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isDarkMode ? 'bg-slate-800/50' : 'bg-amber-50/50'}>
                      <tr>
                        <th className={`text-left p-5 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-yellow-400' : 'text-amber-800'}`}>PRODUCT</th>
                        <th className={`text-left p-5 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-yellow-400' : 'text-amber-800'}`}>CATEGORY</th>
                        <th className={`text-left p-5 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-yellow-400' : 'text-amber-800'}`}>PRICE</th>
                        {viewMode === 'retail' ? (
                          <>
                            <th className={`text-left p-5 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-yellow-400' : 'text-amber-800'}`}>DISCOUNT</th>
                            <th className={`text-left p-5 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-yellow-400' : 'text-amber-800'}`}>STOCK</th>
                          </>
                        ) : (
                          <>
                            <th className={`text-left p-5 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-yellow-400' : 'text-amber-800'}`}>MOQ</th>
                            <th className={`text-left p-5 text-sm font-black uppercase tracking-wider ${isDarkMode ? 'text-yellow-400' : 'text-amber-800'}`}>MARGIN</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-yellow-500/10' : 'divide-amber-100'}`}>
                      {currentProducts.map((product, index) => (
                        <tr key={product.id} className={`cursor-pointer transition-all duration-300 ${isDarkMode ? `hover:bg-yellow-500/5 ${selectedProduct === index ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/5 ring-1 ring-yellow-500/30' : ''}` : `hover:bg-amber-50/30 ${selectedProduct === index ? 'bg-gradient-to-r from-amber-50/60 to-yellow-50/40 ring-1 ring-amber-300' : ''}`}`} onClick={() => setSelectedProduct(index)}>
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg ${viewMode === 'retail' ? 'bg-gradient-to-br from-yellow-400 to-amber-500' : 'bg-gradient-to-br from-amber-500 to-yellow-600'}`}>
                                {product.icon}
                              </div>
                              <div>
                                <div className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{product.name}</div>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${isDarkMode ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-amber-100 text-amber-800'}`}>⭐ {product.rating}</span>
                                  <span className={`text-xs font-medium ${isDarkMode ? 'text-yellow-400/80' : 'text-amber-700/80'}`}>{viewMode === 'retail' ? `${product.sales || '0'} sold` : `${product.orders || '0'} orders`}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-5"><span className={`text-sm font-medium px-3 py-1.5 rounded-lg ${isDarkMode ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20' : 'text-amber-800 bg-amber-50'}`}>{product.category}</span></td>
                          <td className="p-5">
                            <div className="flex flex-col">
                              <span className={`font-black text-xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{product.price}</span>
                              {viewMode === 'retail' && product.originalPrice && <span className={`text-sm line-through font-medium ${isDarkMode ? 'text-yellow-400/50' : 'text-amber-600/70'}`}>{product.originalPrice}</span>}
                            </div>
                          </td>
                          {viewMode === 'retail' ? (
                            <>
                              <td className="p-5"><span className={`text-lg font-black ${isDarkMode ? 'text-yellow-400' : 'text-red-600'}`}>{product.discount}</span></td>
                              <td className="p-5"><span className={`text-sm font-bold ${product.stock === 'In Stock' ? 'text-green-400' : isDarkMode ? 'text-yellow-400' : 'text-amber-700'}`}>{product.stock}</span></td>
                            </>
                          ) : (
                            <>
                              <td className="p-5"><span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{product.moq}</span></td>
                              <td className="p-5"><span className="text-sm font-bold text-green-400">{product.margin}</span></td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {currentProducts.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-medium">No products available in this category yet.</div>
                  )}
                </div>
              </div>
            </div>

            {/* GOLD THEMED OFFER CARD */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                <motion.div key={viewMode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="h-full">
                  <div className={`rounded-2xl p-8 shadow-2xl text-black h-full border ${viewMode === 'retail' ? 'bg-gradient-to-br from-[#D4AF37] via-[#FFD700] to-[#B8860B] shadow-yellow-500/30 border-[#D4AF37]' : 'bg-gradient-to-br from-[#B8860B] via-[#D4AF37] to-[#8B7355] shadow-amber-900/30 border-[#B8860B]'}`}>
                    <div className="flex flex-col h-full">
                      {/* Badge */}
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center">
                          {viewMode === 'retail' ? <Crown className="w-4 h-4 text-black" /> : <TrendingUp className="w-4 h-4 text-black" />}
                        </div>
                        <span className="text-sm font-black uppercase tracking-[0.3em] text-black/90">{currentOffer.badgeText}</span>
                      </div>
                      
                      {/* Main Offer Title */}
                      <div className="mb-8 text-center">
                        <div className="relative">
                          <div className="text-8xl font-black mb-2 leading-none text-black">{currentOffer.discountPercentage}<span className="text-5xl">%</span></div>
                          <div className="absolute -top-2 -right-2">
                            {viewMode === 'retail' ? <Sparkles className="w-8 h-8 text-black/30" /> : <Zap className="w-8 h-8 text-black/30" />}
                          </div>
                        </div>
                        <div className="text-2xl font-black mb-2 tracking-tight text-black">{currentOffer.title}</div>
                        <p className="text-black/80 text-sm font-medium">{currentOffer.description}</p>
                      </div>

                      {/* Dynamic Perks */}
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-4 p-4 bg-black/10 rounded-xl backdrop-blur-sm">
                          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-black" /></div>
                          <div><div className="font-bold text-black">{currentOffer.perk1?.title}</div><div className="text-sm text-black/90">{currentOffer.perk1?.desc}</div></div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-black/10 rounded-xl backdrop-blur-sm">
                          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                            {viewMode === 'retail' ? <Clock className="w-5 h-5 text-black" /> : <Package className="w-5 h-5 text-black" />}
                          </div>
                          <div><div className="font-bold text-black">{currentOffer.perk2?.title}</div><div className="text-sm text-black/90">{currentOffer.perk2?.desc}</div></div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-black/10 rounded-xl backdrop-blur-sm">
                          <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                            {viewMode === 'retail' ? <Gift className="w-5 h-5 text-black" /> : <Users className="w-5 h-5 text-black" />}
                          </div>
                          <div><div className="font-bold text-black">{currentOffer.perk3?.title}</div><div className="text-sm text-black/90">{currentOffer.perk3?.desc}</div></div>
                        </div>
                      </div>

                      {/* Selected Product Info */}
                      {currentProducts[selectedProduct] && (
                        <div className="mt-6 p-4 bg-white/20 rounded-xl backdrop-blur-md border border-white/30">
                          <div className="text-xs font-black uppercase tracking-widest mb-3 text-black/70">SELECTED PRODUCT</div>
                          <div className="flex items-center justify-between text-black">
                            <div className="max-w-[60%]">
                              <div className="font-bold text-lg truncate">{currentProducts[selectedProduct].name}</div>
                              {viewMode === 'retail' && <div className="text-sm opacity-80">{currentProducts[selectedProduct].category}</div>}
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-black">{currentProducts[selectedProduct].price}</div>
                              {viewMode === 'retail' && currentProducts[selectedProduct].originalPrice && (
                                <div className="text-sm line-through opacity-70">{currentProducts[selectedProduct].originalPrice}</div>
                              )}
                              {viewMode === 'wholesale' && (
                                <div className="text-sm opacity-70 font-medium">MOQ: {currentProducts[selectedProduct].moq}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CTA Button - Solid Dark for contrast against Gold */}
                      <button className="mt-auto w-full py-4 bg-black text-[#D4AF37] font-black rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 group shadow-xl hover:scale-[1.02]">
                        {viewMode === 'retail' ? <Sparkles className="w-5 h-5" /> : <Zap className="w-5 h-5" />} 
                        {currentOffer.buttonText} 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </button>
                      <div className="text-xs text-center text-black/60 mt-4 font-medium italic">
                        {currentOffer.terms}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {!isPreview && <ContactPage isOpen={showContact} onClose={() => setShowContact(false)} isDarkMode={isDarkMode} />}
      </div>

      <style jsx global>{`
        @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
      `}</style>

      {/* FOOTER */}
      {!isPreview && <FooterComponent theme={theme} />}
    </div>
  );
}