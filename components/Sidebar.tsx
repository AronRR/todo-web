'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const NAV = [
  { href: '/', label: 'Dashboard', icon: '▦' },
  { href: '/buscar', label: 'Buscar', icon: '⌕' },
  { href: '/perfil', label: 'Perfil', icon: '◉' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    document.cookie = 'firebaseToken=; path=/; max-age=0'
    router.push('/login')
  }

  return (
    <aside className="w-56 min-h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-border">
        <span className="text-text font-bold text-lg">Todo List</span>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              pathname === item.href
                ? 'bg-primary text-white'
                : 'text-muted hover:text-text hover:bg-border'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-danger hover:bg-border transition"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
