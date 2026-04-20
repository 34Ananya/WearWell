import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Wardrobe from './pages/Wardrobe'
import OutfitBuilder from './pages/OutfitBuilder'
import SavedOutfits from './pages/SavedOutfits'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/wardrobe"  element={<ProtectedRoute><Wardrobe /></ProtectedRoute>} />
        <Route path="/builder"   element={<ProtectedRoute><OutfitBuilder /></ProtectedRoute>} />
        <Route path="/outfits"   element={<ProtectedRoute><SavedOutfits /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
