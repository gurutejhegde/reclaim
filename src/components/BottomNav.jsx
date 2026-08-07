import React from 'react'
import { Home, MessageSquare, Plus, FileText } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-50">
      <div className="bg-white shadow-card rounded-full px-6 py-3 flex items-center justify-between w-full max-w-[320px]">
        
        <button onClick={() => navigate('/')} className="flex flex-col items-center p-2 group w-12">
          <Home className={`w-6 h-6 transition-colors ${location.pathname === '/' ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
          <span className={`text-[9px] mt-1 font-semibold ${location.pathname === '/' ? 'text-gray-800' : 'text-gray-400'}`}>Home</span>
        </button>

        <button onClick={() => navigate('/messages')} className="flex flex-col items-center p-2 group w-12">
          <MessageSquare className={`w-6 h-6 transition-colors ${location.pathname === '/messages' ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={location.pathname === '/messages' ? 2.5 : 2} />
          <span className={`text-[9px] mt-1 font-semibold ${location.pathname === '/messages' ? 'text-gray-800' : 'text-gray-400'}`}>Chat</span>
        </button>

        <button onClick={() => navigate('/report')} className="bg-primary hover:bg-primary-dark text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transform -translate-y-4 active:scale-95 transition-all">
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </button>

        <button onClick={() => navigate('/my-reports')} className="flex flex-col items-center p-2 group w-12 ml-2">
          <FileText className={`w-6 h-6 transition-colors ${location.pathname === '/my-reports' ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={location.pathname === '/my-reports' ? 2.5 : 2} />
          <span className={`text-[9px] mt-1 font-semibold ${location.pathname === '/my-reports' ? 'text-gray-800' : 'text-gray-400'}`}>Reports</span>
        </button>

      </div>
    </div>
  )
}
