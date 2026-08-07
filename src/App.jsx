import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ItemDetails from './pages/ItemDetails'
import Messages from './pages/Messages'
import Report from './pages/Report'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background shadow-xl relative overflow-hidden">
        {/* Main Content Area */}
        <main id="main-scroll-container" className="flex-1 overflow-y-auto pb-safe">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/report" element={<Report />} />
            {/* Future routes: /my-reports */}
          </Routes>
        </main>
        
        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </Router>
  )
}

export default App
