'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the interface for props
interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [status, setStatus] = useState<'idle' | 'driving'>('idle');

  const handleStart = () => {
    setStatus('driving');
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
      // Animation: Wait for car to pass (approx 1s), then fade out black background
      animate={{ opacity: status === 'driving' ? [1, 1, 0] : 1 }} 
      transition={{ duration: 1.8, times: [0, 0.7, 1], ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (status === 'driving') {
           onComplete(); // Unmount preloader -> Reveal Site
        }
      }}
    >
      
      {/* --- CLICKABLE CONTENT (Logo) --- */}
      <AnimatePresence>
        {status === 'idle' && (
          <motion.div 
            className="relative cursor-pointer group z-20" // Added z-20 to ensure it's below the car
            onClick={handleStart}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)", transition: { duration: 0.3 } }}
          >
            {/* 1. THE IMAGE (Xbox Logo) */}
            {/* FIXED: Reduced width on mobile (w-[200px]) to fit better */}
            <motion.img
              src="/xbox.png"
              alt="Logo"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(15px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: "easeOut" }}
              // Breathing animation while waiting
              whileInView={{ scale: [1, 1.02, 1], transition: { duration: 3, repeat: Infinity } }}
              // Hover Effect: Scale up slightly
              whileHover={{ scale: 1.1, filter: "drop-shadow(0 0 20px rgba(212,175,55,0.3))" }}
              className="w-[200px] sm:w-[280px] md:w-[350px] object-contain transition-all duration-500"
            />

            {/* 2. HOVER TEXT (Appears over image) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.span 
                // FIXED: Adjusted text size for mobile
                className="text-[#D4AF37] text-sm sm:text-xl md:text-2xl font-black tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md bg-black/50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg backdrop-blur-sm border border-[#D4AF37]/30 whitespace-nowrap"
              >
                Click to Start
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- THE CAR ANIMATION (Wipe Effect) --- */}
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2 z-50 pointer-events-none"
        // FIXED: Using percentages relative to ELEMENT width, not viewport width.
        // '-120%' ensures the car is fully hidden to the left regardless of screen size.
        initial={{ x: "-120%" }} 
        animate={status === 'driving' ? { x: "120vw" } : { x: "-120%" }} 
        transition={{ 
          duration: 1.2, // Speed of the car
          ease: [0.22, 1, 0.36, 1], // "Fast in, slow out" motion
          delay: 0.1 // Slight delay after click
        }}
      >
        {/* Replace with your car image */}
        {/* FIXED: Made car responsive (w-[160vw] on mobile) so it looks big and impressive */}
        <img 
          src="/pngcar.png" 
          alt="Race Car" 
          className="w-[160vw] sm:w-[100vw] md:w-[900px] max-w-none h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        />
        
        {/* Speed lines/Motion Blur trail */}
        <div className="absolute top-1/2 right-0 w-[50%] h-[200px] bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent blur-3xl transform -translate-y-1/2 -skew-x-12" />
      </motion.div>

    </motion.div>
  );
}