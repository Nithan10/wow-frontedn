'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, ShoppingCart, Zap, Share2, 
  Truck, ShieldCheck, RefreshCcw, Heart
} from 'lucide-react';
import { useParams } from 'next/navigation';

// MOCK SINGLE PRODUCT DATA (Replace with API fetch or Context)
const PRODUCT = {
  id: 'rc-monster-truck',
  title: "ZUNBELLA 4x4 Remote Control Stunt Car with Mist Spray",
  price: 915,
  originalPrice: 2999,
  rating: 4.3,
  reviews: 489,
  description: "Experience the thrill of off-road racing with the ZUNBELLA 4x4 Stunt Car. Featuring 360-degree rotation, double-sided driving, and a unique mist spray function that simulates exhaust smoke. Built with durable ABS plastic to withstand crashes and rough terrain.",
  features: [
    "360° Rotating Stunt Capability",
    "Mist Spray / Smoke Effect",
    "2.4GHz Remote Control (No Interference)",
    "Rechargeable Battery Included",
    "All-Terrain Rubber Tires"
  ],
  images: [
    "/chars/car3.png", // Main Image
    "/pngcar2.png",    // Angle 1
    "/chars/car3.png", // Angle 2
    "/pngcar2.png"     // Angle 3
  ]
};

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(PRODUCT.images[0]);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  // Zoom Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({ 
      display: 'block', 
      backgroundPosition: `${x}% ${y}%` 
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: Image Gallery & Zoom */}
          <div className="space-y-4">
            {/* Main Image Stage */}
            <div 
              className="relative h-[400px] md:h-[500px] w-full rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center overflow-hidden cursor-crosshair group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src={activeImage} 
                alt="Product View" 
                className="max-h-[80%] max-w-[80%] object-contain pointer-events-none"
              />
              
              {/* Zoom Lens Overlay (Magnified View) */}
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-200 lg:block hidden"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundSize: '200%', // 2x Zoom
                  backgroundPosition: zoomStyle.backgroundPosition,
                  opacity: zoomStyle.display === 'none' ? 0 : 1
                }}
              />
              
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                 <button className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-400 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                 </button>
                 <button className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 size={20} />
                 </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {PRODUCT.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden ${activeImage === img ? 'border-[#D4AF37]' : 'border-transparent'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`view ${idx}`} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col h-full">
            <nav className="text-sm text-gray-500 mb-4">
              Home / Category / <span className="text-[#D4AF37]">Product</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              {PRODUCT.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="bg-[#D4AF37] text-white px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1">
                {PRODUCT.rating} <Star size={12} className="fill-current" />
              </span>
              <span className="text-gray-500 dark:text-gray-400">{PRODUCT.reviews} Ratings & Reviews</span>
              <span className="text-green-500 font-medium">In Stock</span>
            </div>

            <div className="mb-8">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{PRODUCT.price}</span>
                <span className="text-xl text-gray-500 line-through mb-1">₹{PRODUCT.originalPrice}</span>
                <span className="text-lg font-bold text-green-600 mb-1">
                  {Math.round(((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100)}% off
                </span>
              </div>
              <p className="text-sm text-gray-500">+ ₹40 Secured Packaging Fee</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button 
                className="flex-1 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => console.log('Add to cart')}
              >
                <ShoppingCart size={20} />
                ADD TO CART
              </button>
              <button 
                className="flex-1 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FCEEAC] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center gap-2"
                onClick={() => console.log('Buy Now')}
              >
                <Zap size={20} />
                BUY NOW
              </button>
            </div>

            {/* Features & Description */}
            <div className="space-y-6 flex-1">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {PRODUCT.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                   <Truck className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                   <p className="text-xs text-gray-500">Free Delivery</p>
                </div>
                <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                   <RefreshCcw className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                   <p className="text-xs text-gray-500">7 Days Return</p>
                </div>
                <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                   <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                   <p className="text-xs text-gray-500">Warranty</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}