import React from 'react'
import { Home, Plus, FileText } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <motion.div 
      initial={{ y: 100 }} animate={{ y: 0 }} 
      className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-50"
    >
      <div className="bg-white shadow-card rounded-full px-6 py-3 flex items-center justify-between w-full max-w-[280px]">
        <button onClick={() => navigate('/')} className="flex flex-col items-center p-2 group">
          <Home className={`w-6 h-6 transition-colors ${location.pathname === '/' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
          <span className={`text-[9px] mt-1 font-semibold ${location.pathname === '/' ? 'text-slate-900' : 'text-slate-400'}`}>Home</span>
        </button>

        <button onClick={() => navigate('/report')} className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transform -translate-y-4 active:scale-95 transition-all">
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </button>

        <button onClick={() => navigate('/my-reports')} className="flex flex-col items-center p-2 group">
          <FileText className={`w-6 h-6 transition-colors ${location.pathname === '/my-reports' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} strokeWidth={location.pathname === '/my-reports' ? 2.5 : 2} />
          <span className={`text-[9px] mt-1 font-semibold ${location.pathname === '/my-reports' ? 'text-slate-900' : 'text-slate-400'}`}>Reports</span>
        </button>
      </div>
    </motion.div>
  )
}
