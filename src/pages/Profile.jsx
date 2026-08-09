import React, { useState, useEffect } from 'react';
import { User, LogOut, Award, ChevronRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('reclaim_user_name') || 'Student';
  const [returnCount, setReturnCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from('reports')
        .select('status, reported_by')
        .eq('reported_by', userName)
        .in('status', ['claimed', 'returned']);
      
      if (data) {
        setReturnCount(data.length);
      }
    };
    fetchStats();
  }, [userName]);

  const handleLogout = () => {
    localStorage.removeItem('reclaim_user_name');
    navigate('/login');
  };

  return (
    <div className="px-5 pt-12 pb-32 max-w-md mx-auto min-h-screen bg-background relative overflow-hidden">
      
      {/* Background aesthetics */}
      <div className="absolute top-[-5%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      
      <header className="mb-8 text-center relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg border-[3px] border-white">
           <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
             <User className="w-10 h-10" />
           </div>
        </div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">{userName}</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">AITM Student</p>
      </header>

      <div className="space-y-4 relative z-10">
        <div onClick={() => navigate('/my-reports')} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer active:scale-95 transition-transform">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-sm">My Reports</h3>
            <p className="text-xs text-gray-500 mt-1">View and manage your reports.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-primary">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Your Contribution</h3>
            <p className="text-xs text-gray-500 mt-1">{returnCount} {returnCount === 1 ? 'item' : 'items'} returned through your reports</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8 relative z-10">
        <button 
          onClick={handleLogout}
          className="bg-transparent text-gray-400 font-semibold py-2 px-6 rounded-full flex items-center justify-center gap-2 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all text-xs border border-gray-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </button>
      </div>

    </div>
  );
}
