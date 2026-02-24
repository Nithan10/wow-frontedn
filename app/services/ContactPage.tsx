'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react';

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
  isDarkMode: boolean;
  isPreview?: boolean;
  previewData?: ContactData;
}

export default function ContactPage({ isOpen, onClose, isDarkMode, isPreview = false, previewData }: ContactPageProps) {
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    if (isPreview && previewData) {
      setData(previewData);
      return;
    }

    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/contact`);
        const result = await response.json();
        if (result.success && result.data) setData(result.data);
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen, isPreview, previewData]);

  useEffect(() => {
    if (isPreview) return; // Don't lock scroll in preview mode
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent successfully!');
    if (!isPreview) onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!mounted || (!isOpen && !isPreview)) return null;

  const ModalContent = (
    <motion.div
      initial={isPreview ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
      animate={isPreview ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
      exit={isPreview ? {} : { opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
      transition={{ type: "spring", duration: 0.5 }}
      className={`${isPreview ? 'relative w-full' : 'fixed left-1/2 top-1/2 w-[95%]'} max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl z-[10000] overflow-hidden flex flex-col md:flex-row ${
        isDarkMode ? 'bg-slate-900 border border-yellow-500/20' : 'bg-white border border-amber-200'
      }`}
    >
      {!isPreview && (
        <button
          onClick={onClose}
          className={`absolute right-4 top-4 p-2 rounded-full z-20 transition-all hover:scale-110 shadow-md ${
            isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
          }`}
        >
          <X size={20} />
        </button>
      )}

      {/* Left side - Contact Info */}
      <div className="md:w-2/5 p-6 md:p-8 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-black overflow-y-auto no-scrollbar">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">{data.title}</h2>
            <p className="text-black/80 text-sm md:text-base">{data.subtitle}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-black/10 rounded-xl backdrop-blur-sm transition-transform hover:scale-[1.02]">
              <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                <Mail size={20} className="text-black" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Email</p>
                <p className="font-bold text-sm">{data.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-black/10 rounded-xl backdrop-blur-sm transition-transform hover:scale-[1.02]">
              <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center">
                <Phone size={20} className="text-black" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Phone</p>
                <p className="font-bold text-sm">{data.phone}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-black/10 rounded-xl backdrop-blur-sm">
            <h3 className="font-black text-lg mb-3 flex items-center gap-2">
              <span className="w-1 h-6 bg-black rounded-full"></span>
              Business Hours
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span className="opacity-80">Monday - Friday:</span><span className="font-bold">{data.hoursWeekday}</span></p>
              <p className="flex justify-between"><span className="opacity-80">Saturday:</span><span className="font-bold">{data.hoursSaturday}</span></p>
              <p className="flex justify-between"><span className="opacity-80">Sunday:</span><span className="font-bold">{data.hoursSunday}</span></p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-black/10 rounded-xl backdrop-blur-sm">
            <MapPin size={20} className="flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-sm">Visit Us</p>
              <p className="text-sm opacity-90">{data.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Contact Form */}
      <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto bg-inherit no-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-yellow-400' : 'text-amber-700'}`}>Your Name</label>
            <div className="relative group">
              <User className={`absolute left-3 top-3.5 transition-colors ${isDarkMode ? 'text-yellow-500/50 group-focus-within:text-yellow-400' : 'text-amber-500/50 group-focus-within:text-amber-600'}`} size={18} />
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name"
                className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm md:text-base transition-all ${isDarkMode ? 'bg-slate-800 border-yellow-500/30 text-white placeholder:text-yellow-500/30 focus:bg-slate-700' : 'bg-amber-50/50 border-amber-300 text-slate-900 placeholder:text-amber-500/50 focus:bg-white'} border focus:outline-none focus:ring-2 focus:ring-yellow-500`}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-yellow-400' : 'text-amber-700'}`}>Email Address</label>
              <div className="relative group">
                <Mail className={`absolute left-3 top-3.5 transition-colors ${isDarkMode ? 'text-yellow-500/50 group-focus-within:text-yellow-400' : 'text-amber-500/50 group-focus-within:text-amber-600'}`} size={18} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm md:text-base transition-all ${isDarkMode ? 'bg-slate-800 border-yellow-500/30 text-white placeholder:text-yellow-500/30 focus:bg-slate-700' : 'bg-amber-50/50 border-amber-300 text-slate-900 placeholder:text-amber-500/50 focus:bg-white'} border focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-yellow-400' : 'text-amber-700'}`}>Phone Number</label>
              <div className="relative group">
                <Phone className={`absolute left-3 top-3.5 transition-colors ${isDarkMode ? 'text-yellow-500/50 group-focus-within:text-yellow-400' : 'text-amber-500/50 group-focus-within:text-amber-600'}`} size={18} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm md:text-base transition-all ${isDarkMode ? 'bg-slate-800 border-yellow-500/30 text-white placeholder:text-yellow-500/30 focus:bg-slate-700' : 'bg-amber-50/50 border-amber-300 text-slate-900 placeholder:text-amber-500/50 focus:bg-white'} border focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-yellow-400' : 'text-amber-700'}`}>Your Message</label>
            <div className="relative group">
              <MessageSquare className={`absolute left-3 top-3.5 transition-colors ${isDarkMode ? 'text-yellow-500/50 group-focus-within:text-yellow-400' : 'text-amber-500/50 group-focus-within:text-amber-600'}`} size={18} />
              <textarea name="message" value={formData.message} onChange={handleChange} required rows={4} placeholder="Tell us about your requirements..."
                className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm md:text-base transition-all ${isDarkMode ? 'bg-slate-800 border-yellow-500/30 text-white placeholder:text-yellow-500/30 focus:bg-slate-700' : 'bg-amber-50/50 border-amber-300 text-slate-900 placeholder:text-amber-500/50 focus:bg-white'} border focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none`}
              />
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-yellow-500/30">
            <Send size={18} /> SEND MESSAGE
          </button>
          <p className={`text-xs text-center ${isDarkMode ? 'text-yellow-400/50' : 'text-amber-600/50'}`}>We'll get back to you within 24 hours</p>
        </form>
      </div>
    </motion.div>
  );

  if (isPreview) return ModalContent;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]" />
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