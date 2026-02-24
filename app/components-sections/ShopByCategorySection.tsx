'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  CarFront, Trophy, Gift, Brain, Palette, Gamepad2, 
  ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap, Loader2 
} from 'lucide-react';

// Icon mapping dictionary
const ICON_MAP: Record<string, React.ElementType> = {
  CarFront, Trophy, Gift, Brain, Palette, Gamepad2, Sparkles, Zap
};

export interface CategoryItem {
  id: string;
  title: string;
  img: string;
  color: string;
  accent: string;
  icon: string;
  count: number;
  description: string;
  badge: string;
}

interface ShopByCategorySectionProps {
  theme?: 'dark' | 'light'; // Made optional to fix TS warnings
  isPreview?: boolean;
  previewData?: CategoryItem[];
}

const ShopByCategory = memo(({ theme = 'dark', isPreview = false, previewData = [] }: ShopByCategorySectionProps) => {
  const router = useRouter();
  const [items, setItems] = useState<CategoryItem[]>(previewData);
  const [isLoading, setIsLoading] = useState(!isPreview);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0); 

  // --- Fetch Data ---
  useEffect(() => {
    if (isPreview) {
      setItems(previewData);
      return;
    }

    const fetchItems = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/shopbycategory`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          setItems(result.data);
        } else {
          // Fallback data if DB is empty
          setItems([
            { id: 'vehicles', title: "Vehicles & Tracksets", img: "/chars/car3.png", color: "from-red-600 to-rose-900", accent: "text-red-500", icon: "CarFront", count: 42, description: "Remote control models", badge: "Trending" },
            { id: 'art', title: "Art & Craft", img: "/chars/barbie.avif", color: "from-purple-600 to-indigo-900", accent: "text-purple-500", icon: "Palette", count: 36, description: "Creative kits", badge: "Creative" },
            { id: 'puzzles', title: "Games & Puzzles", img: "/chars/pokemon.avif", color: "from-emerald-500 to-green-800", accent: "text-emerald-500", icon: "Gamepad2", count: 27, description: "Strategy games", badge: "Fun" }
          ]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [isPreview, previewData]);

  // --- Circular Logic ---
  const getCircularIndex = useCallback((index: number, length: number) => {
    if (length === 0) return 0;
    return ((index % length) + length) % length;
  }, []);

  const paginate = useCallback((newDirection: number) => {
    if (items.length === 0) return;
    setDirection(newDirection);
    setActiveIndex((prev) => getCircularIndex(prev + newDirection, items.length));
  }, [items.length, getCircularIndex]);

  // --- Auto Play ---
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    const interval = setInterval(() => paginate(1), 3500); 
    return () => clearInterval(interval);
  }, [isAutoPlaying, paginate, items.length]);

  // --- Styles ---
  const isLight = theme === 'light';
  const bgColor = isLight ? 'bg-gray-50' : 'bg-[#0a0a0a]';
  const textColor = isLight ? 'text-gray-900' : 'text-white';
  const subTextColor = isLight ? 'text-gray-600' : 'text-gray-400';
  const cardBg = isLight ? 'bg-white' : 'bg-[#111]';
  const borderColor = isLight ? 'border-gray-200' : 'border-white/10';

  if (isLoading) {
    return (
      <div className={`w-full py-24 flex justify-center items-center min-h-[500px] ${bgColor}`}>
        <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
      </div>
    );
  }

  if (items.length === 0) return null;

  // Calculate exactly which 3 items to show
  const visibleItems = items.length >= 3 ? [
    items[getCircularIndex(activeIndex - 1, items.length)],
    items[getCircularIndex(activeIndex, items.length)],
    items[getCircularIndex(activeIndex + 1, items.length)],
  ] : items; 

  return (
    <section className={`relative py-24 ${bgColor} overflow-hidden min-h-[900px] flex flex-col justify-center`}>
      
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse`} />
        <div className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em]">Our Collections</span>
          </motion.div>
          
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`text-5xl md:text-7xl font-black ${textColor} tracking-tight mb-6`}>
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FCEEAC] to-[#D4AF37]">Category</span>
          </motion.h2>
          
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`text-lg md:text-xl ${subTextColor} max-w-2xl mx-auto`}>
            Explore our signature categories designed to spark joy and imagination.
          </motion.p>
        </div>

        {/* 3D Carousel Stage */}
        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center perspective-1000">
          
          <button onClick={() => { paginate(-1); setIsAutoPlaying(false); }} className={`absolute left-0 lg:left-8 z-40 p-4 rounded-full ${isLight ? 'bg-white shadow-lg' : 'bg-black/50 backdrop-blur-md border border-white/10'} hover:scale-110 transition-transform group`}>
            <ChevronLeft className={`w-8 h-8 ${textColor} group-hover:text-[#D4AF37] transition-colors`} />
          </button>
          
          <button onClick={() => { paginate(1); setIsAutoPlaying(false); }} className={`absolute right-0 lg:right-8 z-40 p-4 rounded-full ${isLight ? 'bg-white shadow-lg' : 'bg-black/50 backdrop-blur-md border border-white/10'} hover:scale-110 transition-transform group`}>
            <ChevronRight className={`w-8 h-8 ${textColor} group-hover:text-[#D4AF37] transition-colors`} />
          </button>

          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            <AnimatePresence mode='popLayout' custom={direction}>
              {visibleItems.map((category, index) => {
                // Safeguard logic if database has less than 3 items
                const isCenter = items.length < 3 ? index === activeIndex : index === 1;
                const isLeft = items.length < 3 ? index < activeIndex : index === 0;
                
                // Dynamically resolve icon from string
                const IconComponent = ICON_MAP[category.icon] || Sparkles;

                return (
                  <motion.div
                    key={category.id} // FIX: Removed +index to prevent rendering glitches
                    layout 
                    initial={{ scale: 0.8, x: direction > 0 ? 150 : -150, opacity: 0 }}
                    animate={{ 
                      scale: isCenter ? 1 : 0.85, 
                      x: isCenter ? 0 : isLeft ? '-65%' : '65%', 
                      zIndex: isCenter ? 20 : 10,
                      opacity: isCenter ? 1 : 0.4,
                      rotateY: isCenter ? 0 : isLeft ? 15 : -15, 
                      filter: isCenter ? 'blur(0px)' : 'blur(4px)' 
                    }}
                    exit={{ scale: 0.8, x: direction > 0 ? -150 : 150, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
                    className={`absolute w-full max-w-sm md:max-w-md cursor-pointer group`}
                    onClick={() => {
                      if (isCenter) router.push(`/category/${category.id}`);
                      else paginate(isLeft ? -1 : 1);
                    }}
                  >
                    <div className={`relative h-[450px] md:h-[520px] rounded-[2.5rem] overflow-hidden ${cardBg} border ${borderColor} shadow-2xl transition-all duration-500 ${isCenter ? 'shadow-[#D4AF37]/30 ring-1 ring-[#D4AF37]/50' : ''}`}>
                      
                      {/* Image Half */}
                      <div className="h-[55%] relative overflow-hidden bg-gray-900">
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20`} />
                        <img src={category.img} alt={category.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white' : 'from-[#111]'} to-transparent`} />
                        <div className="absolute top-6 right-6 z-10">
                           <span className="px-4 py-2 text-xs font-bold bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[#D4AF37] shadow-lg border border-[#D4AF37]/20">
                             {category.badge}
                           </span>
                        </div>
                      </div>

                      {/* Content Half */}
                      <div className="h-[45%] p-8 flex flex-col justify-between relative">
                        <div className={`absolute bottom-4 right-4 opacity-5 transform scale-[3] -rotate-12 pointer-events-none ${category.accent}`}>
                          <IconComponent />
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                              <IconComponent size={20} />
                            </div>
                            <div className={`text-sm font-semibold ${category.accent} uppercase tracking-wider`}>
                              {category.count} Items
                            </div>
                          </div>

                          <h3 className={`text-3xl font-black ${textColor} leading-tight mb-2 line-clamp-2`}>
                            {category.title}
                          </h3>
                          
                          <p className={`text-sm ${subTextColor} line-clamp-2`}>
                            {category.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <span className={`text-sm font-medium ${subTextColor} group-hover:text-[#D4AF37] transition-colors`}>
                            View Collection
                          </span>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isLight ? 'border-gray-200' : 'border-gray-800'} group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] transition-all duration-300`}>
                            <ArrowRight className={`w-5 h-5 ${textColor} group-hover:text-black`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col items-center mt-12 gap-8">
          <div className="flex gap-3 flex-wrap justify-center max-w-full px-4">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveIndex(idx); setIsAutoPlaying(false); }}
                className={`transition-all duration-500 rounded-full ${
                  idx === activeIndex 
                    ? 'w-10 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#FCEEAC]' 
                    : `w-1.5 h-1.5 ${isLight ? 'bg-gray-300' : 'bg-gray-700'}`
                }`}
              />
            ))}
          </div>

          <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => router.push('/category')}
             className="relative px-12 py-5 bg-transparent overflow-hidden group rounded-full"
          >
            <div className="absolute inset-0 border border-[#D4AF37]/30 rounded-full group-hover:border-[#D4AF37] transition-colors duration-300" />
            <div className="absolute inset-0 bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/10 transition-colors duration-300" />
            <div className="flex items-center gap-3 relative z-10">
              <span className={`text-lg font-bold ${textColor} uppercase tracking-widest`}>View All Categories</span>
              <Zap className="w-5 h-5 text-[#D4AF37] group-hover:animate-bounce" />
            </div>
          </motion.button>
        </div>

      </div>
    </section>
  );
});

ShopByCategory.displayName = 'ShopByCategory';

export default function ShopByCategorySection({ theme = 'dark', isPreview, previewData }: ShopByCategorySectionProps) {
  return <ShopByCategory theme={theme} isPreview={isPreview} previewData={previewData} />;
}