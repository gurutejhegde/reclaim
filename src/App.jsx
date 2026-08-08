import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ItemDetails from './pages/ItemDetails'
import Report from './pages/Report'
import BottomNav from './components/BottomNav'
import Login from './pages/Login'
import Notifications from './pages/Notifications'
import Claimed from './pages/Claimed'
import Profile from './pages/Profile'
import MyReports from './pages/MyReports'

const ProtectedRoute = ({ children }) => {
  const userName = localStorage.getItem('reclaim_user_name');
  if (!userName) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="max-w-md mx-auto min-h-screen bg-background relative shadow-2xl overflow-hidden font-sans">
        <main id="main-scroll-container" className="h-screen overflow-y-auto overflow-x-hidden scroll-smooth">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/item/:id" element={<ProtectedRoute><ItemDetails /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/claimed" element={<ProtectedRoute><Claimed /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </Router>
  )
}

export default App
