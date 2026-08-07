import React from 'react'
import { Search, SlidersHorizontal, MapPin, Camera, SearchIcon, Bell, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const navigate = useNavigate()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pt-12 pb-32 space-y-8 max-w-md mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <p className="text-xs text-slate-500 font-medium">AITM Campus</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reclaim</h1>
        </div>
        <div className="relative p-2 bg-white rounded-full shadow-sm border border-slate-100">
          <Bell className="w-5 h-5 text-slate-700" />
          <div className="w-2.5 h-2.5 bg-primary rounded-full absolute top-0 right-0 border-2 border-white"></div>
        </div>
      </header>

      {/* Search */}
      <div className="relative flex items-center w-full">
        <Search className="absolute left-4 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search items, locations..." 
          className="w-full bg-white shadow-sm border border-slate-50 rounded-full py-4 pl-12 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="absolute right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-sm cursor-pointer">
          <SlidersHorizontal className="w-4 h-4 text-slate-900" />
        </div>
      </div>

      {/* Smart Match Alert */}
      <div className="bg-white border border-primary/20 rounded-2xl p-4 shadow-sm flex items-start gap-3 cursor-pointer active:scale-[0.98] transition-transform">
        <div className="bg-primary/10 p-2 rounded-full text-primary-dark">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Potential Match Found</h4>
          <p className="text-xs text-slate-500 mt-1">A black backpack was reported found at the Library 10 mins ago.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 rounded-[24px] p-5 shadow-lg active:scale-95 transition-transform cursor-pointer flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3">
            <SearchIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-white text-sm">Report Lost</h3>
        </div>
        <div className="bg-primary rounded-[24px] p-5 shadow-lg active:scale-95 transition-transform cursor-pointer flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white/40 rounded-2xl flex items-center justify-center mb-3">
            <Camera className="w-6 h-6 text-slate-900" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Report Found</h3>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
        {['All', 'Electronics', 'Bags', 'Keys', 'IDs'].map((cat, i) => (
          <button key={cat} className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap shadow-sm border ${i === 0 ? 'bg-slate-900 text-white border-transparent' : 'bg-white text-slate-600 border-slate-100'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Recent Reports */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Reports</h2>
        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => navigate('/item/1')} className="bg-white rounded-3xl p-2 shadow-sm border border-slate-50 active:scale-95 transition-transform cursor-pointer">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-2">
              <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80" alt="Backpack" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-lost-bg text-lost-text text-[9px] font-bold px-2 py-1 rounded-full">Lost</div>
            </div>
            <div className="px-1.5 pb-1">
              <h3 className="font-bold text-slate-900 text-xs truncate">Black Backpack</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Bags • 2h ago</p>
              <div className="flex items-center text-slate-500 mt-1">
                <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                <span className="text-[10px] truncate">Library</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-50 active:scale-95 transition-transform cursor-pointer">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-2">
              <img src="https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=500&q=80" alt="iPhone" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-found-bg text-found-text text-[9px] font-bold px-2 py-1 rounded-full">Found</div>
            </div>
            <div className="px-1.5 pb-1">
              <h3 className="font-bold text-slate-900 text-xs truncate">iPhone 13 Pro</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Electronics • 4h ago</p>
              <div className="flex items-center text-slate-500 mt-1">
                <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                <span className="text-[10px] truncate">Cafeteria</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
