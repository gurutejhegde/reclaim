import React, { useState, useEffect } from 'react'
import { Home, Plus, CheckCircle } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const target = e.target === document ? window : e.target;
          const currentScrollY = target.scrollY ?? target.scrollTop ?? 0;
          
          if (currentScrollY > lastScrollY && currentScrollY > 20) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY || currentScrollY <= 20) {
            setIsVisible(true);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Listen on window
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Listen on the main container
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Fallback interval to attach if container wasn't ready
    const timer = setTimeout(() => {
      const lateContainer = document.getElementById('main-scroll-container');
      if (lateContainer) lateContainer.addEventListener('scroll', handleScroll, { passive: true });
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [location.pathname]);

  const isHiddenPage = location.pathname.startsWith('/report') || location.pathname.startsWith('/item') || location.pathname === '/login';

  if (isHiddenPage) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto transition-all duration-300 z-50 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'}`}>
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
