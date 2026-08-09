import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('reclaim_user_name', name.trim().toLowerCase());
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-sm mx-auto space-y-8 pb-20">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
             <img src="/logo.jpeg" alt="Reclaim Logo" className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Reclaim</h1>
          <p className="text-gray-500 font-medium text-sm">Never let a lost item become a forgotten one.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="bg-white p-2 rounded-[2rem] shadow-lg shadow-gray-200/50 border border-gray-100 flex items-center focus-within:ring-4 focus-within:ring-primary/20 transition-all">
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What's your name?" 
              className="w-full bg-transparent px-5 py-4 text-base font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button 
              type="submit"
              disabled={!name.trim()}
              className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 disabled:bg-gray-300 disabled:opacity-50 transition-colors active:scale-95"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
