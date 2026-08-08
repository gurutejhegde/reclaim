import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Loader from '../components/Loader';

export default function MyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReports = async () => {
      const userName = localStorage.getItem('reclaim_user_name');
      if (!userName) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('reported_by', userName)
        .order('created_at', { ascending: false });

      if (data) {
        setReports(data);
      }
      setLoading(false);
    };

    fetchMyReports();
  }, []);

  return (
    <div className="px-5 pt-12 pb-32 max-w-md mx-auto min-h-screen bg-background">
      <header className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate('/profile')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">My Reports</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Track items you've posted.</p>
        </div>
      </header>

      {loading ? (
        <Loader message="Loading your reports..." />
      ) : reports.length === 0 ? (
        <div className="text-center mt-32">
          <p className="text-gray-500 font-bold mb-4">You haven't reported any items yet.</p>
          <button onClick={() => navigate('/report')} className="px-6 py-3 bg-primary text-white font-bold rounded-full shadow-md shadow-primary/20 active:scale-95 transition-transform">
            Report an Item
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/item/${item.id}`)}
              className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                {item.photo_url ? (
                  <img 
                    src={item.photo_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <span className="text-[8px] font-bold mt-1">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden py-1">
                <h3 className="font-bold text-gray-800 text-sm truncate mb-1">{item.title}</h3>
                <div className="flex items-center text-[10px] text-gray-500 font-medium mb-3">
                  <MapPin className="w-3 h-3 mr-1 text-secondary" />
                  <span className="truncate">{item.location}</span>
                </div>
                
                {/* Status Indicators */}
                <div className="flex items-center gap-2">
                   <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.type === 'lost' ? 'bg-lost-bg text-lost-text border border-lost-border' : 'bg-found-bg text-found-text border border-found-border'}`}>
                     {item.type === 'lost' ? 'Lost' : 'Found'}
                   </div>
                   <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                     item.status === 'claimed' 
                       ? 'bg-green-50 text-green-700 border-green-200' 
                       : 'bg-gray-100 text-gray-600 border-gray-200'
                   }`}>
                     {item.status === 'claimed' ? 'Claimed' : 'Open'}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
