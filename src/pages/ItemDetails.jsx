import React from 'react'
import { ArrowLeft, MapPin, Clock, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ItemDetails() {
  const navigate = useNavigate()

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-background pb-32">
      {/* Header Image */}
      <div className="relative w-full h-[350px] bg-white rounded-b-[40px] shadow-sm overflow-hidden">
        <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" alt="Black Backpack" className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 p-5 pt-safe">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 pt-6 space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-black text-slate-900">Black Backpack</h1>
            <div className="bg-lost-bg text-lost-text text-[10px] font-bold px-3 py-1.5 rounded-full">Lost</div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Tag className="w-3.5 h-3.5" /> Bags
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 space-y-3">
          <div className="flex items-center text-slate-700">
            <MapPin className="w-4 h-4 mr-3 text-secondary" />
            <span className="text-sm font-medium">Main Campus Library</span>
          </div>
          <div className="h-px bg-slate-100"></div>
          <div className="flex items-center text-slate-700">
            <Clock className="w-4 h-4 mr-3 text-secondary" />
            <span className="text-sm font-medium">Today, 10:30 AM</span>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-slate-600 text-sm leading-relaxed bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
            I left my black Nike backpack near the charging stations on the second floor. It has a distinctive red keychain. Contains my laptop!
          </p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-100 pb-safe z-40 max-w-md mx-auto">
        <button className="w-full h-14 rounded-full bg-slate-900 text-white font-bold text-base shadow-lg shadow-slate-900/20 active:scale-95 transition-transform">
          Request Claim
        </button>
      </div>
    </motion.div>
  )
}
