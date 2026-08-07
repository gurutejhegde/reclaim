import React, { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Clock, Tag, Trash2, Bookmark, Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ItemDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single()
        
      if (!error && data) {
        setItem(data)
      }
      setLoading(false)
    }
    fetchItem()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);
        
      if (!error) {
        navigate('/');
      } else {
        alert("Failed to delete report.");
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-medium text-sm">Loading details...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 text-center">
        <h2 className="text-2xl font-black text-gray-800 mb-2">Item Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">This report may have been deleted or resolved.</p>
        <button onClick={() => navigate('/')} className="bg-primary text-white font-bold px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform">
          Go Back Home
        </button>
      </div>
    )
  }

  const reportDate = new Date(item.created_at);
  const isToday = new Date().toDateString() === reportDate.toDateString();
  const timeString = reportDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = isToday ? `Today, ${timeString}` : `${reportDate.toLocaleDateString()}, ${timeString}`;

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Image */}
      <div className="relative w-full h-[350px] bg-white rounded-b-[40px] shadow-sm overflow-hidden bg-gray-50 border-b border-gray-100">
        <img 
          src={item.photo_url || "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80"} 
          alt={item.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center pt-safe">
          <button onClick={() => navigate('/')} className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button onClick={handleDelete} className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-sm active:scale-95 transition-transform">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 pt-6 space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-black text-gray-800 pr-4">{item.title}</h1>
            <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${item.type === 'lost' ? 'bg-lost-bg text-lost-text' : 'bg-found-bg text-found-text'}`}>
              {item.type === 'lost' ? 'Lost' : 'Found'}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mt-1">
            <Tag className="w-3.5 h-3.5" /> {item.category}
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 space-y-3">
          <div className="flex items-center text-gray-700">
            <MapPin className="w-4 h-4 mr-3 text-secondary" />
            <span className="text-sm font-medium">{item.location}</span>
          </div>
          <div className="h-px bg-gray-100"></div>
          <div className="flex items-center text-gray-700">
            <Clock className="w-4 h-4 mr-3 text-secondary" />
            <span className="text-sm font-medium">{dateString}</span>
          </div>
        </div>

        {item.description && (
          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-white p-4 rounded-3xl shadow-sm border border-gray-50">
              {item.description}
            </p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 flex gap-4 max-w-md mx-auto z-40 pb-safe">
        <button className="flex-1 h-14 rounded-3xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 active:bg-primary-dark active:scale-[0.98] transition-all">
          {item.type === 'lost' ? 'I Found This' : 'Request Claim'}
        </button>
      </div>
    </div>
  )
}
