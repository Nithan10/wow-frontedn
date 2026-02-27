'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, Send, User, MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export interface ContactData {
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  address: string;
  hoursWeekday: string;
  hoursSaturday: string;
  hoursSunday: string;
}

interface ContactPageProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean; // Kept for prop compatibility, but theme is strictly Black/Gold
  isPreview?: boolean;
  previewData?: ContactData;
}

const API_URL = "https://wow-lifebackend.onrender.com/api";

export default function ContactPage({ isOpen, onClose, isPreview = false, previewData }: ContactPageProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom Notification State
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const [data, setData] = useState<ContactData>({
    title: "Get in Touch", subtitle: "We'd love to hear from you. Contact us for any queries.",
    email: "contact@wowlifestyle.com", phone: "+91 98765 43210", address: "123 Lifestyle Street, Mumbai, India 400001",
    hoursWeekday: "9:00 AM - 8:00 PM", hoursSaturday: "10:00 AM - 6:00 PM", hoursSunday: "Closed"
  });

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Auto-hide notification after 4 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (notification) {
      timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [notification]);

  useEffect(() => {
    if (isPreview && previewData) {
      setData(previewData);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/contact`);
        if (!response.ok) throw new Error('Failed to fetch from server');
        const result = await response.json();
        if (result.success && result.data) setData(result.data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen, isPreview, previewData]);

  useEffect(() => {
    if (isPreview) return; 
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isPreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null); 
    
    try {
      const response = await fetch(`${API_URL}/contact/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}. Make sure the backend is running locally!`);
      }

      const result = await response.json();

      if (result.success) {
        setNotification({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', phone: '', message: '' });
        
        if (!isPreview) {
          setTimeout(() => {
            onClose();
            setNotification(null);
          }, 3000);
        }
      } else {
        setNotification({ type: 'error', message: result.message || 'Failed to send message.' });
      }
    } catch (error) {
      setNotification({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to connect to server.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!mounted || (!isOpen && !isPreview)) return null;

  // Premium Black & Gold Toast Notification
  const CustomToast = (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-8 left-1/2 z-[10005] min-w-[320px] max-w-[90vw] flex items-center gap-3 px-5 py-4 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.15)] backdrop-blur-xl border bg-black/90 border-yellow-500/40 text-yellow-400"
        >
          {notification.type === 'success' ? (
            <CheckCircle size={22} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          ) : (
            <AlertCircle size={22} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          )}
          
          <span className="text-sm font-bold flex-1 leading-tight tracking-wide">
            {notification.message}
          </span>
          
          <button 
            onClick={() => setNotification(null)} 
            className="p-1.5 rounded-full hover:bg-yellow-500/20 text-yellow-500/70 hover:text-yellow-400 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ModalContent = (
    <>
      {CustomToast}
      <motion.div
        initial={isPreview ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
        animate={isPreview ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
        exit={isPreview ? {} : { opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`${isPreview ? 'relative w-full' : 'fixed left-1/2 top-1/2 w-[95%]'} max-w-4xl max-h-[90vh] rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.1)] z-[10000] overflow-hidden flex flex-col md:flex-row bg-black border border-yellow-500/30 ring-1 ring-white/5`}
      >
        {!isPreview && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full z-20 transition-all hover:scale-110 shadow-lg bg-neutral-900 hover:bg-neutral-800 text-yellow-500 border border-yellow-500/30"
          >
            <X size={20} />
          </button>
        )}

        {/* Left side - Contact Info (Black/Gold Rich Contrast) */}
        <div className="md:w-2/5 p-6 md:p-8 bg-gradient-to-br from-neutral-950 to-neutral-900 border-r border-yellow-500/10 text-white overflow-y-auto no-scrollbar relative">
          
          {/* Subtle gold glow behind text */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.05),transparent_50%)] pointer-events-none"></div>

          <div className="space-y-8 relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-sm">
                {data.title}
              </h2>
              <p className="text-yellow-500/70 text-sm md:text-base font-medium">{data.subtitle}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl backdrop-blur-md transition-transform hover:scale-[1.02] hover:bg-yellow-500/10 group">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                  <Mail size={20} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-yellow-600">Email</p>
                  <p className="font-medium text-sm text-gray-200">{data.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl backdrop-blur-md transition-transform hover:scale-[1.02] hover:bg-yellow-500/10 group">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                  <Phone size={20} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-yellow-600">Phone</p>
                  <p className="font-medium text-sm text-gray-200">{data.phone}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-5 bg-yellow-500/5 border border-yellow-500/10 rounded-xl backdrop-blur-md">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2 text-yellow-400">
                <span className="w-1.5 h-6 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></span>
                Business Hours
              </h3>
              <div className="space-y-3 text-sm">
                <p className="flex justify-between items-center border-b border-yellow-500/10 pb-2"><span className="text-yellow-500/60 font-medium">Mon - Fri:</span><span className="font-bold text-gray-200">{data.hoursWeekday}</span></p>
                <p className="flex justify-between items-center border-b border-yellow-500/10 pb-2"><span className="text-yellow-500/60 font-medium">Saturday:</span><span className="font-bold text-gray-200">{data.hoursSaturday}</span></p>
                <p className="flex justify-between items-center"><span className="text-yellow-500/60 font-medium">Sunday:</span><span className="font-bold text-yellow-500">{data.hoursSunday}</span></p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-yellow-500/5 border border-yellow-500/10 rounded-xl backdrop-blur-md group hover:bg-yellow-500/10 transition-colors">
              <MapPin size={22} className="flex-shrink-0 mt-0.5 text-yellow-400" />
              <div>
                <p className="font-bold text-sm text-yellow-500 mb-1 tracking-wide">VISIT US</p>
                <p className="text-sm text-gray-300 leading-relaxed">{data.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Contact Form (Deep Black) */}
        <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto bg-black no-scrollbar relative">
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-yellow-600">Your Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-3.5 transition-colors text-yellow-600/50 group-focus-within:text-yellow-400" size={18} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all bg-neutral-900 border-yellow-500/20 text-white placeholder:text-neutral-600 focus:bg-black focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-yellow-600">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3.5 transition-colors text-yellow-600/50 group-focus-within:text-yellow-400" size={18} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="VIP@email.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all bg-neutral-900 border-yellow-500/20 text-white placeholder:text-neutral-600 focus:bg-black focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-yellow-600">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-3.5 transition-colors text-yellow-600/50 group-focus-within:text-yellow-400" size={18} />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all bg-neutral-900 border-yellow-500/20 text-white placeholder:text-neutral-600 focus:bg-black focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-yellow-600">Your Message</label>
              <div className="relative group">
                <MessageSquare className="absolute left-3.5 top-3.5 transition-colors text-yellow-600/50 group-focus-within:text-yellow-400" size={18} />
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} placeholder="How can we assist you today?"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all bg-neutral-900 border-yellow-500/20 text-white placeholder:text-neutral-600 focus:bg-black focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 outline-none resize-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-black font-black tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-[0_0_20px_rgba(234,179,8,0.25)] disabled:opacity-70 disabled:hover:scale-100 uppercase"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} 
              {isSubmitting ? 'Transmitting...' : 'Send Message'}
            </button>
            <p className="text-xs text-center text-yellow-600/50 font-medium tracking-wide">Our concierge will contact you within 24 hours.</p>
          </form>
        </div>
      </motion.div>
    </>
  );

  if (isPreview) return ModalContent;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999]" />
          {ModalContent}
          <style jsx global>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

