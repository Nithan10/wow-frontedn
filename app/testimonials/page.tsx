'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Crown, Landmark, ArrowRight, Quote, Loader2 } from 'lucide-react';
import Navbar from '../components-main/NavbarHome';
import FooterComponent from '../components-sections/Footer';

const MarqueeRow = ({ items, duration, reverse = false }: { items: any[]; duration: number; reverse?: boolean }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="flex overflow-hidden py-6 mask-fade-edges">
      <motion.div 
        className="flex whitespace-nowrap gap-10"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: duration, repeat: Infinity }}
      >
        {[...items, ...items, ...items].map((review, idx) => (
          <div key={`${review.id}-${idx}`} className="inline-flex items-center gap-6 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-[2.5rem] shadow-xl min-w-[450px] lg:min-w-[550px]">
            <div className="relative flex-shrink-0">
              <img src={review.image} alt="" className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/40 object-cover" />
              <div className="absolute -bottom-1 -right-1 bg-[#D4AF37] rounded-full p-1 border-2 border-white dark:border-[#0f0f0f]">
                <CheckCircle2 size={12} className="text-white dark:text-black" />
              </div>
            </div>
            <div className="text-left overflow-hidden w-full">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-lg font-bold leading-none dark:text-white">{review.name}</p>
                  <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest mt-1">{review.role}</p>
                </div>
                <div className="flex gap-1 ml-6">
                  {[...Array(review.rating || 5)].map((_, i) => <Star key={`star-${i}`} size={12} className="fill-[#D4AF37] text-[#D4AF37]" />)}
                </div>
              </div>
              <p className="text-base text-gray-700 dark:text-gray-300 italic font-medium leading-relaxed whitespace-normal line-clamp-2">
                "{review.text}"
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Fixed the signature to props: any to satisfy Next.js page requirements
export default function EnhancedTestimonials(props: any) {
  const isPreview = props.isPreview || false;
  const previewData = props.previewData || null;

  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!isPreview);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: newTheme }));
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);

    const handleThemeChange = (e: CustomEvent) => {
      if (typeof e.detail === 'string' && (e.detail === 'dark' || e.detail === 'light')) setTheme(e.detail);
      else if (e.detail?.theme) setTheme(e.detail.theme);
    };

    window.addEventListener('theme-change', handleThemeChange as EventListener);
    window.addEventListener('themeChange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('theme-change', handleThemeChange as EventListener);
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (isPreview && previewData) {
      setData(previewData);
      return;
    }

    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/enhanced-testimonials`);
        const result = await response.json();
        if (result.success && result.data) setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isPreview, previewData]);

  if (!mounted || (isLoading && !data)) {
    return (
      <div className={`min-h-screen flex justify-center items-center ${theme === 'light' ? 'bg-white' : 'bg-[#050505]'}`}>
        <Loader2 className="animate-spin text-[#D4AF37] w-12 h-12" />
      </div>
    );
  }

  // Safe fallback arrays if DB is empty
  const reviews = data?.reviews || [];
  const row1 = reviews.length > 0 ? reviews : [];
  const row2 = reviews.length > 0 ? [...reviews].reverse() : [];
  // Shuffle logic safely
  const row3 = reviews.length > 2 ? [reviews[1], reviews[2], reviews[0]] : reviews;

  return (
    <div className={`min-h-screen transition-colors duration-500 selection:bg-[#D4AF37]/30 ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#050505] text-white'}`}>
      
      {!isPreview && <Navbar theme={theme} toggleTheme={toggleTheme} />}

      <div className={isPreview ? 'pt-12' : 'pt-[80px]'}>
        
        {/* --- HERO & MARQUEE SECTION --- */}
        <section className="relative pt-24 pb-20 px-4 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#D4AF37]/10 dark:bg-[#D4AF37]/5 blur-[140px] rounded-full" />
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            {/* 3-Row Marquee */}
            {reviews.length > 0 ? (
              <div className="flex flex-col gap-2 mb-20">
                <MarqueeRow items={row1} duration={30} />
                <MarqueeRow items={row2} duration={40} reverse={true} />
                <MarqueeRow items={row3} duration={35} />
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-500 mb-20 border border-dashed border-gray-300 rounded-xl">
                No reviews added yet. Add reviews in the admin panel to see the marquee.
              </div>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-10">
              <Crown size={14} /> {data?.hero?.badge}
            </motion.div>
            
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-9xl font-serif font-light mb-8 tracking-tighter">
              {data?.hero?.title} <span className="italic text-[#D4AF37]">{data?.hero?.titleHighlight}</span>
            </motion.h1>
            
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 text-xl font-light leading-relaxed">
              {data?.hero?.subtitle}
            </motion.p>
          </div>
        </section>

        {/* --- OWNER SPOTLIGHT --- */}
        <section className="max-w-6xl mx-auto px-4 mb-32">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative group rounded-[4rem] overflow-hidden bg-gray-50 dark:bg-gradient-to-b dark:from-[#111] dark:to-black border border-gray-200 dark:border-white/5 p-10 md:p-20 shadow-2xl dark:shadow-none">
            <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
              <Landmark size={250} />
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-4 text-[#D4AF37] mb-8">
                  <div className="h-[1px] w-12 bg-[#D4AF37]" />
                  <span className="text-sm font-bold tracking-widest uppercase">{data?.spotlight?.badge}</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-[1.1] dark:text-white" dangerouslySetInnerHTML={{ __html: data?.spotlight?.quote?.replace('research', '<span class="italic text-[#D4AF37]">research</span>') || '' }} />
                <p className="text-gray-600 dark:text-gray-400 text-xl mb-10 italic font-light leading-relaxed">
                  {data?.spotlight?.description}
                </p>
                <div>
                  <h4 className="text-2xl font-bold dark:text-white text-gray-900">{data?.spotlight?.name}</h4>
                  <p className="text-[#D4AF37] text-base font-medium">{data?.spotlight?.role}</p>
                </div>
              </div>

              <div className="order-1 md:order-2 relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white dark:border-[#D4AF37]/20 shadow-2xl">
                  <img src={data?.spotlight?.image} alt="Founder" className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000" />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white dark:bg-[#D4AF37] p-8 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-none">
                  <Quote className="text-[#D4AF37] dark:text-black mb-4" size={40} />
                  <p className="text-gray-900 dark:text-black font-black text-sm leading-tight uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: data?.spotlight?.stampText?.replace(' Since', '<br/>Since') || '' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- LUXURY CTA --- */}
        <section className="relative bg-gray-50 dark:bg-transparent py-40 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent dark:hidden" />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-6xl md:text-8xl font-serif mb-10 dark:text-white">{data?.cta?.title} <span className="italic text-[#D4AF37]">{data?.cta?.titleHighlight}</span></h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="px-12 py-5 bg-[#D4AF37] text-white dark:text-black font-black text-sm rounded-[2rem] hover:translate-y-[-4px] transition-all shadow-2xl shadow-[#D4AF37]/30 flex items-center justify-center gap-3 uppercase tracking-widest">
                {data?.cta?.buttonText} <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </section>
      </div>

      <style jsx global>{`
        .mask-fade-edges {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}</style>

      {!isPreview && <FooterComponent theme={theme} />}
    </div>
  );
}