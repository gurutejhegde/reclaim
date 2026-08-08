import React from 'react';
import { User, LogOut, Award, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('reclaim_user_name') || 'Student';

  const handleLogout = () => {
    localStorage.removeItem('reclaim_user_name');
    navigate('/login');
  };

  return (
    <div className="px-5 pt-12 pb-32 max-w-md mx-auto min-h-screen bg-background relative overflow-hidden">
      
      {/* Background aesthetics */}
      <div className="absolute top-[-5%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      
      <header className="mb-10 text-center relative z-10">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg border-4 border-white">
           <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
             <User className="w-10 h-10" />
           </div>
        </div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">{userName}</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">AITM Student</p>
      </header>

      <div className="space-y-4 relative z-10">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-primary">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Good Samaritan</h3>
            <p className="text-xs text-gray-500 mt-1">You are helping keep the campus honest.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-secondary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Verified Profile</h3>
            <p className="text-xs text-gray-500 mt-1">Active on Reclaim Network.</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full mt-10 bg-white border border-red-100 text-red-500 font-bold py-4 rounded-full shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>

    </div>
  );
}
