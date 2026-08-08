import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ItemDetails from './pages/ItemDetails'
import Messages from './pages/Messages'
import Report from './pages/Report'
import BottomNav from './components/BottomNav'
import Login from './pages/Login'
import Claimed from './pages/Claimed'
import Profile from './pages/Profile'

const ProtectedRoute = ({ children }) => {
  const userName = localStorage.getItem('reclaim_user_name');
  if (!userName) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background shadow-xl relative overflow-hidden">
        {/* Main Content Area */}
        <main id="main-scroll-container" className="flex-1 overflow-y-auto pb-safe">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/item/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/claimed" element={<ProtectedRoute><Claimed /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
