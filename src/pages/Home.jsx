import React, { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, MapPin, Camera, SearchIcon, Bell, Sparkles, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Loader from '../components/Loader'

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
  const userName = localStorage.getItem('reclaim_user_name') || 'Student';
  
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredReports = reports
    .filter(r => {
      // 1. Hide ONLY claimed items (Contacted items stay but move to bottom)
      if (r.status === 'claimed') return false;
      
      // 2. Filter by Category Button
      if (activeCategory !== 'All' && r.category !== activeCategory) return false;

      // 3. Filter by Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return r.title.toLowerCase().includes(q) || 
               r.location.toLowerCase().includes(q) || 
               (r.description && r.description.toLowerCase().includes(q));
      }
      
      return true;
    })
    .sort((a, b) => {
      // Push pending or more_info_needed items to the bottom
      const aIsContacted = (a.status === 'pending' || a.status === 'more_info_needed');
      const bIsContacted = (b.status === 'pending' || b.status === 'more_info_needed');
      if (aIsContacted && !bIsContacted) return 1;
      if (!aIsContacted && bIsContacted) return -1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const hasNotifications = reports.some(item => {
    let claimData = { requester: '' };
    try { if (item.claimed_by) claimData = JSON.parse(item.claimed_by); } catch(e){}
    const name = localStorage.getItem('reclaim_user_name');
    
    if (item.status === 'pending' && item.reported_by === name) return true;
    if (item.status === 'more_info_needed' && claimData.requester === name) return true;
    return false;
  });

  return (
    <div className="px-5 pt-12 pb-32 space-y-8 max-w-md mx-auto relative">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Welcome back,</p>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">{userName}</h1>
        </div>
        <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm active:scale-95 transition-transform">
          <Bell className="w-5 h-5" />
          {hasNotifications && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>}
        </button>
      </header>

      {/* Search & Filters */}
      <div className="relative z-20">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Header Banner */}
      <div className="bg-white border-l-4 border-primary rounded-2xl p-5 shadow-sm relative overflow-hidden mt-2 flex items-start gap-3">
        <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="mt-1">
           <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-sm shadow-primary/40"></div>
        </div>
        <div className="relative z-10">
          <h2 className="font-bold text-gray-800 text-sm tracking-wide uppercase mb-1">Reclaim Network</h2>
          <p className="text-gray-500 font-medium text-xs leading-relaxed">
            Turn scattered reporting into a searchable, trackable recovery system. Never let a lost item become a forgotten one.
          </p>
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
          <Loader message="Loading reports..." />
        ) : filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">No items found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredReports.map((report) => {
              const isContacted = report.status === 'pending' || report.status === 'more_info_needed';
              
              return (
                <div 
                  key={report.id} 
                  onClick={() => navigate(`/item/${report.id}`)} 
                  className={`bg-white rounded-3xl p-2 shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer ${isContacted ? 'opacity-60 grayscale' : ''}`}
                >
                  <div className="w-full h-[180px] bg-gray-50 flex items-center justify-center flex-shrink-0 relative overflow-hidden rounded-2xl mb-2">
                    {report.photo_url ? (
                      <img 
                        src={report.photo_url} 
                        alt={report.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-300">
                        <Tag className="w-10 h-10 mb-1 opacity-50" />
                        <span className="text-[10px] font-bold">No Image</span>
                      </div>
                    )}
                    {/* Status Badge / Overlay */}
                    {isContacted ? (
                      <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl">
                         <div className="bg-white/95 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 transform -rotate-3 scale-105 border border-white/50">
                           <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                           <span className="text-gray-900 font-black text-xs uppercase tracking-widest">Contacted</span>
                         </div>
                      </div>
                    ) : (
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-[9px] font-bold backdrop-blur-md shadow-sm flex items-center gap-1.5 ${report.type === 'lost' ? 'bg-lost-bg/95 text-lost-text' : 'bg-found-bg/95 text-found-text'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${report.type === 'lost' ? 'bg-lost-text' : 'bg-found-text'}`}></div>
                        {report.type === 'lost' ? 'Open Lost' : 'Open Found'}
                      </div>
                    )}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
