import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, MapPin } from 'lucide-react';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

export default function Claimed() {
  const [claimedItems, setClaimedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClaimed = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const localClaims = JSON.parse(localStorage.getItem('local_claims') || '[]');
        
        const allClaimed = data.filter(item => 
          item.status === 'claimed' || item.status === 'returned' || localClaims.some(c => c.id === item.id)
        ).map(item => {
          // Sync the local username if it was claimed locally
          const localMatch = localClaims.find(c => c.id === item.id);
          if (localMatch) {
            item.claimed_by = localMatch.claimed_by;
          }
          return item;
        });

        setClaimedItems(allClaimed);
      }
      setLoading(false);
    };

    fetchClaimed();
  }, []);

  return (
    <div className="px-5 pt-12 pb-32 max-w-md mx-auto min-h-screen bg-background">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Claimed Items</h1>
        <p className="text-sm text-gray-500 font-medium mt-2">Items successfully returned to their owners!</p>
      </header>

      {loading ? (
        <Loader message="Loading claimed items..." />
      ) : claimedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm mt-10">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-gray-800 font-bold mb-1">No claims yet</p>
          <p className="text-gray-500 text-sm">When items are claimed, they will appear here as success stories.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claimedItems.map((item) => {
            let claimData = { requester: 'Unknown' };
            try { 
              if (item.claimed_by) {
                // Check if it's a JSON string
                if (item.claimed_by.startsWith('{')) {
                  claimData = JSON.parse(item.claimed_by); 
                } else {
                  // Fallback for old simple strings
                  claimData.requester = item.claimed_by;
                }
              }
            } catch(e){}

            return (
            <div key={item.id} onClick={() => navigate(`/item/${item.id}`)} className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 relative border border-gray-100 flex items-center justify-center">
                {item.photo_url ? (
                  <img src={item.photo_url} alt={item.title} className="w-full h-full object-cover grayscale opacity-70" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <span className="text-[10px] font-bold">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-green-900/10 backdrop-blur-[1px]">
                   <CheckCircle2 className="w-8 h-8 text-green-500 drop-shadow-md" fill="white" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {item.location}
                </p>
                <div className={`mt-3 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 self-start shadow-sm border ${item.status === 'returned' ? 'text-green-700 bg-green-50 border-green-100' : 'text-blue-700 bg-blue-50 border-blue-100'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'returned' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  {item.status === 'returned' ? `Returned to ${claimData.requester}` : `Approved for ${claimData.requester}`}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
