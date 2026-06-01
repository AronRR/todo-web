'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const STACK = [
  { label: 'Frontend web', value: 'Next.js + Tailwind CSS' },
  { label: 'Frontend móvil', value: 'React Native + Expo' },
  { label: 'Auth', value: 'Firebase Authentication' },
  { label: 'Backend', value: 'Quarkus + Java' },
  { label: 'Base de datos', value: 'MySQL (Cloud SQL)' },
  { label: 'Deploy backend', value: 'Render' },
  { label: 'Deploy web', value: 'Vercel' },
]

const TAGS = ['NEXT.JS', 'REACT NATIVE', 'FIREBASE', 'QUARKUS']

export default function ProfilePage() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const user = auth.currentUser
  const initial = user?.email?.charAt(0).toUpperCase() ?? '?'
  const devName = user?.email?.split('@')[0] ?? 'Desarrollador'

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await signOut(auth)
      document.cookie = 'firebaseToken=; path=/; max-age=0'
      router.push('/login')
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-text mb-6">Perfil</h1>

      {/* User card */}
      <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {initial}
        </div>
        <div>
          <p className="text-text font-semibold">{devName}</p>
          <p className="text-muted text-sm">{user?.email}</p>
        </div>
      </div>

      {/* About the app */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-4">
        <p className="text-muted text-xs font-semibold uppercase tracking-widest mb-3">Sobre la App</p>
        <p className="text-text font-bold text-lg mb-2">Lista de Tareas</p>
        <p className="text-muted text-sm leading-relaxed mb-4">
          Aplicación para gestionar tareas y listas de manera eficiente. Organiza tu día con prioridades y fechas límite desde web o móvil.
        </p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-bg border border-border rounded-full text-muted text-xs font-semibold tracking-wide">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden mb-4">
        <p className="text-muted text-xs font-semibold uppercase tracking-widest px-6 pt-5 pb-3">Stack Técnico</p>
        {STACK.map((row, i) => (
          <div key={row.label} className={`flex justify-between px-6 py-3 text-sm ${i > 0 ? 'border-t border-border' : ''}`}>
            <span className="text-muted">{row.label}</span>
            <span className="text-text font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full py-3 bg-danger/10 text-danger font-semibold rounded-xl hover:bg-danger/20 transition disabled:opacity-50"
      >
        {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </button>
    </div>
  )
}
