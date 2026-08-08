import React, { useState, useEffect } from 'react'
import { Home, Plus, CheckCircle } from 'lucide-react'
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
      <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl rounded-full px-8 py-2.5 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
        
        <button onClick={() => navigate('/')} className={`p-2 transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-gray-400 hover:text-gray-800'}`}>
          <Home className="w-6 h-6" strokeWidth={location.pathname === '/' ? 2.5 : 2} />
        </button>

        <div className="relative -top-5">
          <button onClick={() => navigate('/report')} className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform border-[4px] border-background">
            <Plus className="w-7 h-7" strokeWidth={3} />
          </button>
        </div>

        <button onClick={() => navigate('/claimed')} className={`p-2 transition-colors ${location.pathname === '/claimed' ? 'text-primary' : 'text-gray-400 hover:text-gray-800'}`}>
          <CheckCircle className="w-6 h-6" strokeWidth={location.pathname === '/claimed' ? 2.5 : 2} />
        </button>

      </div>
    </div>
  )
}
