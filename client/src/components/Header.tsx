import { Link, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Home, LogIn, LogOut, Menu, Network, X } from 'lucide-react'
import { authClient } from '../lib/auth-client'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [error, setError] = useState<string | null>('error')

  const { data: session } = authClient.useSession()

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError('')
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [error])

  useEffect(() => {
    if (session === null) {
      router.navigate({ to: '/signin' })
    }
  }, [session])

  const handleLogin = () => {
    router.navigate({ to: '/signin' })
  }

  const handleLogout = async () => {
    setError('')
    try {
      await authClient.signOut()
    } catch (e) {
      console.error('Logout failed', e)
      setError('Failed to logout')
    }
  }

  return (
    <div>
      <header className="px-4 flex items-center bg-gray-800 text-white/70 shadow-lg font-medium">
        <nav className="navbar w-full">
          <div className="navbar-start flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="ml-4">
              <Link
                to="/"
                activeProps={{ className: 'font-bold text-primary/80' }}
              >
                Home
              </Link>
            </h1>

            <div className="px-4">
              <Link
                to="/todos"
                activeProps={{ className: 'font-bold  text-primary/80' }}
              >
                Todos
              </Link>
            </div>
          </div>

          <div className="navbar-end pr-2">
            <button
              title={session ? 'Sign out' : 'Sign in'}
              className="p-2 transition-colors flex items-center gap-2"
              aria-label={session ? 'Sign out' : 'Sign in'}
            >
              {session ? (
                <LogOut
                  size={20}
                  className="hover:text-warning"
                  onClick={handleLogout}
                />
              ) : (
                <LogIn
                  size={20}
                  className="hover:text-primary"
                  onClick={handleLogin}
                />
              )}
            </button>
          </div>
        </nav>
        {error && (
          <div className="toast toast-top toast-center">
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          </div>
        )}
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {/* Demo Links Start */}

          <Link
            to="/demo/tanstack-query"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
            }}
          >
            <Network size={20} />
            <span className="font-medium">TanStack Query</span>
          </Link>

          {/* Demo Links End */}
        </nav>
      </aside>
    </div>
  )
}
