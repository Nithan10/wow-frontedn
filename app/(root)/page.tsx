'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
// UPDATED IMPORTS: Added "../" to all component paths
import Preloader from "../components-main/Preloader";
import HeroSection from "../components-sections/HeroSection";
import TrendingSection from "../components-sections/TrendingSection";
import StudioShowcaseSection from "../components-sections/StudioShowcaseSection";
import RalleyzSection from "../components-sections/RalleyzSection";
import CharacterSliderSection from "../components-sections/CharacterSliderSection";
import BestSellersSection from "../components-sections/BestSellersSection";
import ShopByAgeSection from "../components-sections/ShopByAgeSection";
import ShopByCategorySection from "../components-sections/ShopByCategorySection";
import BentoGridSection from "../components-sections/BentoGridSection";
import ReviewSection from "../components-sections/ReviewSection";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMobile, setIsMobile] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const shopByCategoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initial Setup
    const optimizeScroll = () => {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      document.documentElement.style.scrollBehavior = 'auto';
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
      }, 100);
    };

    optimizeScroll();

    // 2. Preloader Logic
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 2800);

    // 3. Mobile Check
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 4. Check URL hash for section scrolling
    const handleHashChange = () => {
      if (window.location.hash === '#shop-by-category' && shopByCategoryRef.current) {
        setTimeout(() => {
          shopByCategoryRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    // Check on initial load
    setTimeout(handleHashChange, 500);

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // 5. Initial Theme Check
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
    if (currentTheme) setTheme(currentTheme);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // 6. Listen for Theme Changes from Layout.tsx
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      const newTheme = event.detail as 'dark' | 'light';
      if (newTheme) {
        setTheme(newTheme);
      }
    };

    window.addEventListener('theme-change', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('theme-change', handleThemeChange as EventListener);
    };
  }, []);

  // Scroll fix after loading
  useEffect(() => {
    if (!isLoading && mainRef.current) {
      void mainRef.current.offsetHeight;
    }
  }, [isLoading]);

  return (
    <main ref={mainRef} className="min-h-screen w-full transition-colors duration-300 scroll-smooth">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className={`w-full ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-black text-white'} transition-colors duration-300`}>
          <HeroSection theme={theme} isMobile={isMobile} />
          <TrendingSection theme={theme} />
          <StudioShowcaseSection theme={theme} />
          <RalleyzSection />
          <CharacterSliderSection theme={theme} />
          <BestSellersSection theme={theme} />
          <ShopByAgeSection theme={theme} />
          
          {/* Add anchor for category navigation */}
          <div id="shop-by-category" ref={shopByCategoryRef}>
            <ShopByCategorySection theme={theme} />
          </div>
          
          <BentoGridSection theme={theme} />
          <ReviewSection theme={theme} />
        </div>
      )}
    </main>
  );
}