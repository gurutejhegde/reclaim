import React from 'react'
import { Search } from 'lucide-react'

export default function Messages() {
  return (
    <div className="px-5 pt-12 pb-32 space-y-6 max-w-md mx-auto">
      <header>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Messages</h1>
        <p className="text-xs text-gray-500 font-medium mt-1.5 leading-relaxed">Coordinate with finders and claimants.</p>
      </header>

      {/* Search */}
      <div className="relative flex items-center w-full">
        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search messages..." 
          className="w-full bg-white shadow-sm border border-gray-100 rounded-full py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {/* Mock Message Item */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform">
          <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 relative">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover"/>
            <div className="absolute top-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-gray-800 text-sm">Priya Sharma</h3>
              <span className="text-[10px] font-bold text-secondary">12m ago</span>
            </div>
            <p className="text-xs text-gray-500 truncate font-medium">Yes, I still have your backpack! Where would you like to meet?</p>
          </div>
        </div>
        
        {/* Mock Message Item 2 */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer opacity-70 active:scale-[0.98] transition-transform">
          <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover"/>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-gray-800 text-sm">Alex Morgan</h3>
              <span className="text-[10px] text-gray-400">Yesterday</span>
            </div>
            <p className="text-xs text-gray-400 truncate">Thanks for returning my keys!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
