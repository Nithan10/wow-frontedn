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

export default function ServicesPage(props: any) {
  const isPreview = props.isPreview || false;
  const previewData = props.previewData || null;

  const [viewMode, setViewMode] = useState<'retail' | 'wholesale'>('retail');
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark'); // Kept to pass to Navbar/Footer
  const [showContact, setShowContact] = useState(false);

  const [retailProducts, setRetailProducts] = useState<any[]>([]);
  const [wholesaleProducts, setWholesaleProducts] = useState<any[]>([]);
  const [retailOffer, setRetailOffer] = useState(DEFAULT_RETAIL_OFFER);
  const [wholesaleOffer, setWholesaleOffer] = useState(DEFAULT_WHOLESALE_OFFER);
  const [isLoading, setIsLoading] = useState(!isPreview);

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
        const API_URL = "https://wow-lifebackend.onrender.com/api";
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
      <div className="min-h-screen flex justify-center items-center bg-black">
        <Loader2 className="animate-spin text-yellow-500 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden bg-black text-white selection:bg-yellow-500/30 selection:text-yellow-200">
      
      {/* Dynamic Gold Glow Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.1)_0%,transparent_70%)] blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)] blur-3xl"></div>
      </div>

      {!isPreview && <Navbar theme={theme} toggleTheme={toggleTheme} />}

      <div className={`relative z-10 flex-grow ${isPreview ? 'py-12' : 'pt-24 pb-12'} px-4 md:px-8`}>
        <div className="max-w-7xl mx-auto mb-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="space-y-4">
              <div className="relative">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2 relative">
                  <span className="relative z-10">
                    <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">WOW</span>
                    <span className="bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#B8860B] bg-clip-text text-transparent animate-gradient ml-3 drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">LIFESTYLE</span>
                  </span>
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse" />
                  <p className="text-lg md:text-xl font-semibold italic text-yellow-400/90 tracking-wide">
                    Just Looking Like a "WOW"
                  </p>
                </div>
              </div>
              <p className="text-lg max-w-2xl text-gray-400 font-medium">
                {viewMode === 'retail' ? "Premium luxury toys for families and exclusive collectors" : "High-margin bulk acquisitions for business partners"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {!isPreview && (
                <button onClick={() => setShowContact(true)} className="px-6 py-3.5 rounded-xl font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-3 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-black shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:scale-105 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] group">
                  <Phone size={18} className="group-hover:animate-bounce" /> 
                  <span>Contact Us</span>
                </button>
              )}

              <div className="inline-flex p-1.5 backdrop-blur-md rounded-xl shadow-2xl bg-neutral-950/80 border border-yellow-500/30">
                <button onClick={() => { setViewMode('retail'); setSelectedProduct(0); }} className={`relative px-8 py-3 rounded-lg text-sm font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-3 ${viewMode === 'retail' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-yellow-500/70 hover:text-yellow-400 hover:bg-white/5'}`}>
                  <ShoppingBag size={18} /> <span>Retail</span>
                </button>
                <button onClick={() => { setViewMode('wholesale'); setSelectedProduct(0); }} className={`relative px-8 py-3 rounded-lg text-sm font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-3 ${viewMode === 'wholesale' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-yellow-500/70 hover:text-yellow-400 hover:bg-white/5'}`}>
                  <Building2 size={18} /> <span>Wholesale</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* PRODUCT LIST (Left Column) */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-xl rounded-3xl overflow-hidden bg-neutral-950/80 border border-yellow-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                <div className="p-8 border-b border-yellow-500/20 bg-gradient-to-r from-neutral-900/50 to-neutral-950/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                        <h2 className="text-2xl font-black tracking-widest text-white uppercase">
                          {viewMode === 'retail' ? 'Retail Collection' : 'Wholesale Vault'}
                        </h2>
                      </div>
                      <p className="text-sm pl-6 text-yellow-500/60 font-medium">
                        {viewMode === 'retail' ? 'Curated selections with exclusive pricing' : 'Bulk acquisition catalog with maximum margins'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-neutral-900 border border-yellow-500/30 shadow-inner">
                      <span className="text-xs font-black tracking-widest text-yellow-400">{currentProducts.length} PRODUCTS</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-900/40 border-b border-yellow-500/20">
                      <tr>
                        <th className="text-left p-5 text-xs font-black uppercase tracking-widest text-yellow-600/80">Product</th>
                        <th className="text-left p-5 text-xs font-black uppercase tracking-widest text-yellow-600/80">Category</th>
                        <th className="text-left p-5 text-xs font-black uppercase tracking-widest text-yellow-600/80">Price</th>
                        {viewMode === 'retail' ? (
                          <>
                            <th className="text-left p-5 text-xs font-black uppercase tracking-widest text-yellow-600/80">Discount</th>
                            <th className="text-left p-5 text-xs font-black uppercase tracking-widest text-yellow-600/80">Status</th>
                          </>
                        ) : (
                          <>
                            <th className="text-left p-5 text-xs font-black uppercase tracking-widest text-yellow-600/80">MOQ</th>
                            <th className="text-left p-5 text-xs font-black uppercase tracking-widest text-yellow-600/80">Margin</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {currentProducts.map((product, index) => (
                        <tr 
                          key={product.id} 
                          className={`cursor-pointer transition-all duration-300 ${
                            selectedProduct === index 
                              ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-l-yellow-400' 
                              : 'hover:bg-white/5 border-l-4 border-l-transparent'
                          }`} 
                          onClick={() => setSelectedProduct(index)}
                        >
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-neutral-900 border border-yellow-500/20 shadow-lg group-hover:scale-110 transition-transform">
                                {product.icon}
                              </div>
                              <div>
                                <div className="font-bold text-lg text-white tracking-wide">{product.name}</div>
                                <div className="flex items-center gap-3 mt-1.5">
                                  <span className="text-[10px] px-2.5 py-1 rounded-md font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">⭐ {product.rating}</span>
                                  <span className="text-xs font-medium text-gray-500">{viewMode === 'retail' ? `${product.sales || '0'} sold` : `${product.orders || '0'} orders`}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <span className="text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg text-yellow-500/80 bg-neutral-900 border border-white/10">
                              {product.category}
                            </span>
                          </td>
                          <td className="p-5">
                            <div className="flex flex-col">
                              <span className="font-black text-xl text-yellow-400">{product.price}</span>
                              {viewMode === 'retail' && product.originalPrice && <span className="text-xs line-through font-medium text-gray-500">{product.originalPrice}</span>}
                            </div>
                          </td>
                          {viewMode === 'retail' ? (
                            <>
                              <td className="p-5"><span className="text-base font-black text-green-400">{product.discount}</span></td>
                              <td className="p-5"><span className={`text-xs font-bold tracking-widest uppercase ${product.stock === 'In Stock' ? 'text-yellow-400' : 'text-red-400'}`}>{product.stock}</span></td>
                            </>
                          ) : (
                            <>
                              <td className="p-5"><span className="text-sm font-bold text-white bg-neutral-800 px-3 py-1 rounded-lg">{product.moq}</span></td>
                              <td className="p-5"><span className="text-sm font-bold text-green-400">{product.margin}</span></td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {currentProducts.length === 0 && (
                    <div className="p-16 text-center text-gray-500 font-medium border-t border-white/5">
                      No exclusive products available in this category yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GOLD THEMED OFFER CARD (Right Column) */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                <motion.div key={viewMode} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="h-full">
                  <div className="rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-full bg-neutral-950 border border-yellow-500/30 relative overflow-hidden flex flex-col group">
                    
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] group-hover:bg-yellow-500/20 transition-colors duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-600/10 rounded-full blur-[60px]"></div>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Badge */}
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                          {viewMode === 'retail' ? <Crown className="w-4 h-4 text-black" /> : <TrendingUp className="w-4 h-4 text-black" />}
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.25em] text-yellow-500">{currentOffer.badgeText}</span>
                      </div>
                      
                      {/* Main Offer Title */}
                      <div className="mb-10 text-center">
                        <div className="relative inline-block">
                          <div className="text-7xl font-black mb-2 leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-lg">
                            {currentOffer.discountPercentage}<span className="text-4xl text-yellow-500">%</span>
                          </div>
                          <div className="absolute -top-4 -right-6 animate-pulse">
                            {viewMode === 'retail' ? <Sparkles className="w-8 h-8 text-yellow-400" /> : <Zap className="w-8 h-8 text-yellow-400" />}
                          </div>
                        </div>
                        <div className="text-xl font-black mb-3 tracking-widest text-white uppercase mt-4">{currentOffer.title}</div>
                        <p className="text-gray-400 text-sm font-medium px-4 leading-relaxed">{currentOffer.description}</p>
                      </div>

                      {/* Dynamic Perks */}
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-yellow-500" /></div>
                          <div><div className="font-bold text-white text-sm">{currentOffer.perk1?.title}</div><div className="text-xs text-yellow-500/80 font-medium mt-0.5">{currentOffer.perk1?.desc}</div></div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                            {viewMode === 'retail' ? <Clock className="w-5 h-5 text-yellow-500" /> : <Package className="w-5 h-5 text-yellow-500" />}
                          </div>
                          <div><div className="font-bold text-white text-sm">{currentOffer.perk2?.title}</div><div className="text-xs text-yellow-500/80 font-medium mt-0.5">{currentOffer.perk2?.desc}</div></div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                            {viewMode === 'retail' ? <Gift className="w-5 h-5 text-yellow-500" /> : <Users className="w-5 h-5 text-yellow-500" />}
                          </div>
                          <div><div className="font-bold text-white text-sm">{currentOffer.perk3?.title}</div><div className="text-xs text-yellow-500/80 font-medium mt-0.5">{currentOffer.perk3?.desc}</div></div>
                        </div>
                      </div>

                      {/* Selected Product Info */}
                      {currentProducts[selectedProduct] && (
                        <div className="mt-2 p-5 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-2xl border border-yellow-500/20 mb-8">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-yellow-500/80">Selected Artifact</div>
                          <div className="flex items-center justify-between text-white">
                            <div className="max-w-[60%]">
                              <div className="font-bold text-base truncate">{currentProducts[selectedProduct].name}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-black text-yellow-400">{currentProducts[selectedProduct].price}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CTA Button */}
                      <button className="mt-auto w-full py-4 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-black font-black tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] hover:scale-[1.02] active:scale-[0.98]">
                        {viewMode === 'retail' ? <Sparkles className="w-5 h-5" /> : <Zap className="w-5 h-5" />} 
                        {currentOffer.buttonText} 
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <div className="text-[10px] text-center text-gray-500 mt-4 font-medium uppercase tracking-widest">
                        {currentOffer.terms}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Contact Modal (Preserved logic) */}
        {!isPreview && <ContactPage isOpen={showContact} onClose={() => setShowContact(false)} isDarkMode={true} />}
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