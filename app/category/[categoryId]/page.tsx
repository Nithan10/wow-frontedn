'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Star, SlidersHorizontal, Heart, ArrowLeft, Filter } from 'lucide-react';

const MOCK_PRODUCTS = [
  {
    id: 'rc-monster-truck',
    title: "ZUNBELLA 4x4 Remote Control Stunt Car",
    price: 915,
    originalPrice: 2999,
    rating: 4.3,
    reviews: 489,
    img: "/chars/car3.png",
    category: 'vehicles',
    tags: ['Best Seller', 'Trending']
  },
  {
    id: 'drift-racer-x',
    title: "Speed Demon Drift Racer X",
    price: 1250,
    originalPrice: 3500,
    rating: 4.8,
    reviews: 124,
    img: "/pngcar2.png",
    category: 'vehicles',
    tags: ['New Arrival']
  },
  {
    id: 'rock-crawler-pro',
    title: "Rock Crawler Pro 1:18 Scale",
    price: 735,
    originalPrice: 1999,
    rating: 3.6,
    reviews: 72,
    img: "/chars/car3.png",
    category: 'vehicles',
    tags: []
  },
  {
    id: 'hyper-drift',
    title: "Hyper Drift Formula Racer",
    price: 1499,
    originalPrice: 3999,
    rating: 4.9,
    reviews: 213,
    img: "/pngcar2.png",
    category: 'vehicles',
    tags: ['Limited Edition']
  },
  {
    id: 'mountain-crawler',
    title: "Mountain Crawler 4WD",
    price: 1899,
    originalPrice: 4500,
    rating: 4.5,
    reviews: 156,
    img: "/chars/car3.png",
    category: 'vehicles',
    tags: ['Premium']
  },
  {
    id: 'speed-racer-pro',
    title: "Speed Racer Pro Series",
    price: 2250,
    originalPrice: 5000,
    rating: 4.7,
    reviews: 89,
    img: "/pngcar2.png",
    category: 'vehicles',
    tags: ['Professional']
  },
];

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId; 

  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Get category title and color based on categoryId
  const getCategoryDetails = (id: string) => {
    const categories = {
      vehicles: {
        title: "Vehicles & Tracksets",
        color: "from-red-600 to-rose-900",
        description: "Remote control cars, tracksets, and diecast models"
      },
      art: {
        title: "Art & Craft",
        color: "from-purple-600 to-indigo-900",
        description: "Creative kits, painting sets, and craft supplies"
      },
      collectors: {
        title: "Collectors",
        color: "from-amber-500 to-orange-800",
        description: "Limited edition collectibles and premium models"
      },
      puzzles: {
        title: "Games & Puzzles",
        color: "from-green-500 to-emerald-800",
        description: "Board games, puzzles, and strategy games"
      },
      dolls: {
        title: "Premium Dolls",
        color: "from-pink-500 to-rose-700",
        description: "Fashion dolls, action figures, and playsets"
      },
      educational: {
        title: "Educational",
        color: "from-blue-500 to-cyan-700",
        description: "STEM kits, learning toys, and educational games"
      }
    };
    
    return categories[id as keyof typeof categories] || {
      title: `${id} Collection`,
      color: "from-gray-600 to-gray-800",
      description: "Explore our premium collection"
    };
  };

  const categoryDetails = getCategoryDetails(categoryId as string);
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    return product.price <= priceRange[1];
  });

  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return 0; // featured - no sorting
    }
  });

  const handleBackToCategories = () => {
    router.push('/#shop-by-category');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBackToCategories}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Categories</span>
        </motion.button>
        
        {/* Category Header with Gradient */}
        <div className={`rounded-2xl bg-gradient-to-r ${categoryDetails.color} p-8 mb-10 relative overflow-hidden`}>
          <div className="relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
            >
              {categoryDetails.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-white/90 max-w-2xl mb-6"
            >
              {categoryDetails.description}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2"
            >
              <span className="text-white font-bold">{filteredProducts.length}</span>
              <span className="text-white/80">Premium Products</span>
            </motion.div>
          </div>
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
        </div>

        {/* Filters and Sort Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex-1">
            <p className="text-gray-500 dark:text-gray-400">
              Showing {filteredProducts.length} of {MOCK_PRODUCTS.length} results
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] appearance-none pr-10"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm text-gray-900 dark:text-white hover:shadow-md transition-shadow"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`
            w-64 flex-shrink-0 space-y-8
            ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-950 p-6 overflow-y-auto' : 'hidden md:block'}
          `}>
            {/* Mobile Header */}
            {isMobileFilterOpen && (
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filters</h3>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            )}
            
            {/* Price Filter */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Price Range</h3>
              <div className="px-2">
                <input 
                  type="range" min="0" max="5000" step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <span>₹0</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Customer Ratings</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2].map((r) => (
                  <label key={r} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-[#D4AF37]"
                      checked={selectedRating === r}
                      onChange={() => setSelectedRating(selectedRating === r ? null : r)}
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={`${i < r ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 dark:fill-gray-700 text-gray-300 dark:text-gray-700'}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">& above</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Best Seller', 'Trending', 'New Arrival', 'Limited Edition', 'Premium', 'Sale'].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-[#D4AF37] hover:text-white transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply/Clear Buttons for Mobile */}
            {isMobileFilterOpen && (
              <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    setPriceRange([0, 5000]);
                    setSelectedRating(null);
                  }}
                  className="flex-1 py-3 text-center border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 text-center bg-[#D4AF37] text-white rounded-xl font-medium hover:bg-[#B8860B] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <Filter size={48} className="mx-auto opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your filters to find what you're looking for</p>
                <button
                  onClick={() => {
                    setPriceRange([0, 5000]);
                    setSelectedRating(null);
                  }}
                  className="px-6 py-3 bg-[#D4AF37] text-white rounded-xl font-medium hover:bg-[#B8860B] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {sortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 p-8">
                        <img 
                          src={product.img} 
                          alt={product.title} 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Tags */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.tags.map(t => (
                            <span 
                              key={t} 
                              className="bg-gradient-to-r from-[#D4AF37] to-[#FCEEAC] text-black text-[10px] px-3 py-1 rounded-full uppercase font-bold shadow-md"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        
                        {/* Wishlist Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to wishlist logic
                          }}
                          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-md"
                        >
                          <Heart size={18} className="text-gray-600 dark:text-gray-400 hover:text-red-500" />
                        </button>
                        
                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                          <span className="text-white font-bold text-sm px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FCEEAC] text-black rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            Quick View
                          </span>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 mb-3 group-hover:text-[#D4AF37] transition-colors">
                          {product.title}
                        </h3>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={`${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 dark:fill-gray-700 text-gray-300 dark:text-gray-700'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {product.rating} ({product.reviews} reviews)
                          </span>
                        </div>
                        
                        {/* Price */}
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              ₹{product.price}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                              ₹{product.originalPrice}
                            </span>
                            <div className="text-xs font-bold text-red-500 dark:text-red-400 mt-1">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </div>
                          </div>
                          
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="p-2 bg-gradient-to-r from-[#D4AF37] to-[#FCEEAC] rounded-full">
                              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Load More Button */}
        {sortedProducts.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FCEEAC] text-black font-bold rounded-xl hover:shadow-xl hover:shadow-[#D4AF37]/25 transition-all duration-300 hover:scale-105">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Add missing X icon component
const X = ({ size, className }: { size: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);