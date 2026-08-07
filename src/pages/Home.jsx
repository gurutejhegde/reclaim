import React, { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, MapPin, Camera, SearchIcon, Bell, Sparkles, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const timeAgo = (dateStr) => {
  const diff = new Date() - new Date(dateStr);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Home() {
  const navigate = useNavigate()
  
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setReports(data)
      }
      setLoading(false)
    }
    fetchReports()
  }, [])

  const filteredReports = activeCategory === 'All' 
    ? reports 
    : reports.filter(r => r.category === activeCategory);

  return (
    <div className="px-5 pt-12 pb-32 space-y-8 max-w-md mx-auto relative">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 font-medium">AITM Campus</p>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Reclaim</h1>
        </div>
        <div className="relative p-2 bg-white rounded-full shadow-sm border border-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          <div className="w-2.5 h-2.5 bg-primary rounded-full absolute top-0 right-0 border-2 border-white"></div>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="relative z-20">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search items, locations..." 
            className="w-full bg-white shadow-sm border border-gray-100 rounded-full py-4 pl-12 pr-14 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div 
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-colors active:scale-95 ${showFilters ? 'bg-gray-800 text-white' : 'bg-primary text-white'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </div>
        </div>

        {/* Filter Dropdown Menu */}
        {showFilters && (
          <div className="absolute top-16 left-0 right-0 bg-white border border-gray-100 rounded-3xl p-5 shadow-xl transition-all">
             <div className="flex justify-between items-center mb-3">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Filter by Category</h4>
               {activeCategory !== 'All' && (
                 <span onClick={() => { setActiveCategory('All'); setShowFilters(false); }} className="text-[10px] font-bold text-primary cursor-pointer">Clear</span>
               )}
             </div>
             <div className="flex flex-wrap gap-2">
                {['All', 'Electronics', 'Bags', 'Wallets', 'Keys', 'ID Cards', 'Other'].map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => { setActiveCategory(cat); setShowFilters(false); }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm border transition-colors ${activeCategory === cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Smart Match Alert */}
      <div className="bg-white border-l-4 border-primary rounded-2xl p-4 shadow-sm flex items-start gap-3 cursor-pointer">
        <div className="bg-orange-50 p-2 rounded-full text-primary">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm">Potential Match Found</h4>
          <p className="text-xs text-gray-500 mt-1">A black backpack was reported found at the Library 10 mins ago.</p>
        </div>
      </div>

      {/* Core Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <div onClick={() => navigate('/report?type=lost')} className="bg-white border-2 border-gray-100 rounded-[24px] p-5 shadow-sm active:scale-95 transition-transform cursor-pointer flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <SearchIcon className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="font-bold text-gray-800 text-sm">Report Lost</h3>
        </div>
        <div onClick={() => navigate('/report?type=found')} className="bg-primary rounded-[24px] p-5 shadow-lg shadow-primary/20 active:scale-95 transition-transform cursor-pointer flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-white text-sm">Report Found</h3>
        </div>
      </div>

      {/* Dynamic Recent Reports Feed */}
      <div>
        <div className="flex justify-between items-end mb-4">
           <h2 className="text-lg font-bold text-gray-800">Recent Reports</h2>
           <span className="text-xs font-bold text-primary">{activeCategory !== 'All' ? activeCategory : ''}</span>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm font-medium">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">No items found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <div 
                key={report.id} 
                onClick={() => navigate(`/item/${report.id}`)} 
                className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 bg-gray-50 border border-gray-50">
                  <img 
                    src={report.photo_url || "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=500&q=80"} 
                    alt={report.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-1 rounded-full ${report.type === 'lost' ? 'bg-lost-bg text-lost-text' : 'bg-found-bg text-found-text'}`}>
                    {report.type === 'lost' ? 'Lost' : 'Found'}
                  </div>
                </div>
                <div className="px-1.5 pb-1">
                  <h3 className="font-bold text-gray-800 text-xs truncate">{report.title}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{report.category} • {timeAgo(report.created_at)}</p>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                    <span className="text-[10px] truncate">{report.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
