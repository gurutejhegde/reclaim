import React, { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Clock, Tag, Trash2, Loader2, MessageSquare, CheckCircle2 } from 'lucide-react'
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
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [claimProof, setClaimProof] = useState('');
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
    setIsDeleting(true);

    if (item.photo_url) {
      try {
        const urlParts = item.photo_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          await supabase.storage.from('item-images').remove([fileName]);
        }
      } catch (e) {
        console.error("Failed to delete image:", e);
      }
    }

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
  const dateString = isToday ? `Today · ${timeString}` : `${reportDate.toLocaleDateString()} · ${timeString}`;

  const handleActionClick = () => {
    setShowClaimModal(true);
  };

  const submitClaim = async () => {
    if (!claimProof.trim()) return;
    
    const userName = localStorage.getItem('reclaim_user_name');
    const claimData = JSON.stringify({ requester: userName, proof: claimProof });
    
    const { error } = await supabase
      .from('reports')
      .update({ status: 'pending', claimed_by: claimData })
      .eq('id', id);

    if (!error) {
      setShowClaimModal(false);
      setShowSuccessModal(true);
    } else {
      setShowClaimModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Image */}
      <div className="relative w-full h-[350px] bg-white rounded-b-[40px] shadow-sm overflow-hidden bg-gray-50 border-b border-gray-100 flex flex-col items-center justify-center">
        {item.photo_url ? (
          <img 
            src={item.photo_url} 
            alt={item.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300">
            <Tag className="w-16 h-16 mb-2 opacity-50" />
            <span className="text-sm font-bold text-gray-400">No Image Provided</span>
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center pt-safe">
          <button onClick={() => navigate('/')} className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
          {item.reported_by === localStorage.getItem('reclaim_user_name') && (
            <button onClick={() => setShowDeleteModal(true)} className="w-10 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-sm active:scale-95 transition-transform">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="px-6 pt-6 space-y-6">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-black text-gray-800 pr-4">{item.title}</h1>
            <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full flex-shrink-0 flex items-center gap-1.5 ${item.type === 'lost' ? 'bg-lost-bg text-lost-text' : 'bg-found-bg text-found-text'}`}>
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.type === 'lost' ? 'bg-lost-text' : 'bg-found-text'}`}></div>
              {item.type === 'lost' ? 'Lost · Open' : 'Found · Open'}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mt-1">
            <Tag className="w-3.5 h-3.5" /> {item.category}
          </div>
        </div>

        {/* Recovery Progress Tracker */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recovery Status</span>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {item.status === 'open' ? 'Step 1 of 3' : item.status === 'claimed' ? 'Step 3 of 3' : 'Step 2 of 3'}
            </span>
          </div>
          
          <div className="relative flex justify-between items-center w-full px-2">
            {/* Background Track */}
            <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-1 bg-gray-100 rounded-full z-0"></div>
            {/* Active Track */}
            <div className={`absolute left-2 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500 ${item.status === 'open' ? 'w-[15%]' : item.status === 'claimed' ? 'w-[95%]' : 'w-1/2'}`}></div>
            
            {/* Step 1: Reported */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-5 h-5 rounded-full bg-primary text-white ring-4 ring-white flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span className="text-[9px] font-bold text-primary mt-2 absolute -bottom-5 whitespace-nowrap">Reported</span>
            </div>

            {/* Step 2: Contacted */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full ring-4 ring-white flex items-center justify-center transition-colors ${item.status !== 'open' ? 'bg-primary text-white shadow-sm' : 'bg-gray-100'}`}>
                {item.status !== 'open' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
              <span className={`text-[9px] font-bold mt-2 absolute -bottom-5 whitespace-nowrap ${item.status !== 'open' ? 'text-primary' : 'text-gray-400'}`}>Contacted</span>
            </div>

            {/* Step 3: Claimed */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full ring-4 ring-white flex items-center justify-center transition-colors ${item.status === 'claimed' ? 'bg-primary text-white shadow-sm' : 'bg-gray-100'}`}>
                {item.status === 'claimed' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
              <span className={`text-[9px] font-bold mt-2 absolute -bottom-5 whitespace-nowrap ${item.status === 'claimed' ? 'text-primary' : 'text-gray-400'}`}>Returned</span>
            </div>
          </div>
          <div className="mt-8 text-xs text-gray-500 font-medium text-center bg-gray-50 p-2 rounded-xl">
            This item is currently <strong className="text-gray-700">Open</strong> and looking for a match.
          </div>
        </div>

        {/* Meetup Instructions Box (Only visible if claimed and has meetup data) */}
        {item.status === 'claimed' && (() => {
          let meetupInfo = null;
          try {
             const claimData = JSON.parse(item.claimed_by);
             meetupInfo = claimData.meetup;
          } catch(e) {}
          
          if (meetupInfo) return (
            <div className="bg-green-50 p-5 rounded-3xl border border-green-100 shadow-sm">
              <h3 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Meetup Instructions
              </h3>
              <p className="text-sm text-green-700 leading-relaxed bg-white p-4 rounded-xl border border-green-100/50 shadow-inner">
                {meetupInfo}
              </p>
            </div>
          )
          return null;
        })()}

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
            <h3 className="text-base font-bold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed bg-white p-4 rounded-3xl shadow-sm border border-gray-50">
              {item.description}
            </p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 flex gap-4 max-w-md mx-auto z-40 pb-safe">
        {item.reported_by === localStorage.getItem('reclaim_user_name') ? (
           <button disabled className="flex-1 h-14 rounded-3xl bg-gray-100 text-gray-400 font-bold text-base transition-all">
             This is your report
           </button>
        ) : item.status === 'claimed' ? (
           <button disabled className="flex-1 h-14 rounded-3xl bg-gray-200 text-gray-500 font-bold text-base transition-all">
             Item has been Claimed
           </button>
        ) : item.status === 'pending' || item.status === 'more_info_needed' ? (
           <button disabled className="flex-1 h-14 rounded-3xl bg-gray-200 text-gray-500 font-bold text-base transition-all">
             Verification in Progress
           </button>
        ) : (
           <button onClick={handleActionClick} className="flex-1 h-14 rounded-3xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 active:bg-primary-dark active:scale-[0.98] transition-all flex items-center justify-center gap-2">
             {item.type === 'lost' ? 'I Found This' : 'Request Claim'}
           </button>
        )}
      </div>

      {/* Proof of Ownership Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100">
            <h3 className="text-xl font-black text-gray-800 mb-2">{item.type === 'lost' ? 'Describe the Found Item' : 'Verify Ownership'}</h3>
            <p className="text-sm text-gray-500 font-medium mb-5">{item.type === 'lost' ? 'Please describe the item you found to help the owner recognize it.' : 'To prevent false claims, please describe a specific detail about this item (e.g., wallpaper, contents, scratch marks).'}</p>
            
            <textarea 
              value={claimProof}
              onChange={(e) => setClaimProof(e.target.value)}
              placeholder={item.type === 'lost' ? "e.g., A blue waterbottle found in classroom..." : "e.g., The lock screen has a picture of a dog..."}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none mb-6"
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setShowClaimModal(false)}
                className="flex-1 py-3.5 rounded-full font-bold text-gray-500 bg-gray-100 active:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitClaim}
                disabled={!claimProof.trim()}
                className="flex-1 py-3.5 rounded-full font-bold text-white bg-primary active:bg-primary-dark transition-colors disabled:opacity-50 disabled:bg-gray-300"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl animate-in zoom-in-95 text-center">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5 text-secondary">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Request Sent!</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">Your details have been securely sent. You will be notified once they review it.</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-full shadow-lg shadow-gray-900/20 active:scale-95 transition-transform"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
