import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/wardrobe', label: 'Wardrobe', icon: '◈' },
  { to: '/builder', label: 'Outfit Builder', icon: '◉' },
  { to: '/outfits', label: 'Saved Outfits', icon: '◎' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-50">
      {/* Sidebar — vertical on desktop, horizontal strip on mobile */}
      <nav className="w-full md:w-56 bg-stone-900 text-stone-100 flex md:flex-col md:min-h-screen flex-shrink-0">
        {/* Brand */}
        <div className="px-5 py-4 md:py-8 flex items-center md:block gap-4">
          <h1 className="font-display text-xl md:text-2xl text-white">WearWell</h1>
          <p className="hidden md:block text-stone-400 text-xs mt-1 truncate">{user?.email}</p>
        </div>

        {/* Nav links */}
        <div className="flex md:flex-col gap-0.5 flex-1 overflow-x-auto md:overflow-visible scrollbar-hide px-2 pb-2 md:pb-0">
          {NAV.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0
                ${location.pathname.startsWith(to)
                  ? 'bg-sage-600 text-white'
                  : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="hidden md:flex items-center gap-2 mx-2 mb-4 mt-auto px-3 py-2.5 rounded-xl text-sm text-stone-500 hover:bg-stone-800 hover:text-white transition-colors"
        >
          <span className="text-base">⎋</span>
          Sign out
        </button>
      </nav>

      {/* Main content area */}
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}
