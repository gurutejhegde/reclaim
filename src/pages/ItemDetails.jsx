import React from 'react'
import { ArrowLeft, MapPin, Clock, Tag, MoreVertical, Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ItemDetails() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Image */}
      <div className="relative w-full h-[350px] bg-white rounded-b-[40px] shadow-sm overflow-hidden">
        <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" alt="Black Backpack" className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center pt-safe">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm active:scale-95 transition-transform">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 pt-6 space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-black text-gray-800">Black Backpack</h1>
            <div className="bg-lost-bg text-lost-text text-[10px] font-bold px-3 py-1.5 rounded-full">Lost</div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Tag className="w-3.5 h-3.5" /> Bags
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 space-y-3">
          <div className="flex items-center text-gray-700">
            <MapPin className="w-4 h-4 mr-3 text-secondary" />
            <span className="text-sm font-medium">Main Campus Library</span>
          </div>
          <div className="h-px bg-gray-100"></div>
          <div className="flex items-center text-gray-700">
            <Clock className="w-4 h-4 mr-3 text-secondary" />
            <span className="text-sm font-medium">Today, 10:30 AM</span>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-gray-600 text-sm leading-relaxed bg-white p-4 rounded-3xl shadow-sm border border-gray-50">
            I left my black Nike backpack near the charging stations on the second floor. It has a distinctive red keychain. Contains my laptop!
          </p>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 flex gap-4 max-w-md mx-auto z-40 pb-safe">
        <button className="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-secondary/30 active:scale-95 transition-transform">
          <Bookmark className="w-6 h-6" fill="currentColor" />
        </button>
        <button className="flex-1 h-14 rounded-3xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 active:bg-primary-dark active:scale-[0.98] transition-all">
          Claim item
        </button>
      </div>
    </div>
  )
}
