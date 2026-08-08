import React, { useState, useEffect } from 'react'
import { Home, Bell, Plus, CheckCircle, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const isHiddenPage = location.pathname.startsWith('/report') || location.pathname.startsWith('/item') || location.pathname === '/login'

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = document.getElementById('main-scroll-container')?.scrollTop || 0
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false) 
      } else {
        setIsVisible(true)  
      }
      setLastScrollY(currentScrollY)
    }

    const scrollContainer = document.getElementById('main-scroll-container')
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => scrollContainer?.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  if (isHiddenPage) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto transition-transform duration-300 z-50 ${isVisible ? 'translate-y-0' : 'translate-y-[150%]'}`}>
      <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl rounded-full px-6 py-3 flex justify-between items-center shadow-xl shadow-gray-200/50 border border-gray-100">
        
        <button onClick={() => navigate('/')} className={`p-2 transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-gray-400 hover:text-gray-800'}`}>
          <Home className="w-[22px] h-[22px]" strokeWidth={location.pathname === '/' ? 2.5 : 2} />
        </button>
        
        <button onClick={() => navigate('/notifications')} className={`p-2 transition-colors ${location.pathname === '/notifications' ? 'text-primary' : 'text-gray-400 hover:text-gray-800'}`}>
          <Bell className="w-[22px] h-[22px]" strokeWidth={location.pathname === '/notifications' ? 2.5 : 2} />
        </button>

        <div className="relative -top-6">
          <button onClick={() => navigate('/report')} className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform border-[3px] border-background">
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        <button onClick={() => navigate('/claimed')} className={`p-2 transition-colors ${location.pathname === '/claimed' ? 'text-primary' : 'text-gray-400 hover:text-gray-800'}`}>
          <CheckCircle className="w-[22px] h-[22px]" strokeWidth={location.pathname === '/claimed' ? 2.5 : 2} />
        </button>

        <button onClick={() => navigate('/profile')} className={`p-2 transition-colors ${location.pathname === '/profile' ? 'text-primary' : 'text-gray-400 hover:text-gray-800'}`}>
          <User className="w-[22px] h-[22px]" strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
        </button>

      </div>
    </div>
  )
}
