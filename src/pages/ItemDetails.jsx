import React, { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Clock, Tag, Trash2, Loader2, MessageSquare } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Loader from '../components/Loader'

export default function ItemDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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
    setIsDeleting(true)
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
      
    if (!error) {
      navigate('/');
    } else {
      alert("Failed to delete report.");
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader message="Loading details..." />
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

  const handleAction = async () => {
    if (item.type === 'lost') {
      // The user found a lost item. We don't mark it as claimed here; we will open a chat.
      alert("This will open a secure chat with the owner so you can return it! (Chat feature coming next)");
      return;
    }

    // The user is requesting a claim for a found item
    if (!window.confirm(`Are you sure you want to mark this item as claimed?`)) return;
    
    const userName = localStorage.getItem('reclaim_user_name');
    
    const { error } = await supabase
      .from('reports')
      .update({ status: 'claimed', claimed_by: userName })
      .eq('id', id);

    if (!error) {
      navigate('/claimed');
    } else {
      alert("Error updating item. Ensure the 'status' and 'claimed_by' columns exist in your Supabase table.");
    }
  };

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
          <button onClick={() => setShowDeleteModal(true)} className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-sm active:scale-95 transition-transform">
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
        {item.status === 'claimed' ? (
           <button disabled className="flex-1 h-14 rounded-3xl bg-gray-200 text-gray-500 font-bold text-base transition-all">
             Item has been Claimed
           </button>
        ) : (
           <button onClick={handleAction} className="flex-1 h-14 rounded-3xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 active:bg-primary-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2">
             {item.type === 'lost' ? 'I Found This' : 'Request Claim'}
           </button>
        )}
      </div>

      {/* Custom Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Delete Report?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">This action cannot be undone. The report will be permanently removed from the campus feed.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl active:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-red-500/20 active:bg-red-600 transition-colors flex justify-center items-center"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
